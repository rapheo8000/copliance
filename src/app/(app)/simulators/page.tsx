import Link from "next/link";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calculator, TrendingUp } from "lucide-react";

export const metadata = {
  title: "Simulateurs",
};

const simulators = [
  {
    title: "Cotisations Urssaf",
    description:
      "Estimez vos cotisations sociales en fonction de votre chiffre d'affaires",
    href: "/simulators/urssaf",
    icon: Calculator,
  },
  {
    title: "Seuil TVA",
    description:
      "Projetez votre CA et anticipez le passage a la TVA",
    href: "/simulators/tva",
    icon: TrendingUp,
  },
];

export default function SimulatorsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Simulateurs</h1>
        <p className="text-muted-foreground">
          Outils de simulation pour anticiper vos charges et obligations
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {simulators.map((sim) => (
          <Link key={sim.href} href={sim.href}>
            <Card className="h-full transition-colors hover:border-primary">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <sim.icon className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">{sim.title}</CardTitle>
                <CardDescription>{sim.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
