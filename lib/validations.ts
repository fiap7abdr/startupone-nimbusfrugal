import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().trim().min(1).max(255),
  email: z.string().trim().toLowerCase().email().max(255),
});

export const createTenantSchema = z.object({
  name: z.string().trim().min(1).max(255),
});

export const registerOrgSchema = z.object({
  organizationName: z.string().trim().min(1).max(255),
  organizationId: z
    .string()
    .trim()
    .regex(/^o-[a-z0-9]{10,32}$/, "ID deve seguir formato o-xxxxxxxxxx"),
  managementAccountId: z
    .string()
    .trim()
    .regex(/^\d{12}$/, "Account ID deve ter 12 digitos"),
});

export const inviteUserSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
  group: z.enum(["owner", "read"]),
});

export const inviteAdminSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
});

export const roleArnSchema = z.object({
  integrationId: z.string().cuid(),
  roleArn: z
    .string()
    .trim()
    .regex(/^arn:aws:iam::\d{12}:role\/.+$/, "Formato ARN invalido"),
});

export const loginEmailSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(255),
});
