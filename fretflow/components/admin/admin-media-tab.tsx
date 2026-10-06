"use client";

import { useEffect, useState, useTransition } from "react";
import { toast } from "sonner";

import { getUploadedMedia, uploadSiteMedia } from "@/app/actions/admin-media";
import { Button } from "@/components/ui/button";
import { SITE_IMAGE_LABELS, SITE_IMAGES, MEDIA_MAX_BYTES } from "@/lib/media";
import { adminCard, adminEyebrow } from "@/lib/admin-ui";

export function AdminMediaTab() {
  const [pending, startTransition] = useTransition();
  const [uploaded, setUploaded] = useState<
    { name: string; publicUrl: string; size: number | null }[]
  >([]);

  useEffect(() => {
    startTransition(async () => {
      setUploaded(await getUploadedMedia());
    });
  }, []);

  const bundled = (Object.keys(SITE_IMAGES) as (keyof typeof SITE_IMAGES)[]).map(
    (key) => ({
      key,
      label: SITE_IMAGE_LABELS[key],
      src: SITE_IMAGES[key],
    }),
  );

  return (
    <section className="space-y-6">
      <p className="max-w-2xl text-sm text-slate-600">
        Zdjęcia strony leżą w jednym katalogu i są tylko referencjonowane — hero,
        o mnie i sklep nie kopiują plików. Nowe wgrania są kompresowane (max{" "}
        {Math.round(MEDIA_MAX_BYTES / 1000)} KB, krawędź 1600 px). Identyczna
        treść dostaje ten sam hash, więc storage się nie dubluje.
      </p>

      <div className={adminCard}>
        <p className={adminEyebrow}>Wgraj zdjęcie</p>
        <form
          className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-end"
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const data = new FormData(form);
            startTransition(async () => {
              const result = await uploadSiteMedia(data);
              if (!result.ok) {
                toast.error(result.message);
                return;
              }
              toast.success(result.message);
              form.reset();
              setUploaded(await getUploadedMedia());
            });
          }}
        >
          <input
            name="file"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-sky-500 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white"
          />
          <Button type="submit" disabled={pending}>
            {pending ? "Wgrywanie…" : "Wgraj i skompresuj"}
          </Button>
        </form>
      </div>

      {uploaded.length > 0 ? (
        <div className={adminCard}>
          <p className={adminEyebrow}>Wgrane (Storage)</p>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {uploaded.map((item) => (
              <li
                key={item.name}
                className="rounded-xl border border-sky-100 bg-sky-50/40 p-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.publicUrl}
                  alt=""
                  className="mb-2 h-24 w-full rounded-lg object-cover"
                />
                <p className="break-all text-xs font-medium text-slate-700">
                  {item.publicUrl}
                </p>
                {item.size ? (
                  <p className="mt-1 text-xs text-slate-500">
                    {Math.round(item.size / 1024)} KB
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className={adminCard}>
        <p className={adminEyebrow}>Zdjęcia strony (wspólny rejestr)</p>
        <ul className="mt-3 divide-y divide-sky-50">
          {bundled.map((item) => (
            <li
              key={item.key}
              className="flex items-center justify-between gap-3 py-2 text-sm"
            >
              <span className="font-medium text-slate-800">{item.label}</span>
              <code className="truncate text-xs text-slate-500">{item.src}</code>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
