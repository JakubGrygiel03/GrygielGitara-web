import type { Metadata } from "next";

import { StudentLoginForm } from "@/components/student-login-form";

export const metadata: Metadata = {
  title: "Logowanie — strefa ucznia",
  robots: { index: false, follow: false },
};

export default async function StudentLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;

  return (
    <section className="flex min-h-[60vh] items-center justify-center px-4 py-12 sm:px-6">
      <StudentLoginForm
        initialError={params.error === "auth" ? "auth" : null}
      />
    </section>
  );
}
