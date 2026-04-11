import type { Meta, StoryObj } from "@storybook/react";
import { tokens } from "@/design-system/tokens";

function SpacingDisplay() {
  return (
    <div style={{ padding: 32, background: "#F1F5F9", minHeight: "100vh" }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>Spacing</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {Object.entries(tokens.spacing).map(([k, v]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <code style={{ width: 60 }}>{k}</code>
            <div
              style={{
                height: 20,
                width: `calc(${v} * 4)`,
                background: "#2F6FE4",
                borderRadius: 4,
              }}
            />
            <span style={{ fontSize: 12, color: "#475569" }}>{v}</span>
          </div>
        ))}
      </div>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginTop: 32, marginBottom: 16 }}>
        Radius
      </h2>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {Object.entries(tokens.radius).map(([k, v]) => (
          <div
            key={k}
            style={{
              padding: 12,
              border: "1px solid #CBD5E1",
              borderRadius: 8,
              background: "#FFFFFF",
              minWidth: 140,
            }}
          >
            <div
              style={{
                height: 60,
                background: "#2F6FE4",
                borderRadius: v,
              }}
            />
            <div style={{ marginTop: 8, fontSize: 12 }}>
              <div style={{ fontWeight: 600 }}>{k}</div>
              <div style={{ color: "#475569" }}>{v}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const meta: Meta<typeof SpacingDisplay> = {
  title: "Design Tokens/Spacing & Radius",
  component: SpacingDisplay,
};
export default meta;

type Story = StoryObj<typeof SpacingDisplay>;
export const Scale: Story = {};
