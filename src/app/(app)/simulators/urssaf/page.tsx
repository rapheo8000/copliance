import { UrssafSimulator } from "@/components/simulators/urssaf-simulator";

export const metadata = {
  title: "Simulateur cotisations Urssaf",
};

export default function UrssafSimulatorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Simulateur de cotisations Urssaf</h1>
        <p className="text-muted-foreground">
          Estimez vos cotisations sociales en fonction de votre chiffre d&apos;affaires
        </p>
      </div>
      <UrssafSimulator />
      <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
        <p className="text-sm text-orange-800">
          Les resultats sont fournis a titre indicatif et ne se substituent pas
          aux conseils d&apos;un expert-comptable. Les taux utilises sont ceux en
          vigueur pour 2025-2026 et peuvent evoluer.
        </p>
      </div>
    </div>
  );
}
