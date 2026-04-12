import { signIn } from "@/auth";
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
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import Link from "next/link";

async function loginWithEmail(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!email) return;
  await signIn("resend", { email, redirectTo: "/app" });
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-md px-6 py-20">
          <Card>
            <CardHeader>
              <CardTitle>Entrar na Nimbus Frugal</CardTitle>
              <CardDescription>
                Enviaremos um link de acesso para o seu e-mail.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form action={loginWithEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="voce@empresa.com"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Enviar magic link
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Não tem conta?{" "}
                  <Link
                    href="/signup"
                    className="font-medium text-primary hover:underline"
                  >
                    Criar uma
                  </Link>
                </p>
              </form>
            </CardContent>
          </Card>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
