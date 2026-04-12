"use server";

import { prisma } from "@/lib/prisma";
import { requireTenant } from "@/lib/tenant";
import { registerOrgSchema, roleArnSchema } from "@/lib/validations";
import { randomExternalId } from "@/lib/utils";
import { CONNECTOR_TYPES } from "@/lib/aws-cloudformation";
import { createAuditLog } from "@/lib/audit";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

const PAGE_PATH = "/app/integrations";

export async function addOrganization(formData: FormData) {
  const { tenant } = await requireTenant();
  const parsed = registerOrgSchema.safeParse({
    organizationName: formData.get("organizationName"),
    organizationId: formData.get("organizationId"),
    managementAccountId: formData.get("managementAccountId"),
  });
  if (!parsed.success) return;
  const { organizationName, organizationId, managementAccountId } = parsed.data;

  const platformAccountId =
    process.env.NIMBUS_PLATFORM_AWS_ACCOUNT_ID ?? "123456789012";

  const org = await prisma.awsOrganization.create({
    data: {
      tenantId: tenant.id,
      organizationName,
      organizationId,
      managementAccountId,
      organizationStatus: "pending",
    },
  });

  await prisma.integration.createMany({
    data: CONNECTOR_TYPES.map((connectorType) => ({
      tenantId: tenant.id,
      organizationId: org.id,
      connectorType,
      integrationMode: "read",
      externalId: randomExternalId(),
      trustPrincipalAccountId: platformAccountId,
      status: "pending",
      healthStatus: "unknown",
    })),
  });

  await createAuditLog({
    tenantId: tenant.id,
    entityType: "aws_organization",
    entityId: org.id,
    action: "organization.registered",
    actor: tenant.ownerUserId,
    module: "organizations",
    summary: `Registrou AWS Organization ${organizationName} (${organizationId})`,
    after: { organizationName, organizationId, managementAccountId },
  });

  revalidatePath(PAGE_PATH);
  redirect(PAGE_PATH);
}

export async function updateOrganization(formData: FormData) {
  const { tenant } = await requireTenant();
  const orgId = String(formData.get("orgId") ?? "");
  const parsed = registerOrgSchema.safeParse({
    organizationName: formData.get("organizationName"),
    organizationId: formData.get("organizationId"),
    managementAccountId: formData.get("managementAccountId"),
  });
  if (!parsed.success || !orgId) return;
  const { organizationName, organizationId, managementAccountId } = parsed.data;

  const org = await prisma.awsOrganization.findFirst({
    where: { id: orgId, tenantId: tenant.id },
  });
  if (!org) return;

  await prisma.awsOrganization.update({
    where: { id: org.id },
    data: { organizationName, organizationId, managementAccountId },
  });

  await createAuditLog({
    tenantId: tenant.id,
    entityType: "aws_organization",
    entityId: org.id,
    action: "organization.updated",
    actor: tenant.ownerUserId,
    module: "organizations",
    summary: `Atualizou AWS Organization ${organizationName}`,
    before: { organizationName: org.organizationName, organizationId: org.organizationId, managementAccountId: org.managementAccountId },
    after: { organizationName, organizationId, managementAccountId },
  });

  revalidatePath(PAGE_PATH);
  revalidatePath(`${PAGE_PATH}/${orgId}`);
}

export async function removeOrganization(formData: FormData) {
  const { tenant } = await requireTenant();
  const orgId = String(formData.get("orgId") ?? "");
  if (!orgId) return;

  const org = await prisma.awsOrganization.findFirst({
    where: { id: orgId, tenantId: tenant.id },
  });
  if (!org) return;

  await createAuditLog({
    tenantId: tenant.id,
    entityType: "aws_organization",
    entityId: org.id,
    action: "organization.removed",
    actor: tenant.ownerUserId,
    module: "organizations",
    summary: `Removeu AWS Organization ${org.organizationName}`,
    before: { organizationName: org.organizationName, organizationId: org.organizationId },
  });

  // Cascade deletes integrations, OUs, accounts
  await prisma.awsOrganization.delete({ where: { id: org.id } });

  revalidatePath(PAGE_PATH);
  redirect(PAGE_PATH);
}

export async function saveRoleArn(formData: FormData) {
  const { tenant } = await requireTenant();
  const parsed = roleArnSchema.safeParse({
    integrationId: formData.get("integrationId"),
    roleArn: formData.get("roleArn"),
  });
  if (!parsed.success) return;
  const { integrationId, roleArn } = parsed.data;

  const integration = await prisma.integration.findFirst({
    where: { id: integrationId, tenantId: tenant.id },
  });
  if (!integration) return;

  await prisma.integration.update({
    where: { id: integration.id },
    data: { roleArn },
  });

  await createAuditLog({
    tenantId: tenant.id,
    entityType: "integration",
    entityId: integrationId,
    action: "integration.role_arn_set",
    actor: tenant.ownerUserId,
    module: "integrations",
    summary: `Configurou Role ARN do conector ${integration.connectorType}`,
    before: { roleArn: integration.roleArn },
    after: { roleArn },
  });

  revalidatePath(PAGE_PATH);
  if (integration.organizationId) {
    revalidatePath(`${PAGE_PATH}/${integration.organizationId}`);
  }
}

export async function runHealthCheck(formData: FormData) {
  const { tenant } = await requireTenant();
  const integrationId = String(formData.get("integrationId") ?? "");
  const integration = await prisma.integration.findFirst({
    where: { id: integrationId, tenantId: tenant.id },
  });
  if (!integration) return;

  const t = await getTranslations("integrations");
  const ok = !!integration.roleArn;
  await prisma.integrationTestResult.create({
    data: {
      integrationId,
      status: ok ? "ok" : "error",
      serviceChecked: "sts:AssumeRole (simulated)",
      errorDetails: ok ? null : t("health_check_no_arn"),
    },
  });
  await prisma.integration.update({
    where: { id: integrationId },
    data: {
      status: ok ? "active" : "error",
      healthStatus: ok ? "healthy" : "error",
      lastSuccessfulCollection: ok ? new Date() : integration.lastSuccessfulCollection,
      lastError: ok ? null : t("health_check_arn_missing"),
    },
  });

  if (ok && integration.organizationId) {
    const existingOrg = await prisma.awsOrganization.findFirst({
      where: { id: integration.organizationId, tenantId: tenant.id },
    });
    if (existingOrg && existingOrg.organizationStatus === "pending") {
      await prisma.awsOrganization.update({
        where: { id: existingOrg.id },
        data: { organizationStatus: "active", discoveredAt: new Date() },
      });
      await prisma.organizationalUnit.create({
        data: {
          tenantId: tenant.id,
          organizationId: existingOrg.id,
          ouId: "ou-root-sim",
          name: "Root",
        },
      });
      await prisma.awsAccount.createMany({
        data: [
          {
            tenantId: tenant.id,
            organizationId: existingOrg.id,
            awsAccountId: existingOrg.managementAccountId,
            accountName: "Management",
            accountType: "management",
            status: "active",
          },
          {
            tenantId: tenant.id,
            organizationId: existingOrg.id,
            awsAccountId: "111111111111",
            accountName: "Production",
            accountType: "member",
            status: "active",
          },
          {
            tenantId: tenant.id,
            organizationId: existingOrg.id,
            awsAccountId: "222222222222",
            accountName: "Staging",
            accountType: "member",
            status: "active",
          },
        ],
      });
    }
    await prisma.dataFreshnessStatus.upsert({
      where: {
        tenantId_connectorType: {
          tenantId: tenant.id,
          connectorType: integration.connectorType,
        },
      },
      create: {
        tenantId: tenant.id,
        connectorType: integration.connectorType,
        lastCollectedAt: new Date(),
        lastConsolidatedAt: new Date(),
        freshnessStatus: "fresh",
      },
      update: {
        lastCollectedAt: new Date(),
        lastConsolidatedAt: new Date(),
        freshnessStatus: "fresh",
      },
    });
  }

  revalidatePath(PAGE_PATH);
  if (integration.organizationId) {
    revalidatePath(`${PAGE_PATH}/${integration.organizationId}`);
  }
}
