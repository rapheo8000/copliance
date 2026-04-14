import { TvaSimulator } from "@/components/simulators/tva-simulator";

export const metadata = {
  title: "Simulateur seuil TVA",
};

export default function TvaSimulatorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Simulateur de seuil TVA</h1>
        <p className="text-muted-foreground">
          Projetez votre chiffre d&apos;affaires et anticipez le passage a la TVA
        </p>
      </div>
      <TvaSimulator />
      <div className="rounded-lg border border-orange-200 bg-orange-50 p-4">
        <p className="text-sm text-orange-800">
          Les resultats sont fournis a titre indicatif et ne se substituent pas
          aux conseils d&apos;un expert-comptable. En cas de depassement du seuil,
          contactez votre SIE (Service des Impots des Entreprises).
        </p>
      </div>
    </div>
  );
}
