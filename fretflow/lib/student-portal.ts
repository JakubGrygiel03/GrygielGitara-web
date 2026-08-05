import { loadOwnedPurchases } from "@/lib/shop";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { resolveStudentForAuthUser } from "@/lib/student-link";

export type StudentPortalLesson = {
  id: string;
  starts_at: string;
  ends_at: string;
  location: string | null;
  notes: string | null;
};

export type StudentPortalMaterial = {
  id: string;
  title: string;
  url: string;
  created_at: string;
};

export type StudentPortalPackage = {
  id: string;
  label: string;
  total_lessons: number;
  remaining_lessons: number;
  active: boolean;
};

export type StudentPortalData = {
  isLessonStudent: boolean;
  account: {
    email: string;
    displayName: string;
  };
  student: {
    id: string;
    full_name: string;
    email: string;
  } | null;
  nextLesson: StudentPortalLesson | null;
  pastLessons: StudentPortalLesson[];
  materials: StudentPortalMaterial[];
  packages: StudentPortalPackage[];
  sessionNotes: { id: string; body: string; created_at: string }[];
  purchases: {
    productId: string;
    slug: string;
    title: string;
    shortDescription: string;
    priceLabel: string;
    badge: string;
    image: string;
    imageAlt: string;
    purchasedAt: string;
  }[];
};

function accountOnlyData(
  email: string,
  displayName: string,
  purchases: StudentPortalData["purchases"] = [],
): StudentPortalData {
  return {
    isLessonStudent: false,
    account: { email, displayName },
    student: null,
    nextLesson: null,
    pastLessons: [],
    materials: [],
    packages: [],
    sessionNotes: [],
    purchases,
  };
}

/**
 * Load account portal. Lesson data only when linked to students table.
 */
export async function loadStudentPortalData(): Promise<
  | { ok: true; data: StudentPortalData }
  | {
      ok: false;
      reason: "unauthenticated" | "error";
      message: string;
    }
> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    return {
      ok: false,
      reason: "unauthenticated",
      message: "Zaloguj się e-mailem i hasłem.",
    };
  }

  const email = user.email.trim().toLowerCase();
  const metaName =
    typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name.trim()
      : "";
  const fallbackName = metaName || email.split("@")[0] || "Użytkowniku";

  let purchases: StudentPortalData["purchases"] = [];
  try {
    const owned = await loadOwnedPurchases(user.id);
    purchases = owned.map((item) => ({
      productId: item.productId,
      slug: item.slug,
      title: item.title,
      shortDescription: item.shortDescription,
      priceLabel: item.priceLabel,
      badge: item.badge,
      image: item.image,
      imageAlt: item.imageAlt,
      purchasedAt: item.purchasedAt,
    }));
  } catch {
    purchases = [];
  }

  const linked = await resolveStudentForAuthUser({
    userId: user.id,
    email,
  });

  if (!linked.ok) {
    if (linked.reason === "no_student") {
      return {
        ok: true,
        data: accountOnlyData(email, fallbackName, purchases),
      };
    }
    return { ok: false, reason: "error", message: linked.message };
  }

  const student = linked.student;
  const admin = createAdminClient();
  const nowIso = new Date().toISOString();

  const [lu, lp, mats, pkgs, nts] = await Promise.all([
    admin
      .from("lessons")
      .select("id, starts_at, ends_at, location, notes")
      .eq("student_id", student.id)
      .gte("starts_at", nowIso)
      .order("starts_at", { ascending: true })
      .limit(1),
    admin
      .from("lessons")
      .select("id, starts_at, ends_at, location, notes")
      .eq("student_id", student.id)
      .lt("starts_at", nowIso)
      .order("starts_at", { ascending: false })
      .limit(12),
    admin
      .from("student_materials")
      .select("id, title, url, created_at")
      .eq("student_id", student.id)
      .order("created_at", { ascending: false })
      .limit(50),
    admin
      .from("student_packages")
      .select("id, label, total_lessons, remaining_lessons, active")
      .eq("student_id", student.id)
      .order("created_at", { ascending: false }),
    admin
      .from("lesson_session_notes")
      .select("id, body, created_at")
      .eq("student_id", student.id)
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return {
    ok: true,
    data: {
      isLessonStudent: true,
      account: {
        email: student.email,
        displayName: student.full_name,
      },
      student: {
        id: student.id,
        full_name: student.full_name,
        email: student.email,
      },
      nextLesson: lu.data?.[0] ?? null,
      pastLessons: lp.data ?? [],
      materials: mats.data ?? [],
      packages: pkgs.data ?? [],
      sessionNotes: nts.data ?? [],
      purchases,
    },
  };
}
