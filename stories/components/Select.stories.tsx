import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "@/components/ui/label";

function SelectDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 280 }}>
      <Label htmlFor="region">Regiao AWS</Label>
      <select
        id="region"
        className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        defaultValue="us-east-1"
      >
        <option value="us-east-1">US East (N. Virginia)</option>
        <option value="us-west-2">US West (Oregon)</option>
        <option value="eu-west-1">EU (Ireland)</option>
        <option value="sa-east-1">South America (Sao Paulo)</option>
      </select>
    </div>
  );
}

const meta: Meta<typeof SelectDemo> = {
  title: "Components/Select",
  component: SelectDemo,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof SelectDemo>;
export const Default: Story = {};
