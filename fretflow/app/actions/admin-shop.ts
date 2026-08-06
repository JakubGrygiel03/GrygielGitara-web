"use server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

export type ShopAccountLookup = {
  userId: string;
  email: string;
  ownedProductIds: string[];
  studentName: string | null;
};

async function findAuthUserIdByEmail(
  admin: ReturnType<typeof createAdminClient>,
  email: string,
): Promise<{ id: string; email: string } | null> {
  // Paginate — Admin API has no getUserByEmail in this SDK version.
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) throw error;
    const users = data?.users ?? [];
    const match = users.find((u) => u.email?.toLowerCase() === email);
    if (match?.email) {
      return { id: match.id, email: match.email };
    }
    if (users.length < 200) break;
  }
  return null;
}

export async function lookupShopAccountByEmail(
  emailRaw: string,
): Promise<{
  ok: boolean;
  message: string;
  account?: ShopAccountLookup;
}> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Brak autoryzacji." };
  }

  const email = emailRaw.trim().toLowerCase();
  if (!email.includes("@")) {
    return { ok: false, message: "Podaj poprawny e-mail." };
  }

  try {
    const admin = createAdminClient();
    const authUser = await findAuthUserIdByEmail(admin, email);
    if (!authUser) {
      return {
        ok: false,
        message:
          "Brak konta w Auth z tym e-mailem. Osoba musi się zarejestrować (/moje-kursy/register) albo zaproś ją z zakładki Uczniowie.",
      };
    }

    const [{ data: entitlements }, { data: student }] = await Promise.all([
      admin
        .from("user_entitlements")
        .select("product_id")
        .eq("user_id", authUser.id),
      admin
        .from("students")
        .select("full_name")
        .eq("email", email)
        .maybeSingle(),
    ]);

    return {
      ok: true,
      message: "Znaleziono konto.",
      account: {
        userId: authUser.id,
        email: authUser.email,
        ownedProductIds: (entitlements ?? []).map((row) => row.product_id),
        studentName: student?.full_name ?? null,
      },
    };
  } catch (error) {
    console.error("lookupShopAccountByEmail error:", error);
    return { ok: false, message: "Nie udało się wyszukać konta." };
  }
}

export async function grantShopProducts(input: {
  userId: string;
  productIds: string[];
}): Promise<{ ok: boolean; message: string }> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Brak autoryzacji." };
  }

  const userId = input.userId.trim();
  const productIds = [...new Set(input.productIds.map((id) => id.trim()))].filter(
    Boolean,
  );

  if (!userId) {
    return { ok: false, message: "Brak użytkownika." };
  }
  if (productIds.length === 0) {
    return { ok: false, message: "Wybierz co najmniej jeden produkt." };
  }

  try {
    const admin = createAdminClient();

    const { data: authData, error: authError } =
      await admin.auth.admin.getUserById(userId);
    if (authError || !authData.user) {
      return { ok: false, message: "Nie znaleziono użytkownika Auth." };
    }

    const { data: products, error: productsError } = await admin
      .from("products")
      .select("id, title")
      .in("id", productIds);

    if (productsError) {
      return { ok: false, message: productsError.message };
    }
    if (!products?.length) {
      return { ok: false, message: "Nie znaleziono wybranych produktów." };
    }

    const { data: existing } = await admin
      .from("user_entitlements")
      .select("product_id")
      .eq("user_id", userId)
      .in(
        "product_id",
        products.map((p) => p.id),
      );

    const already = new Set((existing ?? []).map((row) => row.product_id));
    const toInsert = products.filter((p) => !already.has(p.id));

    if (toInsert.length === 0) {
      return {
        ok: true,
        message: "Wybrane produkty są już przypisane do tego konta.",
      };
    }

    const { error: insertError } = await admin.from("user_entitlements").insert(
      toInsert.map((p) => ({
        user_id: userId,
        product_id: p.id,
        stripe_checkout_session_id: null,
        source: "admin",
      })),
    );

    if (insertError) {
      if (insertError.code === "23505") {
        return {
          ok: true,
          message: "Dostęp już był nadany (albo częściowo — odśwież i sprawdź).",
        };
      }
      return { ok: false, message: insertError.message };
    }

    const titles = toInsert.map((p) => p.title).join(", ");
    const skipped = products.length - toInsert.length;
    const skipHint =
      skipped > 0 ? ` (${skipped} już było na koncie — pominięte).` : "";

    return {
      ok: true,
      message: `Nadano dostęp: ${titles}.${skipHint}`,
    };
  } catch (error) {
    console.error("grantShopProducts error:", error);
    return { ok: false, message: "Nie udało się nadać dostępu." };
  }
}
