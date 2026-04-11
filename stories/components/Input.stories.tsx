import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function InputGallery() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 320 }}>
      <div>
        <Label htmlFor="default">Default</Label>
        <Input id="default" placeholder="Digite algo..." />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" placeholder="voce@empresa.com" />
      </div>
      <div>
        <Label htmlFor="disabled">Disabled</Label>
        <Input id="disabled" disabled placeholder="Desabilitado" />
      </div>
    </div>
  );
}

const meta: Meta<typeof InputGallery> = {
  title: "Components/Input",
  component: InputGallery,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof InputGallery>;
export const Gallery: Story = {};
