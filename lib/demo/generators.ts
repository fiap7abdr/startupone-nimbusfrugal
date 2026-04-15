import { faker } from "@faker-js/faker";

type ConnectorStatus = "active" | "pending" | "error" | "inactive";

export interface DemoOrganizationSummary {
  id: string;
  organizationName: string;
  organizationId: string;
  managementAccountId: string;
  organizationStatus: string;
  integrations: { status: ConnectorStatus }[];
}

export interface DemoOU {
  id: string;
  ouId: string;
  name: string;
  parentOuId: string | null;
}

export interface DemoAccount {
  id: string;
  awsAccountId: string;
  accountName: string;
  ouId: string | null;
  accountType: "management" | "member";
  status: "active" | "suspended";
}

export interface DemoOrganizationFull {
  id: string;
  organizationName: string;
  organizationId: string;
  managementAccountId: string;
  organizationStatus: string;
  ous: DemoOU[];
  accounts: DemoAccount[];
}

export interface DemoRecommendation {
  id: string;
  source: string;
  awsAccountId: string | null;
  region: string | null;
  resourceId: string | null;
  recommendationType: string;
  priority: "low" | "medium" | "high";
  estimatedSavings: number | null;
  status: "open" | "in_progress" | "dismissed" | "applied";
  createdAt: Date;
}

const CONNECTOR_STATUSES: ConnectorStatus[] = ["active", "pending", "error", "inactive"];
const RECOMMENDATION_SOURCES = [
  "cost_optimization_hub",
  "compute_optimizer",
  "trusted_advisor",
];
const AWS_REGIONS = [
  "us-east-1",
  "us-west-2",
  "sa-east-1",
  "eu-west-1",
  "ap-southeast-2",
];
const RECOMMENDATION_TYPES = [
  "Rightsize EC2 instance",
  "Delete unattached EBS volume",
  "Purchase Savings Plan",
  "Stop idle RDS instance",
  "Enable S3 Intelligent-Tiering",
  "Remove unused Elastic IP",
  "Downsize over-provisioned Lambda",
  "Archive old CloudWatch logs",
  "Migrate gp2 volume to gp3",
  "Remove unused NAT Gateway",
];

function awsAccountId(): string {
  return faker.string.numeric(12);
}

function orgIdString(): string {
  return `o-${faker.string.alphanumeric({ length: 10, casing: "lower" })}`;
}

function ouIdString(): string {
  return `ou-${faker.string.alphanumeric({ length: 4, casing: "lower" })}-${faker.string.alphanumeric({ length: 8, casing: "lower" })}`;
}

function arrayOfSize<T>(min: number, max: number, fn: () => T): T[] {
  const n = faker.number.int({ min, max });
  return Array.from({ length: n }, fn);
}

export function generateOrganizationSummaries(): DemoOrganizationSummary[] {
  return arrayOfSize(1, 3, () => ({
    id: faker.string.uuid(),
    organizationName: faker.company.name(),
    organizationId: orgIdString(),
    managementAccountId: awsAccountId(),
    organizationStatus: faker.helpers.arrayElement(["active", "pending"]),
    integrations: Array.from({ length: 7 }, () => ({
      status: faker.helpers.arrayElement(CONNECTOR_STATUSES),
    })),
  }));
}

export function generateOrganizationsWithTree(): DemoOrganizationFull[] {
  return arrayOfSize(1, 3, () => {
    const managementId = awsAccountId();
    const rootOus = arrayOfSize(2, 4, () => ({
      id: faker.string.uuid(),
      ouId: ouIdString(),
      name: faker.helpers.arrayElement([
        "Production",
        "Staging",
        "Development",
        "Sandbox",
        "Security",
        "Data",
        "Platform",
        "FinOps",
      ]),
      parentOuId: null as string | null,
    }));

    const childOus = rootOus.flatMap((root) =>
      arrayOfSize(0, 2, () => ({
        id: faker.string.uuid(),
        ouId: ouIdString(),
        name: faker.helpers.arrayElement([
          "Workloads",
          "Shared Services",
          "Compliance",
          "Logging",
          "Backup",
        ]),
        parentOuId: root.ouId,
      })),
    );

    const allOus = [...rootOus, ...childOus];

    const managementAccount: DemoAccount = {
      id: faker.string.uuid(),
      awsAccountId: managementId,
      accountName: `${faker.company.name()} Management`,
      ouId: null,
      accountType: "management",
      status: "active",
    };

    const memberAccounts: DemoAccount[] = allOus.flatMap((ou) =>
      arrayOfSize(1, 4, () => ({
        id: faker.string.uuid(),
        awsAccountId: awsAccountId(),
        accountName: `${faker.company.buzzNoun()}-${faker.helpers.arrayElement(["prod", "stg", "dev", "ops"])}`,
        ouId: ou.ouId,
        accountType: "member" as const,
        status: faker.helpers.weightedArrayElement([
          { value: "active" as const, weight: 9 },
          { value: "suspended" as const, weight: 1 },
        ]),
      })),
    );

    return {
      id: faker.string.uuid(),
      organizationName: faker.company.name(),
      organizationId: orgIdString(),
      managementAccountId: managementId,
      organizationStatus: "active",
      ous: allOus,
      accounts: [managementAccount, ...memberAccounts],
    };
  });
}

export function generateRecommendations(): DemoRecommendation[] {
  return arrayOfSize(10, 30, () => ({
    id: faker.string.uuid(),
    source: faker.helpers.arrayElement(RECOMMENDATION_SOURCES),
    awsAccountId: awsAccountId(),
    region: faker.helpers.arrayElement(AWS_REGIONS),
    resourceId: `arn:aws:ec2:${faker.helpers.arrayElement(AWS_REGIONS)}::instance/i-${faker.string.alphanumeric({ length: 17, casing: "lower" })}`,
    recommendationType: faker.helpers.arrayElement(RECOMMENDATION_TYPES),
    priority: faker.helpers.weightedArrayElement([
      { value: "high" as const, weight: 2 },
      { value: "medium" as const, weight: 5 },
      { value: "low" as const, weight: 3 },
    ]),
    estimatedSavings: Number(
      faker.number.float({ min: 25, max: 8500, fractionDigits: 2 }).toFixed(2),
    ),
    status: faker.helpers.weightedArrayElement([
      { value: "open" as const, weight: 7 },
      { value: "in_progress" as const, weight: 2 },
      { value: "applied" as const, weight: 1 },
    ]),
    createdAt: faker.date.recent({ days: 30 }),
  }));
}
