export interface ConnectorRole {
  connectorType: string;
  roleName: string;
  externalId: string;
  actions: string[];
}

const CONNECTOR_POLICIES: Record<string, { roleSuffix: string; actions: string[] }> = {
  aws_organizations: {
    roleSuffix: "Organizations",
    actions: [
      "organizations:ListRoots",
      "organizations:ListOrganizationalUnitsForParent",
      "organizations:ListAccountsForParent",
      "organizations:DescribeOrganization",
      "organizations:DescribeAccount",
    ],
  },
  cur: {
    roleSuffix: "CUR",
    actions: [
      "cur:DescribeReportDefinitions",
      "cur:GetUsageReport",
      "s3:GetObject",
      "s3:ListBucket",
    ],
  },
  cost_explorer: {
    roleSuffix: "CostExplorer",
    actions: [
      "ce:GetCostAndUsage",
      "ce:GetCostForecast",
      "ce:GetDimensionValues",
      "ce:GetTags",
    ],
  },
  cost_optimization_hub: {
    roleSuffix: "CostOptHub",
    actions: [
      "cost-optimization-hub:ListRecommendations",
      "cost-optimization-hub:GetRecommendation",
      "cost-optimization-hub:ListRecommendationSummaries",
    ],
  },
  compute_optimizer: {
    roleSuffix: "ComputeOptimizer",
    actions: [
      "compute-optimizer:GetRecommendationSummaries",
      "compute-optimizer:GetEC2InstanceRecommendations",
      "compute-optimizer:GetAutoScalingGroupRecommendations",
      "compute-optimizer:GetEBSVolumeRecommendations",
      "compute-optimizer:GetLambdaFunctionRecommendations",
    ],
  },
  trusted_advisor: {
    roleSuffix: "TrustedAdvisor",
    actions: [
      "support:DescribeTrustedAdvisorChecks",
      "support:DescribeTrustedAdvisorCheckResult",
      "support:DescribeTrustedAdvisorCheckSummaries",
      "support:RefreshTrustedAdvisorCheck",
    ],
  },
  ssm_explorer: {
    roleSuffix: "SSMExplorer",
    actions: [
      "ssm:GetOpsSummary",
      "ssm:GetInventory",
      "ssm:DescribeInstanceInformation",
      "ec2:DescribeInstances",
    ],
  },
};

export const CONNECTOR_TYPES = Object.keys(CONNECTOR_POLICIES) as string[];

export function connectorRoleName(connectorType: string): string {
  const policy = CONNECTOR_POLICIES[connectorType];
  return policy ? `NimbusFrugal${policy.roleSuffix}Role` : "NimbusFrugalRole";
}

export function getConnectorRoles(params: {
  platformAccountId: string;
  connectors: { connectorType: string; externalId: string }[];
}): ConnectorRole[] {
  return params.connectors.map((c) => {
    const policy = CONNECTOR_POLICIES[c.connectorType];
    if (!policy) throw new Error(`Unknown connector: ${c.connectorType}`);
    return {
      connectorType: c.connectorType,
      roleName: `NimbusFrugal${policy.roleSuffix}Role`,
      externalId: c.externalId,
      actions: policy.actions,
    };
  });
}

export function buildConnectorCloudFormation(params: {
  platformAccountId: string;
  connectorType: string;
  externalId: string;
}): string {
  const policy = CONNECTOR_POLICIES[params.connectorType];
  if (!policy) throw new Error(`Unknown connector: ${params.connectorType}`);
  const roleName = `NimbusFrugal${policy.roleSuffix}Role`;
  const safeRoleName = roleName.replace(/[^a-zA-Z0-9]/g, "");
  const actionsYaml = policy.actions.map((a) => `                  - "${a}"`).join("\n");

  return `AWSTemplateFormatVersion: "2010-09-09"
Description: "Nimbus Frugal — IAM Role for ${params.connectorType} (least privilege)"

Resources:
  ${safeRoleName}:
    Type: AWS::IAM::Role
    Properties:
      RoleName: ${roleName}
      AssumeRolePolicyDocument:
        Version: "2012-10-17"
        Statement:
          - Effect: Allow
            Principal:
              AWS: "arn:aws:iam::${params.platformAccountId}:root"
            Action: "sts:AssumeRole"
            Condition:
              StringEquals:
                sts:ExternalId: "${params.externalId}"
      Policies:
        - PolicyName: ${roleName}Policy
          PolicyDocument:
            Version: "2012-10-17"
            Statement:
              - Effect: Allow
                Action:
${actionsYaml}
                Resource: "*"

Outputs:
  ${safeRoleName}Arn:
    Description: "Role ARN for ${params.connectorType}"
    Value: !GetAtt ${safeRoleName}.Arn
`;
}

export function buildNimbusCloudFormationTemplate(params: {
  platformAccountId: string;
  connectors: { connectorType: string; externalId: string }[];
}): string {
  const roles = getConnectorRoles(params);

  const resources = roles
    .map((role) => {
      const actionsYaml = role.actions.map((a) => `                  - "${a}"`).join("\n");
      return `  ${role.roleName.replace(/[^a-zA-Z0-9]/g, "")}:
    Type: AWS::IAM::Role
    Properties:
      RoleName: ${role.roleName}
      AssumeRolePolicyDocument:
        Version: "2012-10-17"
        Statement:
          - Effect: Allow
            Principal:
              AWS: "arn:aws:iam::${params.platformAccountId}:root"
            Action: "sts:AssumeRole"
            Condition:
              StringEquals:
                sts:ExternalId: "${role.externalId}"
      Policies:
        - PolicyName: ${role.roleName}Policy
          PolicyDocument:
            Version: "2012-10-17"
            Statement:
              - Effect: Allow
                Action:
${actionsYaml}
                Resource: "*"`;
    })
    .join("\n\n");

  const outputs = roles
    .map(
      (role) => `  ${role.roleName.replace(/[^a-zA-Z0-9]/g, "")}Arn:
    Description: "Role ARN for ${role.connectorType}"
    Value: !GetAtt ${role.roleName.replace(/[^a-zA-Z0-9]/g, "")}.Arn`,
    )
    .join("\n\n");

  return `AWSTemplateFormatVersion: "2010-09-09"
Description: "Nimbus Frugal — IAM Roles cross-account (least privilege, 1 role per connector)"

Resources:
${resources}

Outputs:
${outputs}
`;
}
