import { createAdminClient } from "@/lib/supabase/admin";

export type SupabaseKeepAliveResult = {
  ok: boolean;
  message: string;
  at: string;
};

/**
 * Lightweight DB touch so Free-tier Supabase does not pause after ~7 days
 * of inactivity. Dashboard browsing alone does not count — need a real query.
 */
export async function pingSupabaseKeepAlive(): Promise<SupabaseKeepAliveResult> {
  const at = new Date().toISOString();

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("products")
      .select("id", { head: true, count: "exact" });

    if (error) {
      return {
        ok: false,
        message: error.message,
        at,
      };
    }

    return {
      ok: true,
      message: "Supabase keep-alive OK",
      at,
    };
  } catch (error) {
    return {
      ok: false,
      message: error instanceof Error ? error.message : "Keep-alive failed",
      at,
    };
  }
}
