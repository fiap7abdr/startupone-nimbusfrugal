import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Resend from "next-auth/providers/resend";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    verifyRequest: "/login/check-email",
  },
  providers: [
    Resend({
      apiKey: process.env.AUTH_RESEND_KEY,
      from: "Nimbus Frugal <onboarding@resend.dev>",
    }),
  ],
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
