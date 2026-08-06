"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  consumeLessonPackageNow,
  createLesson,
  deleteLesson,
  deleteLessonSeries,
  revertLessonPackageUse,
} from "@/app/actions/admin-calendar";
import { updateLessonPayment } from "@/app/actions/admin-students-extra";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { LessonRow, StudentRow } from "@/lib/admin-types";

function toLocalInputValue(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function addMinutes(localValue: string, minutes: number) {
  const date = new Date(localValue);
  if (Number.isNaN(date.getTime())) return localValue;
  date.setMinutes(date.getMinutes() + minutes);
  return toLocalInputValue(date);
}

export function AdminCalendarTab({
  students,
  lessons,
  calendarError,
  onGoStudents,
}: {
  students: StudentRow[];
  lessons: LessonRow[];
  calendarError?: string | null;
  onGoStudents: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [weekOffset, setWeekOffset] = useState(0);
  const [moreOpen, setMoreOpen] = useState(false);

  const defaultStart = toLocalInputValue(new Date(Date.now() + 60 * 60 * 1000));
  const [lessonStudentId, setLessonStudentId] = useState("");
  const [lessonLocation, setLessonLocation] = useState("");
  const [lessonNotes, setLessonNotes] = useState("");
  const [includeNotes, setIncludeNotes] = useState(false);
  const [sendNotify, setSendNotify] = useState(true);
  const [consumeFromPackage, setConsumeFromPackage] = useState(true);
  const [recurring, setRecurring] = useState(false);
  const [weeksCount, setWeeksCount] = useState(8);
  const [lessonStartsAt, setLessonStartsAt] = useState(defaultStart);
  const [lessonEndsAt, setLessonEndsAt] = useState(
    addMinutes(defaultStart, 45),
  );

  const weekDays = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const day = start.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    start.setDate(start.getDate() + mondayOffset + weekOffset * 7);
    return Array.from({ length: 7 }, (_, index) => {
      const d = new Date(start);
      d.setDate(start.getDate() + index);
      return d;
    });
  }, [weekOffset]);

  const lessonsByDay = useMemo(() => {
    const map = new Map<string, LessonRow[]>();
    for (const day of weekDays) map.set(day.toDateString(), []);
    for (const lesson of lessons) {
      const key = new Date(lesson.starts_at).toDateString();
      map.get(key)?.push(lesson);
    }
    for (const list of map.values()) {
      list.sort(
        (a, b) =>
          new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
      );
    }
    return map;
  }, [lessons, weekDays]);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Lekcje</h2>
        <p className="mt-1 text-sm text-muted">
          Zaplanuj termin, wyślij info do ucznia, pilnuj tygodnia.
        </p>
      </div>

      {calendarError ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {calendarError}
        </p>
      ) : null}

      {students.length === 0 ? (
        <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-5 text-sm">
          <p className="font-semibold text-slate-900">Najpierw dodaj ucznia</p>
          <p className="mt-1 text-muted">
            Bez ucznia nie zaplanujesz lekcji. Zrób to w zakładce Uczniowie.
          </p>
          <Button type="button" className="mt-3" onClick={onGoStudents}>
            Przejdź do uczniów
          </Button>
        </div>
      ) : (
        <form
          className="space-y-3 rounded-2xl border border-sky-100 bg-white p-4 sm:p-5"
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              const result = await createLesson({
                studentId: lessonStudentId,
                startsAt: lessonStartsAt,
                endsAt: lessonEndsAt,
                location: lessonLocation,
                notes: includeNotes ? lessonNotes : "",
                includeNotes,
                sendNotify,
                consumeFromPackage,
                recurring,
                weeksCount: recurring ? weeksCount : 1,
              });
              if (!result.ok) {
                toast.error(result.message);
                return;
              }
              toast.success(result.message);
              const nextStart = toLocalInputValue(
                new Date(Date.now() + 60 * 60 * 1000),
              );
              setLessonStudentId("");
              setLessonLocation("");
              setLessonStartsAt(nextStart);
              setLessonEndsAt(addMinutes(nextStart, 45));
              setLessonNotes("");
              setIncludeNotes(false);
              setSendNotify(true);
              setConsumeFromPackage(true);
              setRecurring(false);
              setWeeksCount(8);
              setMoreOpen(false);
              router.refresh();
            });
          }}
        >
          <h3 className="text-lg font-semibold text-slate-900">
            Nowa lekcja
          </h3>

          <div className="space-y-1">
            <Label htmlFor="studentId">Uczeń</Label>
            <select
              id="studentId"
              required
              className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-base"
              value={lessonStudentId}
              onChange={(event) => {
                const id = event.target.value;
                setLessonStudentId(id);
                const student = students.find((item) => item.id === id);
                setLessonLocation(
                  student?.default_location?.trim() || "U nauczyciela",
                );
              }}
            >
              <option value="" disabled>
                Wybierz ucznia
              </option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.full_name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="startsAt">Kiedy zaczyna się?</Label>
              <Input
                id="startsAt"
                type="datetime-local"
                required
                value={lessonStartsAt}
                onChange={(event) => {
                  const value = event.target.value;
                  setLessonStartsAt(value);
                  setLessonEndsAt(addMinutes(value, 45));
                }}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="endsAt">Koniec (domyślnie +45 min)</Label>
              <Input
                id="endsAt"
                type="datetime-local"
                required
                value={lessonEndsAt}
                onChange={(event) => setLessonEndsAt(event.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="location">Gdzie?</Label>
            <Input
              id="location"
              key={lessonStudentId || "no-student"}
              value={lessonLocation}
              onChange={(event) => setLessonLocation(event.target.value)}
            />
          </div>

          <label className="flex items-start gap-2 text-sm text-slate-800">
            <input
              type="checkbox"
              checked={sendNotify}
              onChange={(event) => setSendNotify(event.target.checked)}
              className="mt-0.5 size-4 rounded border-slate-300 text-sky-600"
            />
            <span>Wyślij uczniowi informację (e-mail + SMS jeśli włączony)</span>
          </label>

          <div className="flex flex-col items-stretch gap-3">
            <button
              type="button"
              className="self-start text-left text-sm font-semibold text-sky-700 hover:underline"
              onClick={() => setMoreOpen((v) => !v)}
            >
              {moreOpen
                ? "Ukryj dodatkowe opcje"
                : "Więcej opcji (cykl, pakiet, notatka)"}
            </button>

            {moreOpen ? (
              <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3">
                <label className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={consumeFromPackage}
                    onChange={(e) => setConsumeFromPackage(e.target.checked)}
                    className="mt-0.5 size-4 rounded border-slate-300 text-sky-600"
                  />
                  <span>
                    Odejmij 1 lekcję z pakietu ucznia (jak się nie odbędzie —
                    przywrócisz poniżej)
                  </span>
                </label>
                <label className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={recurring}
                    onChange={(e) => setRecurring(e.target.checked)}
                    className="mt-0.5 size-4 rounded border-slate-300 text-sky-600"
                  />
                  <span>Powtarzaj co tydzień</span>
                </label>
                {recurring ? (
                  <div className="space-y-1">
                    <Label htmlFor="weeksCount">Ile terminów łącznie</Label>
                    <Input
                      id="weeksCount"
                      type="number"
                      min={2}
                      max={26}
                      value={weeksCount}
                      onChange={(e) =>
                        setWeeksCount(
                          Math.min(
                            26,
                            Math.max(2, Number(e.target.value) || 2),
                          ),
                        )
                      }
                    />
                  </div>
                ) : null}
                <label className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={includeNotes}
                    onChange={(e) => setIncludeNotes(e.target.checked)}
                    className="mt-0.5 size-4 rounded border-slate-300 text-sky-600"
                  />
                  <span>Notatka do ucznia w wiadomości</span>
                </label>
                {includeNotes ? (
                  <Textarea
                    className="min-h-16"
                    placeholder="np. weź struny…"
                    value={lessonNotes}
                    onChange={(e) => setLessonNotes(e.target.value)}
                  />
                ) : null}
              </div>
            ) : null}

            <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
              {recurring
                ? `Zapisz cykl (${weeksCount} lekcji)`
                : sendNotify
                  ? "Zapisz i wyślij info"
                  : "Zapisz lekcję"}
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">Ten tydzień</h3>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setWeekOffset((v) => v - 1)}
            >
              ←
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setWeekOffset(0)}
            >
              Dziś
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setWeekOffset((v) => v + 1)}
            >
              →
            </Button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
          {weekDays.map((day) => {
            const key = day.toDateString();
            const dayLessons = lessonsByDay.get(key) ?? [];
            const isToday = key === new Date().toDateString();
            return (
              <div
                key={key}
                className={
                  isToday
                    ? "min-h-36 rounded-2xl border-2 border-sky-400 bg-sky-50/50 p-3"
                    : "min-h-36 rounded-2xl border border-sky-100 bg-white p-3"
                }
              >
                <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
                  {day.toLocaleDateString("pl-PL", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}
                </p>
                <ul className="mt-2 space-y-2">
                  {dayLessons.length === 0 ? (
                    <li className="text-xs text-muted">—</li>
                  ) : (
                    dayLessons.map((lesson) => (
                      <li
                        key={lesson.id}
                        className="rounded-xl bg-white px-2 py-2 text-xs text-slate-800 shadow-sm ring-1 ring-sky-100"
                      >
                        <p className="font-semibold">
                          {new Date(lesson.starts_at).toLocaleTimeString(
                            "pl-PL",
                            { hour: "2-digit", minute: "2-digit" },
                          )}{" "}
                          {lesson.students?.full_name ?? "Uczeń"}
                        </p>
                        <p className="text-slate-600">
                          {lesson.location || "bez miejsca"}
                          {lesson.package_consumed ? " · −1 pakiet" : ""}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-x-2 gap-y-1">
                          <select
                            className="h-7 rounded-md border border-slate-200 px-1 text-[11px]"
                            value={lesson.payment_status}
                            disabled={isPending}
                            onChange={(event) => {
                              const paymentStatus = event.target.value as
                                | "paid"
                                | "unpaid";
                              startTransition(async () => {
                                const result = await updateLessonPayment({
                                  lessonId: lesson.id,
                                  paymentStatus,
                                  consumePackage:
                                    paymentStatus === "paid" &&
                                    !lesson.package_consumed,
                                });
                                if (!result.ok) toast.error(result.message);
                                else toast.success(result.message);
                                router.refresh();
                              });
                            }}
                          >
                            <option value="unpaid">do zapłaty</option>
                            <option value="paid">opłacona</option>
                          </select>
                          {lesson.package_consumed ? (
                            <button
                              type="button"
                              className="font-medium text-amber-700 hover:underline"
                              disabled={isPending}
                              onClick={() => {
                                startTransition(async () => {
                                  const result = await revertLessonPackageUse(
                                    lesson.id,
                                  );
                                  if (!result.ok) toast.error(result.message);
                                  else toast.success(result.message);
                                  router.refresh();
                                });
                              }}
                            >
                              Nie odbyła się
                            </button>
                          ) : (
                            <button
                              type="button"
                              className="font-medium text-sky-700 hover:underline"
                              disabled={isPending}
                              onClick={() => {
                                startTransition(async () => {
                                  const result = await consumeLessonPackageNow(
                                    lesson.id,
                                    lesson.student_id,
                                  );
                                  if (!result.ok) toast.error(result.message);
                                  else toast.success(result.message);
                                  router.refresh();
                                });
                              }}
                            >
                              −1 pakiet
                            </button>
                          )}
                          <button
                            type="button"
                            className="font-medium text-red-600 hover:underline"
                            disabled={isPending}
                            onClick={() => {
                              startTransition(async () => {
                                const result = await deleteLesson(lesson.id);
                                if (!result.ok) toast.error(result.message);
                                else toast.success(result.message);
                                router.refresh();
                              });
                            }}
                          >
                            Usuń
                          </button>
                          {lesson.series_id ? (
                            <button
                              type="button"
                              className="font-medium text-red-700 hover:underline"
                              disabled={isPending}
                              onClick={() => {
                                if (
                                  !window.confirm("Usunąć cały cykl lekcji?")
                                ) {
                                  return;
                                }
                                startTransition(async () => {
                                  const result = await deleteLessonSeries(
                                    lesson.series_id!,
                                  );
                                  if (!result.ok) toast.error(result.message);
                                  else toast.success(result.message);
                                  router.refresh();
                                });
                              }}
                            >
                              Usuń cykl
                            </button>
                          ) : null}
                        </div>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
