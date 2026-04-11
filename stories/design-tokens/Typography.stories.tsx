import type { Meta, StoryObj } from "@storybook/react";

/**
 * Todas as escalas tipograficas usadas no Nimbus Frugal.
 *
 * Estas classes Tailwind sao as mesmas usadas nos componentes e paginas.
 * Alterar os tokens em `design-system/tokens.ts` (fontSans, fontMono)
 * e rodar `npm run tokens` atualiza o CSS em globals.css,
 * que alimenta tanto o site quanto este Storybook.
 */

const SCALE = [
  { class: "text-5xl", label: "text-5xl", px: "48px", usage: "Hero headline (landing)" },
  { class: "text-4xl", label: "text-4xl", px: "36px", usage: "Hero headline (landing)" },
  { class: "text-3xl", label: "text-3xl", px: "30px", usage: "Titulos de secao, PageHeader h1" },
  { class: "text-2xl", label: "text-2xl", px: "24px", usage: "Metricas grandes, dashboard" },
  { class: "text-xl", label: "text-xl", px: "20px", usage: "Subtitulos, valores em cards" },
  { class: "text-lg", label: "text-lg", px: "18px", usage: "CardTitle, titulos de steps" },
  { class: "text-base", label: "text-base", px: "16px", usage: "Corpo de texto padrao" },
  { class: "text-sm", label: "text-sm", px: "14px", usage: "Descricoes, labels, listas de features" },
  { class: "text-xs", label: "text-xs", px: "12px", usage: "Badges, timestamps, captions" },
  { class: "text-[11px]", label: "text-[11px]", px: "11px", usage: "Sidebar labels" },
  { class: "text-[10px]", label: "text-[10px]", px: "10px", usage: "Dashboard micro-labels" },
] as const;

const WEIGHTS = [
  { class: "font-normal", label: "font-normal", value: "400", usage: "Corpo de texto" },
  { class: "font-medium", label: "font-medium", value: "500", usage: "Labels, buttons, links" },
  { class: "font-semibold", label: "font-semibold", value: "600", usage: "CardTitle, subtitulos" },
  { class: "font-bold", label: "font-bold", value: "700", usage: "Headlines, metricas, precos" },
] as const;

const COLORS = [
  { class: "text-foreground", label: "text-foreground", desc: "Texto principal" },
  { class: "text-muted-foreground", label: "text-muted-foreground", desc: "Texto secundario" },
  { class: "text-primary", label: "text-primary", desc: "Links, destaques" },
  { class: "text-positive", label: "text-positive", desc: "Economia, sucesso" },
  { class: "text-negative", label: "text-negative", desc: "Erro, desperdicio" },
  { class: "text-accent-foreground", label: "text-accent-foreground", desc: "Sobre accent bg" },
] as const;

function TypographyPlayground() {
  return (
    <div style={{ padding: 32, maxWidth: 960 }}>
      {/* Scale */}
      <section>
        <h2 className="text-xl font-bold mb-1">Escala tipografica</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Classes Tailwind usadas no site. Fonte:{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            var(--font-sans)
          </code>
        </p>
        <div className="border border-border rounded-lg overflow-hidden">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr className="bg-muted">
                <th className="text-left text-xs font-semibold text-muted-foreground p-3">
                  Classe
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground p-3">
                  Tamanho
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground p-3">
                  Preview
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground p-3">
                  Uso no produto
                </th>
              </tr>
            </thead>
            <tbody>
              {SCALE.map((s, i) => (
                <tr
                  key={s.class}
                  className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}
                >
                  <td className="p-3 align-middle">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                      {s.label}
                    </code>
                  </td>
                  <td className="p-3 align-middle text-xs text-muted-foreground font-mono">
                    {s.px}
                  </td>
                  <td className={`p-3 align-middle ${s.class} font-semibold`}>
                    Nimbus Frugal
                  </td>
                  <td className="p-3 align-middle text-xs text-muted-foreground">
                    {s.usage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Weights */}
      <section className="mt-12">
        <h2 className="text-xl font-bold mb-1">Pesos</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Pesos usados consistentemente no design system.
        </p>
        <div className="border border-border rounded-lg overflow-hidden">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr className="bg-muted">
                <th className="text-left text-xs font-semibold text-muted-foreground p-3">
                  Classe
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground p-3">
                  Valor
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground p-3">
                  Preview
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground p-3">
                  Uso
                </th>
              </tr>
            </thead>
            <tbody>
              {WEIGHTS.map((w, i) => (
                <tr
                  key={w.class}
                  className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}
                >
                  <td className="p-3 align-middle">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                      {w.label}
                    </code>
                  </td>
                  <td className="p-3 align-middle text-xs text-muted-foreground font-mono">
                    {w.value}
                  </td>
                  <td className={`p-3 align-middle text-lg ${w.class}`}>
                    Controle de custos em nuvem
                  </td>
                  <td className="p-3 align-middle text-xs text-muted-foreground">
                    {w.usage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Colors */}
      <section className="mt-12">
        <h2 className="text-xl font-bold mb-1">Cores de texto</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Cores semanticas de texto via CSS variables.
        </p>
        <div className="border border-border rounded-lg overflow-hidden">
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr className="bg-muted">
                <th className="text-left text-xs font-semibold text-muted-foreground p-3">
                  Classe
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground p-3">
                  Preview
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground p-3">
                  Descricao
                </th>
              </tr>
            </thead>
            <tbody>
              {COLORS.map((c, i) => (
                <tr
                  key={c.class}
                  className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}
                >
                  <td className="p-3 align-middle">
                    <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                      {c.label}
                    </code>
                  </td>
                  <td className={`p-3 align-middle text-base font-semibold ${c.class}`}>
                    R$ 12.480,00
                  </td>
                  <td className="p-3 align-middle text-xs text-muted-foreground">
                    {c.desc}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Monospace */}
      <section className="mt-12">
        <h2 className="text-xl font-bold mb-1">Monospace</h2>
        <p className="text-sm text-muted-foreground mb-6">
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            var(--font-mono)
          </code>{" "}
          — usada em blocos de codigo, IDs e comandos AWS.
        </p>
        <div className="space-y-4">
          <div className="rounded-lg bg-[#0f172a] p-4">
            <pre className="font-mono text-sm text-white">
{`aws sts assume-role \\
  --role-arn arn:aws:iam::123456789012:role/NimbusFrugalRole \\
  --external-id nimbus-a1b2c3d4`}
            </pre>
          </div>
          <div className="flex gap-4 items-center">
            <code className="rounded bg-muted px-2 py-1 text-xs font-mono">
              i-0abc123def456
            </code>
            <code className="rounded bg-muted px-2 py-1 text-xs font-mono">
              vol-0def456ghi789
            </code>
            <code className="rounded bg-muted px-2 py-1 text-xs font-mono">
              org-12345678
            </code>
          </div>
        </div>
      </section>

      {/* Tracking & leading */}
      <section className="mt-12">
        <h2 className="text-xl font-bold mb-1">Tracking & leading</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Combinacoes de tracking e line-height usadas no produto.
        </p>
        <div className="space-y-6">
          <div>
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono mb-2 inline-block">
              text-4xl font-bold tracking-tight leading-tight
            </code>
            <p className="text-4xl font-bold tracking-tight leading-tight">
              Controle de custos em nuvem,<br />inteligencia para economizar
            </p>
          </div>
          <div>
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono mb-2 inline-block">
              text-lg font-semibold tracking-tight
            </code>
            <p className="text-lg font-semibold tracking-tight">
              Nimbus Frugal
            </p>
          </div>
          <div>
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono mb-2 inline-block">
              text-sm leading-relaxed
            </code>
            <p className="text-sm leading-relaxed max-w-lg text-muted-foreground">
              Recursos nao utilizados geram custos desnecessarios. Instancias
              ociosas, volumes orfaos e reservas expiradas consomem orcamento
              silenciosamente.
            </p>
          </div>
        </div>
      </section>

      {/* Real-world compositions */}
      <section className="mt-12">
        <h2 className="text-xl font-bold mb-1">Composicoes reais</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Exemplos de como a tipografia se combina no produto.
        </p>
        <div className="space-y-8">
          {/* Page header */}
          <div>
            <p className="text-xs text-muted-foreground mb-1 font-mono">PageHeader</p>
            <div className="border-l-2 border-primary pl-4">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Recomendacoes
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Oportunidades de economia identificadas pela plataforma.
              </p>
            </div>
          </div>
          {/* Metric */}
          <div>
            <p className="text-xs text-muted-foreground mb-1 font-mono">
              Metrica de dashboard
            </p>
            <div className="border-l-2 border-primary pl-4">
              <p className="text-xs text-muted-foreground uppercase">
                Economia identificada
              </p>
              <p className="text-2xl font-bold text-positive mt-1">
                R$ 3.755
              </p>
              <p className="text-xs text-positive mt-1">+18,4%</p>
            </div>
          </div>
          {/* Pricing */}
          <div>
            <p className="text-xs text-muted-foreground mb-1 font-mono">
              Pricing card
            </p>
            <div className="border-l-2 border-primary pl-4">
              <h3 className="text-lg font-bold">Pro</h3>
              <p className="mt-1">
                <span className="text-3xl font-bold">10%</span>
                <span className="text-sm text-muted-foreground">
                  {" "}da economia realizada
                </span>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                So paga quando economiza.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

const meta: Meta<typeof TypographyPlayground> = {
  title: "Design Tokens/Typography",
  component: TypographyPlayground,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof TypographyPlayground>;
export const Playground: Story = {};
