"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

import {
  changeStudentPassword,
  signOutStudent,
} from "@/app/actions/student-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { StudentPortalData } from "@/lib/student-portal";

function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function StudentPortal({ data }: { data: StudentPortalData }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const activePkg = data.packages.find((p) => p.active);
  const firstName = data.account.displayName.split(" ")[0] || "Cześć";

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-4 py-10 sm:px-6 sm:py-14">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">
            Moje konto
          </p>
          <h1 className="text-[1.5rem] font-bold tracking-[-0.015em] text-slate-900 sm:text-3xl">
            Cześć, {firstName}
          </h1>
          <p className="text-sm text-muted">{data.account.email}</p>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="sm"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await signOutStudent();
              toast.success("Wylogowano.");
              router.push("/moje-kursy/login");
              router.refresh();
            });
          }}
        >
          Wyloguj
        </Button>
      </div>

      {data.isLessonStudent ? (
        <>
          <section className="rounded-2xl border border-sky-100 bg-sky-50/60 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-sky-700">
              Najbliższa lekcja
            </h2>
            {data.nextLesson ? (
              <div className="mt-2 space-y-1">
                <p className="text-lg font-semibold text-slate-900">
                  {formatWhen(data.nextLesson.starts_at)}
                </p>
                {data.nextLesson.location ? (
                  <p className="text-sm text-slate-700">
                    {data.nextLesson.location}
                  </p>
                ) : null}
                {data.nextLesson.notes ? (
                  <p className="text-sm text-muted">{data.nextLesson.notes}</p>
                ) : null}
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted">
                Brak zaplanowanego terminu — nauczyciel ustawi go w kalendarzu.
              </p>
            )}
            {activePkg ? (
              <p className="mt-3 text-sm font-medium text-slate-800">
                Pakiet: {activePkg.remaining_lessons} z {activePkg.total_lessons}{" "}
                lekcji
              </p>
            ) : null}
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Materiały od nauczyciela
            </h2>
            {data.materials.length === 0 ? (
              <p className="rounded-xl border border-dashed border-slate-200 px-4 py-5 text-sm text-muted">
                Na razie pusto. Jak nauczyciel doda linki — pojawią się tutaj.
              </p>
            ) : (
              <ul className="space-y-2">
                {data.materials.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-900 transition-colors hover:border-sky-200 hover:bg-sky-50"
                    >
                      <span>{item.title}</span>
                      <ExternalLink className="size-4 shrink-0 text-sky-600" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {data.sessionNotes.length > 0 ? (
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-slate-900">
                Notatki po lekcjach
              </h2>
              <ul className="space-y-2">
                {data.sessionNotes.map((note) => (
                  <li
                    key={note.id}
                    className="rounded-xl border border-slate-100 bg-slate-50/80 px-4 py-3 text-sm text-slate-700"
                  >
                    <p className="text-xs text-muted">
                      {new Intl.DateTimeFormat("pl-PL", {
                        dateStyle: "medium",
                      }).format(new Date(note.created_at))}
                    </p>
                    <p className="mt-1 whitespace-pre-wrap">{note.body}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-slate-900">
              Historia lekcji
            </h2>
            {data.pastLessons.length === 0 ? (
              <p className="text-sm text-muted">
                Jeszcze bez zakończonych terminów.
              </p>
            ) : (
              <ul className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
                {data.pastLessons.map((lesson) => (
                  <li key={lesson.id} className="px-4 py-3 text-sm">
                    <p className="font-medium text-slate-900">
                      {formatWhen(lesson.starts_at)}
                    </p>
                    {lesson.location ? (
                      <p className="text-muted">{lesson.location}</p>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      ) : (
        <section className="space-y-3 rounded-2xl border border-sky-100 bg-sky-50/50 p-5">
          <h2 className="text-lg font-semibold text-slate-900">Lekcje</h2>
          <p className="text-sm leading-relaxed text-muted">
            Nie jesteś jeszcze zapisany na lekcje u mnie. Jak dołączysz — tu
            zobaczysz terminy, materiały i notatki.
          </p>
          <Button asChild size="sm">
            <Link href="/rezerwacja">Umów lekcję próbną</Link>
          </Button>
        </section>
      )}

      <section className="space-y-3 rounded-2xl border border-dashed border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Zakupy</h2>
        <p className="text-sm leading-relaxed text-muted">
          Tu pojawią się e-booki i kursy po zakupie. Sklep uruchomimy wkrótce.
        </p>
      </section>

      <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-5">
        <h2 className="text-lg font-semibold text-slate-900">Hasło konta</h2>
        <p className="text-sm text-muted">
          Możesz zmienić hasło w każdej chwili (także to tymczasowe od
          nauczyciela).
        </p>
        <form
          className="space-y-3 sm:max-w-md"
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              const result = await changeStudentPassword(
                currentPassword,
                newPassword,
                newPasswordConfirm,
              );
              if (!result.ok) {
                toast.error(result.message);
                return;
              }
              toast.success(result.message);
              setCurrentPassword("");
              setNewPassword("");
              setNewPasswordConfirm("");
            });
          }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="cur-pass">Obecne hasło</Label>
            <Input
              id="cur-pass"
              type="password"
              autoComplete="current-password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-pass">Nowe hasło</Label>
            <Input
              id="new-pass"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-pass2">Powtórz nowe hasło</Label>
            <Input
              id="new-pass2"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
            />
          </div>
          <Button type="submit" size="sm" disabled={isPending}>
            Zmień hasło
          </Button>
        </form>
      </section>

      <p className="text-center text-sm text-muted">
        Pytanie?{" "}
        <Link
          href="/kontakt"
          className="font-medium text-sky-600 hover:underline"
        >
          Napisz przez kontakt
        </Link>
      </p>
    </div>
  );
}
