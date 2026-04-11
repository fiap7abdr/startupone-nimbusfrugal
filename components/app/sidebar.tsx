"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { TenantSwitcher } from "@/components/app/tenant-switcher";
import { LogoutButton } from "@/components/app/logout-button";
import {
  LayoutDashboard,
  Cable,
  Sparkles,
  Users,
  Settings,
  Network,
  Crown,
  Zap,
  Menu,
  Loader2,
} from "lucide-react";

const NAV = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/integrations", label: "Integracoes AWS", icon: Cable },
  { href: "/app/organization", label: "Organizacao AWS", icon: Network },
  { href: "/app/recommendations", label: "Recomendacoes", icon: Sparkles },
  { href: "/app/users", label: "Usuarios", icon: Users },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

interface TenantOption {
  id: string;
  name: string;
}

export function AppSidebar({
  tenantName,
  tenants,
  activeTenantId,
  plan,
  trialEndsAt,
}: {
  tenantName: string;
  tenants?: TenantOption[];
  activeTenantId?: string;
  plan: string;
  trialEndsAt: string | null;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const isTrial = plan === "TRIAL";
  const [navigating, setNavigating] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const trialDaysLeft = trialEndsAt
    ? Math.max(0, Math.ceil((new Date(trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  function handleNavClick(href: string, e: React.MouseEvent) {
    e.preventDefault();
    if (navigating) return;
    setNavigating(href);
    startTransition(() => {
      router.push(href);
    });
  }

  // Clear navigating state when pathname changes
  const isNavigating = isPending && navigating !== null;
  if (!isPending && navigating !== null) {
    // Transition finished — will clear on next render
    setTimeout(() => setNavigating(null), 0);
  }

  return (
    <>
      {/* Spacer — always collapsed width */}
      <div className="w-16 shrink-0" />

      {/* Sidebar */}
      <aside
        className={cn(
          "group/sidebar fixed inset-y-0 left-0 z-30 flex w-16 flex-col bg-[#1E3A8A] text-white",
          "transition-all duration-200 hover:w-64",
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-3">
          <button
            type="button"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md transition group-hover/sidebar:hidden hover:bg-white/10"
            tabIndex={-1}
          >
            <Menu className="h-5 w-5" />
          </button>
          <Image
            src="/logo-40.png"
            alt="Nimbus Frugal"
            width={32}
            height={32}
            className="hidden shrink-0 group-hover/sidebar:block"
          />
          <div className="hidden min-w-0 flex-1 group-hover/sidebar:block">
            <p className="text-sm font-semibold">Nimbus Frugal</p>
            {tenants && activeTenantId ? (
              <TenantSwitcher
                tenants={tenants}
                activeTenantId={activeTenantId}
                isTrial={isTrial}
              />
            ) : (
              <p className="truncate text-[11px] text-white/60">{tenantName}</p>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {NAV.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const isLoading = navigating === item.href && isNavigating;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={item.label}
                onClick={(e) => handleNavClick(item.href, e)}
                aria-disabled={isNavigating}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition",
                  "justify-center group-hover/sidebar:justify-start group-hover/sidebar:gap-3",
                  isNavigating && !isLoading && "pointer-events-none opacity-50",
                  active
                    ? "bg-primary text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white",
                )}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                ) : (
                  <Icon className="h-4 w-4 shrink-0" />
                )}
                <span className="hidden group-hover/sidebar:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 px-2 py-3 space-y-2">
          {isTrial && (
            <Link
              href="/app/upgrade"
              title="Upgrade para Pro"
              onClick={(e) => handleNavClick("/app/upgrade", e)}
              aria-disabled={isNavigating}
              className={cn(
                "flex items-center rounded-md bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-white shadow-sm transition hover:opacity-90",
                "justify-center p-2 group-hover/sidebar:justify-start group-hover/sidebar:gap-3 group-hover/sidebar:px-3",
                isNavigating && "pointer-events-none opacity-70",
              )}
            >
              {navigating === "/app/upgrade" && isNavigating ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 shrink-0" />
              )}
              <div className="hidden min-w-0 flex-1 group-hover/sidebar:block">
                <span className="text-sm font-semibold">Upgrade para Pro</span>
                {trialDaysLeft > 0 && (
                  <p className="text-[10px] font-normal text-white/80">
                    {trialDaysLeft} dias restantes no trial
                  </p>
                )}
              </div>
            </Link>
          )}

          {!isTrial && (
            <div
              title="Plano Pro"
              className={cn(
                "flex items-center rounded-md bg-white/10 text-sm",
                "justify-center p-2 group-hover/sidebar:justify-start group-hover/sidebar:gap-3 group-hover/sidebar:px-3",
              )}
            >
              <Crown className="h-4 w-4 shrink-0 text-[#F59E0B]" />
              <span className="hidden font-medium text-white/90 group-hover/sidebar:inline">
                Plano Pro
              </span>
            </div>
          )}

          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
