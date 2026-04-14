"use client";

import { format, differenceInDays, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, CheckCircle2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { markObligationComplete } from "@/actions/obligations";

interface Obligation {
  id: string;
  type: string;
  label: string;
  description: string | null;
  next_due_date: string;
  status: string;
}

function getDaysLabel(dueDate: string): { text: string; variant: "default" | "warning" | "destructive" | "success" } {
  const days = differenceInDays(parseISO(dueDate), new Date());
  if (days < 0) return { text: "En retard", variant: "destructive" };
  if (days === 0) return { text: "Aujourd'hui", variant: "destructive" };
  if (days === 1) return { text: "Demain", variant: "warning" };
  if (days <= 7) return { text: `Dans ${days} jours`, variant: "warning" };
  return { text: `Dans ${days} jours`, variant: "default" };
}

export function UpcomingObligations({
  obligations,
}: {
  obligations: Obligation[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Prochaines echeances
        </CardTitle>
        <CardDescription>
          Vos obligations administratives a venir
        </CardDescription>
      </CardHeader>
      <CardContent>
        {obligations.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune echeance a venir. Tout est en ordre !
          </p>
        ) : (
          <div className="space-y-4">
            {obligations.map((obligation) => {
              const { text, variant } = getDaysLabel(obligation.next_due_date);
              return (
                <div
                  key={obligation.id}
                  className="flex items-start justify-between rounded-lg border p-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{obligation.label}</p>
                      <Badge variant={variant}>{text}</Badge>
                    </div>
                    {obligation.description && (
                      <p className="text-sm text-muted-foreground">
                        {obligation.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Echeance :{" "}
                      {format(parseISO(obligation.next_due_date), "d MMMM yyyy", {
                        locale: fr,
                      })}
                    </p>
                  </div>
                  <form action={markObligationComplete.bind(null, obligation.id)}>
                    <Button variant="ghost" size="icon" type="submit">
                      <CheckCircle2 className="h-5 w-5 text-muted-foreground hover:text-green-600" />
                    </Button>
                  </form>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
