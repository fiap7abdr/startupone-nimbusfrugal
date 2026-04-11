import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
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
  const membership = await prisma.tenantMember.findFirst({
    where: { userId: user.id, membershipStatus: "active" },
    include: { tenant: { include: { billing: true } } },
  });
  if (!membership) redirect("/signup");
  return { user, membership, tenant: membership.tenant };
}

export async function requireAdmin() {
  const user = await requireUser();
  const admin = await prisma.adminUser.findUnique({
    where: { email: user.email },
  });
  if (!admin || admin.status !== "active") redirect("/admin/login");
  return { user, admin };
}
