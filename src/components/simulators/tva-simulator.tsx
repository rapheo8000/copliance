"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { simulateTva, type TvaSimulationResult } from "@/lib/simulators/tva";
import { formatCurrency } from "@/lib/utils";
import type { ActivityType } from "@/types";

const MONTHS = [
  "Janvier",
  "Fevrier",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Aout",
  "Septembre",
  "Octobre",
  "Novembre",
  "Decembre",
];

const ACTIVITY_OPTIONS: { value: ActivityType; label: string }[] = [
  { value: "commercial_vente", label: "Vente de marchandises" },
  { value: "commercial_service", label: "Prestation de services (BIC)" },
  { value: "liberal", label: "Activite liberale (BNC)" },
  { value: "artisanal", label: "Artisanat" },
];

export function TvaSimulator() {
  const [activityType, setActivityType] = useState<ActivityType>("liberal");
  const [monthlyRevenues, setMonthlyRevenues] = useState<string[]>(
    Array(12).fill("")
  );
  const [result, setResult] = useState<TvaSimulationResult | null>(null);

  function updateMonth(index: number, value: string) {
    const updated = [...monthlyRevenues];
    updated[index] = value;
    setMonthlyRevenues(updated);
  }

  function handleSimulate() {
    const revenues = monthlyRevenues.map((v) => parseFloat(v) || 0);
    if (revenues.every((v) => v === 0)) return;

    const sim = simulateTva({ activityType, monthlyRevenues: revenues });
    setResult(sim);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">CA mensuel previsionnel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Type d&apos;activite</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={activityType}
              onChange={(e) => setActivityType(e.target.value as ActivityType)}
            >
              {ACTIVITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {MONTHS.map((month, i) => (
              <div key={month} className="space-y-1">
                <Label className="text-xs">{month}</Label>
                <Input
                  type="number"
                  min="0"
                  step="100"
                  placeholder="0"
                  value={monthlyRevenues[i]}
                  onChange={(e) => updateMonth(i, e.target.value)}
                />
              </div>
            ))}
          </div>

          <Button onClick={handleSimulate} className="w-full">
            Simuler
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Analyse du seuil TVA</CardTitle>
        </CardHeader>
        <CardContent>
          {!result ? (
            <p className="text-sm text-muted-foreground">
              Entrez votre CA mensuel previsionnel et cliquez sur Simuler
            </p>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Seuil de base: {formatCurrency(result.threshold)}
                  </span>
                  <span className="font-medium">
                    {Math.min(result.percentOfThreshold, 100).toFixed(0)}%
                  </span>
                </div>
                <Progress
                  value={Math.min(result.percentOfThreshold, 100)}
                />
              </div>

              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Seuil majore: {formatCurrency(result.toleranceThreshold)}
                  </span>
                  <span className="font-medium">
                    {Math.min(result.percentOfTolerance, 100).toFixed(0)}%
                  </span>
                </div>
                <Progress
                  value={Math.min(result.percentOfTolerance, 100)}
                />
              </div>

              <div className="space-y-2 rounded-lg bg-muted p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">CA total projete</span>
                  <span className="font-semibold">
                    {formatCurrency(result.totalRevenue)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Marge avant seuil
                  </span>
                  <span className="font-semibold">
                    {formatCurrency(result.remainingBeforeThreshold)}
                  </span>
                </div>
                {result.crossingMonth !== null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Mois de depassement
                    </span>
                    <span className="font-semibold text-orange-600">
                      {MONTHS[result.crossingMonth]}
                    </span>
                  </div>
                )}
              </div>

              <div
                className={`rounded-lg p-4 text-sm ${
                  result.willCrossThreshold
                    ? "bg-orange-50 text-orange-800"
                    : "bg-green-50 text-green-800"
                }`}
              >
                {result.recommendation}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
