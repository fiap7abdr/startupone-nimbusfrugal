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
import { PageHeader } from "@/components/app/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function DashboardComposition() {
  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: 24 }}>
      <PageHeader
        title="Dashboard"
        description="Visao consolidada dos custos e oportunidades de economia."
      />

      {/* Metric cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Gasto mensal</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">R$ 225.115</p>
            <p className="mt-1 text-xs text-muted-foreground">+3,2% vs mes anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Economia identificada</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-positive">R$ 3.755</p>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="positive">+18,4%</Badge>
              <span className="text-xs text-muted-foreground">12 recomendacoes</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Desperdicio detectado</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-negative">R$ 1.972</p>
            <div className="mt-1 flex items-center gap-2">
              <Badge variant="negative">-7,2%</Badge>
              <span className="text-xs text-muted-foreground">5 recursos ociosos</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs section */}
      <Tabs defaultValue="recommendations" className="mt-8">
        <TabsList>
          <TabsTrigger value="recommendations">Recomendacoes</TabsTrigger>
          <TabsTrigger value="integrations">Integracoes</TabsTrigger>
        </TabsList>
        <TabsContent value="recommendations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="negative">High</Badge>
                <span className="text-sm font-semibold text-positive">
                  -R$ 2.100/mes
                </span>
              </div>
              <CardTitle className="text-base">
                Rightsizing: i-0abc123 (m5.2xlarge → m5.xlarge)
              </CardTitle>
              <CardDescription>
                Uso medio de CPU em 12% nos ultimos 14 dias.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button size="sm" variant="positive">Aplicar</Button>
                <Button size="sm" variant="outline">Ignorar</Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Medium</Badge>
                <span className="text-sm font-semibold text-positive">
                  -R$ 840/mes
                </span>
              </div>
              <CardTitle className="text-base">
                Volume EBS orfao: vol-0def456 (500 GiB gp3)
              </CardTitle>
              <CardDescription>
                Sem attachment ha 45 dias. Nenhuma snapshot recente.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button size="sm" variant="positive">Aplicar</Button>
                <Button size="sm" variant="outline">Ignorar</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="integrations" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">AWS Organizations</CardTitle>
                <Badge variant="positive">Active</Badge>
              </div>
              <CardDescription>Ultima coleta: ha 2 horas</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Cost Explorer</CardTitle>
                <Badge variant="positive">Active</Badge>
              </div>
              <CardDescription>Ultima coleta: ha 3 horas</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Trusted Advisor</CardTitle>
                <Badge variant="muted">Pending</Badge>
              </div>
              <CardDescription>Aguardando ativacao</CardDescription>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

const meta: Meta<typeof DashboardComposition> = {
  title: "Compositions/Dashboard",
  component: DashboardComposition,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "nimbus-light" },
  },
};
export default meta;

type Story = StoryObj<typeof DashboardComposition>;
export const Default: Story = {};
