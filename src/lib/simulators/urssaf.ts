import {
  COTISATION_RATES,
  VL_RATES,
  CFP_RATES,
  type ActivityRateKey,
} from "@/lib/engine/thresholds";
import type { ActivityType } from "@/types";

export interface UrssafSimulationInput {
  activityType: ActivityType;
  revenueAmount: number;
  hasAcre: boolean;
  versementLiberatoire: boolean;
}

export interface UrssafSimulationResult {
  revenueAmount: number;
  cotisationsRate: number;
  cotisationsAmount: number;
  vlRate: number;
  vlAmount: number;
  cfpRate: number;
  cfpAmount: number;
  totalCharges: number;
  netRevenue: number;
  effectiveRate: number;
}

function getActivityKey(activityType: ActivityType): ActivityRateKey {
  switch (activityType) {
    case "commercial_vente":
      return "commercial_vente";
    case "commercial_service":
      return "commercial_service";
    case "commercial":
      return "commercial";
    case "liberal":
      return "liberal";
    case "artisanal":
      return "artisanal";
    default:
      return "commercial";
  }
}

export function simulateUrssaf(
  input: UrssafSimulationInput
): UrssafSimulationResult {
  const key = getActivityKey(input.activityType);

  // Cotisations sociales
  const cotisationsRate = input.hasAcre
    ? COTISATION_RATES.acre[key]
    : COTISATION_RATES[key];
  const cotisationsAmount = input.revenueAmount * cotisationsRate;

  // Versement liberatoire (impot sur le revenu)
  const vlRate = input.versementLiberatoire ? VL_RATES[key] : 0;
  const vlAmount = input.revenueAmount * vlRate;

  // CFP (Contribution a la Formation Professionnelle)
  const cfpRate = CFP_RATES[key];
  const cfpAmount = input.revenueAmount * cfpRate;

  const totalCharges = cotisationsAmount + vlAmount + cfpAmount;
  const netRevenue = input.revenueAmount - totalCharges;
  const effectiveRate =
    input.revenueAmount > 0 ? totalCharges / input.revenueAmount : 0;

  return {
    revenueAmount: input.revenueAmount,
    cotisationsRate,
    cotisationsAmount,
    vlRate,
    vlAmount,
    cfpRate,
    cfpAmount,
    totalCharges,
    netRevenue,
    effectiveRate,
  };
}
