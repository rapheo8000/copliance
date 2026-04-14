"use client";

import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  parseISO,
} from "date-fns";
import { fr } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ObligationCard } from "./obligation-card";
import { cn } from "@/lib/utils";

interface Obligation {
  id: string;
  type: string;
  label: string;
  description: string | null;
  next_due_date: string;
  status: string;
  frequency: string;
}

const WEEKDAYS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

export function CalendarView({
  obligations,
}: {
  obligations: Obligation[];
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<"calendar" | "list">("calendar");

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const obligationsByDate = useMemo(() => {
    const map = new Map<string, Obligation[]>();
    obligations.forEach((ob) => {
      const key = ob.next_due_date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(ob);
    });
    return map;
  }, [obligations]);

  const selectedObligations = selectedDate
    ? obligationsByDate.get(format(selectedDate, "yyyy-MM-dd")) || []
    : [];

  const monthObligations = obligations
    .filter((ob) => {
      const d = parseISO(ob.next_due_date);
      return isSameMonth(d, currentDate);
    })
    .sort(
      (a, b) =>
        parseISO(a.next_due_date).getTime() -
        parseISO(b.next_due_date).getTime()
    );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold capitalize">
            {format(currentDate, "MMMM yyyy", { locale: fr })}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={view === "calendar" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("calendar")}
          >
            Calendrier
          </Button>
          <Button
            variant={view === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("list")}
          >
            Liste
          </Button>
        </div>
      </div>

      {view === "calendar" ? (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-4">
                <div className="grid grid-cols-7 gap-px">
                  {WEEKDAYS.map((day) => (
                    <div
                      key={day}
                      className="p-2 text-center text-sm font-medium text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}
                  {days.map((day) => {
                    const dateKey = format(day, "yyyy-MM-dd");
                    const dayObligations = obligationsByDate.get(dateKey) || [];
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isSelected = selectedDate && isSameDay(day, selectedDate);
                    const isToday = isSameDay(day, new Date());

                    return (
                      <button
                        key={dateKey}
                        onClick={() => setSelectedDate(day)}
                        className={cn(
                          "relative flex min-h-[64px] flex-col items-center rounded-md p-1 text-sm transition-colors hover:bg-accent",
                          !isCurrentMonth && "text-muted-foreground/40",
                          isSelected && "bg-primary/10 ring-1 ring-primary",
                          isToday && "font-bold"
                        )}
                      >
                        <span
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-full",
                            isToday && "bg-primary text-primary-foreground"
                          )}
                        >
                          {format(day, "d")}
                        </span>
                        {dayObligations.length > 0 && (
                          <div className="mt-1 flex gap-0.5">
                            {dayObligations.slice(0, 3).map((ob) => (
                              <div
                                key={ob.id}
                                className={cn(
                                  "h-1.5 w-1.5 rounded-full",
                                  ob.status === "overdue"
                                    ? "bg-red-500"
                                    : ob.status === "completed"
                                    ? "bg-green-500"
                                    : "bg-blue-500"
                                )}
                              />
                            ))}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {selectedDate
                    ? format(selectedDate, "d MMMM yyyy", { locale: fr })
                    : "Selectionnez une date"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedObligations.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {selectedDate
                      ? "Aucune echeance ce jour"
                      : "Cliquez sur une date pour voir les echeances"}
                  </p>
                ) : (
                  <div className="space-y-3">
                    {selectedObligations.map((ob) => (
                      <ObligationCard key={ob.id} obligation={ob} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Echeances de{" "}
              {format(currentDate, "MMMM yyyy", { locale: fr })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {monthObligations.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Aucune echeance ce mois-ci
              </p>
            ) : (
              <div className="space-y-3">
                {monthObligations.map((ob) => (
                  <ObligationCard key={ob.id} obligation={ob} showDate />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
