import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nimbus Frugal — Controle de custos em nuvem, inteligencia para economizar",
  description:
    "Plataforma FinOps SaaS multi-tenant para AWS com atualizacao diaria e foco em visibilidade, priorizacao e governanca operacional.",
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Nimbus Frugal",
    description:
      "Plataforma FinOps SaaS multi-tenant para AWS com atualizacao diaria e foco em visibilidade, priorizacao e governanca operacional.",
    images: [{ url: "/og-logo.png", width: 630, height: 630 }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
