"use client";

import { lessonPackages, type LessonPackageId } from "@/lib/lesson-packages";
import { cn } from "@/lib/utils";

type PackageChoiceCardsProps = {
  value: LessonPackageId | "";
  onChange: (id: LessonPackageId) => void;
  name?: string;
  error?: string;
};

export function PackageChoiceCards({
  value,
  onChange,
  name = "interestPackage",
  error,
}: PackageChoiceCardsProps) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-slate-900">
        Jaki wariant Cię interesuje?
      </p>
      <ul className="grid gap-3 sm:grid-cols-2">
        {lessonPackages.map((pkg) => {
          const selected = value === pkg.id;
          return (
            <li key={pkg.id}>
              <label
                className={cn(
                  "flex h-full cursor-pointer flex-col rounded-2xl border bg-white p-4 transition-colors",
                  selected
                    ? "border-sky-500 ring-2 ring-sky-300"
                    : pkg.highlight
                      ? "border-sky-300 hover:border-sky-400"
                      : "border-sky-100 hover:border-sky-300",
                )}
              >
                <input
                  type="radio"
                  className="sr-only"
                  name={name}
                  value={pkg.id}
                  checked={selected}
                  onChange={() => onChange(pkg.id)}
                />
                <div className="flex flex-wrap items-center gap-2">
                  {pkg.highlight ? (
                    <span className="rounded-full bg-sky-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                      Najczęściej wybierany
                    </span>
                  ) : null}
                  {selected ? (
                    <span className="rounded-full bg-sky-50 px-2 py-0.5 text-[10px] font-semibold text-sky-700">
                      Wybrane
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {pkg.name}
                </p>
                <p className="mt-1 text-2xl font-bold tracking-tight text-sky-600">
                  {pkg.priceLabel}
                </p>
                <p className="text-xs text-muted">{pkg.perLesson}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">
                  {pkg.location}
                </p>
                <p className="mt-1 text-xs text-slate-500">{pkg.note}</p>
              </label>
            </li>
          );
        })}
      </ul>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
