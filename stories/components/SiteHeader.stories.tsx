import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@/components/ui/button";

function SiteHeaderDemo() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <img
            src="/logo-64.png"
            alt="Nimbus Frugal"
            width={36}
            height={36}
          />
          <span className="text-lg font-semibold tracking-tight">
            Nimbus Frugal
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm">
            Entrar
          </Button>
          <Button size="sm">Comecar gratis</Button>
        </div>
      </div>
    </header>
  );
}

const meta: Meta<typeof SiteHeaderDemo> = {
  title: "Marketing/SiteHeader",
  component: SiteHeaderDemo,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof SiteHeaderDemo>;
export const Default: Story = {};
