"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  addLessonSessionNote,
  addStudentMaterial,
  adjustStudentPackage,
  createStudentPackage,
  deleteStudentMaterial,
} from "@/app/actions/admin-students-extra";
import {
  createStudent,
  deleteStudent,
  updateStudent,
} from "@/app/actions/admin-calendar";
import { inviteStudentToPortal } from "@/app/actions/student-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type {
  MaterialRow,
  PackageRow,
  SessionNoteRow,
  StudentRow,
} from "@/lib/admin-types";
import {
  lessonPackageIds,
  lessonPackageLabel,
  lessonPackages,
} from "@/lib/lesson-packages";
import { cn } from "@/lib/utils";

export function AdminStudentsTab({
  students,
  packages,
  materials,
  sessionNotes,
}: {
  students: StudentRow[];
  packages: PackageRow[];
  materials: MaterialRow[];
  sessionNotes: SessionNoteRow[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("asc");
  const [openId, setOpenId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const emptyForm = {
    fullName: "",
    email: "",
    phone: "",
    defaultLocation: "",
    interestPackage: "" as string,
    notes: "",
  };
  const [form, setForm] = useState(emptyForm);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = q
      ? students.filter((s) =>
          [
            s.full_name,
            s.email,
            s.phone ?? "",
            s.default_location ?? "",
            lessonPackageLabel(s.interest_package) ?? "",
            s.notes ?? "",
          ]
            .join(" ")
            .toLowerCase()
            .includes(q),
        )
      : students;
    return [...list].sort((a, b) => {
      const cmp = a.full_name.localeCompare(b.full_name, "pl", {
        sensitivity: "base",
      });
      return sort === "asc" ? cmp : -cmp;
    });
  }, [students, search, sort]);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Uczniowie</h2>
        <p className="mt-1 text-sm text-muted">
          Najważniejsze: jaki wariant ceny wybrał (400 / 100 / 120 / online 80).
          Reszta — materiały i notatki po lekcji.
        </p>
      </div>

      <form
        className="space-y-3 rounded-2xl border border-sky-100 bg-white p-4 sm:p-5"
        onSubmit={(event) => {
          event.preventDefault();
          startTransition(async () => {
            const payload = {
              fullName: form.fullName,
              email: form.email,
              phone: form.phone,
              defaultLocation: form.defaultLocation,
              interestPackage: form.interestPackage,
              notes: form.notes,
            };
            const result = editingId
              ? await updateStudent(editingId, payload)
              : await createStudent(payload);
            if (!result.ok) {
              toast.error(result.message);
              return;
            }
            toast.success(result.message);
            setEditingId(null);
            setForm(emptyForm);
            router.refresh();
          });
        }}
      >
        <h2 className="text-lg font-semibold text-slate-900">
          {editingId ? "Edytuj ucznia" : "Dodaj ucznia"}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1 sm:col-span-2">
            <Label>Imię i nazwisko</Label>
            <Input
              required
              value={form.fullName}
              onChange={(e) =>
                setForm((p) => ({ ...p, fullName: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label>E-mail</Label>
            <Input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label>Telefon</Label>
            <Input
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label>Co wybrał / jaki wariant go interesuje</Label>
            <select
              className="flex h-11 w-full rounded-xl border border-sky-200 bg-sky-50/50 px-3.5 text-sm font-medium text-sky-900"
              value={form.interestPackage}
              onChange={(e) =>
                setForm((p) => ({ ...p, interestPackage: e.target.value }))
              }
            >
              <option value="">— jeszcze nie wiadomo —</option>
              {lessonPackageIds.map((id) => (
                <option key={id} value={id}>
                  {lessonPackageLabel(id)}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label>Domyślne miejsce</Label>
            <Input
              value={form.defaultLocation}
              onChange={(e) =>
                setForm((p) => ({ ...p, defaultLocation: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1 sm:col-span-2">
            <Label>Notatki profilu</Label>
            <Textarea
              className="min-h-16"
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={isPending}>
            {editingId ? "Zapisz" : "Dodaj"}
          </Button>
          {editingId ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setEditingId(null);
                setForm(emptyForm);
              }}
            >
              Anuluj
            </Button>
          ) : null}
        </div>
      </form>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1 space-y-1">
          <Label htmlFor="stuSearch">Szukaj</Label>
          <Input
            id="stuSearch"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Imię, e-mail, telefon…"
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="stuSort">Sortuj</Label>
          <select
            id="stuSort"
            className="flex h-11 rounded-xl border border-slate-200 bg-white px-3.5 text-sm"
            value={sort}
            onChange={(e) => setSort(e.target.value as "asc" | "desc")}
          >
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
          </select>
        </div>
      </div>

      <ul className="space-y-3">
        {filtered.map((student) => {
          const pkgs = packages.filter((p) => p.student_id === student.id);
          const mats = materials.filter((m) => m.student_id === student.id);
          const notes = sessionNotes
            .filter((n) => n.student_id === student.id)
            .slice(0, 8);
          const open = openId === student.id;
          return (
            <li
              key={student.id}
              className="rounded-2xl border border-sky-100 bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">
                    {student.full_name}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-sky-700">
                    {lessonPackageLabel(student.interest_package) ||
                      "Wariant: nie ustawiony"}
                  </p>
                  <p className="text-sm text-muted">
                    {student.email}
                    {student.phone ? ` · ${student.phone}` : ""}
                  </p>
                  {pkgs[0] ? (
                    <p className="mt-1 text-sm text-slate-600">
                      Licznik lekcji: {pkgs[0].remaining_lessons} z{" "}
                      {pkgs[0].total_lessons}
                      {pkgs.length > 1 ? ` (+${pkgs.length - 1})` : ""}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => setOpenId(open ? null : student.id)}
                  >
                    {open ? "Zwiń" : "Materiały / notatki"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    disabled={isPending}
                    onClick={() => {
                      startTransition(async () => {
                        const result = await inviteStudentToPortal(student.id);
                        if (!result.ok) {
                          toast.error(result.message);
                          return;
                        }
                        toast.success(result.message);
                      });
                    }}
                  >
                    {student.user_id
                      ? "Nowe hasło tymczasowe"
                      : "Załóż konto + hasło"}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setEditingId(student.id);
                      setForm({
                        fullName: student.full_name,
                        email: student.email,
                        phone: student.phone ?? "",
                        defaultLocation: student.default_location ?? "",
                        interestPackage: student.interest_package ?? "",
                        notes: student.notes ?? "",
                      });
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    Edytuj
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    disabled={isPending}
                    onClick={() => {
                      if (
                        !window.confirm(
                          `Usunąć ${student.full_name}? Lekcje też znikną.`,
                        )
                      ) {
                        return;
                      }
                      startTransition(async () => {
                        const result = await deleteStudent(student.id);
                        if (!result.ok) {
                          toast.error(result.message);
                          return;
                        }
                        toast.success(result.message);
                        router.refresh();
                      });
                    }}
                  >
                    Usuń
                  </Button>
                </div>
              </div>

              {open ? (
                <StudentExtras
                  student={student}
                  packages={pkgs}
                  materials={mats}
                  notes={notes}
                  isPending={isPending}
                  startTransition={startTransition}
                  onRefresh={() => router.refresh()}
                />
              ) : null}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function StudentExtras({
  student,
  packages,
  materials,
  notes,
  isPending,
  startTransition,
  onRefresh,
}: {
  student: StudentRow;
  packages: PackageRow[];
  materials: MaterialRow[];
  notes: SessionNoteRow[];
  isPending: boolean;
  startTransition: (fn: () => void) => void;
  onRefresh: () => void;
}) {
  const [matTitle, setMatTitle] = useState("");
  const [matUrl, setMatUrl] = useState("");
  const [noteBody, setNoteBody] = useState("");

  return (
    <div className="mt-4 space-y-4 border-t border-sky-50 pt-4 text-sm">
      <div className="space-y-2">
        <p className="font-semibold text-slate-900">Dodaj pakiet / wariant</p>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {lessonPackages.map((catalog) => (
            <li key={catalog.id}>
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  startTransition(async () => {
                    const result = await createStudentPackage({
                      studentId: student.id,
                      label: `${catalog.name} (${catalog.priceLabel})`,
                      totalLessons: catalog.totalLessons,
                    });
                    if (!result.ok) {
                      toast.error(result.message);
                      return;
                    }
                    toast.success(result.message);
                    onRefresh();
                  });
                }}
                className={cn(
                  "flex h-full w-full flex-col rounded-2xl border bg-white p-3 text-left transition-colors hover:border-sky-400",
                  catalog.highlight
                    ? "border-sky-400 ring-1 ring-sky-200"
                    : "border-sky-100",
                )}
              >
                {catalog.highlight ? (
                  <span className="mb-1 w-fit rounded-full bg-sky-500 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                    Pakiet
                  </span>
                ) : null}
                <span className="text-xs font-semibold text-slate-900">
                  {catalog.name}
                </span>
                <span className="mt-1 text-xl font-bold text-sky-600">
                  {catalog.priceLabel}
                </span>
                <span className="text-[11px] text-muted">
                  {catalog.totalLessons}{" "}
                  {catalog.totalLessons === 1 ? "lekcja" : "lekcje"} · kliknij,
                  aby dodać
                </span>
              </button>
            </li>
          ))}
        </ul>
        <ul className="space-y-1">
          {packages.map((pkg) => (
            <li
              key={pkg.id}
              className="flex flex-wrap items-center gap-2 rounded-xl bg-sky-50 px-3 py-2"
            >
              <span>
                {pkg.label}: {pkg.remaining_lessons}/{pkg.total_lessons}
              </span>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={isPending}
                onClick={() => {
                  startTransition(async () => {
                    const result = await adjustStudentPackage(pkg.id, -1);
                    if (!result.ok) toast.error(result.message);
                    else toast.success(result.message);
                    onRefresh();
                  });
                }}
              >
                −1 lekcja
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                disabled={isPending}
                onClick={() => {
                  startTransition(async () => {
                    const result = await adjustStudentPackage(pkg.id, 1);
                    if (!result.ok) toast.error(result.message);
                    else toast.success(result.message);
                    onRefresh();
                  });
                }}
              >
                +1
              </Button>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <p className="font-semibold text-slate-900">Materiały / linki</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Tytuł"
            value={matTitle}
            onChange={(e) => setMatTitle(e.target.value)}
          />
          <Input
            placeholder="https://…"
            value={matUrl}
            onChange={(e) => setMatUrl(e.target.value)}
          />
          <Button
            type="button"
            size="sm"
            disabled={isPending}
            onClick={() => {
              startTransition(async () => {
                const result = await addStudentMaterial({
                  studentId: student.id,
                  title: matTitle,
                  url: matUrl,
                });
                if (!result.ok) {
                  toast.error(result.message);
                  return;
                }
                toast.success(result.message);
                setMatTitle("");
                setMatUrl("");
                onRefresh();
              });
            }}
          >
            Dodaj
          </Button>
        </div>
        <ul className="space-y-1">
          {materials.map((mat) => (
            <li key={mat.id} className="flex items-center justify-between gap-2">
              <a
                href={mat.url}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-sky-700 hover:underline"
              >
                {mat.title}
              </a>
              <button
                type="button"
                className="text-red-600 hover:underline"
                disabled={isPending}
                onClick={() => {
                  startTransition(async () => {
                    const result = await deleteStudentMaterial(mat.id);
                    if (!result.ok) toast.error(result.message);
                    else toast.success(result.message);
                    onRefresh();
                  });
                }}
              >
                Usuń
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="space-y-2">
        <p className="font-semibold text-slate-900">Historia zajęć</p>
        <Textarea
          className="min-h-16"
          placeholder="Dziś przerabialiśmy… na za tydzień…"
          value={noteBody}
          onChange={(e) => setNoteBody(e.target.value)}
        />
        <Button
          type="button"
          size="sm"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              const result = await addLessonSessionNote({
                studentId: student.id,
                body: noteBody,
              });
              if (!result.ok) {
                toast.error(result.message);
                return;
              }
              toast.success(result.message);
              setNoteBody("");
              onRefresh();
            });
          }}
        >
          Zapisz notatkę po lekcji
        </Button>
        <ul className="space-y-2">
          {notes.map((note) => (
            <li
              key={note.id}
              className="rounded-xl bg-slate-50 px-3 py-2 text-slate-700"
            >
              <p className="text-xs text-muted">
                {new Date(note.created_at).toLocaleString("pl-PL")}
              </p>
              <p className="whitespace-pre-wrap">{note.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
