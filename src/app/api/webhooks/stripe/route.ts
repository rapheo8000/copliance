import { NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe/client";
import { createClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

function createServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = createServiceClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      if (!userId) break;

      await supabase
        .from("subscriptions")
        .update({
          plan: "pro",
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          status: "active",
        })
        .eq("user_id", userId);
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const periodEnd = (subscription as any).current_period_end as number | undefined;

      await supabase
        .from("subscriptions")
        .update({
          status: subscription.status === "active" ? "active" : "past_due",
          current_period_end: periodEnd
            ? new Date(periodEnd * 1000).toISOString()
            : null,
        })
        .eq("stripe_customer_id", customerId);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId =
        typeof subscription.customer === "string"
          ? subscription.customer
          : subscription.customer.id;

      await supabase
        .from("subscriptions")
        .update({
          plan: "free",
          status: "canceled",
          stripe_subscription_id: null,
        })
        .eq("stripe_customer_id", customerId);
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId =
        typeof invoice.customer === "string"
          ? invoice.customer
          : invoice.customer?.id;

      if (customerId) {
        await supabase
          .from("subscriptions")
          .update({ status: "past_due" })
          .eq("stripe_customer_id", customerId);
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
