"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { FullOnboardingData } from "@/lib/validations/profile";
import { generateObligations } from "@/lib/engine/obligations";
import type { UserProfile } from "@/types";

export async function completeOnboarding(data: FullOnboardingData) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  // Update profile with onboarding data
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .update({
      legal_status: data.legalStatus,
      activity_type: data.activityType,
      tax_regime: data.taxRegime,
      declaration_frequency: data.declarationFrequency,
      versement_liberatoire: data.versementLiberatoire,
      has_tva: data.hasTva,
      has_acre: data.hasAcre,
      acre_end_date: data.acreEndDate || null,
      has_are: data.hasAre,
      siret: data.siret || null,
      creation_date: data.creationDate,
      onboarding_completed: true,
    })
    .eq("user_id", user.id)
    .select()
    .single();

  if (profileError) throw new Error(profileError.message);

  // Generate obligations using the rules engine
  const userProfile: UserProfile = {
    id: profile.id,
    userId: profile.user_id,
    email: profile.email,
    fullName: profile.full_name,
    legalStatus: profile.legal_status,
    activityType: profile.activity_type,
    taxRegime: profile.tax_regime,
    creationDate: profile.creation_date ? new Date(profile.creation_date) : null,
    siret: profile.siret,
    hasTva: profile.has_tva,
    hasAcre: profile.has_acre,
    acreEndDate: profile.acre_end_date ? new Date(profile.acre_end_date) : null,
    hasAre: profile.has_are,
    versementLiberatoire: profile.versement_liberatoire,
    declarationFrequency: profile.declaration_frequency as "monthly" | "quarterly",
    onboardingCompleted: profile.onboarding_completed,
    createdAt: new Date(profile.created_at),
    updatedAt: new Date(profile.updated_at),
  };

  const obligationSpecs = generateObligations(userProfile);

  // Insert obligations into database
  if (obligationSpecs.length > 0) {
    const obligationsToInsert = obligationSpecs.map((spec) => ({
      profile_id: profile.id,
      type: spec.type,
      label: spec.label,
      description: spec.description,
      frequency: spec.frequency,
      next_due_date: spec.dueDate.toISOString().split("T")[0],
      status: "upcoming",
    }));

    const { error: obligationsError } = await supabase
      .from("obligations")
      .insert(obligationsToInsert);

    if (obligationsError) {
      console.error("Error inserting obligations:", obligationsError);
    }
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function getProfile() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return profile;
}
