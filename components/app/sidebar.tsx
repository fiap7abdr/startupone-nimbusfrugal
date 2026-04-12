"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Cable,
  Sparkles,
  Users,
  Settings,
  Network,
  Rocket,
  LogOut,
  CloudCog,
} from "lucide-react";

const NAV = [
  { href: "/app/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/app/onboarding", label: "Onboarding", icon: Rocket },
  { href: "/app/integrations", label: "Integrações", icon: Cable },
  { href: "/app/organization", label: "Organização AWS", icon: Network },
  { href: "/app/recommendations", label: "Recomendações", icon: Sparkles },
  { href: "/app/users", label: "Usuários", icon: Users },
  { href: "/app/settings", label: "Settings", icon: Settings },
];

export function AppSidebar({ tenantName }: { tenantName: string }) {
  const pathname = usePathname();
  return (
    <aside className="flex h-screen w-64 flex-col bg-[#1E3A8A] text-white">
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
          <CloudCog className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold">Nimbus Frugal</p>
          <p className="text-[11px] text-white/60">{tenantName}</p>
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
        <form action="/api/auth/signout" method="post">
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-white/80 hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </form>
      </div>
    </aside>
  );
}
