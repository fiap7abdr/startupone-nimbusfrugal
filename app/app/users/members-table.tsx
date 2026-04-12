"use client";

import { useState } from "react";
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
import { Trash2, ArrowRightLeft } from "lucide-react";
import { removeMember, changeMemberRole } from "@/lib/member-actions";

interface Member {
  id: string;
  userId: string;
  targetGroup: string;
  membershipStatus: string;
  joinedAt: string;
  userName: string | null;
  userEmail: string;
}

export function MembersTable({
  members,
  currentUserId,
  isOwner,
}: {
  members: Member[];
  currentUserId: string;
  isOwner: boolean;
}) {
  const t = useTranslations("users");
  const tc = useTranslations("common");
  const router = useRouter();
  const [removingId, setRemovingId] = useState<string | null>(null);
  const memberToRemove = members.find((m) => m.id === removingId);

  async function handleRemove(memberId: string) {
    await removeMember(memberId);
    setRemovingId(null);
    router.refresh();
  }

  async function handleChangeRole(memberId: string, currentRole: string) {
    const newRole = currentRole === "owner" ? "read" : "owner";
    await changeMemberRole(memberId, newRole);
    router.refresh();
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString();
  }

  return (
    <>
      <table className="w-full text-sm">
        <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-4 py-2 text-left">{t("col_user")}</th>
            <th className="px-4 py-2 text-left">{t("col_group")}</th>
            <th className="px-4 py-2 text-left">{tc("status")}</th>
            <th className="px-4 py-2 text-left">{t("col_joined")}</th>
            {isOwner && (
              <th className="px-4 py-2 text-left">{t("col_actions")}</th>
            )}
          </tr>
        </thead>
        <tbody>
          {members.map((m) => {
            const isSelf = m.userId === currentUserId;
            return (
              <tr key={m.id} className="border-t border-border">
                <td className="px-4 py-2">
                  <p className="font-medium">
                    {m.userName ?? "—"}
                    {isSelf && (
                      <span className="ml-1.5 text-xs text-muted-foreground">
                        ({t("you_label")})
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">{m.userEmail}</p>
                </td>
                <td className="px-4 py-2">
                  <Badge>{m.targetGroup}</Badge>
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  {m.membershipStatus}
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  {formatDate(m.joinedAt)}
                </td>
                {isOwner && (
                  <td className="px-4 py-2">
                    {!isSelf && (
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          title={t("change_role")}
                          onClick={() => handleChangeRole(m.id, m.targetGroup)}
                        >
                          <ArrowRightLeft className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title={t("remove_member")}
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setRemovingId(m.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      <Dialog
        open={removingId !== null}
        onOpenChange={(open) => {
          if (!open) setRemovingId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("remove_member")}</DialogTitle>
            <DialogDescription>
              {t("remove_confirm")}{" "}
              <strong>{memberToRemove?.userName ?? memberToRemove?.userEmail}</strong>{" "}
              {t("remove_confirm_suffix")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">{tc("cancel")}</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => removingId && handleRemove(removingId)}
            >
              {t("remove_member")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
