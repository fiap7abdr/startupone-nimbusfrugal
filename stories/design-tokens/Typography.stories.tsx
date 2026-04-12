import type { Meta, StoryObj } from "@storybook/react";
import { tokens } from "@/design-system/tokens";

function Typography() {
  return (
    <div
      style={{
        padding: 32,
        background: "#F1F5F9",
        minHeight: "100vh",
        fontFamily: tokens.typography.fontSans,
      }}
    >
      <h1 style={{ fontSize: 48, fontWeight: 700, margin: 0 }}>
        Nimbus Frugal — Headline
      </h1>
      <p style={{ color: "#475569", marginTop: 8 }}>
        fontSans: {tokens.typography.fontSans}
      </p>
      <h2 style={{ fontSize: 32, fontWeight: 700, marginTop: 32 }}>
        Heading 2 — seção
      </h2>
      <h3 style={{ fontSize: 24, fontWeight: 600, marginTop: 16 }}>
        Heading 3 — card
      </h3>
      <p style={{ fontSize: 16, marginTop: 16, maxWidth: 640 }}>
        Paragraph body. Plataforma FinOps SaaS multi-tenant para AWS com
        atualização diária e foco em visibilidade, priorização e governança
        operacional.
      </p>
      <p style={{ fontSize: 12, marginTop: 16, color: "#475569" }}>
        Small text · 12px · muted
      </p>
      <pre
        style={{
          marginTop: 16,
          fontFamily: tokens.typography.fontMono,
          fontSize: 12,
          background: "#0f172a",
          color: "#fff",
          padding: 12,
          borderRadius: 8,
          display: "inline-block",
        }}
      >
        aws sts assume-role --external-id nimbus-xxxxx
      </pre>
    </div>
  );
}

const meta: Meta<typeof Typography> = {
  title: "Design Tokens/Typography",
  component: Typography,
};
export default meta;

type Story = StoryObj<typeof Typography>;
export const Scale: Story = {};
