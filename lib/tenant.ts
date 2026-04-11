import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function requireUser() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) redirect("/login");
  return user;
}

export async function requireTenant() {
  const user = await requireUser();

  const memberships = await prisma.tenantMember.findMany({
    where: { userId: user.id, membershipStatus: "active" },
    include: { tenant: { include: { billing: true } } },
    orderBy: { joinedAt: "desc" },
  });

  if (memberships.length === 0) redirect("/new-tenant");

  const cookieStore = await cookies();
  const activeTenantId = cookieStore.get("active-tenant-id")?.value;

  const membership =
    memberships.find((m) => m.tenantId === activeTenantId) ?? memberships[0];

  return { user, membership, tenant: membership.tenant, memberships };
}

export async function requireAdmin() {
  const user = await requireUser();
  const admin = await prisma.adminUser.findUnique({
    where: { email: user.email },
  });
  if (!admin || admin.status !== "active") redirect("/admin/login");
  return { user, admin };
}
