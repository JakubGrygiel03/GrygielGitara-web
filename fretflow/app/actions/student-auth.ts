"use server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getRequestSiteUrl, getSiteUrl } from "@/lib/env";
import { sendEmail } from "@/lib/resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { resolveStudentForAuthUser } from "@/lib/student-link";
import {
  generateTempPassword,
  isValidPassword,
} from "@/lib/temp-password";

export async function signInStudent(
  emailRaw: string,
  password: string,
): Promise<{ ok: boolean; message: string }> {
  const email = emailRaw.trim().toLowerCase();
  if (!email.includes("@") || !password) {
    return { ok: false, message: "Podaj e-mail i hasło." };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return {
        ok: false,
        message: "Błędny e-mail lub hasło. Sprawdź dane albo zarejestruj się.",
      };
    }

    // Optional: link lesson-student profile when e-mail matches admin list
    await resolveStudentForAuthUser({
      userId: data.user.id,
      email: data.user.email ?? email,
    });

    return { ok: true, message: "Zalogowano." };
  } catch (error) {
    console.error("signInStudent error:", error);
    return { ok: false, message: "Nie udało się zalogować." };
  }
}

/**
 * Open registration — anyone can create an account (lessons + future shop).
 * Confirmation mail goes through Resend (not Supabase Auth SMTP), so a broken
 * SMTP config no longer blocks signup with "Error sending confirmation email".
 */
export async function registerStudent(
  emailRaw: string,
  password: string,
  passwordConfirm: string,
  fullNameRaw?: string,
): Promise<{ ok: boolean; message: string; needsEmailConfirm?: boolean }> {
  const email = emailRaw.trim().toLowerCase();
  const fullName = fullNameRaw?.trim() || "";
  if (!email.includes("@")) {
    return { ok: false, message: "Podaj poprawny e-mail." };
  }
  if (!isValidPassword(password)) {
    return { ok: false, message: "Hasło musi mieć co najmniej 8 znaków." };
  }
  if (password !== passwordConfirm) {
    return { ok: false, message: "Hasła nie są takie same." };
  }

  try {
    const admin = createAdminClient();
    const siteUrl = await getRequestSiteUrl();
    const redirectTo = `${siteUrl}/auth/callback?next=/moje-kursy`;

    const { data: existingStudent } = await admin
      .from("students")
      .select("id, full_name, user_id")
      .eq("email", email)
      .maybeSingle();

    const displayName =
      fullName || existingStudent?.full_name || email.split("@")[0] || "Użytkowniku";

    const existingAuth = await findAuthUserByEmail(admin, email);
    if (existingAuth?.email_confirmed_at) {
      return {
        ok: false,
        message: "To konto już istnieje — zaloguj się.",
      };
    }

    let userId = existingAuth?.id ?? null;
    let actionLink: string | null = null;

    if (existingAuth && !existingAuth.email_confirmed_at) {
      // Leftover from a previous failed Supabase SMTP signup — finish it via Resend.
      const { error: updateError } = await admin.auth.admin.updateUserById(
        existingAuth.id,
        {
          password,
          email_confirm: false,
          user_metadata: { full_name: displayName },
        },
      );
      if (updateError) {
        return { ok: false, message: friendlyAuthError(updateError.message) };
      }

      const { data: linkData, error: linkError } =
        await admin.auth.admin.generateLink({
          type: "magiclink",
          email,
          options: { redirectTo },
        });
      if (linkError || !linkData.properties?.action_link) {
        // Last resort: confirm + sign in so the user is not stuck.
        await admin.auth.admin.updateUserById(existingAuth.id, {
          email_confirm: true,
        });
        const supabase = await createClient();
        const { error: signError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signError) {
          return {
            ok: false,
            message:
              "Konto istnieje, ale aktywacja nie doszła. Spróbuj „Zapomniane hasło” albo napisz na kontakt@grygielgitara.pl.",
          };
        }
        await resolveStudentForAuthUser({
          userId: existingAuth.id,
          email,
        });
        return {
          ok: true,
          needsEmailConfirm: false,
          message: "Konto aktywowane — jesteś zalogowany.",
        };
      }
      actionLink = linkData.properties.action_link;
      userId = linkData.user?.id ?? existingAuth.id;
    } else {
      const { data: linkData, error: linkError } =
        await admin.auth.admin.generateLink({
          type: "signup",
          email,
          password,
          options: {
            data: { full_name: displayName },
            redirectTo,
          },
        });

      if (linkError) {
        const lower = linkError.message.toLowerCase();
        if (
          lower.includes("already") ||
          lower.includes("registered") ||
          lower.includes("exists")
        ) {
          return {
            ok: false,
            message: "To konto już istnieje — zaloguj się.",
          };
        }
        return { ok: false, message: friendlyAuthError(linkError.message) };
      }

      actionLink = linkData.properties?.action_link ?? null;
      userId = linkData.user?.id ?? null;
    }

    if (!actionLink) {
      return {
        ok: false,
        message: "Nie udało się wygenerować linku aktywacyjnego.",
      };
    }

    if (userId) {
      await resolveStudentForAuthUser({ userId, email });
    }

    const mail = await sendEmail({
      to: email,
      subject: "Potwierdź konto — GrygielGitara",
      html: buildConfirmAccountEmailHtml({
        name: displayName,
        actionLink,
        siteUrl,
      }),
    });

    if (!mail.ok) {
      console.error("registerStudent Resend error:", mail.message);
      // Don't leave the user locked out if Resend fails after Auth user exists.
      if (userId) {
        await admin.auth.admin.updateUserById(userId, { email_confirm: true });
        const supabase = await createClient();
        const { error: signError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (!signError) {
          return {
            ok: true,
            needsEmailConfirm: false,
            message:
              "Konto utworzone i zalogowane. Mail aktywacyjny chwilowo nie doszedł — możesz korzystać z konta.",
          };
        }
      }
      return {
        ok: false,
        message:
          "Nie udało się wysłać maila aktywacyjnego. Sprawdź RESEND na serwerze albo napisz na kontakt@grygielgitara.pl.",
      };
    }

    return {
      ok: true,
      needsEmailConfirm: true,
      message:
        "Konto utworzone. Sprawdź e-mail (także spam / powiadomienia): kliknij link potwierdzający od GrygielGitara, potem zaloguj się.",
    };
  } catch (error) {
    console.error("registerStudent error:", error);
    return { ok: false, message: "Nie udało się założyć konta." };
  }
}

export async function changeStudentPassword(
  currentPassword: string,
  newPassword: string,
  newPasswordConfirm: string,
): Promise<{ ok: boolean; message: string }> {
  if (!isValidPassword(newPassword)) {
    return { ok: false, message: "Nowe hasło musi mieć co najmniej 8 znaków." };
  }
  if (newPassword !== newPasswordConfirm) {
    return { ok: false, message: "Nowe hasła nie są takie same." };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user?.email) {
      return { ok: false, message: "Musisz być zalogowany." };
    }

    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    });
    if (reauthError) {
      return { ok: false, message: "Obecne hasło jest nieprawidłowe." };
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { ok: false, message: error.message };

    return { ok: true, message: "Hasło zmienione." };
  } catch (error) {
    console.error("changeStudentPassword error:", error);
    return { ok: false, message: "Nie udało się zmienić hasła." };
  }
}

export async function signOutStudent(): Promise<{ ok: boolean }> {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return { ok: true };
  } catch {
    return { ok: false };
  }
}

/**
 * Admin: create/reset Auth account with temporary password and e-mail it.
 * Password is reset only AFTER students.user_id is linked, so a failed link
 * cannot lock the student out of a previous working password.
 */
export async function inviteStudentToPortal(
  studentId: string,
): Promise<{ ok: boolean; message: string }> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Brak autoryzacji." };
  }

  try {
    const admin = createAdminClient();
    const { data: student, error } = await admin
      .from("students")
      .select("id, full_name, email, user_id")
      .eq("id", studentId)
      .maybeSingle();

    if (error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("user_id") && (msg.includes("column") || msg.includes("schema cache"))) {
        return {
          ok: false,
          message:
            "Brak kolumny user_id. W Supabase SQL Editor odpal FIX_student_portal_user_id.sql (i sprawdź wynik kontroli).",
        };
      }
      return { ok: false, message: `Błąd odczytu ucznia: ${error.message}` };
    }
    if (!student) {
      return { ok: false, message: "Nie znaleziono ucznia." };
    }

    const email = student.email.trim().toLowerCase();
    const tempPassword = generateTempPassword(10);
    const loginUrl = `${getSiteUrl()}/moje-kursy/login`;
    let authUserId = student.user_id;
    let createdFreshUser = false;

    // 1) Resolve Auth user (create if needed) — do NOT reset password yet
    if (!authUserId) {
      const { data: created, error: createError } =
        await admin.auth.admin.createUser({
          email,
          password: tempPassword,
          email_confirm: true,
          user_metadata: { full_name: student.full_name },
        });

      if (createError) {
        const { data: listed } = await admin.auth.admin.listUsers({
          page: 1,
          perPage: 200,
        });
        const existing = listed?.users?.find(
          (u) => u.email?.toLowerCase() === email,
        );
        if (!existing) {
          return { ok: false, message: createError.message };
        }
        authUserId = existing.id;
      } else {
        authUserId = created.user?.id ?? null;
        createdFreshUser = true;
      }
    }

    if (!authUserId) {
      return { ok: false, message: "Nie udało się utworzyć użytkownika Auth." };
    }

    // 2) Link students.user_id before any password reset on existing accounts
    if (student.user_id !== authUserId) {
      await admin
        .from("students")
        .update({ user_id: null })
        .eq("user_id", authUserId)
        .neq("id", student.id);

      const { error: linkError } = await admin
        .from("students")
        .update({ user_id: authUserId, email })
        .eq("id", student.id);
      if (linkError) {
        const msg = linkError.message;
        const lower = msg.toLowerCase();
        const hint = createdFreshUser
          ? ` Konto Auth powstało z hasłem tymczasowym: ${tempPassword}`
          : " Stare hasło powinno nadal działać — powiązanie nie ruszyło hasła.";
        if (lower.includes("column") || lower.includes("schema cache")) {
          return {
            ok: false,
            message: `Brak kolumny user_id w API. Odpal FIX_student_portal_user_id.sql.${hint}`,
          };
        }
        return {
          ok: false,
          message: `Powiązanie user_id nie wyszło: ${msg}.${hint}`,
        };
      }
    }

    // 3) Reset password only after link OK (skip if we just created with this password)
    if (!createdFreshUser) {
      const { error: updateError } = await admin.auth.admin.updateUserById(
        authUserId,
        { password: tempPassword, email_confirm: true },
      );
      if (updateError) {
        return { ok: false, message: updateError.message };
      }
    }

    const mail = await sendEmail({
      to: email,
      subject: "Twoje konto w strefie ucznia — GrygielGitara",
      html: `
        <p>Cześć ${escapeHtml(student.full_name)},</p>
        <p>Nauczyciel przygotował dla Ciebie konto w <strong>strefie ucznia</strong>
        (materiały, terminy lekcji).</p>
        <p><strong>Logowanie:</strong><br/>
        Adres: <a href="${loginUrl}">${loginUrl}</a><br/>
        E-mail: ${escapeHtml(email)}<br/>
        Hasło tymczasowe: <code>${escapeHtml(tempPassword)}</code></p>
        <p>Po zalogowaniu <strong>zmień hasło</strong> w ustawieniach profilu.</p>
        <p>— Jakub, GrygielGitara</p>
      `,
    });

    // Always surface temp password in admin toast (mail often fails on Resend sandbox)
    if (!mail.ok) {
      return {
        ok: true,
        message: `Konto gotowe, ale mail nie poszedł (${mail.message ?? "Resend"}). Zaloguj się hasłem: ${tempPassword}`,
      };
    }

    return {
      ok: true,
      message: `Wysłano mail na ${email}. Hasło tymczasowe (skopiuj na wszelki wypadek): ${tempPassword}`,
    };
  } catch (error) {
    console.error("inviteStudentToPortal error:", error);
    return { ok: false, message: "Nie udało się utworzyć konta ucznia." };
  }
}

/** Public: recovery link generated by Auth admin API, delivered via Resend. */
export async function requestStudentPasswordReset(
  emailRaw: string,
): Promise<{ ok: boolean; message: string }> {
  const email = emailRaw.trim().toLowerCase();
  if (!email.includes("@")) {
    return { ok: false, message: "Podaj poprawny e-mail." };
  }

  const genericOk = {
    ok: true as const,
    message:
      "Jeśli konto istnieje, wyślemy link do resetu hasła (sprawdź skrzynkę i spam).",
  };

  try {
    const admin = createAdminClient();
    const existing = await findAuthUserByEmail(admin, email);
    if (!existing) {
      return genericOk;
    }

    const site = await getRequestSiteUrl();
    const { data: linkData, error } = await admin.auth.admin.generateLink({
      type: "recovery",
      email,
      options: {
        redirectTo: `${site}/auth/callback?next=/moje-kursy/ustaw-haslo`,
      },
    });

    if (error || !linkData.properties?.action_link) {
      console.error("requestStudentPasswordReset generateLink:", error?.message);
      return genericOk;
    }

    const mail = await sendEmail({
      to: email,
      subject: "Nowe hasło — GrygielGitara",
      html: buildResetPasswordEmailHtml({
        actionLink: linkData.properties.action_link,
        siteUrl: site,
      }),
    });

    if (!mail.ok) {
      console.error("requestStudentPasswordReset Resend:", mail.message);
    }

    return genericOk;
  } catch (error) {
    console.error("requestStudentPasswordReset error:", error);
    return { ok: false, message: "Nie udało się wysłać linku." };
  }
}

/** Logged-in (also recovery session): set new password without old one. */
export async function setStudentPasswordAfterRecovery(
  newPassword: string,
  newPasswordConfirm: string,
): Promise<{ ok: boolean; message: string }> {
  if (!isValidPassword(newPassword)) {
    return { ok: false, message: "Hasło musi mieć co najmniej 8 znaków." };
  }
  if (newPassword !== newPasswordConfirm) {
    return { ok: false, message: "Hasła nie są takie same." };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return {
        ok: false,
        message: "Sesja wygasła — użyj ponownie linku z maila albo zaloguj się.",
      };
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return { ok: false, message: error.message };

    return { ok: true, message: "Hasło ustawione — możesz korzystać z konta." };
  } catch (error) {
    console.error("setStudentPasswordAfterRecovery error:", error);
    return { ok: false, message: "Nie udało się ustawić hasła." };
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function friendlyAuthError(message: string) {
  const lower = message.toLowerCase();
  if (lower.includes("confirmation email") || lower.includes("sending")) {
    return "Nie udało się wysłać maila aktywacyjnego. Spróbuj za chwilę albo napisz na kontakt@grygielgitara.pl.";
  }
  if (lower.includes("rate") || lower.includes("security")) {
    return "Zbyt wiele prób — odczekaj minutę i spróbuj ponownie.";
  }
  return message;
}

async function findAuthUserByEmail(
  admin: ReturnType<typeof createAdminClient>,
  email: string,
) {
  const normalized = email.trim().toLowerCase();
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) {
      console.error("findAuthUserByEmail listUsers:", error.message);
      return null;
    }
    const found = data.users.find((u) => u.email?.toLowerCase() === normalized);
    if (found) return found;
    if (data.users.length < 200) break;
  }
  return null;
}

function buildConfirmAccountEmailHtml(input: {
  name: string;
  actionLink: string;
  siteUrl: string;
}) {
  const safeName = escapeHtml(input.name);
  const safeLink = escapeHtml(input.actionLink);
  const loginUrl = escapeHtml(`${input.siteUrl}/moje-kursy/login`);
  return `
    <p>Cześć ${safeName},</p>
    <p>Dziękujemy za założenie konta w <strong>GrygielGitara</strong>.</p>
    <p><a href="${safeLink}" style="display:inline-block;padding:12px 18px;background:#0ea5e9;color:#fff;text-decoration:none;border-radius:10px;font-weight:700">Potwierdź konto</a></p>
    <p>Albo wklej ten link w przeglądarce:<br/><a href="${safeLink}">${safeLink}</a></p>
    <p>Po kliknięciu wróć do logowania: <a href="${loginUrl}">${loginUrl}</a></p>
    <p>Jeśli to nie Ty zakładałeś konto — zignoruj tę wiadomość.</p>
    <p>— Jakub, GrygielGitara</p>
  `;
}

function buildResetPasswordEmailHtml(input: {
  actionLink: string;
  siteUrl: string;
}) {
  const safeLink = escapeHtml(input.actionLink);
  const loginUrl = escapeHtml(`${input.siteUrl}/moje-kursy/login`);
  return `
    <p>Cześć,</p>
    <p>Otrzymaliśmy prośbę o reset hasła do konta <strong>GrygielGitara</strong>.</p>
    <p><a href="${safeLink}" style="display:inline-block;padding:12px 18px;background:#0ea5e9;color:#fff;text-decoration:none;border-radius:10px;font-weight:700">Ustaw nowe hasło</a></p>
    <p>Albo wklej ten link w przeglądarce:<br/><a href="${safeLink}">${safeLink}</a></p>
    <p>Potem zaloguj się tutaj: <a href="${loginUrl}">${loginUrl}</a></p>
    <p>Jeśli to nie Ty — zignoruj maila, hasło się nie zmieni.</p>
    <p>— Jakub, GrygielGitara</p>
  `;
}
