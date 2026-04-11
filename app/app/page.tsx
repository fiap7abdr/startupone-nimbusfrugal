import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export default async function AppIndex() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) redirect("/login");

  const memberships = await prisma.tenantMember.findMany({
    where: { userId: user.id, membershipStatus: "active" },
    include: { tenant: true },
    orderBy: { joinedAt: "desc" },
  });

  if (memberships.length === 0) {
    redirect("/new-tenant");
  }

  const cookieStore = await cookies();
  const activeTenantId = cookieStore.get("active-tenant-id")?.value;

  const activeMembership =
    memberships.find((m) => m.tenantId === activeTenantId) ?? memberships[0];

  cookieStore.set("active-tenant-id", activeMembership.tenantId, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365,
  });

  redirect("/app/dashboard");
}
