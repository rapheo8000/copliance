export const dynamic = "force-dynamic";

import { getObligations } from "@/actions/obligations";
import { CalendarView } from "@/components/calendar/calendar-view";

export const metadata = {
  title: "Calendrier",
};

export default async function CalendarPage() {
  const obligations = await getObligations();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Calendrier des obligations</h1>
        <p className="text-muted-foreground">
          Visualisez toutes vos echeances administratives
        </p>
      </div>
      <CalendarView obligations={obligations || []} />
    </div>
  );
}
