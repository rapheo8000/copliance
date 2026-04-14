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
import type { OnboardingStep2 } from "@/lib/validations/profile";
import type { TaxRegime, DeclarationFrequency } from "@/types";

const taxRegimes: { value: TaxRegime; label: string; description: string }[] = [
  {
    value: "micro_fiscal",
    label: "Regime micro-fiscal",
    description: "Abattement forfaitaire, pas de comptabilite complexe",
  },
  {
    value: "reel_simplifie",
    label: "Reel simplifie",
    description: "Deduction des charges reelles, comptabilite allegee",
  },
  {
    value: "reel_normal",
    label: "Reel normal",
    description: "Comptabilite complete, TVA mensuelle",
  },
  {
    value: "is",
    label: "Impot sur les societes",
    description: "Pour EURL/SASU ayant opte pour l'IS",
  },
];

const frequencies: {
  value: DeclarationFrequency;
  label: string;
  description: string;
}[] = [
  {
    value: "monthly",
    label: "Mensuelle",
    description: "Declaration chaque mois",
  },
  {
    value: "quarterly",
    label: "Trimestrielle",
    description: "Declaration chaque trimestre (par defaut)",
  },
];

interface StepActivityProps {
  onNext: (data: OnboardingStep2) => void;
  onBack: () => void;
  defaultValues?: OnboardingStep2;
}

export function StepActivity({ onNext, onBack, defaultValues }: StepActivityProps) {
  const [taxRegime, setTaxRegime] = useState<TaxRegime | null>(
    defaultValues?.taxRegime ?? null
  );
  const [frequency, setFrequency] = useState<DeclarationFrequency>(
    defaultValues?.declarationFrequency ?? "quarterly"
  );
  const [vl, setVl] = useState(defaultValues?.versementLiberatoire ?? false);

  function handleNext() {
    if (taxRegime) {
      onNext({
        taxRegime,
        declarationFrequency: frequency,
        versementLiberatoire: vl,
      });
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4 text-lg font-semibold">Votre regime fiscal</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {taxRegimes.map((regime) => (
            <Card
              key={regime.value}
              className={cn(
                "cursor-pointer transition-colors hover:border-primary",
                taxRegime === regime.value && "border-primary bg-primary/5"
              )}
              onClick={() => setTaxRegime(regime.value)}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-base">{regime.label}</CardTitle>
                <CardDescription className="text-xs">
                  {regime.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">
          Frequence de declaration Urssaf
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {frequencies.map((freq) => (
            <Card
              key={freq.value}
              className={cn(
                "cursor-pointer transition-colors hover:border-primary",
                frequency === freq.value && "border-primary bg-primary/5"
              )}
              onClick={() => setFrequency(freq.value)}
            >
              <CardHeader className="p-4">
                <CardTitle className="text-base">{freq.label}</CardTitle>
                <CardDescription className="text-xs">
                  {freq.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Versement liberatoire</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Card
            className={cn(
              "cursor-pointer transition-colors hover:border-primary",
              vl && "border-primary bg-primary/5"
            )}
            onClick={() => setVl(true)}
          >
            <CardHeader className="p-4">
              <CardTitle className="text-base">Oui</CardTitle>
              <CardDescription className="text-xs">
                Impot preleve avec les cotisations Urssaf
              </CardDescription>
            </CardHeader>
          </Card>
          <Card
            className={cn(
              "cursor-pointer transition-colors hover:border-primary",
              !vl && "border-primary bg-primary/5"
            )}
            onClick={() => setVl(false)}
          >
            <CardHeader className="p-4">
              <CardTitle className="text-base">Non</CardTitle>
              <CardDescription className="text-xs">
                Impot calcule sur la declaration de revenus
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button onClick={handleNext} disabled={!taxRegime} size="lg">
          Continuer
        </Button>
      </div>
    </div>
  );
}
