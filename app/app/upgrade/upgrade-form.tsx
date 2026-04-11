"use client";

import { useState } from "react";
import { upgradeToPro } from "@/lib/billing-actions";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Crown, Building2, BarChart3, Shield } from "lucide-react";

export function UpgradeForm({ daysLeft }: { daysLeft: number }) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="space-y-6">
      {/* Current plan info */}
      {daysLeft > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          Voce tem <strong>{daysLeft} dias</strong> restantes no trial.
          Ao fazer upgrade, seu plano muda imediatamente para Pro.
        </div>
      )}

      {/* Pro plan card */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#F59E0B] to-[#F97316]">
              <Crown className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>Plano Pro</CardTitle>
              <CardDescription>
                <span className="text-2xl font-bold text-foreground">10%</span>{" "}
                da economia realizada
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Benefits */}
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">
              O que voce desbloqueia:
            </p>
            <ul className="space-y-2.5">
              <Benefit
                icon={Building2}
                text="Multiplas empresas — crie e alterne entre varias organizacoes"
              />
              <Benefit
                icon={BarChart3}
                text="Batches diarios consolidados e reprocessamento"
              />
              <Benefit
                icon={Shield}
                text="Workflow de acoes com owner, prioridade e auditoria"
              />
              <Benefit
                icon={Check}
                text="Excecoes com justificativa, aprovacao e expiracao"
              />
              <Benefit
                icon={Check}
                text="Sem limite de tempo — tudo do Trial, permanente"
              />
            </ul>
          </div>

          {/* Billing model explanation */}
          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <p className="text-sm font-semibold">Como funciona a cobranca</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ao fim de cada mes, somamos os <strong>estimated savings</strong> dos
              recursos identificados com potencial de economia na sua conta AWS.
              Cobramos <strong>10% desse valor</strong>. Voce so paga quando
              economiza.
            </p>
          </div>

          {/* Consent */}
          <label className="flex items-start gap-3 cursor-pointer rounded-lg border p-4 transition hover:bg-muted/30">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary accent-primary"
            />
            <span className="text-sm leading-relaxed">
              Li e concordo com o modelo de cobranca do plano Pro.
              Entendo que serei cobrado mensalmente em 10% dos estimated savings
              identificados nos meus recursos AWS.
            </span>
          </label>

          {/* Action */}
          <form action={upgradeToPro}>
            <SubmitButton
              disabled={!agreed}
              className="w-full bg-gradient-to-r from-[#F59E0B] to-[#F97316] text-white hover:opacity-90 disabled:opacity-50"
              size="lg"
              pendingText="Processando..."
            >
              <Crown className="mr-2 h-4 w-4" />
              Confirmar upgrade para Pro
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function Benefit({
  icon: Icon,
  text,
}: {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}) {
  return (
    <li className="flex items-start gap-2.5 text-sm">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#F59E0B]" />
      {text}
    </li>
  );
}
