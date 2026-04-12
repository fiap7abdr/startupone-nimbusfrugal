import Image from "next/image";
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
import { getTranslations } from "next-intl/server";

async function adminLogin(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin || admin.status !== "active") {
    redirect("/admin/login?error=forbidden");
  }
  await signIn("resend", { email, redirectTo: "/admin" });
}

async function adminLoginWithGoogle() {
  "use server";
  await signIn("google", { redirectTo: "/admin" });
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const state = await prisma.platformSetupState.findFirst();
  const sp = await searchParams;
  const t = await getTranslations("admin");
  const tc = await getTranslations("common");
  const tauth = await getTranslations("auth");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1b3f] p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="items-center">
          <Image
            src="/logo-128.png"
            alt="Nimbus Frugal"
            width={80}
            height={80}
            className="mb-2"
          />
          <CardTitle className="mt-4">{t("login_title")}</CardTitle>
          <CardDescription>{t("login_desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          {!state?.setupCompleted && (
            <div className="mb-4 rounded-md border border-[#fbbf24]/30 bg-[#fef3c7] p-3 text-sm text-[#92400e]">
              {t("login_not_initialized")}{" "}
              <a href="/nimbus-setup" className="underline">
                {t("login_setup_path")}
              </a>{" "}
              {t("login_setup_suffix")}
            </div>
          )}
          {sp.error === "forbidden" && (
            <div className="mb-4 rounded-md border border-negative/20 bg-negative/10 p-3 text-sm text-negative">
              {t("login_unauthorized")}
            </div>
          )}
          <form action={adminLoginWithGoogle}>
            <Button type="submit" variant="outline" className="w-full">
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              {tauth("login_google")}
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">{tc("or")}</span>
            </div>
          </div>

          <form action={adminLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{tc("email")}</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <Button type="submit" className="w-full">
              {tauth("send_magic_link")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
