"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { LogoutButton } from "@/components/app/logout-button";
import {
  LayoutDashboard,
  Building2,
  Cable,
  Database,
  Users,
  UserCircle,
  ShieldCheck,
  ScrollText,
} from "lucide-react";

export function AdminSidebar({ adminEmail }: { adminEmail: string }) {
  const pathname = usePathname();
  const t = useTranslations("admin");

  const NAV = [
    { href: "/admin", label: t("nav_overview"), icon: LayoutDashboard },
    { href: "/admin/tenants", label: t("nav_tenants"), icon: Building2 },
    { href: "/admin/integrations", label: t("nav_integrations"), icon: Cable },
    { href: "/admin/batches", label: t("nav_batches"), icon: Database },
    { href: "/admin/users", label: t("nav_users"), icon: UserCircle },
    { href: "/admin/admin-users", label: t("nav_admins"), icon: Users },
    { href: "/admin/audit", label: t("nav_audit"), icon: ScrollText },
  ];

  return (
    <aside className="flex h-screen w-64 flex-col bg-[#0f1b3f] text-white">
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-negative">
          <ShieldCheck className="h-4 w-4" />
        </div>
        <div>
          <p className="text-sm font-semibold">Nimbus · Admin</p>
          <p className="text-[11px] text-white/60">{adminEmail}</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
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
      <div className="border-t border-white/10 p-3 space-y-2">
        <LogoutButton />
      </div>
    </aside>
  );
}
