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

/** Public file URL without ?download= (Resend fetches this for attachments). */
export function getFreeGuidePdfFileUrl(): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (supabaseUrl) {
    const origin = supabaseUrl.replace(/\/$/, "");
    const objectPath = encodeURIComponent(FREE_GUIDE_STORAGE_OBJECT);
    return `${origin}/storage/v1/object/public/${FREE_GUIDE_STORAGE_BUCKET}/${objectPath}`;
  }

  const explicit = process.env.FREE_GUIDE_PDF_URL?.trim();
  if (explicit) return stripDownloadHint(explicit);

  return `${getSiteUrl()}/products/${FREE_GUIDE_LOCAL_OBJECT}`;
}

/** Direct download URL. Prefer this in the browser so the file saves, not opens. */
export function getFreeGuidePdfUrl(): string {
  const explicit = process.env.FREE_GUIDE_PDF_URL?.trim();
  if (explicit) return withDownloadHint(explicit);

  // Local: serve from public/products (gitignored 37 MB file). Production: Storage.
  if (isLocalDev()) {
    return withDownloadHint(
      `${getSiteUrl()}/products/${FREE_GUIDE_LOCAL_OBJECT}`,
    );
  }

  return withDownloadHint(getFreeGuidePdfFileUrl());
}

/** Public HTTPS URL for e-mail buttons (not localhost). */
export function getFreeGuideEmailDownloadUrl(): string {
  return withDownloadHint(getFreeGuidePdfFileUrl());
}

/**
 * Gmail rejects ~25 MB messages. After Base64, ~18 MB source is the safe ceiling.
 * Current ebook is ~37 MB — attach only if a smaller file is uploaded later.
 */
export const FREE_GUIDE_ATTACH_MAX_BYTES = 18 * 1024 * 1024;

export async function canAttachFreeGuidePdf(): Promise<boolean> {
  const fileUrl = getFreeGuidePdfFileUrl();
  if (!fileUrl.startsWith("https://") || fileUrl.includes("localhost")) {
    return false;
  }
  try {
    const response = await fetch(fileUrl, { method: "HEAD" });
    const length = Number(response.headers.get("content-length") || 0);
    return (
      response.ok &&
      Number.isFinite(length) &&
      length > 0 &&
      length <= FREE_GUIDE_ATTACH_MAX_BYTES
    );
  } catch {
    return false;
  }
}

function stripDownloadHint(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.searchParams.delete("download");
    return parsed.toString();
  } catch {
    return url.replace(/([?&])download=[^&]*&?/g, "$1").replace(/[?&]$/, "");
  }
}

function withDownloadHint(url: string): string {
  if (url.includes("download=")) return url;
  const join = url.includes("?") ? "&" : "?";
  return `${url}${join}download=${encodeURIComponent(FREE_GUIDE_DOWNLOAD_FILENAME)}`;
}
