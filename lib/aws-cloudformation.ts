export function buildNimbusCloudFormationTemplate(params: {
  platformAccountId: string;
  externalId: string;
  roleName?: string;
}): string {
  const roleName = params.roleName ?? "NimbusFrugalReadRole";
  return `AWSTemplateFormatVersion: "2010-09-09"
Description: "Nimbus Frugal read-only cross-account role (External ID: ${params.externalId})"
Resources:
  NimbusFrugalRole:
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
      ManagedPolicyArns:
        - "arn:aws:iam::aws:policy/ReadOnlyAccess"
      Policies:
        - PolicyName: NimbusFrugalFinOpsRead
          PolicyDocument:
            Version: "2012-10-17"
            Statement:
              - Effect: Allow
                Action:
                  - "organizations:ListRoots"
                  - "organizations:ListOrganizationalUnitsForParent"
                  - "organizations:ListAccountsForParent"
                  - "organizations:DescribeOrganization"
                  - "ce:GetCostAndUsage"
                  - "ce:GetRightsizingRecommendation"
                  - "ce:GetReservationPurchaseRecommendation"
                  - "cost-optimization-hub:GetRecommendation"
                  - "cost-optimization-hub:ListRecommendations"
                  - "compute-optimizer:GetRecommendationSummaries"
                  - "compute-optimizer:GetEC2InstanceRecommendations"
                  - "support:DescribeTrustedAdvisorChecks"
                  - "support:DescribeTrustedAdvisorCheckResult"
                  - "ssm:GetOpsSummary"
                Resource: "*"
Outputs:
  RoleArn:
    Description: "Role ARN para registrar na Nimbus Frugal"
    Value: !GetAtt NimbusFrugalRole.Arn
`;
}
