"use client";

import { useRouter } from "next/navigation";
import { ChevronDown, Lock, Settings2, Loader2 } from "lucide-react";
import { useState } from "react";

interface TenantOption {
  id: string;
  name: string;
}

export function TenantSwitcher({
  tenants,
  activeTenantId,
  isTrial,
}: {
  tenants: TenantOption[];
  activeTenantId: string;
  isTrial: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [switchingId, setSwitchingId] = useState<string | null>(null);
  const active = tenants.find((t) => t.id === activeTenantId) ?? tenants[0];

  if (tenants.length <= 1 && isTrial) {
    return (
      <p className="truncate text-[11px] text-white/60">{active?.name}</p>
    );
  }

  async function switchTenant(tenantId: string) {
    setSwitchingId(tenantId);
    await fetch("/api/switch-tenant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId }),
    });
    router.refresh();
    setOpen(false);
    setSwitchingId(null);
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
                disabled={switchingId !== null}
                onClick={() => switchTenant(t.id)}
                className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-xs disabled:opacity-50 ${
                  t.id === activeTenantId
                    ? "bg-primary/30 font-medium text-white"
                    : "text-white/80 hover:bg-white/10"
                }`}
              >
                {switchingId === t.id && (
                  <Loader2 className="h-3 w-3 animate-spin shrink-0" />
                )}
                {t.name}
              </button>
            ))}
            <div className="mx-2 my-1 border-t border-white/10" />
            {isTrial ? (
              <div className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-white/40">
                <Lock className="h-3 w-3" />
                Multiplas empresas disponivel no Pro
              </div>
            ) : (
              <a
                href="/app/companies"
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-white/60 hover:bg-white/10 hover:text-white/90"
              >
                <Settings2 className="h-3 w-3" />
                Gerenciar Empresas
              </a>
            )}
          </div>
        </>
      )}
    </div>
  );
}
