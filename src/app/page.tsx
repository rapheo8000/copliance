import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Bell,
  Calculator,
  Shield,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <span className="text-xl font-bold text-primary">Copliance</span>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Connexion</Button>
            </Link>
            <Link href="/signup">
              <Button>Commencer gratuitement</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-24 text-center">
        <Badge variant="secondary" className="mb-4">
          Pour les entrepreneurs francais
        </Badge>
        <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
          Simplifiez votre vie{" "}
          <span className="text-primary">administrative</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Calendrier d&apos;obligations personnalise, alertes proactives et
          simulateurs contextuels. Ne manquez plus jamais une echeance Urssaf,
          TVA ou CFE.
        </p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/signup">
            <Button size="lg">
              Creer mon compte gratuit
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline">
              J&apos;ai deja un compte
            </Button>
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Gratuit pour commencer. Pas de carte bancaire requise.
        </p>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/50 py-24">
        <div className="container">
          <h2 className="text-center text-3xl font-bold">
            Tout ce dont vous avez besoin
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
            Un cockpit unique pour toutes vos obligations administratives
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={Calendar}
              title="Calendrier personnalise"
              description="Toutes vos echeances au meme endroit : Urssaf, TVA, CFE, impots... Generees automatiquement selon votre profil."
            />
            <FeatureCard
              icon={Bell}
              title="Alertes proactives"
              description="Notifications J-7, J-3, J-1 par email avant chaque echeance. Plus jamais de penalites de retard."
            />
            <FeatureCard
              icon={Calculator}
              title="Simulateurs"
              description="Estimez vos cotisations Urssaf, anticipez le seuil TVA et optimisez vos charges."
            />
            <FeatureCard
              icon={Shield}
              title="Tous statuts"
              description="Micro-entreprise, EI, EURL, SASU : un seul outil adapte a votre situation exacte."
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="container py-24">
        <h2 className="text-center text-3xl font-bold">Tarifs simples</h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Commencez gratuitement, passez a Pro quand vous en avez besoin
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:px-12">
          <PricingCard
            title="Gratuit"
            price="0"
            features={[
              "Calendrier d'obligations",
              "2 alertes email / mois",
              "Simulateur cotisations",
            ]}
          />
          <PricingCard
            title="Pro"
            price="9,90"
            popular
            features={[
              "Alertes illimitees (email + SMS)",
              "Tous les simulateurs",
              "Assistant IA (20 questions/mois)",
              "Vault documentaire (50 docs)",
            ]}
          />
          <PricingCard
            title="Business"
            price="19,90"
            features={[
              "Tout de Pro",
              "Assistant IA illimite",
              "Documents illimites",
              "Multi-entreprise",
              "Support prioritaire",
            ]}
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            Copliance fournit des informations a caractere general et des outils
            de simulation. Il ne se substitue en aucun cas a un expert-comptable,
            un avocat ou un conseiller fiscal.
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Copliance. Tous droits reserves.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}

function PricingCard({
  title,
  price,
  features,
  popular,
}: {
  title: string;
  price: string;
  features: string[];
  popular?: boolean;
}) {
  return (
    <Card className={popular ? "border-primary shadow-lg" : ""}>
      <CardHeader>
        {popular && (
          <Badge className="mb-2 w-fit">Le plus populaire</Badge>
        )}
        <CardTitle>{title}</CardTitle>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold">{price} EUR</span>
          <span className="text-muted-foreground">/ mois</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              {feature}
            </li>
          ))}
        </ul>
        <Link href="/signup" className="mt-6 block">
          <Button className="w-full" variant={popular ? "default" : "outline"}>
            {price === "0" ? "Commencer" : "Essayer Pro"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
