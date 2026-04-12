"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Building2,
  Plus,
  Trash2,
  Users,
  ArrowRightLeft,
  Crown,
  Loader2,
} from "lucide-react";
import { createAdditionalTenant, deleteTenant } from "@/lib/billing-actions";

interface Company {
  id: string;
  name: string;
  slug: string;
  plan: string;
  role: string;
  memberCount: number;
  isOwner: boolean;
  createdAt: string;
}

export function CompaniesClient({
  companies,
  activeTenantId,
}: {
  companies: Company[];
  activeTenantId: string;
}) {
  const t = useTranslations("companies");
  const tc = useTranslations("common");
  const router = useRouter();
  const [switchingId, setSwitchingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmName, setConfirmName] = useState("");

  async function switchTo(tenantId: string) {
    setSwitchingId(tenantId);
    await fetch("/api/switch-tenant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tenantId }),
    });
    router.refresh();
  }

  const companyToDelete = companies.find((c) => c.id === deletingId);

  return (
    <div className="space-y-6">
      {/* Company list */}
      <div className="grid gap-4">
        {companies.map((c) => {
          const isActive = c.id === activeTenantId;
          const isSwitching = switchingId === c.id;
          return (
            <Card
              key={c.id}
              className={isActive ? "border-primary/50 bg-primary/5" : ""}
            >
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">{c.name}</p>
                      {isActive && (
                        <Badge variant="secondary" className="text-[10px]">
                          {tc("active")}
                        </Badge>
                      )}
                      {c.role === "owner" && (
                        <Badge variant="outline" className="text-[10px]">
                          <Crown className="mr-1 h-2.5 w-2.5" />
                          {t("owner")}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="font-mono">{c.slug}</span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {c.memberCount}{" "}
                        {c.memberCount === 1
                          ? t("member_singular")
                          : t("member_plural")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!isActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={switchingId !== null}
                      onClick={() => switchTo(c.id)}
                    >
                      {isSwitching ? (
                        <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <ArrowRightLeft className="mr-1.5 h-3.5 w-3.5" />
                      )}
                      {isSwitching ? t("switching") : t("switch_btn")}
                    </Button>
                  )}
                  {c.isOwner && companies.length > 1 && (
                    <Dialog
                      open={deletingId === c.id}
                      onOpenChange={(open) => {
                        if (!open) {
                          setDeletingId(null);
                          setConfirmName("");
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setDeletingId(c.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{t("delete_title")}</DialogTitle>
                          <DialogDescription>
                            {t("delete_warning")}{" "}
                            <strong>{companyToDelete?.name}</strong>{" "}
                            {t("delete_warning_suffix")}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label>
                              {t("delete_type")}{" "}
                              <strong>{companyToDelete?.name}</strong>{" "}
                              {t("delete_confirm_suffix")}
                            </Label>
                            <Input
                              value={confirmName}
                              onChange={(e) => setConfirmName(e.target.value)}
                              placeholder={companyToDelete?.name}
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <DialogClose asChild>
                              <Button variant="outline">{tc("cancel")}</Button>
                            </DialogClose>
                            <form
                              action={async () => {
                                await deleteTenant(c.id);
                                setDeletingId(null);
                                setConfirmName("");
                              }}
                            >
                              <SubmitButton
                                variant="destructive"
                                disabled={confirmName !== companyToDelete?.name}
                                pendingText={t("deleting")}
                              >
                                {t("delete_title")}
                              </SubmitButton>
                            </form>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add new company */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Plus className="h-4 w-4" />
            {t("new_company")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createAdditionalTenant} className="flex items-end gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="name">{t("company_name")}</Label>
              <Input
                id="name"
                name="name"
                placeholder="Acme FinOps"
                required
              />
            </div>
            <SubmitButton pendingText={t("creating")}>
              <Building2 className="mr-2 h-4 w-4" />
              {tc("create")}
            </SubmitButton>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
