import { THRESHOLDS } from "@/lib/engine/thresholds";
import type { ActivityType } from "@/types";

export interface TvaSimulationInput {
  activityType: ActivityType;
  monthlyRevenues: number[]; // Array of up to 12 monthly CA values
}

export interface TvaSimulationResult {
  totalRevenue: number;
  threshold: number;
  toleranceThreshold: number;
  percentOfThreshold: number;
  percentOfTolerance: number;
  willCrossThreshold: boolean;
  crossingMonth: number | null; // 0-indexed month when threshold is crossed
  remainingBeforeThreshold: number;
  recommendation: string;
}

function isVenteActivity(activityType: ActivityType): boolean {
  return activityType === "commercial_vente";
}

export function simulateTva(input: TvaSimulationInput): TvaSimulationResult {
  const isVente = isVenteActivity(input.activityType);
  const threshold = isVente ? THRESHOLDS.TVA_VENTE : THRESHOLDS.TVA_SERVICES;
  const toleranceThreshold = isVente
    ? THRESHOLDS.TVA_VENTE_TOLERANCE
    : THRESHOLDS.TVA_SERVICES_TOLERANCE;

  let cumulativeRevenue = 0;
  let crossingMonth: number | null = null;

  for (let i = 0; i < input.monthlyRevenues.length; i++) {
    cumulativeRevenue += input.monthlyRevenues[i];
    if (cumulativeRevenue > threshold && crossingMonth === null) {
      crossingMonth = i;
    }
  }

  const totalRevenue = cumulativeRevenue;
  const percentOfThreshold =
    threshold > 0 ? (totalRevenue / threshold) * 100 : 0;
  const percentOfTolerance =
    toleranceThreshold > 0
      ? (totalRevenue / toleranceThreshold) * 100
      : 0;
  const willCrossThreshold = totalRevenue > threshold;
  const remainingBeforeThreshold = Math.max(0, threshold - totalRevenue);

  let recommendation: string;
  if (percentOfThreshold < 50) {
    recommendation =
      "Vous etes loin du seuil de TVA. Aucune action necessaire pour le moment.";
  } else if (percentOfThreshold < 80) {
    recommendation =
      "Vous approchez du seuil de TVA. Commencez a vous renseigner sur les obligations liees a la TVA.";
  } else if (percentOfThreshold < 100) {
    recommendation =
      "Attention, vous etes proche du seuil de TVA ! Preparez-vous au passage a la TVA et contactez votre SIE.";
  } else if (percentOfTolerance < 100) {
    recommendation =
      "Vous avez depasse le seuil de base. Si c'est la premiere annee de depassement, vous restez en franchise. Au-dela du seuil majore, la TVA s'applique immediatement.";
  } else {
    recommendation =
      "Vous avez depasse le seuil majore. La TVA s'applique immediatement. Contactez votre SIE pour obtenir votre numero de TVA.";
  }

  return {
    totalRevenue,
    threshold,
    toleranceThreshold,
    percentOfThreshold,
    percentOfTolerance,
    willCrossThreshold,
    crossingMonth,
    remainingBeforeThreshold,
    recommendation,
  };
}
