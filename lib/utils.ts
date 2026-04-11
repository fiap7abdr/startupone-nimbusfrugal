import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function formatDate(value: Date | string | null | undefined): string {
  if (!value) return "—";
  const d = typeof value === "string" ? new Date(value) : value;
  return d.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function randomExternalId(): string {
  return `nimbus-${crypto.randomUUID()}`;
}

export function generateTenantSlug(name: string): string {
  const base = slugify(name).slice(0, 30);
  const suffix = crypto.randomUUID().slice(0, 8);
  return base ? `${base}-${suffix}` : suffix;
}

const CONNECTOR_LABELS: Record<string, string> = {
  aws_organizations: "AWS Organizations",
  cur: "CUR (Cost and Usage Report)",
  cost_explorer: "Cost Explorer",
  cost_optimization_hub: "Cost Optimization Hub",
  compute_optimizer: "Compute Optimizer",
  trusted_advisor: "Trusted Advisor",
  ssm_explorer: "SSM Explorer",
};

export function connectorLabel(connectorType: string): string {
  return CONNECTOR_LABELS[connectorType] ?? connectorType;
}
