import { FREE_GUIDE_SLUG } from "@/lib/free-guide";
import { createAdminClient } from "@/lib/supabase/admin";

async function findAuthUserIdByEmail(
  admin: ReturnType<typeof createAdminClient>,
  email: string,
): Promise<string | null> {
  const normalized = email.trim().toLowerCase();
  for (let page = 1; page <= 10; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    });
    if (error) {
      console.error("grantFreeGuide listUsers:", error.message);
      return null;
    }
    const found = data.users.find((user) => user.email?.toLowerCase() === normalized);
    if (found) return found.id;
    if (data.users.length < 200) break;
  }
  return null;
}

async function grantToUserId(
  admin: ReturnType<typeof createAdminClient>,
  userId: string,
): Promise<void> {
  const { data: product } = await admin
    .from("products")
    .select("id")
    .eq("slug", FREE_GUIDE_SLUG)
    .maybeSingle();
  if (!product?.id) return;

  const { error } = await admin.from("user_entitlements").insert({
    user_id: userId,
    product_id: product.id,
    stripe_checkout_session_id: null,
    source: "free_guide",
  });
  if (error && error.code !== "23505") {
    console.error("grantFreeGuide entitlement:", error.message);
  }
}

/** Attach Gitarowy Reset to an existing Auth account (same e-mail). */
export async function grantFreeGuideToEmail(email: string): Promise<void> {
  try {
    const admin = createAdminClient();
    const userId = await findAuthUserIdByEmail(admin, email);
    if (!userId) return;
    await grantToUserId(admin, userId);
  } catch (error) {
    console.error("grantFreeGuideToEmail:", error);
  }
}

/** Attach Gitarowy Reset when the user is already known by Auth id. */
export async function grantFreeGuideToUserId(userId: string): Promise<void> {
  if (!userId) return;
  try {
    const admin = createAdminClient();
    await grantToUserId(admin, userId);
  } catch (error) {
    console.error("grantFreeGuideToUserId:", error);
  }
}

/**
 * After login / register: only if this e-mail already claimed the free PDF.
 */
export async function grantFreeGuideToUserIfLead(
  userId: string,
  email: string,
): Promise<void> {
  if (!userId || !email) return;
  try {
    const admin = createAdminClient();
    const { data: lead } = await admin
      .from("newsletter_subscribers")
      .select("id")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();
    if (!lead) return;
    await grantToUserId(admin, userId);
  } catch (error) {
    console.error("grantFreeGuideToUserIfLead:", error);
  }
}
