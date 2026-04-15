import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { requireAdmin } from "@/lib/tenant";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin } = await requireAdmin();
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar adminEmail={admin.email} adminName={admin.name} />
      <div className="flex-1 overflow-auto">
        <main className="mx-auto max-w-6xl p-8">{children}</main>
      </div>
      <LocaleSwitcher className="fixed bottom-4 right-4 z-40 rounded-full bg-card border border-border shadow-lg px-3 py-2 text-sm" />
    </div>
  );
}
