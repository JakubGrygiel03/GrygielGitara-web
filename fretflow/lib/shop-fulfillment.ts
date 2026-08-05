import { readFile } from "node:fs/promises";
import { Resend } from "resend";

import { getSiteUrl } from "@/lib/env";
import { resolveProductFileAbsolute, type ProductRow } from "@/lib/shop";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Grant product access after successful Stripe checkout (idempotent).
 */
export async function fulfillShopPurchase(input: {
  userId: string;
  productId: string;
  checkoutSessionId: string;
  customerEmail?: string | null;
  amountTotalGrosze?: number | null;
}): Promise<{ ok: boolean; alreadyFulfilled?: boolean; message?: string }> {
  const admin = createAdminClient();

  const { data: existingBySession } = await admin
    .from("user_entitlements")
    .select("id")
    .eq("stripe_checkout_session_id", input.checkoutSessionId)
    .maybeSingle();

  if (existingBySession) {
    return { ok: true, alreadyFulfilled: true };
  }

  const { data: existingOwned } = await admin
    .from("user_entitlements")
    .select("id")
    .eq("user_id", input.userId)
    .eq("product_id", input.productId)
    .maybeSingle();

  if (existingOwned) {
    return { ok: true, alreadyFulfilled: true };
  }

  const { data: product, error: productError } = await admin
    .from("products")
    .select("*")
    .eq("id", input.productId)
    .maybeSingle();

  if (productError || !product) {
    return { ok: false, message: productError?.message ?? "Product not found" };
  }

  const typed = product as ProductRow;

  const { error: entitlementError } = await admin.from("user_entitlements").insert({
    user_id: input.userId,
    product_id: input.productId,
    stripe_checkout_session_id: input.checkoutSessionId,
    source: "stripe",
  });

  if (entitlementError) {
    // Race: unique violation → treat as success
    if (entitlementError.code === "23505") {
      return { ok: true, alreadyFulfilled: true };
    }
    return { ok: false, message: entitlementError.message };
  }

  const amountZl =
    typeof input.amountTotalGrosze === "number"
      ? input.amountTotalGrosze / 100
      : typed.price_grosze / 100;

  await admin.from("revenue_entries").insert({
    category: "shop",
    amount: amountZl,
    occurred_on: new Date().toISOString().slice(0, 10),
    note: `${typed.title} · Stripe ${input.checkoutSessionId}`,
  });

  let email = input.customerEmail?.trim() || null;
  if (!email) {
    const { data } = await admin.auth.admin.getUserById(input.userId);
    email = data.user?.email ?? null;
  }

  if (email) {
    await sendPurchaseEmail({ to: email, product: typed });
  }

  return { ok: true };
}

async function sendPurchaseEmail(input: {
  to: string;
  product: ProductRow;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return;

  const site = getSiteUrl();
  let attachment:
    | { filename: string; content: string }
    | undefined;

  try {
    const abs = resolveProductFileAbsolute(input.product.file_path);
    const file = await readFile(abs);
    attachment = {
      filename: `${input.product.slug}.pdf`,
      content: file.toString("base64"),
    };
  } catch {
    attachment = undefined;
  }

  const html = `
    <p>Dzięki za zakup w GrygielGitara.</p>
    <p><strong>${input.product.title}</strong> jest już przypisany do Twojego konta.</p>
    <p>Pobierz w panelu: <a href="${site}/moje-kursy">${site}/moje-kursy</a> (sekcja Zakupy).</p>
    ${
      attachment
        ? "<p>PDF jest też w załączniku tej wiadomości.</p>"
        : "<p>PDF pobierzesz z konta.</p>"
    }
  `;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: input.to,
    subject: `Twój zakup: ${input.product.title}`,
    html,
    attachments: attachment
      ? [{ filename: attachment.filename, content: attachment.content }]
      : undefined,
  });
  if (error) {
    console.error("sendPurchaseEmail Resend error:", error.message);
  }
}
