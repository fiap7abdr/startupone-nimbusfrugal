import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/ui/button";
import { Check, Trash2, CloudCog, Plus, Loader2 } from "lucide-react";

const VARIANTS = [
  "default",
  "secondary",
  "outline",
  "ghost",
  "destructive",
  "positive",
  "link",
] as const;

const SIZES = ["sm", "default", "lg", "icon"] as const;

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: [...VARIANTS],
    },
    size: {
      control: "select",
      options: [...SIZES],
    },
    disabled: { control: "boolean" },
    children: { control: "text" },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

// ─── Individual stories ────────────────────────────────────────────
export const Default: Story = {
  args: { children: "Criar tenant", variant: "default" },
};
export const Secondary: Story = {
  args: { children: "Ver detalhes", variant: "secondary" },
};
export const Outline: Story = {
  args: { children: "Cancelar", variant: "outline" },
};
export const Ghost: Story = {
  args: { children: "Entrar", variant: "ghost" },
};
export const Destructive: Story = {
  args: { children: "Revogar acesso", variant: "destructive" },
};
export const Positive: Story = {
  args: { children: "Aplicar recomendacao", variant: "positive" },
};
export const LinkVariant: Story = {
  args: { children: "Saiba mais", variant: "link" },
};

// ─── Playground: Variant × Size matrix ─────────────────────────────
export const Playground: Story = {
  render: () => {
    const sizeLabels: Record<string, string> = {
      sm: "Small (h-9)",
      default: "Default (h-10)",
      lg: "Large (h-11)",
      icon: "Icon (h-10 w-10)",
    };

    return (
      <div style={{ padding: 24, maxWidth: 900 }}>
        <h2 className="text-xl font-bold mb-2">Button Playground</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Todas as combinacoes de variant x size. Derivado de{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">
            components/ui/button.tsx
          </code>{" "}
          via <code className="rounded bg-muted px-1 py-0.5 text-xs font-mono">buttonVariants</code> (cva).
        </p>

        {/* Matrix: Variant × Size */}
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th
                className="text-left text-xs font-semibold text-muted-foreground pb-3 pr-4"
                style={{ width: 120 }}
              >
                variant \ size
              </th>
              {SIZES.map((s) => (
                <th
                  key={s}
                  className="text-center text-xs font-semibold text-muted-foreground pb-3 px-2"
                >
                  {sizeLabels[s]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {VARIANTS.map((v) => (
              <tr key={v}>
                <td className="py-3 pr-4 text-sm font-mono font-medium align-middle">
                  {v}
                </td>
                {SIZES.map((s) => (
                  <td key={s} className="py-3 px-2 text-center align-middle">
                    <Button variant={v} size={s}>
                      {s === "icon" ? <Plus className="h-4 w-4" /> : "Label"}
                    </Button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Disabled state */}
        <h3 className="text-lg font-semibold mt-10 mb-4">
          Estado: disabled
        </h3>
        <div className="flex flex-wrap gap-3">
          {VARIANTS.map((v) => (
            <Button key={v} variant={v} disabled>
              {v}
            </Button>
          ))}
        </div>

        {/* With icons */}
        <h3 className="text-lg font-semibold mt-10 mb-4">
          Com icone
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button variant="default">
            <Plus className="h-4 w-4" />
            Novo conector
          </Button>
          <Button variant="positive">
            <Check className="h-4 w-4" />
            Aplicar
          </Button>
          <Button variant="destructive">
            <Trash2 className="h-4 w-4" />
            Remover
          </Button>
          <Button variant="outline">
            <CloudCog className="h-4 w-4" />
            Configurar
          </Button>
          <Button variant="ghost">
            <Plus className="h-4 w-4" />
            Adicionar
          </Button>
        </div>

        {/* Loading state pattern */}
        <h3 className="text-lg font-semibold mt-10 mb-4">
          Padrao: loading
        </h3>
        <div className="flex flex-wrap gap-3">
          <Button disabled>
            <Loader2 className="h-4 w-4 animate-spin" />
            Processando...
          </Button>
          <Button variant="positive" disabled>
            <Loader2 className="h-4 w-4 animate-spin" />
            Aplicando...
          </Button>
          <Button variant="outline" disabled>
            <Loader2 className="h-4 w-4 animate-spin" />
            Carregando...
          </Button>
        </div>

        {/* Full width */}
        <h3 className="text-lg font-semibold mt-10 mb-4">
          Full width
        </h3>
        <div className="flex flex-col gap-3" style={{ maxWidth: 360 }}>
          <Button className="w-full">Criar minha conta</Button>
          <Button variant="outline" className="w-full">
            Cadastrar com Google
          </Button>
          <Button variant="positive" className="w-full">
            Comecar gratis
          </Button>
        </div>

        {/* Dark background */}
        <h3 className="text-lg font-semibold mt-10 mb-4">
          Sobre fundo escuro
        </h3>
        <div
          className="rounded-xl p-6 flex flex-wrap gap-3"
          style={{ background: "var(--background-dark)" }}
        >
          <Button className="bg-[#34D399] text-white hover:bg-[#2CC085]">
            Comece gratis
          </Button>
          <Button
            variant="outline"
            className="border-[#34D399] text-[#34D399] hover:bg-[#34D399]/10"
          >
            Comecar no Pro
          </Button>
          <Button variant="ghost" className="text-white hover:bg-white/10">
            Entrar
          </Button>
        </div>
      </div>
    );
  },
  parameters: { layout: "padded" },
};
