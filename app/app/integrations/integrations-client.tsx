"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitButton } from "@/components/ui/submit-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { addOrganization, removeOrganization } from "@/lib/integration-actions";
import {
  Plus,
  Trash2,
  Settings2,
  CheckCircle2,
  Circle,
  AlertCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface IntegrationSummary {
  status: string;
}

interface OrgData {
  id: string;
  organizationName: string;
  organizationId: string;
  managementAccountId: string;
  organizationStatus: string;
  integrations: IntegrationSummary[];
}

export function IntegrationsClient({ orgs }: { orgs: OrgData[] }) {
  const t = useTranslations("integrations");
  const tc = useTranslations("common");
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-4">
      {orgs.map((org) => (
        <OrgCard key={org.id} org={org} />
      ))}

      {showAddForm ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("add_org")}</CardTitle>
            <CardDescription>
              {t("add_org_desc")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={addOrganization} className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="organizationName">{t("org_name")}</Label>
                <Input id="organizationName" name="organizationName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organizationId">{t("org_id")}</Label>
                <Input
                  id="organizationId"
                  name="organizationId"
                  placeholder={t("org_id_placeholder")}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="managementAccountId">{t("mgmt_account")}</Label>
                <Input
                  id="managementAccountId"
                  name="managementAccountId"
                  placeholder={t("mgmt_placeholder")}
                  required
                />
              </div>
              <div className="flex items-center gap-2 md:col-span-3">
                <SubmitButton pendingText={t("registering")}>
                  {t("register_org")}
                </SubmitButton>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowAddForm(false)}
                >
                  {tc("cancel")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setShowAddForm(true)} variant="outline" className="w-full">
          <Plus className="mr-2 h-4 w-4" />
          {t("add_org")}
        </Button>
      )}
    </div>
  );
}

function OrgCard({ org }: { org: OrgData }) {
  const t = useTranslations("integrations");
  const tc = useTranslations("common");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const activeCount = org.integrations.filter((i) => i.status === "active").length;
  const totalCount = org.integrations.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {org.organizationName}
              <OrgStatusBadge status={org.organizationStatus} />
            </CardTitle>
            <CardDescription className="mt-1">
              Org ID: <span className="font-mono">{org.organizationId}</span> ·
              Management: <span className="font-mono">{org.managementAccountId}</span>
            </CardDescription>
          </div>

          <div className="flex items-center gap-1">
            <Button asChild variant="ghost" size="sm">
              <Link href={`/app/integrations/${org.id}`}>
                <Settings2 className="mr-2 h-4 w-4" />
                {t("configure")}
              </Link>
            </Button>

            <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setDeleteConfirm(""); }}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="text-negative hover:text-negative">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t("remove_org")}</DialogTitle>
                  <DialogDescription>
                    {t("remove_org_warning")} <strong>{org.organizationName}</strong> {t("remove_org_confirm")}
                  </DialogDescription>
                </DialogHeader>
                <Input
                  placeholder={org.organizationName}
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                />
                <DialogFooter>
                  <form action={removeOrganization}>
                    <input type="hidden" name="orgId" value={org.id} />
                    <SubmitButton
                      variant="destructive"
                      disabled={deleteConfirm !== org.organizationName}
                      pendingText={t("removing")}
                    >
                      {tc("delete")}
                    </SubmitButton>
                  </form>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-muted-foreground">
            {t("connectors_count")} <strong className="text-foreground">{activeCount}/{totalCount}</strong> {t("connectors_active")}
          </span>
          <div className="flex items-center gap-2">
            {org.integrations.map((i, idx) => (
              <StatusDot key={idx} status={i.status} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusDot({ status }: { status: string }) {
  if (status === "active") return <CheckCircle2 className="h-3.5 w-3.5 text-positive" />;
  if (status === "error") return <AlertCircle className="h-3.5 w-3.5 text-negative" />;
  return <Circle className="h-3.5 w-3.5 text-muted-foreground" />;
}

function OrgStatusBadge({ status }: { status: string }) {
  const t = useTranslations("integrations");
  if (status === "active") return <Badge variant="positive">{t("org_active")}</Badge>;
  return <Badge variant="muted">{status}</Badge>;
}
