import type { Metadata } from "next";

import { StudentForgotPasswordForm } from "@/components/student-forgot-password-form";

export const metadata: Metadata = {
  title: "Zapomniałem hasła — konto",
  robots: { index: false, follow: false },
};

export default async function StudentForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;
  const initialEmail = params.email?.trim() ?? "";

  return (
    <section className="flex min-h-[60vh] items-center justify-center px-4 py-12 sm:px-6">
      <StudentForgotPasswordForm initialEmail={initialEmail} />
    </section>
  );
}
