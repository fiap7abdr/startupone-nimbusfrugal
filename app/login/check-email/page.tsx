import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiteHeader } from "@/components/marketing/site-header";
import { SiteFooter } from "@/components/marketing/site-footer";
import { MailCheck } from "lucide-react";

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <section className="mx-auto max-w-md px-6 py-20">
          <Card>
            <CardHeader className="items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <MailCheck className="h-6 w-6" />
              </div>
              <CardTitle className="mt-4">Verifique seu e-mail</CardTitle>
              <CardDescription>
                Enviamos um link de acesso. Abra o e-mail e clique no link para
                continuar.
              </CardDescription>
            </CardHeader>
            <CardContent />
          </Card>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
