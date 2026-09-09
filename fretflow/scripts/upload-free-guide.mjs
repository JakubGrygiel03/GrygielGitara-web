import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";

const BUCKET = "free-guides";
const OBJECT = "Ebook gitarowy reset.pdf";
const SIZE_LIMIT = 52_428_800;

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  const text = fs.readFileSync(filePath, "utf8");
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

const root = process.cwd();
loadEnvFile(path.join(root, ".env.local"));
loadEnvFile(path.join(root, ".env"));

const pdfPath = process.argv[2];
if (!pdfPath) {
  console.error(
    'Użycie: node scripts/upload-free-guide.mjs "C:\\ścieżka\\Gitarowy-Reset.pdf"',
  );
  process.exit(1);
}

const abs = path.resolve(pdfPath);
if (!fs.existsSync(abs)) {
  console.error("Nie znaleziono pliku:", abs);
  process.exit(1);
}

const stat = fs.statSync(abs);
if (stat.size > SIZE_LIMIT) {
  console.error(
    `Plik ma ${(stat.size / 1024 / 1024).toFixed(1)} MB — limit bucketa to 50 MB.`,
  );
  process.exit(1);
}

const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
if (!url || !serviceKey) {
  console.error(
    "Brak NEXT_PUBLIC_SUPABASE_URL albo SUPABASE_SERVICE_ROLE_KEY w .env.local",
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const { error: bucketError } = await supabase.storage.createBucket(BUCKET, {
  public: true,
  fileSizeLimit: SIZE_LIMIT,
  allowedMimeTypes: ["application/pdf"],
});
if (bucketError && !/already exists/i.test(bucketError.message)) {
  console.error("Nie udało się utworzyć bucketa:", bucketError.message);
  process.exit(1);
}

const file = fs.readFileSync(abs);
const { error: uploadError } = await supabase.storage.from(BUCKET).upload(OBJECT, file, {
  contentType: "application/pdf",
  upsert: true,
});
if (uploadError) {
  console.error("Upload nieudany:", uploadError.message);
  process.exit(1);
}

const publicUrl = `${url.replace(/\/$/, "")}/storage/v1/object/public/${BUCKET}/${OBJECT}`;
console.log("OK — PDF jest w Storage.");
console.log("Publiczny adres:", publicUrl);
console.log(
  "Opcjonalnie ustaw FREE_GUIDE_PDF_URL w Vercel na ten adres (domyślnie strona i tak go złoży sama).",
);
