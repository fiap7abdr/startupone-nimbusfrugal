export type DesignTokens = {
  colors: {
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    background: string;
    backgroundDark: string;
    foreground: string;
    mutedForeground: string;
    card: string;
    cardForeground: string;
    border: string;
    input: string;
    ring: string;
    positive: string;
    positiveLight: string;
    positiveSoft: string;
    negative: string;
    negativeForeground: string;
    accent: string;
    accentForeground: string;
    muted: string;
  };
  sidebar: {
    background: string;
    foreground: string;
    border: string;
    accent: string;
    accentForeground: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontSans: string;
    fontMono: string;
  };
};

export const tokens: DesignTokens = {
  colors: {
    primary: "#2F6FE4",
    primaryForeground: "#FFFFFF",
    secondary: "#5FA8FF",
    secondaryForeground: "#0B1E3F",
    background: "#F1F5F9",
    backgroundDark: "#1E3A8A",
    foreground: "#0F172A",
    mutedForeground: "#475569",
    card: "#FFFFFF",
    cardForeground: "#0F172A",
    border: "#CBD5E1",
    input: "#CBD5E1",
    ring: "#2F6FE4",
    positive: "#22C55E",
    positiveLight: "#4ADE80",
    positiveSoft: "#A7F3D0",
    negative: "#EF4444",
    negativeForeground: "#FFFFFF",
    accent: "#E0ECFF",
    accentForeground: "#1E3A8A",
    muted: "#E2E8F0",
  },
  sidebar: {
    background: "#1E3A8A",
    foreground: "#E0ECFF",
    border: "#24468F",
    accent: "#2F6FE4",
    accentForeground: "#FFFFFF",
  },
  radius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    xl: "1rem",
    full: "9999px",
  },
  spacing: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
  },
  typography: {
    fontSans:
      "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    fontMono:
      "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
};
