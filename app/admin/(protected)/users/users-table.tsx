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
import { Trash2 } from "lucide-react";
import { deleteUser } from "@/lib/admin-actions";

interface Membership {
  id: string;
  tenantName: string;
  targetGroup: string;
}

interface UserRow {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: string;
  memberships: Membership[];
  isOwnerOfTenants: boolean;
  isSelf: boolean;
}

export function UsersTable({ users }: { users: UserRow[] }) {
  const t = useTranslations("admin");
  const tc = useTranslations("common");
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const userToDelete = users.find((u) => u.id === deletingId);

  async function handleDelete(userId: string) {
    await deleteUser(userId);
    setDeletingId(null);
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
            <th className="px-4 py-3 text-left">{t("col_user_name")}</th>
            <th className="px-4 py-3 text-left">{t("col_user_email")}</th>
            <th className="px-4 py-3 text-left">{t("col_user_tenants")}</th>
            <th className="px-4 py-3 text-left">{t("col_user_created")}</th>
            <th className="px-4 py-3 text-left">{t("col_actions")}</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-border">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt=""
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                      {(user.name ?? user.email).charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-medium">{user.name ?? "—"}</span>
                </div>
              </td>
              <td className="px-4 py-3 font-mono text-xs">{user.email}</td>
              <td className="px-4 py-3">
                {user.memberships.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {user.memberships.map((m) => (
                      <Badge key={m.id} variant="muted">
                        {m.tenantName}
                        <span className="ml-1 text-[10px] opacity-60">
                          ({m.targetGroup})
                        </span>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    {t("no_tenants")}
                  </span>
                )}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDate(user.createdAt)}
              </td>
              <td className="px-4 py-3">
                {!user.isSelf && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setDeletingId(user.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog
        open={deletingId !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingId(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("delete_user")}</DialogTitle>
            <DialogDescription>
              {t("delete_user_confirm")}{" "}
              <strong>{userToDelete?.name ?? userToDelete?.email}</strong>
              {t("delete_user_confirm_suffix")}
            </DialogDescription>
          </DialogHeader>
          {userToDelete?.isOwnerOfTenants && (
            <div className="rounded-md border border-negative/20 bg-negative/10 p-3 text-sm text-negative">
              {t("delete_user_is_owner")}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">{tc("cancel")}</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => deletingId && handleDelete(deletingId)}
            >
              {t("delete_user")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
