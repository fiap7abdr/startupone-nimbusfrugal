import { AppSidebar } from "@/components/app/sidebar";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { requireTenant } from "@/lib/tenant";
import { cookies } from "next/headers";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { tenant, memberships } = await requireTenant();

  const cookieStore = await cookies();
  const activeTenantId = cookieStore.get("active-tenant-id")?.value ?? tenant.id;

  const tenants = memberships.map((m) => ({
    id: m.tenantId,
    name: m.tenant.name,
  }));

  const billing = tenant.billing;
  const plan = billing?.plan ?? "TRIAL";
  const trialEndsAt = billing?.trialEndsAt?.toISOString() ?? null;

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar
        tenantName={tenant.name}
        tenants={tenants}
        activeTenantId={activeTenantId}
        plan={plan}
        trialEndsAt={trialEndsAt}
      />
      <div className="flex-1 overflow-auto">
        <main className="mx-auto max-w-6xl p-8">{children}</main>
      </div>
      <LocaleSwitcher className="fixed bottom-4 right-4 z-40 rounded-full bg-card border border-border shadow-lg px-3 py-2 text-sm" />
    </div>
  );
}
