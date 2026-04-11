import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const meta: Meta = {
  title: "Components/Card",
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj;

export const Metric: Story = {
  render: () => (
    <Card style={{ width: 320 }}>
      <CardHeader>
        <CardTitle>Savings estimados</CardTitle>
        <CardDescription>Proximos 30 dias · consolidado diario</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">US$ 12.480,00</p>
        <div className="mt-3 flex gap-2">
          <Badge variant="positive">+18% vs mes anterior</Badge>
          <Badge variant="muted">Fresh</Badge>
        </div>
      </CardContent>
    </Card>
  ),
};

export const Integration: Story = {
  render: () => (
    <Card style={{ width: 360 }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>AWS Organizations</CardTitle>
          <Badge variant="positive">Active</Badge>
        </div>
        <CardDescription>org-12345678 · us-east-1</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Ultima coleta</span>
          <span>ha 2 horas</span>
        </div>
        <div className="mt-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Contas descobertas</span>
          <span>24</span>
        </div>
      </CardContent>
    </Card>
  ),
};

export const Recommendation: Story = {
  render: () => (
    <Card style={{ width: 400 }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="negative">High</Badge>
          <span className="text-sm font-semibold text-positive">
            -US$ 840/mes
          </span>
        </div>
        <CardTitle className="text-base">
          Rightsizing: i-0abc123 (m5.2xlarge → m5.xlarge)
        </CardTitle>
        <CardDescription>
          Instancia com uso medio de CPU em 12% nos ultimos 14 dias.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          <Button size="sm" variant="positive">
            Aplicar
          </Button>
          <Button size="sm" variant="outline">
            Ignorar
          </Button>
        </div>
      </CardContent>
    </Card>
  ),
};

export const PricingTrial: Story = {
  render: () => (
    <Card style={{ width: 320 }}>
      <CardHeader className="text-center">
        <CardTitle>Trial</CardTitle>
        <div className="mt-2">
          <span className="text-3xl font-bold">Gratis</span>
          <span className="text-sm text-muted-foreground"> por 90 dias</span>
        </div>
        <CardDescription>
          Toda a plataforma liberada enquanto voce valida o retorno.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button className="w-full">Comecar gratis</Button>
      </CardContent>
    </Card>
  ),
};
