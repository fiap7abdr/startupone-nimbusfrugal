import type { Meta, StoryObj } from "@storybook/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function TabsDemo() {
  return (
    <Tabs defaultValue="overview" style={{ width: 400 }}>
      <TabsList>
        <TabsTrigger value="overview">Visao geral</TabsTrigger>
        <TabsTrigger value="integrations">Integracoes</TabsTrigger>
        <TabsTrigger value="settings">Configuracoes</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Custos consolidados e recomendacoes priorizadas.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="integrations">
        <Card>
          <CardHeader>
            <CardTitle>Conectores AWS</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              7 conectores: Organizations, CUR, Cost Explorer, Cost Optimization
              Hub, Compute Optimizer, Trusted Advisor, SSM Explorer.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="settings">
        <Card>
          <CardHeader>
            <CardTitle>Preferencias</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Billing, notificacoes e configuracao de coleta.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

const meta: Meta<typeof TabsDemo> = {
  title: "Components/Tabs",
  component: TabsDemo,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof TabsDemo>;
export const Default: Story = {};
