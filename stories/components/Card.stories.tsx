import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function MetricCard() {
  return (
    <Card style={{ width: 320 }}>
      <CardHeader>
        <CardTitle>Savings estimados</CardTitle>
        <CardDescription>Próximos 30 dias · consolidado diário</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">US$ 12.480,00</p>
        <div className="mt-3 flex gap-2">
          <Badge variant="positive">+18% vs mês anterior</Badge>
          <Badge variant="muted">Fresh</Badge>
        </div>
      </CardContent>
    </Card>
  );
}

const meta: Meta<typeof MetricCard> = {
  title: "Components/Card",
  component: MetricCard,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof MetricCard>;
export const Metric: Story = {};
