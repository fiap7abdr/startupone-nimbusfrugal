import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import {
  Trash2,
  EyeOff,
  Wrench,
  Brain,
  CloudCog,
  TrendingDown,
  Check,
} from "lucide-react";

export default async function LandingPage() {
  const session = await auth();
  if (session?.user?.email) redirect("/app");

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#38BDF8] text-white">
          <div className="absolute inset-0 opacity-30 [background:radial-gradient(ellipse_at_bottom_right,#5EEAD4,transparent_60%)]" />
          <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-6 py-20 md:grid-cols-2 md:py-28">
            <div>
              <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
                Controle de custos em nuvem, inteligencia para economizar
              </h1>
              <p className="mt-6 max-w-lg text-lg text-white/80">
                Otimizamos seus custos com a AWS atraves de IA avancada,
                visibilidade completa e priorizacao de economia.
              </p>
              <div className="mt-8">
                <Button
                  asChild
                  size="lg"
                  className="bg-[#34D399] text-white hover:bg-[#2CC085] shadow-lg"
                >
                  <Link href="/signup">Comece gratis</Link>
                </Button>
              </div>
            </div>

            {/* Dashboard mockup */}
            <div className="relative hidden md:block">
              <div className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-sm">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-xs font-medium text-white/60">
                    Gasto mensal consolidado
                  </p>
                  <p className="text-2xl font-bold">R$ 225.115</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white/10 p-4">
                    <p className="text-[10px] uppercase text-white/50">
                      Economias
                    </p>
                    <p className="mt-1 text-xl font-bold text-[#34D399]">
                      R$ 3.755
                    </p>
                    <p className="mt-1 text-xs text-[#34D399]">+18,4%</p>
                  </div>
                  <div className="rounded-xl bg-white/10 p-4">
                    <p className="text-[10px] uppercase text-white/50">
                      Desperdicio
                    </p>
                    <p className="mt-1 text-xl font-bold text-[#FB923C]">
                      R$ 1.972
                    </p>
                    <p className="mt-1 text-xs text-[#FB923C]">-7,2%</p>
                  </div>
                </div>
                <div className="mt-4 flex items-end gap-1">
                  {[40, 55, 45, 65, 50, 70, 60, 80, 72, 85, 78, 90].map(
                    (h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-gradient-to-t from-[#34D399] to-[#5EEAD4]"
                        style={{ height: `${h}px` }}
                      />
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Wave divider */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg
              viewBox="0 0 1440 80"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full"
            >
              <path
                d="M0 40C240 80 480 0 720 40C960 80 1200 0 1440 40V80H0V40Z"
                fill="white"
              />
            </svg>
          </div>
        </section>

        {/* O Problema */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-center text-3xl font-bold tracking-tight text-[#1E3A8A]">
            O Problema
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <ProblemCard
              icon={<Trash2 className="h-8 w-8 text-[#38BDF8]" />}
              title="Desperdicio"
              description="Recursos nao utilizados geram custos desnecessarios. Instancias ociosas, volumes orfaos e reservas expiradas consomem orcamento silenciosamente."
            />
            <ProblemCard
              icon={<EyeOff className="h-8 w-8 text-[#38BDF8]" />}
              title="Sem Visibilidade"
              description="Dificil identificar onde estao os maiores gastos na sua nuvem. Dados dispersos entre Cost Explorer, CUR e dezenas de contas AWS."
            />
            <ProblemCard
              icon={<Wrench className="h-8 w-8 text-[#38BDF8]" />}
              title="Trabalho Manual"
              description="Leva tempo demais para analisar e otimizar manualmente cada conta e servico. Recomendacoes viram backlog esquecido."
            />
          </div>
        </section>

        {/* A Solucao */}
        <section className="bg-gradient-to-b from-[#F0F9FF] to-white">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="text-center text-3xl font-bold tracking-tight text-[#1E3A8A]">
              A Solucao
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <SolutionCard
                step="1"
                icon={<Brain className="h-8 w-8 text-[#2563EB]" />}
                title="IA Avancada"
                description="Detecta padroes, desperdicios e oportunidades de economia automaticamente com inteligencia artificial."
              />
              <SolutionCard
                step="2"
                icon={<CloudCog className="h-8 w-8 text-[#2563EB]" />}
                title="Analisamos sua nuvem"
                description="Identificamos desperdicios, oportunidades e priorizamos acoes de economia na sua AWS Organization."
              />
              <SolutionCard
                step="3"
                icon={<TrendingDown className="h-8 w-8 text-[#2563EB]" />}
                title="Reduza seus custos"
                description="Economias de magnitude em seus gastos com a economia. Recomendacoes priorizadas com estimated savings."
              />
            </div>
          </div>
        </section>

        {/* Como Funciona */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#38BDF8] text-white">
          <div className="absolute inset-0 opacity-20 [background:radial-gradient(ellipse_at_top_left,#5EEAD4,transparent_50%)]" />
          <div className="relative mx-auto max-w-6xl px-6 py-20">
            <h2 className="text-3xl font-bold tracking-tight">
              Como Funciona
            </h2>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {/* Step 1 */}
              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                  <span className="text-lg font-bold">aws</span>
                </div>
                <h3 className="text-lg font-semibold">
                  1. Conecte sua conta AWS
                </h3>
                <p className="mt-2 text-sm text-white/70">
                  Conecte sua AWS Organization com nosso template CloudFormation
                  seguro.
                </p>
              </div>

              {/* Step 2 */}
              <div className="rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
                  <CloudCog className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold">
                  2. Analisamos sua nuvem
                </h3>
                <p className="mt-2 text-sm text-white/70">
                  Detectamos desperdicios e oportunidades de economia
                  automaticamente.
                </p>
              </div>

              {/* Pricing - Pro */}
              <div className="rounded-2xl bg-white p-6 text-[#1E293B]">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-[#1E3A8A]">Pro</h3>
                  <p className="mt-2">
                    <span className="text-3xl font-bold text-[#1E3A8A]">
                      R$ 299
                    </span>
                    <span className="text-sm text-gray-500">/mes</span>
                  </p>
                  <ul className="mt-4 space-y-2 text-left text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#34D399]" />
                      Identificacao desperdicio
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#34D399]" />
                      Analise e recomendacoes
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#34D399]" />
                      Dashboard completo
                    </li>
                  </ul>
                  <Button
                    asChild
                    className="mt-6 w-full bg-[#34D399] text-white hover:bg-[#2CC085]"
                  >
                    <Link href="/signup">Comece gratis</Link>
                  </Button>
                </div>
              </div>

              {/* Pricing - Empresarial */}
              <div className="rounded-2xl bg-[#0F172A] p-6 text-white">
                <div className="text-center">
                  <h3 className="text-lg font-bold">Empresarial</h3>
                  <p className="mt-2 text-sm text-white/70">Contate</p>
                  <ul className="mt-4 space-y-2 text-left text-sm">
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#34D399]" />
                      Multi-contas ilimitadas
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#34D399]" />
                      Suporte dedicado
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#34D399]" />
                      Integracao customizada
                    </li>
                  </ul>
                  <Button
                    asChild
                    variant="outline"
                    className="mt-6 w-full border-[#34D399] text-[#34D399] hover:bg-[#34D399]/10"
                  >
                    <Link href="/signup">Comece gratis</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="rounded-2xl bg-gradient-to-r from-[#1E3A8A] to-[#2563EB] p-10 text-center text-white md:p-16">
            <h3 className="text-3xl font-bold">
              Comece agora — trial de 90 dias, sem cartao
            </h3>
            <p className="mx-auto mt-4 max-w-xl text-white/80">
              Integre sua AWS Organization e veja economia mensuravel na
              primeira semana.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 bg-[#34D399] text-white hover:bg-[#2CC085] shadow-lg"
            >
              <Link href="/signup">Criar minha conta</Link>
            </Button>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function ProblemCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F0F9FF]">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-semibold text-[#1E293B]">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-gray-500">
        {description}
      </p>
    </div>
  );
}

function SolutionCard({
  step,
  icon,
  title,
  description,
}: {
  step: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EFF6FF]">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-semibold text-[#1E293B]">
        {step}. {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-gray-500">
        {description}
      </p>
    </div>
  );
}
