import { z } from "zod";

export const legalStatusSchema = z.enum(["micro", "ei", "eurl", "sasu"]);

export const activityTypeSchema = z.enum([
  "liberal",
  "commercial",
  "artisanal",
  "commercial_vente",
  "commercial_service",
]);

export const taxRegimeSchema = z.enum([
  "micro_fiscal",
  "reel_simplifie",
  "reel_normal",
  "is",
]);

export const declarationFrequencySchema = z.enum(["monthly", "quarterly"]);

export const onboardingStep1Schema = z.object({
  legalStatus: legalStatusSchema,
  activityType: activityTypeSchema,
});

export const onboardingStep2Schema = z.object({
  taxRegime: taxRegimeSchema,
  declarationFrequency: declarationFrequencySchema,
  versementLiberatoire: z.boolean(),
});

export const onboardingStep3Schema = z.object({
  hasTva: z.boolean(),
  hasAcre: z.boolean(),
  acreEndDate: z.string().optional(),
  hasAre: z.boolean(),
  siret: z.string().optional(),
  creationDate: z.string().min(1, "La date de creation est requise"),
});

export const fullOnboardingSchema = onboardingStep1Schema
  .merge(onboardingStep2Schema)
  .merge(onboardingStep3Schema);

export type OnboardingStep1 = z.infer<typeof onboardingStep1Schema>;
export type OnboardingStep2 = z.infer<typeof onboardingStep2Schema>;
export type OnboardingStep3 = z.infer<typeof onboardingStep3Schema>;
export type FullOnboardingData = z.infer<typeof fullOnboardingSchema>;
