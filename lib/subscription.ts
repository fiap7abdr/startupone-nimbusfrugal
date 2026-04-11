import type { BillingSubscription } from "@prisma/client";

export function isTrialActive(billing: BillingSubscription | null): boolean {
  if (!billing) return false;
  if (billing.plan !== "TRIAL") return false;
  if (!billing.trialEndsAt) return false;
  return billing.trialEndsAt > new Date();
}

export function isSubscribed(billing: BillingSubscription | null): boolean {
  if (!billing) return false;
  return billing.plan === "PRO" && billing.billingStatus === "active";
}

export function hasAccess(billing: BillingSubscription | null): boolean {
  return isTrialActive(billing) || isSubscribed(billing);
}

export function daysLeftInTrial(billing: BillingSubscription | null): number {
  if (!billing?.trialEndsAt) return 0;
  if (billing.plan !== "TRIAL") return 0;
  const diff = billing.trialEndsAt.getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

export function billingStatusLabel(billing: BillingSubscription | null): string {
  if (!billing) return "Sem plano";
  if (isSubscribed(billing)) return "PRO";
  if (isTrialActive(billing)) return `Trial (${daysLeftInTrial(billing)} dias restantes)`;
  if (billing.plan === "TRIAL") return "Trial expirado";
  return billing.billingStatus;
}
