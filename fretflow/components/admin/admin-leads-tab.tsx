"use client";

import type { LeadRow } from "@/lib/admin-types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pl-PL", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

function downloadCsv(leads: LeadRow[]) {
  const header = ["email", "source", "created_at"];
  const lines = [
    header.join(","),
    ...leads.map((lead) =>
      [
        `"${lead.email.replaceAll('"', '""')}"`,
        `"${(lead.source ?? "").replaceAll('"', '""')}"`,
        `"${lead.created_at}"`,
      ].join(","),
    ),
  ];
  const blob = new Blob([lines.join("\n")], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leady-grygielgitara-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function AdminLeadsTab({ leads }: { leads: LeadRow[] }) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">
            Lista e-mail ({leads.length})
          </h2>
          <p className="text-sm text-muted">
            Osoby z darmowego PDF (opcjonalna zgoda marketingowa).
          </p>
        </div>
        <button
          type="button"
          className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-600 disabled:opacity-50"
          disabled={leads.length === 0}
          onClick={() => downloadCsv(leads)}
        >
          Pobierz CSV
        </button>
      </div>

      {leads.length === 0 ? (
        <p className="text-sm text-muted">Brak zapisanych leadów.</p>
      ) : (
        <ul className="divide-y divide-sky-100 rounded-2xl border border-sky-100 bg-white">
          {leads.map((lead) => (
            <li
              key={lead.id}
              className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm"
            >
              <div>
                <p className="font-semibold text-slate-900">{lead.email}</p>
                <p className="text-muted">
                  {lead.source || "—"} · {formatDate(lead.created_at)}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
