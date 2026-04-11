import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export default function SetupDonePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f1b3f] p-6">
      <Card className="w-full max-w-xl border-border">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-positive/20 text-positive">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <CardTitle className="mt-4">Setup concluido!</CardTitle>
          <CardDescription>
            O Administrador Geral foi criado com sucesso. Este caminho
            (/nimbus-setup) esta agora bloqueado permanentemente.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="mb-6 text-sm text-muted-foreground">
            Faca login no painel administrativo para continuar a configuracao da
            plataforma.
          </p>
          <Button asChild className="w-full" size="lg">
            <Link href="/admin/login">Acessar painel admin</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
