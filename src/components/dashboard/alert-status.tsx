import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Bell } from "lucide-react";

export function AlertStatus() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="h-5 w-5" />
          Alertes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Les alertes email seront envoyees J-7, J-3 et J-1 avant chaque
          echeance.
        </p>
      </CardContent>
    </Card>
  );
}
