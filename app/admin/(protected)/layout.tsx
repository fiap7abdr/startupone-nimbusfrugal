import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { requireAdmin } from "@/lib/tenant";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { admin } = await requireAdmin();
  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar adminEmail={admin.email} />
      <div className="flex-1 overflow-auto">
        <main className="mx-auto max-w-6xl p-8">{children}</main>
      </div>
    </div>
  );
}
