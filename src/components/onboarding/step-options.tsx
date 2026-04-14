"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { OnboardingStep3 } from "@/lib/validations/profile";

interface StepOptionsProps {
  onComplete: (data: OnboardingStep3) => void;
  onBack: () => void;
  loading: boolean;
}

export function StepOptions({ onComplete, onBack, loading }: StepOptionsProps) {
  const [hasTva, setHasTva] = useState(false);
  const [hasAcre, setHasAcre] = useState(false);
  const [acreEndDate, setAcreEndDate] = useState("");
  const [hasAre, setHasAre] = useState(false);
  const [siret, setSiret] = useState("");
  const [creationDate, setCreationDate] = useState("");

  function handleComplete() {
    if (!creationDate) return;
    onComplete({
      hasTva,
      hasAcre,
      acreEndDate: acreEndDate || undefined,
      hasAre,
      siret: siret || undefined,
      creationDate,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4 text-lg font-semibold">Date de creation</h2>
        <div className="max-w-xs">
          <Label htmlFor="creationDate">
            Date de debut d&apos;activite
          </Label>
          <Input
            id="creationDate"
            type="date"
            value={creationDate}
            onChange={(e) => setCreationDate(e.target.value)}
            className="mt-1"
            required
          />
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">SIRET (optionnel)</h2>
        <div className="max-w-xs">
          <Input
            placeholder="123 456 789 00012"
            value={siret}
            onChange={(e) => setSiret(e.target.value)}
          />
        </div>
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Options actives</h2>
        <div className="space-y-3">
          <ToggleCard
            label="TVA"
            description="Etes-vous assujetti a la TVA ?"
            active={hasTva}
            onToggle={() => setHasTva(!hasTva)}
          />
          <ToggleCard
            label="ACRE"
            description="Beneficiez-vous de l'ACRE (exoneration de cotisations) ?"
            active={hasAcre}
            onToggle={() => setHasAcre(!hasAcre)}
          />
          {hasAcre && (
            <div className="ml-4 max-w-xs">
              <Label htmlFor="acreEndDate">Date de fin de l&apos;ACRE</Label>
              <Input
                id="acreEndDate"
                type="date"
                value={acreEndDate}
                onChange={(e) => setAcreEndDate(e.target.value)}
                className="mt-1"
              />
            </div>
          )}
          <ToggleCard
            label="Cumul ARE"
            description="Cumulez-vous avec des allocations chomage (ARE) ?"
            active={hasAre}
            onToggle={() => setHasAre(!hasAre)}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button
          onClick={handleComplete}
          disabled={!creationDate || loading}
          size="lg"
        >
          {loading ? "Configuration..." : "Terminer la configuration"}
        </Button>
      </div>
    </div>
  );
}

function ToggleCard({
  label,
  description,
  active,
  onToggle,
}: {
  label: string;
  description: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-colors hover:border-primary",
        active && "border-primary bg-primary/5"
      )}
      onClick={onToggle}
    >
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <div>
          <CardTitle className="text-base">{label}</CardTitle>
          <CardDescription className="text-xs">{description}</CardDescription>
        </div>
        <div
          className={cn(
            "flex h-6 w-11 items-center rounded-full p-1 transition-colors",
            active ? "bg-primary" : "bg-muted"
          )}
        >
          <div
            className={cn(
              "h-4 w-4 rounded-full bg-white transition-transform",
              active ? "translate-x-5" : "translate-x-0"
            )}
          />
        </div>
      </CardHeader>
    </Card>
  );
}
