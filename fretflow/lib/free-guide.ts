import { getSiteUrl } from "@/lib/env";

/** Canonical product slug — same offer from home, shop, and CTAs. */
export const FREE_GUIDE_SLUG = "gitarowy-reset";

/** Single offer URL for the free PDF (shop product page). */
export const FREE_GUIDE_HREF = `/sklep/${FREE_GUIDE_SLUG}` as const;

export const FREE_GUIDE_STORAGE_BUCKET = "free-guides";
/** Filename actually uploaded in Supabase Storage. */
export const FREE_GUIDE_STORAGE_OBJECT = "Ebook gitarowy reset.pdf";
/** Gitignored local copy under public/products/. */
export const FREE_GUIDE_LOCAL_OBJECT = "gitarowy-reset.pdf";
export const FREE_GUIDE_DOWNLOAD_FILENAME = "Gitarowy-Reset.pdf";

/**
 * Free PDF download form.
 * Open by default (ebook is ready). Set FREE_GUIDE_OPEN=false to hide the form.
 */
export function isFreeGuideOpen(): boolean {
  const raw = process.env.FREE_GUIDE_OPEN?.trim().toLowerCase();
  if (!raw) return true;
  return raw !== "0" && raw !== "false" && raw !== "no" && raw !== "off";
}

function isLocalDev(): boolean {
  return process.env.VERCEL !== "1" && process.env.NODE_ENV !== "production";
}

/** Direct download URL. 37 MB — never attach to e-mail (Gmail limit is 25 MB). */
export function getFreeGuidePdfUrl(): string {
  const explicit = process.env.FREE_GUIDE_PDF_URL?.trim();
  if (explicit) return withDownloadHint(explicit);

  // Local: serve from public/products (gitignored 37 MB file). Production: Storage.
  if (isLocalDev()) {
    return `${getSiteUrl()}/products/${FREE_GUIDE_LOCAL_OBJECT}`;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (supabaseUrl) {
    const origin = supabaseUrl.replace(/\/$/, "");
    const objectPath = encodeURIComponent(FREE_GUIDE_STORAGE_OBJECT);
    return withDownloadHint(
      `${origin}/storage/v1/object/public/${FREE_GUIDE_STORAGE_BUCKET}/${objectPath}`,
    );
  }

  return `${getSiteUrl()}/products/${FREE_GUIDE_LOCAL_OBJECT}`;
}

function withDownloadHint(url: string): string {
  if (url.includes("download=")) return url;
  const join = url.includes("?") ? "&" : "?";
  return `${url}${join}download=${encodeURIComponent(FREE_GUIDE_DOWNLOAD_FILENAME)}`;
}
