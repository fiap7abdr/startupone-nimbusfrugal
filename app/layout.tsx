import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nimbus Frugal — Controle de custos em nuvem, inteligência para economizar",
  description:
    "Plataforma FinOps SaaS multi-tenant para AWS com atualização diária e foco em visibilidade, priorização e governança operacional.",
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
