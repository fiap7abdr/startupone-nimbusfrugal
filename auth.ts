import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/audit";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  events: {
    async signIn({ user, account, isNewUser }) {
      if (!user?.id || !user?.email) return;
      await createAuditLog({
        entityType: "user",
        entityId: user.id,
        action: "login_success",
        actor: user.id,
        actorEmail: user.email,
        actorType: "user",
        module: "auth",
        summary: `${user.name ?? user.email} fez login via ${account?.provider ?? "unknown"}`,
        metadata: {
          method: account?.provider ? `${account.provider}_oauth` : "unknown",
          provider: account?.provider ?? null,
          name: user.name ?? null,
          isNewUser: !!isNewUser,
        },
      });
    },
    async signOut(message) {
      const token = "token" in message ? message.token : null;
      if (!token?.sub || !token.email) return;
      await createAuditLog({
        entityType: "user",
        entityId: token.sub,
        action: "logout",
        actor: token.sub,
        actorEmail: String(token.email),
        actorType: "user",
        module: "auth",
        summary: `${token.email} fez logout`,
      });
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
        token.sub = user.id ?? token.sub;
      }
      if (token.email) {
        const admin = await prisma.adminUser.findUnique({
          where: { email: token.email },
        });
        token.isAdmin = !!admin && admin.status === "active";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.sub as string) ?? session.user.id;
        (session.user as { isAdmin?: boolean }).isAdmin =
          (token as { isAdmin?: boolean }).isAdmin ?? false;
      }
      return session;
    },
  },
});
