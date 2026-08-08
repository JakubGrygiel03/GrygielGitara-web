import { readFile } from "node:fs/promises";
import { Resend } from "resend";

import { resolveNotifyEmail } from "@/lib/admin-settings";
import { getSiteUrl } from "@/lib/env";
import { resolveProductFileAbsolute, type ProductRow } from "@/lib/shop";
import {
  digitalConsentEmailNotice,
  digitalConsentEmailNoticeVipPs,
  VIP_PURCHASE_EMAIL_SUBJECT,
} from "@/lib/shop-digital-terms";
import { getShopProductOffer } from "@/lib/shop-product-details";
import { createAdminClient } from "@/lib/supabase/admin";

const VIP_PACKAGE_SLUG = "start-bez-stresu-feedback-vip";

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

  if (typed.slug === VIP_PACKAGE_SLUG) {
    await grantBonusProductBySlug({
      userId: input.userId,
      slug: "setup-gitary-w-domu",
      checkoutSessionId: input.checkoutSessionId,
    });
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

/** Bonus title included with VIP (mentioned in purchase e-mail). Idempotent. */
async function grantBonusProductBySlug(input: {
  userId: string;
  slug: string;
  checkoutSessionId: string;
}): Promise<void> {
  const admin = createAdminClient();
  const { data: bonus } = await admin
    .from("products")
    .select("id")
    .eq("slug", input.slug)
    .maybeSingle();
  if (!bonus?.id) return;

  const { data: owned } = await admin
    .from("user_entitlements")
    .select("id")
    .eq("user_id", input.userId)
    .eq("product_id", bonus.id)
    .maybeSingle();
  if (owned) return;

  const { error } = await admin.from("user_entitlements").insert({
    user_id: input.userId,
    product_id: bonus.id,
    stripe_checkout_session_id: `${input.checkoutSessionId}:bonus:${input.slug}`,
    source: "stripe",
  });
  if (error && error.code !== "23505") {
    console.error("grantBonusProductBySlug:", error.message);
  }
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function portalPurchasesUrl() {
  const site = getSiteUrl().includes("localhost")
    ? "https://grygielgitaraweb.vercel.app"
    : getSiteUrl();
  return `${site}/moje-kursy#zakupy`;
}

async function loadProductPdfAttachment(product: ProductRow) {
  try {
    const abs = resolveProductFileAbsolute(product.file_path);
    const file = await readFile(abs);
    return {
      filename: `${product.slug}.pdf`,
      content: file.toString("base64"),
    };
  } catch {
    return undefined;
  }
}

function buildVipPurchaseEmailHtml(portalUrl: string) {
  return `
    <p>Cześć!</p>
    <p>Bardzo się cieszę, że zaczynamy tę drogę razem. Wybór pakietu z indywidualną konsultacją to najlepszy krok, jaki mogłeś zrobić na starcie.</p>
    <p>Najczęstszą barierą na początku nauki gry na gitarze jest lęk: „czy na pewno dobrze układam dłonie?” albo „co jeśli nauczę się złych nawyków i nabawię bólu?”. Dzięki analizie wideo całkowicie zdejmujemy ten problem z Twoich barków. Na moich lekcjach jesteśmy partnerami – dbam o Twoją technikę po to, abyś od samego początku czuł wolność i czystą radość z wydobywania dźwięków.</p>
    <p>W tym mailu znajdziesz prostą instrukcję, jak krok po kroku odebrać swoje osobiste wsparcie. Bez pośpiechu i w Twoim własnym tempie.</p>
    <p><strong>Twój plan działania VIP:</strong></p>
    <p><strong>Krok 1: Przeczytaj rozdział o ergonomii</strong><br/>
    Otwórz e-book „Start z gitarą bez stresu” i zacznij od rozdziału poświęconego prawidłowej postawie oraz układaniu dłoni. To nasz absolutny fundament. Zależy mi, aby Twoje palce od pierwszych minut pracowały luźno, bez niepotrzebnego napięcia i bólu.</p>
    <p><strong>Krok 2: Poćwicz spokojnie przez kilka dni</strong><br/>
    Daj sobie i swoim dłoniom czas na oswojenie się z instrumentem. Spróbuj zagrać pierwsze proste, jednogłosowe melodie z tabulatury. Pamiętaj, że całkowicie omijamy na start trudne akordy (jak F-dur) – skupiamy się wyłącznie na czystości dźwięku i Twoim komforcie.</p>
    <p><strong>Krok 3: Nagraj krótkie wideo smartfonem</strong><br/>
    Kiedy poczujesz, że Twoje palce zaczynają łapać o co chodzi, nagraj krótki filmik (wystarczą 2–3 minuty). Ustaw telefon tak, aby było dobrze widać Twoją postawę, ułożenie gitary oraz obie dłonie na gryfie i strunach.<br/>
    <strong>Ważna wskazówka:</strong> Nie przejmuj się potknięciami czy puszczeniem nieczystego dźwięku. To nagranie nie ma być idealnym występem scenicznym. Ma pokazać Twój naturalny stan gry, żebym wiedział, jak mogę Ci najlepiej pomóc.</p>
    <p><strong>Krok 4: Prześlij nagranie do mnie</strong><br/>
    Odpowiedz bezpośrednio na tego maila i załącz swoje wideo. Jeśli plik jest za duży, możesz wrzucić go na swój Dysk Google, Dropbox, WeTransfer lub wysłać mi go bezpośrednio na Telegramie.</p>
    <p><strong>Co wydarzy się dalej?</strong><br/>
    Dokładnie przyjrzę się Twojej technice, postawie oraz rytmowi. W ciągu maksymalnie 3 dni roboczych odeślę do Ciebie moje osobiste nagranie wideo z informacją zwrotną. Pokażę Ci w nim, co już teraz robisz super, a jakie drobne detale w ułożeniu palców warto skorygować, aby grało Ci się jeszcze lżej i przyjemniej.</p>
    <p>Twoje materiały cyfrowe są już gotowe i czekają na Ciebie w sekcji <strong>Zakupy</strong> w Twoim koncie ucznia: <a href="${portalUrl}">${portalUrl}</a>. Dorzuciłem tam dla Ciebie również drugi e-book: „Setup i dbanie o gitarę w domu”, który pomoże Ci zadbać o to, aby struny były miękkie i blisko gryfu.</p>
    <p>Do usłyszenia przy strunach!<br/>Jakub Grygiel</p>
    <p><strong>P.S. (Informacja prawna):</strong> ${escapeHtml(digitalConsentEmailNoticeVipPs)}</p>
  `;
}

async function sendPurchaseEmail(input: {
  to: string;
  product: ProductRow;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return;

  const portalUrl = portalPurchasesUrl();
  const title = input.product.title;
  const isVip = input.product.slug === VIP_PACKAGE_SLUG;
  const attachment = await loadProductPdfAttachment(input.product);

  let subject: string;
  let html: string;

  if (isVip) {
    subject = VIP_PURCHASE_EMAIL_SUBJECT;
    html = buildVipPurchaseEmailHtml(portalUrl);
  } else {
    const offer = getShopProductOffer(input.product.slug);
    const tip =
      offer?.purchaseEmailTip ??
      "Na start: idź spokojnie rozdział po rozdziale i daj sobie czas na oswojenie materiału — małe kroki dają najszybszy efekt.";

    const attachmentBlock = attachment
      ? `<li>Pobierając plik PDF, który dla Twojej wygody dołączyłem jako załącznik do tej wiadomości.</li>`
      : `<li>Pobierając PDF z sekcji Zakupy w koncie (załącznik wyślemy, gdy plik będzie dostępny na serwerze).</li>`;

    subject = `Dzięki za zaufanie! Twój e-book „${title}” jest już gotowy`;
    html = `
    <p>Cześć!</p>
    <p>Niezmiernie dziękuję Ci za zakup e-booka i za to, że doceniasz moją pracę oraz rzemieślnicze podejście do nauki gry na instrumencie.</p>
    <p>Ponieważ buduję markę <strong>GrygielGitara</strong> w pełni niezależnie, pracując wyłącznie na własne nazwisko i odrzucając masowe, szkolne schematy, każde takie zamówienie ma dla mnie ogromne znaczenie. To dla mnie najlepszy dowód na to, że pokazywanie muzyki jako bezstresowej przygody i czystej radości ma ogromny sens. Twój sukces i komfort są dla mnie absolutnym priorytetem, dlatego włożyłem w ten poradnik całe moje pedagogiczne i techniczne doświadczenie.</p>
    <p>Twój e-book <strong>„${escapeHtml(title)}”</strong> jest już przypisany do Twojego konta.</p>
    <p>Możesz go pobrać na dwa wygodne sposoby:</p>
    <ul>
      <li>Bezpośrednio w panelu studenta: <a href="${portalUrl}">${portalUrl}</a> (sekcja <strong>Zakupy</strong>).</li>
      ${attachmentBlock}
    </ul>
    <p><strong>Potwierdzenie utraty prawa odstąpienia od umowy:</strong> ${escapeHtml(digitalConsentEmailNotice)}</p>
    <p>${escapeHtml(tip)}</p>
    <p>Gdyby podczas czytania lub pierwszych domowych ćwiczeń pojawiły się jakiekolwiek pytania lub wątpliwości techniczne — napisz do mnie śmiało, odpowiadając na tę wiadomość.</p>
    <p>Trzymam mocno kciuki za Twoje pierwsze kroki z instrumentem i do usłyszenia!</p>
    <p>Jakub Grygiel<br/>GrygielGitara</p>
  `;
  }

  const replyTo = resolveNotifyEmail() || undefined;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: input.to,
    ...(replyTo ? { replyTo } : {}),
    subject,
    html,
    attachments: attachment
      ? [{ filename: attachment.filename, content: attachment.content }]
      : undefined,
  });
  if (error) {
    console.error("sendPurchaseEmail Resend error:", error.message);
  }
}

/** Manual admin grant — different copy than Stripe purchase confirmation. */
export async function sendAdminAccessGrantedEmail(input: {
  to: string;
  products: ProductRow[];
  recipientName?: string | null;
}): Promise<{ ok: boolean; message?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    return { ok: false, message: "Brak konfiguracji Resend." };
  }
  if (!input.products.length) {
    return { ok: false, message: "Brak produktów do maila." };
  }

  const portalUrl = portalPurchasesUrl();
  const firstName = input.recipientName?.trim().split(/\s+/)[0] || "";
  const greeting = firstName ? `Cześć ${escapeHtml(firstName)},` : "Cześć!";
  const titles = input.products.map((p) => p.title);
  const titleListHtml = titles
    .map((t) => `<li><strong>„${escapeHtml(t)}”</strong></li>`)
    .join("");
  const subjectTitle =
    titles.length === 1
      ? `„${titles[0]}”`
      : `${titles.length} materiały na Twoim koncie`;

  const attachments: { filename: string; content: string }[] = [];
  for (const product of input.products) {
    const file = await loadProductPdfAttachment(product);
    if (file) attachments.push(file);
  }

  const attachmentNote =
    attachments.length > 0
      ? `<p>Dla wygody dołączam też ${attachments.length === 1 ? "PDF jako załącznik" : "PDF-y jako załączniki"} do tej wiadomości.</p>`
      : `<p>Plik pobierzesz z sekcji <strong>Zakupy</strong> w koncie (załącznik doślemy, gdy będzie dostępny na serwerze).</p>`;

  const html = `
    <p>${greeting}</p>
    <p>Przypisałem do Twojego konta GrygielGitara następujący materiał:</p>
    <ul>
      ${titleListHtml}
    </ul>
    <p>Dostęp jest już aktywny — nic nie musisz kupować ponownie.</p>
    <p>Znajdziesz go tutaj: <a href="${portalUrl}">${portalUrl}</a> (sekcja <strong>Zakupy</strong>).</p>
    ${attachmentNote}
    <p>Jakby coś nie działało albo masz pytania do materiału — po prostu odpisz na tego maila.</p>
    <p>Do zobaczenia!<br/>Jakub Grygiel<br/>GrygielGitara</p>
  `;

  const replyTo = resolveNotifyEmail() || undefined;

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: input.to,
    ...(replyTo ? { replyTo } : {}),
    subject: `Przypisałem materiał do Twojego konta: ${subjectTitle}`,
    html,
    attachments: attachments.length
      ? attachments.map((a) => ({
          filename: a.filename,
          content: a.content,
        }))
      : undefined,
  });

  if (error) {
    console.error("sendAdminAccessGrantedEmail Resend error:", error.message);
    return { ok: false, message: error.message };
  }
  return { ok: true };
}
