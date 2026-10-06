import { createHash } from "node:crypto";

import {
  MEDIA_ALLOWED_TYPES,
  MEDIA_BUCKET,
  MEDIA_MAX_BYTES,
  MEDIA_MAX_EDGE,
} from "@/lib/media";
import { createAdminClient } from "@/lib/supabase/admin";

type AllowedType = (typeof MEDIA_ALLOWED_TYPES)[number];

function sniffType(bytes: Uint8Array): AllowedType | null {
  if (bytes.length < 12) return null;
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }
  const riff = String.fromCharCode(...bytes.slice(0, 4));
  const webp = String.fromCharCode(...bytes.slice(8, 12));
  if (riff === "RIFF" && webp === "WEBP") return "image/webp";
  return null;
}

function extFor(type: AllowedType): string {
  if (type === "image/png") return "png";
  if (type === "image/webp") return "webp";
  return "jpg";
}

async function compress(bytes: Buffer, type: AllowedType): Promise<Buffer> {
  try {
    const sharp = (await import("sharp")).default;
    let pipeline = sharp(bytes, { failOn: "none" }).rotate().resize({
      width: MEDIA_MAX_EDGE,
      height: MEDIA_MAX_EDGE,
      fit: "inside",
      withoutEnlargement: true,
    });
    if (type === "image/png") {
      pipeline = pipeline.png({ compressionLevel: 9 });
    } else if (type === "image/webp") {
      pipeline = pipeline.webp({ quality: 72 });
    } else {
      pipeline = pipeline.jpeg({ quality: 72, mozjpeg: true });
    }
    return await pipeline.toBuffer();
  } catch {
    return bytes;
  }
}

export async function processAndStoreImage(
  file: File,
): Promise<{ ok: true; path: string; publicUrl: string } | { ok: false; message: string }> {
  if (file.size > MEDIA_MAX_BYTES) {
    return {
      ok: false,
      message: `Plik jest za duży (max ${Math.round(MEDIA_MAX_BYTES / 1000)} KB).`,
    };
  }

  const raw = Buffer.from(await file.arrayBuffer());
  const sniffed = sniffType(raw);
  if (!sniffed) {
    return {
      ok: false,
      message: "Dozwolone są tylko JPEG, PNG i WebP (sprawdzane po zawartości pliku).",
    };
  }

  const compressed = await compress(raw, sniffed);
  if (compressed.length > MEDIA_MAX_BYTES) {
    return {
      ok: false,
      message: "Po kompresji plik nadal przekracza limit. Wgraj mniejsze zdjęcie.",
    };
  }

  const hash = createHash("sha256").update(compressed).digest("hex").slice(0, 32);
  const objectPath = `${hash}.${extFor(sniffed)}`;

  const admin = createAdminClient();
  const { error: bucketError } = await admin.storage.createBucket(MEDIA_BUCKET, {
    public: true,
    fileSizeLimit: MEDIA_MAX_BYTES,
    allowedMimeTypes: [...MEDIA_ALLOWED_TYPES],
  });
  if (
    bucketError &&
    !/exists|duplicate|already/i.test(bucketError.message)
  ) {
    // Bucket may already exist — continue to upload.
  }

  const { data: existing } = await admin.storage
    .from(MEDIA_BUCKET)
    .list("", { search: objectPath, limit: 1 });

  const already =
    existing?.some((item) => item.name === objectPath) ?? false;

  if (!already) {
    const { error } = await admin.storage.from(MEDIA_BUCKET).upload(objectPath, compressed, {
      contentType: sniffed,
      upsert: false,
      cacheControl: "31536000",
    });
    if (error && !/exists|duplicate/i.test(error.message)) {
      return { ok: false, message: error.message };
    }
  }

  const { data } = admin.storage.from(MEDIA_BUCKET).getPublicUrl(objectPath);
  return { ok: true, path: objectPath, publicUrl: data.publicUrl };
}

export async function listUploadedMedia(): Promise<
  { name: string; publicUrl: string; size: number | null }[]
> {
  const admin = createAdminClient();
  const { data, error } = await admin.storage.from(MEDIA_BUCKET).list("", {
    limit: 80,
    sortBy: { column: "created_at", order: "desc" },
  });
  if (error || !data) return [];

  return data
    .filter((item) => item.name && !item.name.startsWith("."))
    .map((item) => {
      const { data: pub } = admin.storage
        .from(MEDIA_BUCKET)
        .getPublicUrl(item.name);
      return {
        name: item.name,
        publicUrl: pub.publicUrl,
        size: item.metadata?.size ?? null,
      };
    });
}
