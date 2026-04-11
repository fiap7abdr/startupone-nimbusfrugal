"use client";

import Link from "next/link";
import { Clock } from "lucide-react";

interface TrialBannerProps {
  daysLeft: number;
}

export function TrialBanner({ daysLeft }: TrialBannerProps) {
  if (daysLeft <= 0) return null;

  const urgent = daysLeft <= 7;

  return (
    <div
      className={`flex items-center justify-between gap-4 rounded-md px-4 py-2 text-sm ${
        urgent
          ? "bg-negative/10 text-negative"
          : "bg-accent text-accent-foreground"
      }`}
    >
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span>
          {daysLeft === 1
            ? "Seu trial expira amanhã"
            : `${daysLeft} dias restantes no trial`}
        </span>
      </div>
      <Link
        href="/app/settings"
        className="font-medium underline underline-offset-4 hover:opacity-80"
      >
        Fazer upgrade
      </Link>
    </div>
  );
}
