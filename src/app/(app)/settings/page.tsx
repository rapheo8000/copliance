export const dynamic = "force-dynamic";

import { getProfile } from "@/actions/profile";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createCheckoutSession, createPortalSession } from "@/actions/subscription";

export const metadata = {
  title: "Parametres",
};

export default async function SettingsPage() {
  const supabase = createClient();
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", profile.user_id)
    .single();

  const plan = subscription?.plan || "free";
  const isPro = plan === "pro" || plan === "business";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Parametres</h1>
        <p className="text-muted-foreground">
          Gerez votre compte et votre abonnement
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profil</CardTitle>
          <CardDescription>Vos informations personnelles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Email</span>
            <span className="text-sm">{profile.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">Nom</span>
            <span className="text-sm">{profile.full_name || "Non renseigne"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-muted-foreground">SIRET</span>
            <span className="text-sm">{profile.siret || "Non renseigne"}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Abonnement
            <Badge variant={isPro ? "default" : "secondary"}>
              {plan === "free" ? "Gratuit" : plan === "pro" ? "Pro" : "Business"}
            </Badge>
          </CardTitle>
          <CardDescription>
            {isPro
              ? "Vous beneficiez de toutes les fonctionnalites Copliance"
              : "Passez a Pro pour debloquer toutes les fonctionnalites"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isPro ? (
            <form action={createPortalSession}>
              <Button variant="outline">Gerer mon abonnement</Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <h3 className="font-semibold">Copliance Pro — 9,90 EUR/mois</h3>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>Alertes email illimitees (J-7, J-3, J-1)</li>
                  <li>Tous les simulateurs (Urssaf, TVA, ACRE, projection)</li>
                  <li>Assistant IA (20 questions/mois)</li>
                  <li>Vault documentaire (50 documents)</li>
                </ul>
              </div>
              <form action={createCheckoutSession}>
                <Button size="lg">Passer a Pro</Button>
              </form>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
