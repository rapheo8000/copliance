"use server";

import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe/client";
import { redirect } from "next/navigation";

export async function createCheckoutSession() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Get or create Stripe customer
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  let customerId = subscription?.stripe_customer_id;

  if (!customerId) {
    const customer = await getStripe().customers.create({
      email: user.email!,
      metadata: { user_id: user.id },
    });
    customerId = customer.id;

    await supabase
      .from("subscriptions")
      .update({ stripe_customer_id: customerId })
      .eq("user_id", user.id);
  }

  const session = await getStripe().checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [
      {
        price: process.env.STRIPE_PRO_PRICE_ID!,
        quantity: 1,
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
    metadata: { user_id: user.id },
  });

  if (session.url) {
    redirect(session.url);
  }
}

export async function createPortalSession() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  if (!subscription?.stripe_customer_id) {
    throw new Error("No Stripe customer found");
  }

  const session = await getStripe().billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
  });

  redirect(session.url);
}
