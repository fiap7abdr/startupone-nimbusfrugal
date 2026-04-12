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
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { Check } from "lucide-react";

const TRIAL_FEATURES = [
  "Ingestão AWS Organizations, CUR, Cost Explorer",
  "Recomendações de Cost Optimization Hub, Compute Optimizer, Trusted Advisor",
  "Dashboards e freshness por conector",
  "Convites de usuários, grupos owner e read",
  "Tudo ilimitado durante 90 dias",
];

const PRO_FEATURES = [
  "Tudo do Trial, sem limite de tempo",
  "Batches diários consolidados e reprocessamento",
  "Workflow de ações com owner, prioridade e auditoria",
  "Exceções com justificativa, aprovação e expiração",
  "Billing baseado em % do gasto consolidado",
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary">Pricing simples</Badge>
            <h1 className="mt-4 text-4xl font-bold tracking-tight">
              Um preço que cresce com o valor gerado
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Comece no Trial com tudo liberado. Ao virar Pro, você paga uma
              fração do que a Nimbus ajuda a economizar.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            <PlanCard
              name="Trial"
              price="Grátis"
              period="por 90 dias"
              description="Toda a plataforma liberada enquanto você valida o retorno."
              features={TRIAL_FEATURES}
              ctaHref="/signup"
              ctaLabel="Começar grátis"
            />
            <PlanCard
              highlight
              name="Pro"
              price="0,5%"
              period="do gasto mensal consolidado da AWS Organization"
              description="Cobrança proporcional ao gasto AWS sob gestão, sem tiers rígidos."
              features={PRO_FEATURES}
              ctaHref="/signup"
              ctaLabel="Começar no Pro"
            />
          </div>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            Precisa de condições específicas para grandes contas?{" "}
            <Link href="/signup" className="font-medium text-primary hover:underline">
              Entre em contato
            </Link>
            .
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function PlanCard({
  name,
  price,
  period,
  description,
  features,
  ctaHref,
  ctaLabel,
  highlight,
}: {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  ctaHref: string;
  ctaLabel: string;
  highlight?: boolean;
}) {
  return (
    <Card className={highlight ? "border-primary shadow-lg" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{name}</CardTitle>
          {highlight && <Badge>Recomendado</Badge>}
        </div>
        <CardDescription>{description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold">{price}</span>
          <span className="ml-2 text-sm text-muted-foreground">{period}</span>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-positive" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
        <Button asChild className="mt-8 w-full" variant={highlight ? "default" : "outline"}>
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
