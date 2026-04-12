import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

async function adminLogin(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin || admin.status !== "active") {
    redirect("/admin/login?error=forbidden");
  }
  await signIn("resend", { email, redirectTo: "/admin" });
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const state = await prisma.platformSetupState.findFirst();
  const sp = await searchParams;
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1b3f] p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle className="mt-4">Acesso administrativo</CardTitle>
          <CardDescription>
            Área restrita a Administradores Gerais da Nimbus Frugal.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!state?.setupCompleted && (
            <div className="mb-4 rounded-md border border-[#fbbf24]/30 bg-[#fef3c7] p-3 text-sm text-[#92400e]">
              Plataforma ainda não foi inicializada. Use{" "}
              <a href="/nimbus-setup" className="underline">
                /nimbus-setup
              </a>{" "}
              para criar o primeiro administrador.
            </div>
          )}
          {sp.error === "forbidden" && (
            <div className="mb-4 rounded-md border border-negative/20 bg-negative/10 p-3 text-sm text-negative">
              E-mail não autorizado.
            </div>
          )}
          <form action={adminLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail administrativo</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <Button type="submit" className="w-full">
              Enviar magic link
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
