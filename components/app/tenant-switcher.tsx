"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, Plus } from "lucide-react";
import { useState } from "react";

interface TenantOption {
  id: string;
  name: string;
}

export function TenantSwitcher({
  tenants,
  activeTenantId,
}: {
  tenants: TenantOption[];
  activeTenantId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const active = tenants.find((t) => t.id === activeTenantId) ?? tenants[0];

  if (tenants.length <= 1) {
    return (
      <p className="truncate text-[11px] text-white/60">{active?.name}</p>
    );
  }

  async function switchTenant(tenantId: string) {
    setOpen(false);
    await fetch("/api/switch-tenant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId }),
    });
    router.refresh();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 truncate text-[11px] text-white/60 hover:text-white/90"
      >
        <span className="truncate">{active?.name}</span>
        <ChevronDown className="h-3 w-3 shrink-0" />
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-full z-50 mt-1 w-52 rounded-md border border-white/20 bg-[#1a3178] py-1 shadow-lg">
            {tenants.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => switchTenant(t.id)}
                className={`flex w-full items-center px-3 py-1.5 text-left text-xs ${
                  t.id === activeTenantId
                    ? "bg-primary/30 font-medium text-white"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                {t.name}
              </button>
            ))}
            <div className="mx-2 my-1 border-t border-white/10" />
            <a
              href="/app/new-tenant"
              className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10 hover:text-white/90"
            >
              <Plus className="h-3 w-3" />
              Criar novo tenant
            </a>
          </div>
        </>
      )}
    </div>
  );
}
