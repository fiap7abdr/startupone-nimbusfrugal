import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@/components/ui/badge";

function BadgeGallery() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="positive">Fresh</Badge>
      <Badge variant="negative">Error</Badge>
      <Badge variant="muted">Stale</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  );
}

const meta: Meta<typeof BadgeGallery> = {
  title: "Components/Badge",
  component: BadgeGallery,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof BadgeGallery>;
export const Gallery: Story = {};
