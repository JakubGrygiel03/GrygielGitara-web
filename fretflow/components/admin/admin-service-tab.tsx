"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  createServiceOrder,
  deleteServiceOrder,
  notifyServicePickup,
  updateServiceOrderStatus,
  type ServiceStatus,
} from "@/app/actions/admin-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { ServiceOrderRow, StudentRow } from "@/lib/admin-types";

const statusLabels: Record<ServiceStatus, string> = {
  queued: "W kolejce",
  in_progress: "W trakcie pracy",
  ready: "Gotowa do odbioru",
  delivered: "Wydana",
};

export function AdminServiceTab({
  orders,
  students,
}: {
  orders: ServiceOrderRow[];
  students: StudentRow[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState({
    studentId: "",
    clientName: "",
    email: "",
    phone: "",
    guitarModel: "",
    receivedAt: new Date().toISOString().slice(0, 10),
    conditionNotes: "",
    price: "",
  });

  const open = orders.filter((o) => o.status !== "delivered");
  const done = orders.filter((o) => o.status === "delivered");

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Serwis gitary</h2>
        <p className="mt-1 text-sm text-muted">
          Przyjęte instrumenty: kolejka → praca → odbiór → wydane.
        </p>
      </div>

      <form
        className="space-y-3 rounded-2xl border border-sky-100 bg-white p-4 sm:p-5"
        onSubmit={(event) => {
          event.preventDefault();
          startTransition(async () => {
            const result = await createServiceOrder(form);
            if (!result.ok) {
              toast.error(result.message);
              return;
            }
            toast.success(result.message);
            setForm((prev) => ({
              ...prev,
              studentId: "",
              clientName: "",
              email: "",
              phone: "",
              guitarModel: "",
              conditionNotes: "",
              price: "",
            }));
            router.refresh();
          });
        }}
      >
        <h2 className="text-lg font-semibold text-slate-900">
          Nowe zlecenie serwisowe
        </h2>
        <div className="space-y-1">
          <Label htmlFor="svcStudent">Uczeń (opcjonalnie)</Label>
          <select
            id="svcStudent"
            className="flex h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm"
            value={form.studentId}
            onChange={(event) => {
              const id = event.target.value;
              const student = students.find((s) => s.id === id);
              setForm((prev) => ({
                ...prev,
                studentId: id,
                clientName: student?.full_name ?? prev.clientName,
                email: student?.email ?? prev.email,
                phone: student?.phone ?? prev.phone,
              }));
            }}
          >
            <option value="">Klient z zewnątrz / ręcznie</option>
            {students.map((student) => (
              <option key={student.id} value={student.id}>
                {student.full_name}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="clientName">Klient</Label>
            <Input
              id="clientName"
              required
              value={form.clientName}
              onChange={(e) =>
                setForm((p) => ({ ...p, clientName: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="guitarModel">Model gitary</Label>
            <Input
              id="guitarModel"
              required
              placeholder="np. Fender Stratocaster"
              value={form.guitarModel}
              onChange={(e) =>
                setForm((p) => ({ ...p, guitarModel: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="svcEmail">E-mail</Label>
            <Input
              id="svcEmail"
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="svcPhone">Telefon</Label>
            <Input
              id="svcPhone"
              value={form.phone}
              onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="receivedAt">Data przyjęcia</Label>
            <Input
              id="receivedAt"
              type="date"
              required
              value={form.receivedAt}
              onChange={(e) =>
                setForm((p) => ({ ...p, receivedAt: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="svcPrice">Cena (opcjonalnie)</Label>
            <Input
              id="svcPrice"
              inputMode="decimal"
              placeholder="120"
              value={form.price}
              onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
            />
          </div>
        </div>
        <div className="space-y-1">
          <Label htmlFor="conditionNotes">Stan / opis</Label>
          <Textarea
            id="conditionNotes"
            className="min-h-20"
            placeholder="stare struny, wysoka akcja, brudna podstrunnica…"
            value={form.conditionNotes}
            onChange={(e) =>
              setForm((p) => ({ ...p, conditionNotes: e.target.value }))
            }
          />
        </div>
        <Button type="submit" disabled={isPending}>
          Dodaj zlecenie
        </Button>
      </form>

      <OrderList
        title={`Aktywne (${open.length})`}
        orders={open}
        isPending={isPending}
        onRefresh={() => router.refresh()}
      />
      <OrderList
        title={`Wydane (${done.length})`}
        orders={done}
        isPending={isPending}
        onRefresh={() => router.refresh()}
        muted
      />
    </section>
  );
}

function OrderList({
  title,
  orders,
  isPending,
  onRefresh,
  muted,
}: {
  title: string;
  orders: ServiceOrderRow[];
  isPending: boolean;
  onRefresh: () => void;
  muted?: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const busy = isPending || pending;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {orders.length === 0 ? (
        <p className="text-sm text-muted">Brak pozycji.</p>
      ) : (
        <ul className="space-y-3">
          {orders.map((order) => (
            <li
              key={order.id}
              className={
                muted
                  ? "rounded-2xl border border-slate-100 bg-slate-50/80 p-4"
                  : "rounded-2xl border border-sky-100 bg-white p-4"
              }
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">
                    {order.guitar_model}
                  </p>
                  <p className="text-sm text-muted">
                    {order.client_name}
                    {order.phone ? ` · ${order.phone}` : ""}
                    {order.email ? ` · ${order.email}` : ""}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Przyjęto: {order.received_at}
                    {order.price != null ? ` · ${order.price} zł` : ""}
                  </p>
                </div>
                <select
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm"
                  value={order.status}
                  disabled={busy}
                  onChange={(event) => {
                    const status = event.target.value as ServiceStatus;
                    startTransition(async () => {
                      const result = await updateServiceOrderStatus(
                        order.id,
                        status,
                      );
                      if (!result.ok) {
                        toast.error(result.message);
                        return;
                      }
                      toast.success(result.message);
                      onRefresh();
                    });
                  }}
                >
                  {(Object.keys(statusLabels) as ServiceStatus[]).map((key) => (
                    <option key={key} value={key}>
                      {statusLabels[key]}
                    </option>
                  ))}
                </select>
              </div>
              {order.condition_notes ? (
                <p className="mt-2 text-sm text-slate-700">
                  {order.condition_notes}
                </p>
              ) : null}
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  type="button"
                  size="sm"
                  disabled={busy}
                  onClick={() => {
                    startTransition(async () => {
                      const result = await notifyServicePickup(order.id);
                      if (!result.ok) {
                        toast.error(result.message);
                        return;
                      }
                      toast.success(result.message);
                      onRefresh();
                    });
                  }}
                >
                  Powiadom o odbiorze
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={busy}
                  onClick={() => {
                    if (!window.confirm("Usunąć to zlecenie?")) return;
                    startTransition(async () => {
                      const result = await deleteServiceOrder(order.id);
                      if (!result.ok) {
                        toast.error(result.message);
                        return;
                      }
                      toast.success(result.message);
                      onRefresh();
                    });
                  }}
                >
                  Usuń
                </Button>
                {order.notify_ready_sent ? (
                  <span className="self-center text-xs text-muted">
                    powiadomiono
                  </span>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
