import { readFile } from "node:fs/promises";
import { NextResponse } from "next/server";

import { resolveProductFileAbsolute } from "@/lib/shop";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { ProductRow } from "@/lib/shop";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ productId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { productId } = await context.params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/moje-kursy/login", _request.url));
  }

  const admin = createAdminClient();
  const { data: entitlement } = await admin
    .from("user_entitlements")
    .select("id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .maybeSingle();

  if (!entitlement) {
    return NextResponse.json({ error: "Brak dostępu" }, { status: 403 });
  }

  const { data: product, error } = await admin
    .from("products")
    .select("*")
    .eq("id", productId)
    .maybeSingle();

  if (error || !product) {
    return NextResponse.json({ error: "Nie znaleziono produktu" }, { status: 404 });
  }

  const typed = product as ProductRow;

  try {
    const abs = resolveProductFileAbsolute(typed.file_path);
    const file = await readFile(abs);
    return new NextResponse(file, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${typed.slug}.pdf"`,
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Plik PDF nie jest jeszcze dostępny na serwerze." },
      { status: 404 },
    );
  }
}
