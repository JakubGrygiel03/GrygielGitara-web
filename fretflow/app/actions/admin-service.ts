"use server";

import { isAdminAuthenticated } from "@/lib/admin-auth";
import { notifyServiceReady } from "@/lib/notify-service";
import { createAdminClient } from "@/lib/supabase/admin";

export type ServiceStatus = "queued" | "in_progress" | "ready" | "delivered";

export async function createServiceOrder(input: {
  studentId?: string;
  clientName: string;
  email?: string;
  phone?: string;
  guitarModel: string;
  receivedAt: string;
  conditionNotes?: string;
  price?: string;
}): Promise<{ ok: boolean; message: string }> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Brak autoryzacji." };
  }

  const clientName = input.clientName.trim();
  const guitarModel = input.guitarModel.trim();
  if (clientName.length < 2 || guitarModel.length < 2) {
    return { ok: false, message: "Podaj klienta i model gitary." };
  }

  const priceRaw = input.price?.trim();
  const price = priceRaw ? Number(priceRaw.replace(",", ".")) : null;
  if (priceRaw && (Number.isNaN(price) || (price ?? 0) < 0)) {
    return { ok: false, message: "Nieprawidłowa cena." };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("service_orders").insert({
      student_id: input.studentId || null,
      client_name: clientName,
      email: input.email?.trim() || null,
      phone: input.phone?.trim() || null,
      guitar_model: guitarModel,
      received_at: input.receivedAt || new Date().toISOString().slice(0, 10),
      condition_notes: input.conditionNotes?.trim() || null,
      status: "queued",
      price,
    });
    if (error) return { ok: false, message: error.message };
    return { ok: true, message: "Zlecenie dodane." };
  } catch {
    return {
      ok: false,
      message: "Odpal migrację 20260326_admin_ops.sql w Supabase.",
    };
  }
}

export async function updateServiceOrderStatus(
  id: string,
  status: ServiceStatus,
): Promise<{ ok: boolean; message: string }> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Brak autoryzacji." };
  }

  try {
    const supabase = createAdminClient();
    const patch: {
      status: ServiceStatus;
      delivered_at?: string | null;
    } = { status };
    if (status === "delivered") {
      patch.delivered_at = new Date().toISOString();
    }
    const { error } = await supabase
      .from("service_orders")
      .update(patch)
      .eq("id", id);
    if (error) return { ok: false, message: error.message };
    return { ok: true, message: "Status zlecenia zapisany." };
  } catch {
    return { ok: false, message: "Nie udało się zapisać statusu." };
  }
}

export async function notifyServicePickup(
  id: string,
): Promise<{ ok: boolean; message: string }> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Brak autoryzacji." };
  }

  try {
    const supabase = createAdminClient();
    const { data: order, error } = await supabase
      .from("service_orders")
      .select("id, client_name, email, phone, guitar_model, status")
      .eq("id", id)
      .maybeSingle();

    if (error || !order) {
      return { ok: false, message: "Nie znaleziono zlecenia." };
    }

    const notify = await notifyServiceReady({
      clientName: order.client_name,
      email: order.email,
      phone: order.phone,
      guitarModel: order.guitar_model,
    });

    await supabase
      .from("service_orders")
      .update({
        notify_ready_sent: notify.emailOk || notify.smsOk,
        status: order.status === "queued" ? "ready" : order.status,
      })
      .eq("id", id);

    const parts = [
      notify.emailOk ? "e-mail OK" : "e-mail nie wyszedł",
      notify.smsOk
        ? "SMS OK"
        : `SMS: ${notify.smsSkippedReason || "nie wysłano"}`,
    ];
    return {
      ok: true,
      message: `Powiadomienie o odbiorze: ${parts.join(", ")}.`,
    };
  } catch {
    return { ok: false, message: "Błąd wysyłki powiadomienia." };
  }
}

export async function deleteServiceOrder(
  id: string,
): Promise<{ ok: boolean; message: string }> {
  if (!(await isAdminAuthenticated())) {
    return { ok: false, message: "Brak autoryzacji." };
  }
  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("service_orders").delete().eq("id", id);
    if (error) return { ok: false, message: error.message };
    return { ok: true, message: "Zlecenie usunięte." };
  } catch {
    return { ok: false, message: "Nie udało się usunąć." };
  }
}
