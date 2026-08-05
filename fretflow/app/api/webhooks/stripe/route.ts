import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { fulfillShopPurchase } from "@/lib/shop-fulfillment";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return NextResponse.json(
      { error: "Missing STRIPE_WEBHOOK_SECRET" },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await request.text();
  const stripe = getStripe();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Invalid webhook signature",
      },
      { status: 400 },
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.user_id;
    const productId = session.metadata?.product_id;

    if (!userId || !productId) {
      return NextResponse.json(
        { error: "Missing metadata user_id / product_id" },
        { status: 400 },
      );
    }

    const result = await fulfillShopPurchase({
      userId,
      productId,
      checkoutSessionId: session.id,
      customerEmail: session.customer_details?.email ?? session.customer_email,
      amountTotalGrosze: session.amount_total,
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.message ?? "Fulfillment failed" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ received: true });
}
