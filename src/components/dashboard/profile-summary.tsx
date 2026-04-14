import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

const STATUS_LABELS: Record<string, string> = {
  micro: "Micro-entreprise",
  ei: "Entreprise individuelle",
  eurl: "EURL",
  sasu: "SASU",
};

const ACTIVITY_LABELS: Record<string, string> = {
  liberal: "Activite liberale",
  commercial: "Commerce",
  artisanal: "Artisanat",
  commercial_vente: "Vente de marchandises",
  commercial_service: "Prestation de services",
};

interface Profile {
  legal_status: string | null;
  activity_type: string | null;
  has_tva: boolean;
  has_acre: boolean;
  declaration_frequency: string;
  versement_liberatoire: boolean;
}

export function ProfileSummary({ profile }: { profile: Profile }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <User className="h-5 w-5" />
          Votre profil
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Statut</span>
          <span className="text-sm font-medium">
            {STATUS_LABELS[profile.legal_status || ""] || "Non defini"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Activite</span>
          <span className="text-sm font-medium">
            {ACTIVITY_LABELS[profile.activity_type || ""] || "Non defini"}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-sm text-muted-foreground">Declaration</span>
          <span className="text-sm font-medium">
            {profile.declaration_frequency === "monthly"
              ? "Mensuelle"
              : "Trimestrielle"}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.has_tva && <Badge variant="secondary">TVA</Badge>}
          {profile.has_acre && <Badge variant="success">ACRE</Badge>}
          {profile.versement_liberatoire && (
            <Badge variant="secondary">VL</Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
