"use client";

import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { markObligationComplete } from "@/actions/obligations";

interface Obligation {
  id: string;
  type: string;
  label: string;
  description: string | null;
  next_due_date: string;
  status: string;
}

const TYPE_LABELS: Record<string, string> = {
  urssaf: "Urssaf",
  tva: "TVA",
  cfe: "CFE",
  income_tax: "Impots",
  liasse_fiscale: "Liasse fiscale",
  dsi: "DSI",
  dsn: "DSN",
  acre_expiry: "ACRE",
  tva_threshold: "Seuil TVA",
  micro_ceiling: "Plafond micro",
};

export function ObligationCard({
  obligation,
  showDate = false,
}: {
  obligation: Obligation;
  showDate?: boolean;
}) {
  return (
    <div className="flex items-start justify-between rounded-lg border p-3">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {TYPE_LABELS[obligation.type] || obligation.type}
          </Badge>
          {obligation.status === "completed" && (
            <Badge variant="success">Fait</Badge>
          )}
        </div>
        <p className="text-sm font-medium">{obligation.label}</p>
        {obligation.description && (
          <p className="text-xs text-muted-foreground">
            {obligation.description}
          </p>
        )}
        {showDate && (
          <p className="text-xs text-muted-foreground">
            {format(parseISO(obligation.next_due_date), "d MMMM yyyy", {
              locale: fr,
            })}
          </p>
        )}
      </div>
      {obligation.status !== "completed" && (
        <form action={markObligationComplete.bind(null, obligation.id)}>
          <Button variant="ghost" size="icon" type="submit" title="Marquer comme fait">
            <CheckCircle2 className="h-4 w-4" />
          </Button>
        </form>
      )}
    </div>
  );
}
