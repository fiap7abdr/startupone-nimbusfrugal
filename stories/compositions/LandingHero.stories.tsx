import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

function LandingHeroComposition() {
  return (
    <div>
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <img
              src="/logo-64.png"
              alt="Nimbus Frugal"
              width={36}
              height={36}
            />
            <span className="text-lg font-semibold tracking-tight">
              Nimbus Frugal
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">Entrar</Button>
            <Button size="sm">Comecar gratis</Button>
          </div>
        </div>
      </header>

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
                size="lg"
                className="bg-[#34D399] text-white hover:bg-[#2CC085] shadow-lg"
              >
                Comece gratis
              </Button>
            </div>
          </div>
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
                  <p className="text-[10px] uppercase text-white/50">Economias</p>
                  <p className="mt-1 text-xl font-bold text-[#34D399]">R$ 3.755</p>
                </div>
                <div className="rounded-xl bg-white/10 p-4">
                  <p className="text-[10px] uppercase text-white/50">Desperdicio</p>
                  <p className="mt-1 text-xl font-bold text-[#FB923C]">R$ 1.972</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#1E3A8A] via-[#2563EB] to-[#38BDF8] text-white">
        <div className="relative mx-auto max-w-6xl px-6 py-20">
          <h2 className="text-3xl font-bold tracking-tight">Planos</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2 max-w-2xl">
            <div className="rounded-2xl bg-white p-6 text-[#1E293B]">
              <div className="text-center">
                <h3 className="text-lg font-bold text-[#1E3A8A]">Trial</h3>
                <p className="mt-2">
                  <span className="text-3xl font-bold text-[#1E3A8A]">Gratis</span>
                  <span className="text-sm text-gray-500"> por 90 dias</span>
                </p>
                <ul className="mt-4 space-y-2 text-left text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#34D399]" />
                    Tudo ilimitado durante 90 dias
                  </li>
                </ul>
                <Button className="mt-6 w-full bg-[#34D399] text-white hover:bg-[#2CC085]">
                  Comecar gratis
                </Button>
              </div>
            </div>
            <div className="rounded-2xl bg-[#0F172A] p-6 text-white">
              <div className="text-center">
                <h3 className="text-lg font-bold">Pro</h3>
                <p className="mt-2">
                  <span className="text-3xl font-bold">10%</span>
                  <span className="text-sm text-white/70"> da economia realizada</span>
                </p>
                <ul className="mt-4 space-y-2 text-left text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#34D399]" />
                    Tudo do Trial, sem limite de tempo
                  </li>
                </ul>
                <Button
                  variant="outline"
                  className="mt-6 w-full border-[#34D399] text-[#34D399] hover:bg-[#34D399]/10"
                >
                  Comecar no Pro
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const meta: Meta<typeof LandingHeroComposition> = {
  title: "Compositions/Landing Page",
  component: LandingHeroComposition,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "card" },
  },
};
export default meta;

type Story = StoryObj<typeof LandingHeroComposition>;
export const Default: Story = {};
