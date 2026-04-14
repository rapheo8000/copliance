"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { OnboardingStep1 } from "@/lib/validations/profile";
import type { LegalStatus, ActivityType } from "@/types";

const legalStatuses: { value: LegalStatus; label: string; description: string }[] = [
  {
    value: "micro",
    label: "Micro-entreprise",
    description: "Auto-entrepreneur, regime simplifie",
  },
  {
    value: "ei",
    label: "Entreprise individuelle",
    description: "EI au regime reel",
  },
  {
    value: "eurl",
    label: "EURL",
    description: "Entreprise unipersonnelle a responsabilite limitee",
  },
  {
    value: "sasu",
    label: "SASU",
    description: "Societe par actions simplifiee unipersonnelle",
  },
];

const activityTypes: { value: ActivityType; label: string; description: string }[] = [
  {
    value: "commercial_vente",
    label: "Vente de marchandises",
    description: "Achat-revente, e-commerce, restauration a emporter",
  },
  {
    value: "commercial_service",
    label: "Prestation de services (BIC)",
    description: "Artisans, restauration sur place, transport",
  },
  {
    value: "liberal",
    label: "Activite liberale (BNC)",
    description: "Conseil, formation, developpement, design",
  },
  {
    value: "artisanal",
    label: "Activite artisanale",
    description: "Metiers manuels inscrits au repertoire des metiers",
  },
];

interface StepStatusProps {
  onNext: (data: OnboardingStep1) => void;
  defaultValues?: OnboardingStep1;
}

export function StepStatus({ onNext, defaultValues }: StepStatusProps) {
  const [legalStatus, setLegalStatus] = useState<LegalStatus | null>(
    defaultValues?.legalStatus ?? null
  );
  const [activityType, setActivityType] = useState<ActivityType | null>(
    defaultValues?.activityType ?? null
  );

  function handleNext() {
    if (legalStatus && activityType) {
      onNext({ legalStatus, activityType });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4 text-lg font-semibold">Votre statut juridique</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {legalStatuses.map((status) => (
            <Card
              key={status.value}
              className={cn(
                "cursor-pointer transition-colors hover:border-primary",
                legalStatus === status.value && "border-primary bg-primary/5"
              )}
              onClick={() => setLegalStatus(status.value)}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-base">{status.label}</CardTitle>
                <CardDescription className="text-xs">
                  {status.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Votre type d&apos;activite</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {activityTypes.map((activity) => (
            <Card
              key={activity.value}
              className={cn(
                "cursor-pointer transition-colors hover:border-primary",
                activityType === activity.value &&
                  "border-primary bg-primary/5"
              )}
              onClick={() => setActivityType(activity.value)}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-base">{activity.label}</CardTitle>
                <CardDescription className="text-xs">
                  {activity.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!legalStatus || !activityType}
          size="lg"
        >
          Continuer
        </Button>
      </div>
    </div>
  );
}
