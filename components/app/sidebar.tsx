"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  Rocket,
} from "lucide-react";

const NAV = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/onboarding", label: "Onboarding", icon: Rocket },
  { href: "/app/integrations", label: "Integracoes", icon: Cable },
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
}: {
  tenantName: string;
  tenants?: TenantOption[];
  activeTenantId?: string;
}) {
  const pathname = usePathname();
  return (
    <aside className="flex h-screen w-64 flex-col bg-[#1E3A8A] text-white">
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
        <Image
          src="/logo-40.png"
          alt="Nimbus Frugal"
          width={32}
          height={32}
          className="shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Nimbus Frugal</p>
          {tenants && activeTenantId ? (
            <TenantSwitcher
              tenants={tenants}
              activeTenantId={activeTenantId}
            />
          ) : (
            <p className="truncate text-[11px] text-white/60">{tenantName}</p>
          )}
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition",
                active
                  ? "bg-primary text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-3">
        <LogoutButton />
      </div>
    </aside>
  );
}
