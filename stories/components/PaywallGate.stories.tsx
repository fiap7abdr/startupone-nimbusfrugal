import type { Meta, StoryObj } from "@storybook/react";
import { PaywallGate } from "@/components/paywall/paywall-gate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function PaywallBlocked() {
  return (
    <PaywallGate hasAccess={false} featureName="recomendacoes">
      <p>Este conteudo nunca aparece</p>
    </PaywallGate>
  );
}

function PaywallAllowed() {
  return (
    <PaywallGate hasAccess={true} featureName="recomendacoes">
      <Card style={{ width: 320 }}>
        <CardHeader>
          <CardTitle>Recomendacoes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            3 oportunidades de economia identificadas.
          </p>
        </CardContent>
      </Card>
    </PaywallGate>
  );
}

const meta: Meta = {
  title: "Components/PaywallGate",
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj;
export const Blocked: Story = { render: () => <PaywallBlocked /> };
export const Allowed: Story = { render: () => <PaywallAllowed /> };
