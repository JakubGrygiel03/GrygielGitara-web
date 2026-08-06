"use server";

import { earlyBirdSuccessMessage } from "@/lib/shop-early-bird";
import { SHOP_EARLY_BIRD_PERCENT, shopProducts } from "@/lib/shop-products";
import {
  contactFormSchema,
  LESSON_WAITLIST_SUCCESS,
  type ContactFormValues,
} from "@/lib/validations/contact";
import { createClient } from "@/lib/supabase/server";
import { sendContactEmails } from "@/lib/resend";

export type ContactActionState = {
  ok: boolean;
  message: string;
  fieldErrors?: Partial<Record<keyof ContactFormValues, string[]>>;
};

async function resolveEarlyBirdOffer(
  supabase: Awaited<ReturnType<typeof createClient>>,
  slug: string,
): Promise<{ open: boolean; title: string } | null> {
  const { data } = await supabase
    .from("products")
    .select("title, early_bird_open, published")
    .eq("slug", slug)
    .maybeSingle();

  if (data) {
    return {
      open: Boolean(data.published && data.early_bird_open),
      title: data.title,
    };
  }

  const fallback = shopProducts.find((p) => p.slug === slug);
  if (!fallback) return null;
  return { open: fallback.earlyBirdOpen, title: fallback.title };
}

export async function submitContactForm(
  values: ContactFormValues,
): Promise<ContactActionState> {
  const parsed = contactFormSchema.safeParse(values);

  if (!parsed.success) {
    return {
      ok: false,
      message: "Sprawdź pola formularza i spróbuj ponownie.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const {
    senderName,
    email,
    phone,
    topic,
    message,
    productSlug,
    productTitle,
  } = parsed.data;
  const supabase = await createClient();
  const isWaitlist = topic === "lesson_waitlist";
  const slug = productSlug?.trim() || "";
  const isShopEarlyBird = topic === "shop_support" && Boolean(slug);

  const { error } = await supabase.from("contact_messages").insert({
    sender_name: senderName,
    email,
    phone: phone || null,
    topic,
    message,
  });

  if (error) {
    console.error("contact_messages insert failed:", error.message, error);
    const topicHint =
      error.message.includes("topic") || error.message.includes("check")
        ? " Odpal migrację 20260326_contact_lesson_waitlist_topic.sql"
        : "";
    return {
      ok: false,
      message:
        error.code === "42501"
          ? "Baza nie ma uprawnień INSERT. Odpal w Supabase SQL Editor plik supabase/migrations/20260325_phase1_grants.sql"
          : `Nie udało się wysłać wiadomości.${topicHint}`,
    };
  }

  if (isWaitlist) {
    const { error: waitlistError } = await supabase
      .from("lesson_waitlist")
      .insert({
        full_name: senderName,
        email,
        phone: phone || null,
        note: message,
      });

    if (waitlistError && waitlistError.code !== "23505") {
      console.error(
        "lesson_waitlist insert from contact failed:",
        waitlistError.message,
      );
    }
  }

  let successMessage = isWaitlist
    ? LESSON_WAITLIST_SUCCESS
    : "Wiadomość wysłana. Na maila leci potwierdzenie.";

  if (isShopEarlyBird) {
    const offer = await resolveEarlyBirdOffer(supabase, slug);
    if (!offer?.open) {
      successMessage =
        "Wiadomość wysłana. Ten tytuł nie ma teraz otwartej listy −30% (np. koncept / feedback albo premiera już minęła).";
    } else {
      const title = productTitle?.trim() || offer.title;
      const { error: earlyError } = await supabase
        .from("shop_early_bird_signups")
        .insert({
          full_name: senderName,
          email,
          phone: phone || null,
          product_slug: slug,
          product_title: title,
          discount_percent: SHOP_EARLY_BIRD_PERCENT,
          note: message,
        });

      if (earlyError && earlyError.code !== "23505") {
        console.error(
          "shop_early_bird_signups insert failed:",
          earlyError.message,
        );
        successMessage =
          "Wiadomość wysłana. Lista −30% wymaga migracji SQL 20260326_shop_early_bird.sql (albo RUN_ME).";
      } else {
        successMessage = earlyBirdSuccessMessage(title);
      }
    }
  }

  try {
    await sendContactEmails({
      senderName,
      email,
      phone: phone || undefined,
      topic,
      message,
    });
  } catch (mailError) {
    console.error("contact email failed:", mailError);
  }

  return {
    ok: true,
    message: successMessage,
  };
}
