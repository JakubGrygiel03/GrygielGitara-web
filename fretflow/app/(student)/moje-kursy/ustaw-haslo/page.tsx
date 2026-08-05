import { StudentSetPasswordForm } from "@/components/student-set-password-form";

export const metadata = {
  title: "Ustaw hasło | GrygielGitara",
};

export default function StudentSetPasswordPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-lg items-center px-4 py-12">
      <StudentSetPasswordForm />
    </main>
  );
}
