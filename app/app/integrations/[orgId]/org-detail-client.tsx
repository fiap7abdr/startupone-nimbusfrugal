"use client";

import { useState } from "react";
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
  updateOrganization,
  saveRoleArn,
  runHealthCheck,
} from "@/lib/integration-actions";
import { connectorLabel, formatDate } from "@/lib/utils";
import { connectorRoleName, buildConnectorCloudFormation } from "@/lib/aws-cloudformation";
import {
  Pencil,
  CheckCircle2,
  Circle,
  AlertCircle,
  FileCode,
} from "lucide-react";
import { useTranslations } from "next-intl";

interface IntegrationData {
  id: string;
  connectorType: string;
  status: string;
  healthStatus: string;
  roleArn: string | null;
  externalId: string;
  trustPrincipalAccountId: string;
  lastError: string | null;
  lastSuccessfulCollection: string | null;
}

interface OrgData {
  id: string;
  organizationName: string;
  organizationId: string;
  managementAccountId: string;
  organizationStatus: string;
  integrations: IntegrationData[];
}

export function OrgDetailClient({
  org,
  platformAccountId,
}: {
  org: OrgData;
  platformAccountId: string;
}) {
  const t = useTranslations("integrations");
  const tc = useTranslations("common");
  const [editing, setEditing] = useState(false);
  const activeCount = org.integrations.filter((i) => i.status === "active").length;
  const totalCount = org.integrations.length;

  return (
    <div className="space-y-6">
      {/* Org details card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                {t("org_data")}
                <OrgStatusBadge status={org.organizationStatus} />
              </CardTitle>
              <CardDescription>
                {t("connectors_title")}: <strong>{activeCount}/{totalCount}</strong> {t("connectors_active")}
              </CardDescription>
            </div>
            {!editing && (
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
                <Pencil className="mr-2 h-4 w-4" />
                {tc("edit")}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {editing ? (
            <form
              action={async (formData) => {
                await updateOrganization(formData);
                setEditing(false);
              }}
              className="grid gap-4 md:grid-cols-3"
            >
              <input type="hidden" name="orgId" value={org.id} />
              <div className="space-y-2">
                <Label htmlFor="organizationName">{t("org_name")}</Label>
                <Input
                  id="organizationName"
                  name="organizationName"
                  defaultValue={org.organizationName}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organizationId">{t("org_id")}</Label>
                <Input
                  id="organizationId"
                  name="organizationId"
                  defaultValue={org.organizationId}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="managementAccountId">{t("management_account")}</Label>
                <Input
                  id="managementAccountId"
                  name="managementAccountId"
                  defaultValue={org.managementAccountId}
                  required
                />
              </div>
              <div className="flex items-center gap-2 md:col-span-3">
                <SubmitButton pendingText={tc("saving")}>
                  {tc("save")}
                </SubmitButton>
                <Button type="button" variant="ghost" onClick={() => setEditing(false)}>
                  {tc("cancel")}
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid gap-3 text-sm md:grid-cols-3">
              <InfoRow label={tc("name")} value={org.organizationName} />
              <InfoRow label="Organization ID" value={org.organizationId} mono />
              <InfoRow label={t("management_account")} value={org.managementAccountId} mono />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Connectors */}
      <h2 className="text-lg font-semibold">{t("connectors_title")}</h2>

      {org.integrations.map((integration) => (
        <ConnectorCard
          key={integration.id}
          integration={integration}
          platformAccountId={platformAccountId}
        />
      ))}
    </div>
  );
}

function ConnectorCard({
  integration,
  platformAccountId,
}: {
  integration: IntegrationData;
  platformAccountId: string;
}) {
  const t = useTranslations("integrations");
  const tc = useTranslations("common");
  const [showCf, setShowCf] = useState(false);
  const roleName = connectorRoleName(integration.connectorType);

  const cfTemplate = buildConnectorCloudFormation({
    platformAccountId,
    connectorType: integration.connectorType,
    externalId: integration.externalId,
  });

  const isActive = integration.status === "active";
  const isError = integration.status === "error";

  return (
    <Card className={isActive ? "border-positive/30" : isError ? "border-negative/30" : ""}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <StatusIcon status={integration.status} />
            <div>
              <CardTitle className="text-base">
                {connectorLabel(integration.connectorType)}
              </CardTitle>
              <CardDescription>
                {t("role_label")} <span className="font-mono">{roleName}</span> · {t("health_label")} {integration.healthStatus}
              </CardDescription>
            </div>
          </div>
          <ConnectorBadge status={integration.status} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid gap-3 text-sm md:grid-cols-3">
          <InfoRow label={t("external_id")} value={integration.externalId} mono />
          <InfoRow label={t("trust_principal")} value={integration.trustPrincipalAccountId} mono />
          <InfoRow label={t("last_collection")} value={formatDate(integration.lastSuccessfulCollection)} />
        </div>

        <form action={saveRoleArn} className="flex flex-col gap-3 md:flex-row md:items-end">
          <input type="hidden" name="integrationId" value={integration.id} />
          <div className="flex-1 space-y-2">
            <Label htmlFor={`role-${integration.id}`}>{t("role_arn")}</Label>
            <Input
              id={`role-${integration.id}`}
              name="roleArn"
              defaultValue={integration.roleArn ?? ""}
              placeholder={`${t("role_arn_placeholder")}${roleName}`}
            />
          </div>
          <SubmitButton variant="outline" pendingText={tc("saving")}>
            {tc("save")}
          </SubmitButton>
        </form>

        <div className="flex items-center gap-2">
          <form action={runHealthCheck}>
            <input type="hidden" name="integrationId" value={integration.id} />
            <SubmitButton pendingText={t("checking")}>
              {t("health_check")}
            </SubmitButton>
          </form>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowCf(!showCf)}
          >
            <FileCode className="mr-2 h-4 w-4" />
            {showCf ? t("hide_cf") : t("show_cf")}
          </Button>
        </div>

        {showCf && (
          <pre className="overflow-x-auto rounded-md border border-border bg-[#0f172a] p-4 text-xs text-white">
            {cfTemplate}
          </pre>
        )}

        {integration.lastError && (
          <p className="text-xs text-negative">{t("last_error")} {integration.lastError}</p>
        )}
      </CardContent>
    </Card>
  );
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={mono ? "font-mono text-sm break-all" : "text-sm"}>{value}</p>
    </div>
  );
}

function StatusIcon({ status }: { status: string }) {
  if (status === "active") return <CheckCircle2 className="h-5 w-5 shrink-0 text-positive" />;
  if (status === "error") return <AlertCircle className="h-5 w-5 shrink-0 text-negative" />;
  return <Circle className="h-5 w-5 shrink-0 text-muted-foreground" />;
}

function ConnectorBadge({ status }: { status: string }) {
  const variant =
    status === "active" ? "positive" : status === "error" ? "negative" : "muted";
  return <Badge variant={variant}>{status}</Badge>;
}

function OrgStatusBadge({ status }: { status: string }) {
  const t = useTranslations("integrations");
  if (status === "active") return <Badge variant="positive">{t("org_active")}</Badge>;
  return <Badge variant="muted">{status}</Badge>;
}
