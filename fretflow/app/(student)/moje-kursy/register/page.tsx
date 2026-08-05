import type { Metadata } from "next";

import { StudentRegisterForm } from "@/components/student-register-form";

export const metadata: Metadata = {
  title: "Załóż konto",
  robots: { index: false, follow: false },
};

export default function StudentRegisterPage() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-4 py-12 sm:px-6">
      <StudentRegisterForm />
    </section>
  );
}
