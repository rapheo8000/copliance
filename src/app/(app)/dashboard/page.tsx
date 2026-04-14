export const dynamic = "force-dynamic";

import { getUpcomingObligations } from "@/actions/obligations";
import { getProfile } from "@/actions/profile";
import { UpcomingObligations } from "@/components/dashboard/upcoming-obligations";
import { ProfileSummary } from "@/components/dashboard/profile-summary";
import { AlertStatus } from "@/components/dashboard/alert-status";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Tableau de bord",
};

export default async function DashboardPage() {
  const [profile, obligations] = await Promise.all([
    getProfile(),
    getUpcomingObligations(5),
  ]);

  if (!profile) redirect("/login");
  if (!profile.onboarding_completed) redirect("/onboarding");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Bonjour{profile.full_name ? `, ${profile.full_name}` : ""} !
        </h1>
        <p className="text-muted-foreground">
          Voici un apercu de vos obligations administratives
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <UpcomingObligations obligations={obligations} />
        </div>
        <div className="space-y-6">
          <ProfileSummary profile={profile} />
          <AlertStatus />
        </div>
      </div>
    </div>
  );
}
