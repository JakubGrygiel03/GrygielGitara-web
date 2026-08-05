"use server";

import { getSiteUrl } from "@/lib/env";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { sendEmail } from "@/lib/resend";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function requestStudentMagicLink(
  emailRaw: string,
): Promise<{ ok: boolean; message: string }> {
  const email = emailRaw.trim().toLowerCase();
  if (!email.includes("@")) {
    return { ok: false, message: "Podaj poprawny e-mail." };
  }

  try {
    const admin = createAdminClient();
    const { data: student } = await admin
      .from("students")
      .select("id, email")
      .ilike("email", email)
      .maybeSingle();

    if (!student) {
      // Same message whether missing — avoid enumerating students
      return {
        ok: true,
        message:
          "Jeśli ten e-mail jest na liście uczniów, wyślemy link w ciągu chwili. Sprawdź skrzynkę (i spam).",
      };
    }

    const supabase = await createClient();
    const redirectTo = `${getSiteUrl()}/auth/callback?next=/moje-kursy`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: true,
      },
    });

    if (error) {
      console.error("signInWithOtp failed:", error.message);
      return {
        ok: false,
        message:
          "Nie udało się wysłać linku. Sprawdź ustawienia Auth w Supabase (Redirect URLs).",
      };
    }

    return {
      ok: true,
      message:
        "Link do logowania poszedł na maila. Kliknij go na tym samym telefonie/komputerze.",
    };
  } catch (error) {
    console.error("requestStudentMagicLink error:", error);
    return { ok: false, message: "Błąd wysyłki. Spróbuj za chwilę." };
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

/** Admin: send magic link to an existing student (Supabase Auth e-mail). */
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

    if (error || !student) {
      return { ok: false, message: "Nie znaleziono ucznia." };
    }

    const email = student.email.trim().toLowerCase();
    const redirectTo = `${getSiteUrl()}/auth/callback?next=/moje-kursy`;

    const { data: linkData, error: linkError } =
      await admin.auth.admin.generateLink({
        type: "magiclink",
        email,
        options: { redirectTo },
      });

    if (linkError || !linkData?.properties?.action_link) {
      // Fallback: OTP via public client (Supabase sends its own e-mail)
      const supabase = await createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
          shouldCreateUser: true,
        },
      });
      if (otpError) {
        return {
          ok: false,
          message: linkError?.message ?? otpError.message,
        };
      }
      return {
        ok: true,
        message: `Wysłano magic link na ${email} (Supabase Auth).`,
      };
    }

    const actionLink = linkData.properties.action_link;
    const mail = await sendEmail({
      to: email,
      subject: "Twoja strefa ucznia — GrygielGitara",
      html: `
        <p>Cześć ${escapeHtml(student.full_name)},</p>
        <p>Tu są Twoje materiały, najbliższa lekcja i historia zajęć.</p>
        <p><a href="${actionLink}">Wejdź do strefy ucznia</a></p>
        <p>Link działa przez ograniczony czas. Jeśli nie działa — wejdź na
        <a href="${getSiteUrl()}/moje-kursy/login">${getSiteUrl()}/moje-kursy/login</a>
        i podaj ten sam e-mail.</p>
        <p>— Jakub, GrygielGitara</p>
      `,
    });

    if (!mail.ok) {
      // Still try Supabase's built-in e-mail
      const supabase = await createClient();
      await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: redirectTo, shouldCreateUser: true },
      });
      return {
        ok: true,
        message: `Link wygenerowany; wysyłka Resend nie przeszła — spróbuj Supabase Auth mail na ${email}.`,
      };
    }

    return {
      ok: true,
      message: student.user_id
        ? `Wysłano link do strefy na ${email}.`
        : `Wysłano zaproszenie na ${email}. Po pierwszym wejściu konto się powiąże.`,
    };
  } catch (error) {
    console.error("inviteStudentToPortal error:", error);
    return { ok: false, message: "Nie udało się wysłać zaproszenia." };
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}
