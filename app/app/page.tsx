import { redirect } from "next/navigation";
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
    take: 1,
  });

  if (memberships.length === 0) {
    redirect("/new-tenant");
  }

  redirect("/app/dashboard");
}
