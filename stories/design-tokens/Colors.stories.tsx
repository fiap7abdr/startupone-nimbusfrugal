import type { Meta, StoryObj } from "@storybook/react";
import { tokens } from "@/design-system/tokens";

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: 12,
        borderRadius: 8,
        border: "1px solid #CBD5E1",
        background: "#FFFFFF",
        minWidth: 180,
      }}
    >
      <div
        style={{
          height: 56,
          borderRadius: 6,
          background: value,
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      />
      <div style={{ fontSize: 12 }}>
        <div style={{ fontWeight: 600 }}>{name}</div>
        <div style={{ color: "#475569", fontFamily: "ui-monospace, monospace" }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function ColorsPalette() {
  return (
    <div style={{ padding: 24, background: "#F1F5F9", minHeight: "100vh" }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>
        Cores — Brand
      </h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 32 }}>
        {Object.entries(tokens.colors).map(([k, v]) => (
          <Swatch key={k} name={k} value={v} />
        ))}
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Sidebar</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
        {Object.entries(tokens.sidebar).map(([k, v]) => (
          <Swatch key={k} name={k} value={v} />
        ))}
      </div>
    </div>
  );
}

const meta: Meta<typeof ColorsPalette> = {
  title: "Design Tokens/Colors",
  component: ColorsPalette,
};
export default meta;

type Story = StoryObj<typeof ColorsPalette>;
export const Palette: Story = {};
