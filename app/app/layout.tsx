import { AppSidebar } from "@/components/app/sidebar";
import { requireTenant } from "@/lib/tenant";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { tenant } = await requireTenant();
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar tenantName={tenant.name} />
      <div className="flex-1 overflow-auto">
        <main className="mx-auto max-w-6xl p-8">{children}</main>
      </div>
    </div>
  );
}
