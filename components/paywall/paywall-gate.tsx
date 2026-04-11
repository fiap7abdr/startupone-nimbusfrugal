"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";

interface PaywallGateProps {
  hasAccess: boolean;
  children: React.ReactNode;
  featureName?: string;
}

export function PaywallGate({
  hasAccess,
  children,
  featureName = "esta funcionalidade",
}: PaywallGateProps) {
  if (hasAccess) return <>{children}</>;

  return (
    <Card className="mx-auto max-w-md border-border">
      <CardHeader className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent">
          <ShieldCheck className="h-6 w-6 text-accent-foreground" />
        </div>
        <CardTitle className="mt-4">Acesso restrito</CardTitle>
        <CardDescription>
          Seu trial expirou. Faça upgrade para PRO para continuar usando{" "}
          {featureName}.
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Button asChild className="w-full">
          <Link href="/app/settings">Fazer upgrade</Link>
        </Button>
        <p className="mt-3 text-xs text-muted-foreground">
          PRO: 0,5% do gasto mensal consolidado AWS
        </p>
      </CardContent>
    </Card>
  );
}
