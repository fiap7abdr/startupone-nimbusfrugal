import type { Meta, StoryObj } from "@storybook/react";

function SiteFooterDemo() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
        <p>&copy; 2026 Nimbus Frugal. Todos os direitos reservados.</p>
        <div className="flex gap-6">
          <span className="cursor-pointer hover:text-foreground">Entrar</span>
          <span className="cursor-pointer hover:text-foreground">Signup</span>
        </div>
      </div>
    </footer>
  );
}

const meta: Meta<typeof SiteFooterDemo> = {
  title: "Marketing/SiteFooter",
  component: SiteFooterDemo,
  parameters: { layout: "fullscreen" },
};
export default meta;

type Story = StoryObj<typeof SiteFooterDemo>;
export const Default: Story = {};
