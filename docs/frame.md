---
shaping: true
---

# Nimbus Frugal — Frame

## Source

> Plataforma FinOps SaaS multi-tenant para AWS com atualização diária e foco em visibilidade, priorização e governança operacional.
>
> Controle de custos em nuvem, inteligência para economizar.
>
> Nimbus Frugal roda em conta AWS própria. Cada tenant cria IAM Role na própria AWS via CloudFormation. Trust policy referencia o AWS Account ID da Nimbus com External ID único. Coleta assíncrona em batch a cada 24h. Dados não são real-time — freshness sempre exibido.
>
> Escopo inicial enxuto: Bootstrap, Landing/Signup, AWS Onboarding, Tenant App, Global Admin Panel.
> 3 perfis de acesso: Admin Geral, Owner do Tenant, Read.
> 18 entidades mínimas. 7 conectores iniciais.
>
> Pricing: TRIAL 90 dias tudo ilimitado; PRO 0,5% do gasto mensal consolidado AWS.

---

## Problem

Empresas que usam AWS não têm visibilidade centralizada e acionável sobre seus custos multi-conta. As ferramentas nativas da AWS (Cost Explorer, Trusted Advisor, Compute Optimizer) são fragmentadas, exigem navegação manual entre contas e não priorizam oportunidades de economia de forma unificada. Não existe uma camada SaaS acessível que consolide essas fontes, organize por Organization/OUs, e apresente recomendações priorizadas com freshness transparente.

## Outcome

Uma plataforma SaaS multi-tenant onde:

1. **Onboarding self-service** — tenant conecta sua AWS Organization via CloudFormation em minutos
2. **Visibilidade consolidada** — dashboard único com custos, recomendações e freshness de dados
3. **Priorização inteligente** — recomendações de economia agregadas de múltiplas fontes AWS, priorizadas por impacto
4. **Governança operacional** — árvore de OUs/contas, integrações com health check, audit log
5. **Admin global** — painel administrativo para gestão de tenants, batches e impersonation
6. **Modelo de negócio sustentável** — trial generoso (90 dias) + pricing baseado em uso (0,5% do gasto)
