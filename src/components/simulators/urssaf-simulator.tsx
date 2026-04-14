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
import { Separator } from "@/components/ui/separator";
import { simulateUrssaf, type UrssafSimulationResult } from "@/lib/simulators/urssaf";
import { formatCurrency, formatPercentage } from "@/lib/utils";
import type { ActivityType } from "@/types";

const ACTIVITY_OPTIONS: { value: ActivityType; label: string }[] = [
  { value: "commercial_vente", label: "Vente de marchandises" },
  { value: "commercial_service", label: "Prestation de services (BIC)" },
  { value: "liberal", label: "Activite liberale (BNC)" },
  { value: "artisanal", label: "Artisanat" },
];

export function UrssafSimulator() {
  const [activityType, setActivityType] = useState<ActivityType>("liberal");
  const [revenue, setRevenue] = useState("");
  const [hasAcre, setHasAcre] = useState(false);
  const [vl, setVl] = useState(false);
  const [result, setResult] = useState<UrssafSimulationResult | null>(null);

  function handleSimulate() {
    const amount = parseFloat(revenue);
    if (isNaN(amount) || amount < 0) return;

    const sim = simulateUrssaf({
      activityType,
      revenueAmount: amount,
      hasAcre,
      versementLiberatoire: vl,
    });
    setResult(sim);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Parametres</CardTitle>
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

          <div className="space-y-2">
            <Label htmlFor="revenue">
              Chiffre d&apos;affaires (periode)
            </Label>
            <div className="relative">
              <Input
                id="revenue"
                type="number"
                min="0"
                step="100"
                placeholder="5000"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                EUR
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={hasAcre}
                onChange={(e) => setHasAcre(e.target.checked)}
                className="rounded"
              />
              ACRE
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={vl}
                onChange={(e) => setVl(e.target.checked)}
                className="rounded"
              />
              Versement liberatoire
            </label>
          </div>

          <Button onClick={handleSimulate} className="w-full">
            Calculer
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Resultats</CardTitle>
        </CardHeader>
        <CardContent>
          {!result ? (
            <p className="text-sm text-muted-foreground">
              Entrez un chiffre d&apos;affaires et cliquez sur Calculer
            </p>
          ) : (
            <div className="space-y-3">
              <ResultRow
                label="Chiffre d'affaires"
                value={formatCurrency(result.revenueAmount)}
              />
              <Separator />
              <ResultRow
                label={`Cotisations sociales (${formatPercentage(result.cotisationsRate)})`}
                value={formatCurrency(result.cotisationsAmount)}
              />
              {result.vlAmount > 0 && (
                <ResultRow
                  label={`Versement liberatoire (${formatPercentage(result.vlRate)})`}
                  value={formatCurrency(result.vlAmount)}
                />
              )}
              <ResultRow
                label={`Formation professionnelle (${formatPercentage(result.cfpRate)})`}
                value={formatCurrency(result.cfpAmount)}
              />
              <Separator />
              <ResultRow
                label="Total des charges"
                value={formatCurrency(result.totalCharges)}
                bold
              />
              <ResultRow
                label="Revenu net"
                value={formatCurrency(result.netRevenue)}
                bold
                highlight
              />
              <ResultRow
                label="Taux effectif"
                value={formatPercentage(result.effectiveRate)}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function ResultRow({
  label,
  value,
  bold,
  highlight,
}: {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span
        className={`text-sm ${bold ? "font-semibold" : "text-muted-foreground"}`}
      >
        {label}
      </span>
      <span
        className={`text-sm ${bold ? "font-semibold" : ""} ${
          highlight ? "text-green-600" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
