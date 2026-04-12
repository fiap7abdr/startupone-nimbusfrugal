"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Loader2, RotateCcw, Check, Trash2 } from "lucide-react";
import { resendInvite, revokeInvite } from "@/lib/member-actions";

const COOLDOWN_MS = 5 * 60 * 1000; // 5 minutes

interface Invitation {
  id: string;
  email: string;
  token: string;
  targetGroup: string;
  status: string;
  expiresAt: string;
  lastSentAt: string;
  isRegistered: boolean;
}

function isInCooldown(lastSentAt: string) {
  return Date.now() - new Date(lastSentAt).getTime() < COOLDOWN_MS;
}

export function InvitationsTable({
  invitations,
}: {
  invitations: Invitation[];
}) {
  const t = useTranslations("users");
  const tc = useTranslations("common");
  const router = useRouter();
  const [resendingId, setResendingId] = useState<string | null>(null);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [, setTick] = useState(0);

  // Re-render every 30s to update cooldown state
  useEffect(() => {
    const hasCooldown = invitations.some((inv) => isInCooldown(inv.lastSentAt));
    if (!hasCooldown) return;
    const interval = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(interval);
  }, [invitations]);

  async function handleResend(invitationId: string) {
    setResendingId(invitationId);
    try {
      await resendInvite(invitationId);
      router.refresh();
    } finally {
      setResendingId(null);
    }
  }

  async function handleRevoke(invitationId: string) {
    await revokeInvite(invitationId);
    setRevokingId(null);
    router.refresh();
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString();
  }

  function formatDateTime(dateStr: string) {
    const d = new Date(dateStr);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }

  function getStatusInfo(inv: Invitation) {
    if (inv.isRegistered) {
      return { label: t("status_registered"), variant: "positive" as const };
    }
    if (inv.status === "revoked") {
      return { label: t("status_revoked"), variant: "negative" as const };
    }
    if (inv.status === "accepted") {
      return { label: t("status_accepted"), variant: "default" as const };
    }
    if (new Date(inv.expiresAt) < new Date()) {
      return { label: t("status_expired"), variant: "negative" as const };
    }
    return { label: t("status_pending"), variant: "muted" as const };
  }

  function canResend(inv: Invitation) {
    return (
      inv.status === "pending" &&
      !inv.isRegistered &&
      new Date(inv.expiresAt) >= new Date()
    );
  }

  function canRevoke(inv: Invitation) {
    return inv.status === "pending" && !inv.isRegistered;
  }

  const invToRevoke = invitations.find((inv) => inv.id === revokingId);

  return (
    <>
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-4 py-2 text-left">{tc("email")}</th>
            <th className="px-4 py-2 text-left">{t("col_group")}</th>
            <th className="px-4 py-2 text-left">{tc("status")}</th>
            <th className="px-4 py-2 text-left">{t("col_last_sent")}</th>
            <th className="px-4 py-2 text-left">{tc("expires")}</th>
            <th className="px-4 py-2 text-left">{t("col_actions")}</th>
          </tr>
        </thead>
        <tbody>
          {invitations.map((inv) => {
            const statusInfo = getStatusInfo(inv);
            const isResending = resendingId === inv.id;
            const cooldown = isInCooldown(inv.lastSentAt);

            return (
              <tr key={inv.id} className="border-t border-border">
                <td className="px-4 py-2">{inv.email}</td>
                <td className="px-4 py-2">
                  <Badge>{inv.targetGroup}</Badge>
                </td>
                <td className="px-4 py-2">
                  <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  {formatDateTime(inv.lastSentAt)}
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  {formatDate(inv.expiresAt)}
                </td>
                <td className="px-4 py-2">
                  <div className="flex items-center gap-1">
                    {canResend(inv) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        disabled={isResending || cooldown}
                        onClick={() => handleResend(inv.id)}
                      >
                        {isResending ? (
                          <>
                            <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                            {t("resending")}
                          </>
                        ) : cooldown ? (
                          <>
                            <Check className="mr-1.5 h-3.5 w-3.5 text-positive" />
                            {t("resent")}
                          </>
                        ) : (
                          <>
                            <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                            {t("resend_invite")}
                          </>
                        )}
                      </Button>
                    )}
                    {canRevoke(inv) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        onClick={() => setRevokingId(inv.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <Dialog
        open={revokingId !== null}
        onOpenChange={(open) => {
          if (!open) setRevokingId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("revoke_invite")}</DialogTitle>
            <DialogDescription>
              {t("revoke_confirm")}{" "}
              <strong>{invToRevoke?.email}</strong>
              {t("revoke_confirm_suffix")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">{tc("cancel")}</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => revokingId && handleRevoke(revokingId)}
            >
              {t("revoke_invite")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
