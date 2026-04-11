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
import {
  BarChart3,
  Clock,
  ShieldCheck,
  Sparkles,
  Target,
  Workflow,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-[#1E3A8A] text-white">
          <div className="absolute inset-0 opacity-20 [background:radial-gradient(ellipse_at_top,#5FA8FF,transparent_60%)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
            <Badge variant="secondary" className="mb-6 bg-accent text-accent-foreground">
              FinOps SaaS multi-tenant para AWS
            </Badge>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
              Controle de custos em nuvem, inteligência para economizar
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/80 md:text-xl">
              Plataforma FinOps SaaS multi-tenant para AWS com atualização diária
              e foco em visibilidade, priorização e governança operacional.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href="/signup">Começar trial de 90 dias</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10"
              >
                <Link href="/pricing">Ver pricing</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Problem */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="grid gap-10 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                Gasto AWS sem governança vira dívida silenciosa
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Times FinOps lutam contra dados dispersos em Cost Explorer, CUR,
                Compute Optimizer, Trusted Advisor e dezenas de contas. Sem
                consolidação, as recomendações viram backlog esquecido e a conta
                mensal sobe sem dono.
              </p>
            </div>
            <Card className="border-border">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 mt-2 rounded-full bg-negative" />
                  <p className="text-sm">
                    Recomendações do Cost Optimization Hub ignoradas por falta de owner
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 mt-2 rounded-full bg-negative" />
                  <p className="text-sm">
                    Tags inconsistentes impedem allocation e chargeback confiáveis
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 mt-2 rounded-full bg-negative" />
                  <p className="text-sm">
                    Sem trilha de auditoria para exceções e aprovações
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Features */}
        <section className="bg-card border-y border-border">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <div className="mx-auto max-w-2xl text-center">
              <Badge variant="secondary">Plataforma</Badge>
              <h2 className="mt-4 text-3xl font-bold tracking-tight">
                Consolidação diária, ações priorizadas, trilha auditável
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Nimbus Frugal conecta a conta management da sua AWS Organization,
                descobre OUs e contas, coleta custo e recomendações, e entrega
                ações priorizadas com owner e justificativa.
              </p>
            </div>
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              <Feature
                icon={<BarChart3 className="h-5 w-5" />}
                title="Dashboard consolidado"
                description="Custo por organização, OU, conta, região e serviço, atualizado em batch a cada 24h."
              />
              <Feature
                icon={<Sparkles className="h-5 w-5" />}
                title="Recomendações unificadas"
                description="Ingestão de Cost Optimization Hub, Compute Optimizer e Trusted Advisor em uma única fila priorizada."
              />
              <Feature
                icon={<Target className="h-5 w-5" />}
                title="Ações com owner"
                description="Cada oportunidade vira action candidate com responsável, prioridade e status."
              />
              <Feature
                icon={<Workflow className="h-5 w-5" />}
                title="Onboarding AWS Org"
                description="CloudFormation com External ID e trust policy para a conta AWS da Nimbus — sem credenciais armazenadas."
              />
              <Feature
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Governança auditável"
                description="Exceções com justificativa, aprovação e expiração. Tudo registrado em audit log."
              />
              <Feature
                icon={<Clock className="h-5 w-5" />}
                title="Freshness explícito"
                description="Última coleta e última consolidação exibidas em tela. Sem ilusão de real-time."
              />
            </div>
          </div>
        </section>

        {/* Screenshots */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary">Produto</Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight">
              Veja a plataforma em acao
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Dashboard consolidado, recomendacoes priorizadas e onboarding
              self-service.
            </p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <Card className="overflow-hidden border-border">
              <div className="flex h-48 items-center justify-center bg-muted text-muted-foreground">
                <p className="text-sm">Screenshot: Dashboard</p>
              </div>
              <CardContent className="p-4">
                <p className="text-sm font-medium">Dashboard consolidado</p>
                <p className="text-xs text-muted-foreground">
                  Custos por Organization, OUs e contas com freshness.
                </p>
              </CardContent>
            </Card>
            <Card className="overflow-hidden border-border">
              <div className="flex h-48 items-center justify-center bg-muted text-muted-foreground">
                <p className="text-sm">Screenshot: Recomendacoes</p>
              </div>
              <CardContent className="p-4">
                <p className="text-sm font-medium">Recomendacoes priorizadas</p>
                <p className="text-xs text-muted-foreground">
                  Oportunidades de economia unificadas de 3 fontes AWS.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <Card className="overflow-hidden border-border bg-[#1E3A8A] text-white">
            <CardContent className="flex flex-col items-start gap-6 p-10 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-2xl font-bold">
                  Comece agora — trial de 90 dias, sem cartão
                </h3>
                <p className="mt-2 text-white/80">
                  Integre sua AWS Organization e veja economia mensurável na
                  primeira semana.
                </p>
              </div>
              <Button asChild size="lg" className="bg-positive text-white hover:bg-positive/90">
                <Link href="/signup">Criar minha conta</Link>
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent text-accent-foreground">
          {icon}
        </div>
        <CardTitle className="mt-3">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
