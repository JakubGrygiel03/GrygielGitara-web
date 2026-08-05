"use server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSiteUrl } from "@/lib/env";
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
 * If e-mail already exists as a lesson student, link user_id.
 */
export async function registerStudent(
  emailRaw: string,
  password: string,
  passwordConfirm: string,
  fullNameRaw?: string,
): Promise<{ ok: boolean; message: string }> {
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
    const { data: existingStudent } = await admin
      .from("students")
      .select("id, full_name, user_id")
      .eq("email", email)
      .maybeSingle();

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || existingStudent?.full_name || email.split("@")[0],
        },
        emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/moje-kursy`,
      },
    });

    if (error) {
      if (error.message.toLowerCase().includes("already")) {
        return {
          ok: false,
          message: "To konto już istnieje — zaloguj się.",
        };
      }
      return { ok: false, message: error.message };
    }

    if (data.user) {
      await resolveStudentForAuthUser({
        userId: data.user.id,
        email,
      });
    }

    if (!data.session) {
      return {
        ok: true,
        message:
          "Konto utworzone. Jeśli dostaniesz mail potwierdzający — kliknij link, potem zaloguj się.",
      };
    }

    return { ok: true, message: "Konto gotowe — jesteś zalogowany." };
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

/** Public: send Supabase recovery mail (uses Auth SMTP, not Resend). */
export async function requestStudentPasswordReset(
  emailRaw: string,
): Promise<{ ok: boolean; message: string }> {
  const email = emailRaw.trim().toLowerCase();
  if (!email.includes("@")) {
    return { ok: false, message: "Podaj poprawny e-mail." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getSiteUrl()}/auth/callback?next=/moje-kursy/ustaw-haslo`,
    });
    if (error) {
      return { ok: false, message: error.message };
    }
    return {
      ok: true,
      message:
        "Jeśli konto istnieje, wyślemy link do resetu hasła (sprawdź skrzynkę i spam).",
    };
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
