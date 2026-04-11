import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
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
import { ShieldAlert } from "lucide-react";
import { bootstrapSchema } from "@/lib/validations";

async function createFirstAdmin(formData: FormData) {
  "use server";
  const state = await prisma.platformSetupState.findFirst();
  if (state?.setupCompleted) {
    redirect("/admin/login");
  }

  const parsed = bootstrapSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
  });
  if (!parsed.success) redirect("/nimbus-setup?error=missing");
  const { name, email } = parsed.data;

  const [admin] = await prisma.$transaction([
    prisma.adminUser.upsert({
      where: { email },
      update: { name, role: "super_admin", status: "active" },
      create: { email, name, role: "super_admin", status: "active" },
    }),
    prisma.user.upsert({
      where: { email },
      update: { name },
      create: { email, name },
    }),
  ]);

  await prisma.platformSetupState.upsert({
    where: { id: state?.id ?? "bootstrap" },
    update: {
      setupCompleted: true,
      initialAdminUserId: admin.id,
      completedAt: new Date(),
    },
    create: {
      id: "bootstrap",
      setupCompleted: true,
      setupPath: "/nimbus-setup",
      initialAdminUserId: admin.id,
      completedAt: new Date(),
    },
  });

  await prisma.platformConfiguration.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      platformAwsAccountId:
        process.env.NIMBUS_PLATFORM_AWS_ACCOUNT_ID ?? "123456789012",
      externalIdStrategy: "per-integration",
      defaultRegion: "us-east-1",
      onboardingMode: "self-service",
      batchIntervalHours: 24,
    },
  });

  await prisma.auditLog.create({
    data: {
      entityType: "admin_user",
      entityId: admin.id,
      action: "platform.bootstrap",
      actor: admin.email,
      actorType: "admin",
    },
  });

  redirect("/nimbus-setup/done");
}

export default async function NimbusSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const state = await prisma.platformSetupState.findFirst();
  if (state?.setupCompleted) {
    notFound();
  }
  const sp = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1b3f] p-6">
      <Card className="w-full max-w-xl border-border">
        <CardHeader>
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <CardTitle className="mt-4">
            Bootstrap da plataforma Nimbus Frugal
          </CardTitle>
          <CardDescription>
            Este formulário aparece apenas uma vez. Ele cria o primeiro
            Administrador Geral e bloqueia permanentemente este caminho. Futuros
            administradores gerais só entrarão por convite.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sp.error && (
            <div className="mb-4 rounded-md border border-negative/20 bg-negative/10 p-3 text-sm text-negative">
              Preencha nome e e-mail para continuar.
            </div>
          )}
          <form action={createFirstAdmin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Administrador Geral</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Criar Administrador Geral e bloquear setup
            </Button>
            <p className="text-xs text-muted-foreground">
              Ao enviar, o setup é marcado como concluído. Você receberá um
              magic link para acessar /admin.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
