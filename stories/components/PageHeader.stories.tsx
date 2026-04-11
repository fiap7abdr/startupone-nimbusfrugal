import type { Meta, StoryObj } from "@storybook/react";
import { PageHeader } from "@/components/app/page-header";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof PageHeader> = {
  title: "Components/PageHeader",
  component: PageHeader,
  parameters: { layout: "padded" },
};
export default meta;

type Story = StoryObj<typeof PageHeader>;

export const TitleOnly: Story = {
  args: { title: "Dashboard" },
};

export const WithDescription: Story = {
  args: {
    title: "Recomendacoes",
    description:
      "Oportunidades de economia identificadas pela plataforma, priorizadas por impacto.",
  },
};

export const WithAction: Story = {
  args: {
    title: "Usuarios",
    description: "Membros do tenant com acesso a plataforma.",
    action: <Button>Convidar usuario</Button>,
  },
};
