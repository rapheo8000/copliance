"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createDeclaration(data: {
  period: string;
  revenueAmount: number;
}) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) throw new Error("Profile not found");

  const { error } = await supabase.from("declarations").insert({
    profile_id: profile.id,
    period: data.period,
    revenue_amount: data.revenueAmount,
    status: "draft",
  });

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
}
