"use server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { listUploadedMedia, processAndStoreImage } from "@/lib/media-upload";
import { rateLimit } from "@/lib/security";

export async function uploadSiteMedia(formData: FormData): Promise<{
  ok: boolean;
  message: string;
  publicUrl?: string;
}> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Brak autoryzacji." };
  }

  const limited = await rateLimit("admin-media", 20);
  if (!limited.ok) return limited;

  const file = formData.get("file");
  if (!(file instanceof File) || file.size < 32) {
    return { ok: false, message: "Wybierz zdjęcie JPEG, PNG lub WebP." };
  }

  const result = await processAndStoreImage(file);
  if (!result.ok) return result;

  return {
    ok: true,
    message:
      "Zapisane (skompresowane). Ten sam plik nie jest duplikowany — kolejne wgranie tego zdjęcia użyje istniejącego adresu.",
    publicUrl: result.publicUrl,
  };
}

export async function getUploadedMedia(): Promise<
  { name: string; publicUrl: string; size: number | null }[]
> {
  if (!(await isAdminAuthenticated())) return [];
  try {
    return await listUploadedMedia();
  } catch {
    return [];
  }
}
