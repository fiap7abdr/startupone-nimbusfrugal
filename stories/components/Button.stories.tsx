import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/ui/button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "outline", "ghost", "destructive", "positive", "link"],
    },
    size: { control: "select", options: ["default", "sm", "lg", "icon"] },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { children: "Criar tenant", variant: "default" } };
export const Secondary: Story = { args: { children: "Ver pricing", variant: "secondary" } };
export const Outline: Story = { args: { children: "Cancelar", variant: "outline" } };
export const Positive: Story = { args: { children: "Aplicar recomendação", variant: "positive" } };
export const Destructive: Story = { args: { children: "Revogar acesso", variant: "destructive" } };
