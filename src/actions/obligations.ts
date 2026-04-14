"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getObligations() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) return [];

  const { data: obligations } = await supabase
    .from("obligations")
    .select("*")
    .eq("profile_id", profile.id)
    .order("next_due_date", { ascending: true });

  return obligations || [];
}

export async function getUpcomingObligations(limit: number = 5) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (!profile) return [];

  const today = new Date().toISOString().split("T")[0];

  const { data: obligations } = await supabase
    .from("obligations")
    .select("*")
    .eq("profile_id", profile.id)
    .gte("next_due_date", today)
    .neq("status", "completed")
    .order("next_due_date", { ascending: true })
    .limit(limit);

  return obligations || [];
}

export async function markObligationComplete(obligationId: string) {
  const supabase = createClient();

  const { error } = await supabase
    .from("obligations")
    .update({ status: "completed" })
    .eq("id", obligationId);

  if (error) throw new Error(error.message);

  revalidatePath("/dashboard");
  revalidatePath("/calendar");
}
