import type { UserProfile } from "@/types";
import { generateMicroObligations, type ObligationSpec } from "./rules/micro";

/**
 * Main entry point for the rules engine.
 * Takes a user profile and generates all applicable obligations
 * for the next 12 months.
 *
 * Currently supports: micro-entrepreneur
 * Phase 2 will add: EI, EURL, SASU
 */
export function generateObligations(
  profile: UserProfile,
  referenceDate: Date = new Date()
): ObligationSpec[] {
  switch (profile.legalStatus) {
    case "micro":
      return generateMicroObligations(profile, referenceDate);

    case "ei":
    case "eurl":
    case "sasu":
      // Phase 2: return specific rules for these statuts
      // For now, fall through to micro rules as a baseline
      return generateMicroObligations(profile, referenceDate);

    default:
      return [];
  }
}

export type { ObligationSpec };
