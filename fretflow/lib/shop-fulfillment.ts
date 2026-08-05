import { readFile } from "node:fs/promises";
import { Resend } from "resend";

import { getSiteUrl } from "@/lib/env";
import { resolveProductFileAbsolute, type ProductRow } from "@/lib/shop";
import { getShopProductOffer } from "@/lib/shop-product-details";
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

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function sendPurchaseEmail(input: {
  to: string;
  product: ProductRow;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return;

  const site = getSiteUrl().includes("localhost")
    ? "https://grygielgitaraweb.vercel.app"
    : getSiteUrl();
  const portalUrl = `${site}/moje-kursy#zakupy`;
  const title = input.product.title;
  const offer = getShopProductOffer(input.product.slug);
  const tip =
    offer?.purchaseEmailTip ??
    "Na start: idź spokojnie rozdział po rozdziale i daj sobie czas na oswojenie materiału — małe kroki dają najszybszy efekt.";

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

  const attachmentBlock = attachment
    ? `<li>Pobierając plik PDF, który dla Twojej wygody dołączyłem jako załącznik do tej wiadomości.</li>`
    : `<li>Pobierając PDF z sekcji Zakupy w koncie (załącznik wyślemy, gdy plik będzie dostępny na serwerze).</li>`;

  const html = `
    <p>Cześć!</p>
    <p>Niezmiernie dziękuję Ci za zakup e-booka i za to, że doceniasz moją pracę oraz rzemieślnicze podejście do nauki gry na instrumencie.</p>
    <p>Ponieważ buduję markę <strong>GrygielGitara</strong> w pełni niezależnie, pracując wyłącznie na własne nazwisko i odrzucając masowe, szkolne schematy, każde takie zamówienie ma dla mnie ogromne znaczenie. To dla mnie najlepszy dowód na to, że pokazywanie muzyki jako bezstresowej przygody i czystej radości ma ogromny sens. Twój sukces i komfort są dla mnie absolutnym priorytetem, dlatego włożyłem w ten poradnik całe moje pedagogiczne i techniczne doświadczenie.</p>
    <p>Twój e-book <strong>„${escapeHtml(title)}”</strong> jest już przypisany do Twojego konta.</p>
    <p>Możesz go pobrać na dwa wygodne sposoby:</p>
    <ul>
      <li>Bezpośrednio w panelu studenta: <a href="${portalUrl}">${portalUrl}</a> (sekcja <strong>Zakupy</strong>).</li>
      ${attachmentBlock}
    </ul>
    <p>${escapeHtml(tip)}</p>
    <p>Gdyby podczas czytania lub pierwszych domowych ćwiczeń pojawiły się jakiekolwiek pytania lub wątpliwości techniczne — napisz do mnie śmiało, odpowiadając na tę wiadomość.</p>
    <p>Trzymam mocno kciuki za Twoje pierwsze kroki z instrumentem i do usłyszenia!</p>
    <p>Jakub Grygiel<br/>GrygielGitara</p>
  `;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: input.to,
    subject: `Dzięki za zaufanie! Twój e-book „${title}” jest już gotowy`,
    html,
    attachments: attachment
      ? [{ filename: attachment.filename, content: attachment.content }]
      : undefined,
  });
  if (error) {
    console.error("sendPurchaseEmail Resend error:", error.message);
  }
}
