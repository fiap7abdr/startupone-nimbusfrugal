---
shaping: true
---

# Nimbus Frugal — Shaping

## Requirements (R)

| ID | Requirement | Status |
|----|-------------|--------|
| **R0** | Plataforma FinOps SaaS multi-tenant com onboarding self-service para AWS | Core goal |
| **R1** | **Autenticação e acesso** | Must-have |
| R1.1 | Magic link via Resend (sem senha) + Google OAuth | Must-have |
| R1.2 | 3 perfis: Admin Geral, Owner do Tenant, Read | Must-have |
| R1.3 | Bootstrap one-shot para criar primeiro Admin Geral (`/nimbus-setup`) | Must-have |
| R1.4 | Middleware protege rotas `/app/*` e `/admin/*` (exceto `/admin/login`) | Must-have |
| R1.5 | Signup cria apenas User (sem tenant); tenant criado em etapa separada | Must-have |
| **R2** | **Multi-tenancy** | Must-have |
| R2.1 | Usuario sem tenant e redirecionado para criar tenant apos login | Must-have |
| R2.2 | Slug unico por tenant | Must-have |
| R2.3 | Convites para membros com grupo owner/read via link com token | Must-have |
| R2.4 | Isolamento de dados por tenant em todas as entidades | Must-have |
| R2.5 | Usuario pode pertencer a multiplos tenants | Must-have |
| R2.6 | Tenant switcher no sidebar com cookie `active-tenant-id` | Must-have |
| R2.7 | Aceite de convite em `/invitations/[token]` (logado aceita direto; nao logado redireciona para login com callback) | Must-have |
| **R3** | **Onboarding AWS** | Must-have |
| R3.1 | Wizard registra AWS Organization (nome, ID, management account) | Must-have |
| R3.2 | Gera template CloudFormation com IAM Role + trust policy + External ID único | Must-have |
| R3.3 | Trust policy referencia AWS Account ID da plataforma Nimbus | Must-have |
| R3.4 | 7 conectores: Organizations, CUR, Cost Explorer, Cost Optimization Hub, Compute Optimizer, Trusted Advisor, SSM Explorer | Must-have |
| **R4** | **Integrações e health check** | Must-have |
| R4.1 | Listagem de integrações por tenant com status (pending/active/error/partial) | Must-have |
| R4.2 | Health check simula validação de Role ARN e cria IntegrationTestResult | Must-have |
| R4.3 | Health check ativa integração e descobre OUs/contas placeholder | Must-have |
| **R5** | **Visibilidade e dashboard** | Must-have |
| R5.1 | Dashboard consolidado com métricas e freshness de dados | Must-have |
| R5.2 | Árvore de OUs/contas descobertas por Organization | Must-have |
| R5.3 | Recomendações priorizadas (low/medium/high) com estimated savings | Must-have |
| R5.4 | Data freshness sempre exibido (fresh/stale/delayed/unknown) | Must-have |
| **R6** | **Admin global** | Must-have |
| R6.1 | Painel admin: overview, tenants, integrações, batches, admin-users | Must-have |
| R6.2 | Impersonation de tenant com reason e audit trail | Must-have |
| R6.3 | Convite de novos admins | Must-have |
| **R7** | **Billing** | Must-have |
| R7.1 | TRIAL: 90 dias, tudo ilimitado | Must-have |
| R7.2 | PRO: 0,5% do gasto mensal consolidado AWS | Nice-to-have |
| R7.3 | Status de billing: trial → active → past_due → canceled | Must-have |
| **R8** | **Coleta de dados** | Must-have |
| R8.1 | Batch assíncrono a cada 24h (não real-time) | Must-have |
| R8.2 | CollectionBatch com status (scheduled/running/success/failed/partial) | Must-have |
| R8.3 | Freshness delay calculado por conector | Must-have |

---

## Selected Shape: A — Next.js Full-Stack Monolith

Shape A was selected and implemented in the bootstrap phase.

### Parts

| Part | Mechanism | Flag |
|------|-----------|:----:|
| **A1** | **Auth & Access** — Auth.js v5 + Resend magic link, JWT strategy, PrismaAdapter. Middleware cookie-based (não importa auth.ts para manter middleware lean). AdminUser table separada de User. | |
| **A2** | **Multi-tenancy** — Tenant model com slug único. TenantMember com targetGroup (owner/read). TenantInvitation com token e expiração. Server-side `requireTenant()` / `requireAdmin()` helpers. | |
| **A3** | **AWS Onboarding** — Wizard 3-step em `/app/onboarding`. Server Action cria AwsOrganization + Integration (aws_organizations). `buildNimbusCloudFormationTemplate()` gera YAML com IAM Role, trust policy, External ID, permissões FinOps (ce, organizations, cost-optimization-hub, compute-optimizer, support, ssm). | |
| **A4** | **Integrações** — CRUD de Integration com 7 connectorTypes. Health check via Server Action: valida Role ARN → ativa integração → cria IntegrationTestResult → descobre OUs/contas placeholder → upsert DataFreshnessStatus. | |
| **A5** | **Dashboard & Visibilidade** — `/app/dashboard` com métricas consolidadas + freshness badges. `/app/organization` com árvore OUs/contas. `/app/recommendations` com lista priorizada. | |
| **A6** | **Admin Panel** — Route group `(protected)` com layout que chama `requireAdmin()`. Páginas: overview, tenants, integrations, batches, admin-users. `/admin/login` fora do group. | |
| **A7** | **Billing** — BillingSubscription criada no signup (TRIAL, 90 dias). Modelo usage_percent para PRO. `/app/settings` para billing e preferências. | ⚠️ |
| **A8** | **Coleta de Dados** — CollectionBatch model com scheduling. DataFreshnessStatus por conector por tenant. Cron job placeholder (não implementado real). | ⚠️ |
| **A9** | **Design System** — Tokens tipados em TS → CSS variables geradas automaticamente. Tailwind 4 `@theme inline`. shadcn-style components com cva. Storybook 8 react-vite. | |

---

## Fit Check: R × A

| Req | Requirement | Status | A |
|-----|-------------|--------|---|
| R0 | Plataforma FinOps SaaS multi-tenant com onboarding self-service | Core goal | ✅ |
| R1.1 | Magic link via Resend | Must-have | ✅ |
| R1.2 | 3 perfis: Admin Geral, Owner, Read | Must-have | ✅ |
| R1.3 | Bootstrap one-shot `/nimbus-setup` | Must-have | ✅ |
| R1.4 | Middleware protege rotas | Must-have | ✅ |
| R2.1 | Signup cria Tenant + Owner + TRIAL | Must-have | ✅ |
| R2.2 | Slug único | Must-have | ✅ |
| R2.3 | Convites para membros | Must-have | ✅ |
| R2.4 | Isolamento por tenant | Must-have | ✅ |
| R3.1 | Wizard registra AWS Organization | Must-have | ✅ |
| R3.2 | CloudFormation template com IAM Role | Must-have | ✅ |
| R3.3 | Trust policy com Account ID da Nimbus | Must-have | ✅ |
| R3.4 | 7 conectores | Must-have | ✅ |
| R4.1 | Listagem de integrações com status | Must-have | ✅ |
| R4.2 | Health check com IntegrationTestResult | Must-have | ✅ |
| R4.3 | Health check descobre OUs/contas | Must-have | ✅ |
| R5.1 | Dashboard consolidado + freshness | Must-have | ✅ |
| R5.2 | Árvore OUs/contas | Must-have | ✅ |
| R5.3 | Recomendações priorizadas | Must-have | ✅ |
| R5.4 | Data freshness sempre exibido | Must-have | ✅ |
| R6.1 | Painel admin completo | Must-have | ✅ |
| R6.2 | Impersonation com audit | Must-have | ✅ |
| R6.3 | Convite de admins | Must-have | ✅ |
| R7.1 | TRIAL 90 dias ilimitado | Must-have | ✅ |
| R7.2 | PRO 0,5% do gasto | Nice-to-have | ❌ |
| R7.3 | Status billing lifecycle | Must-have | ✅ |
| R8.1 | Batch 24h assíncrono | Must-have | ❌ |
| R8.2 | CollectionBatch com status | Must-have | ✅ |
| R8.3 | Freshness delay por conector | Must-have | ✅ |

**Notes:**
- A fails R7.2: cálculo real de 0,5% do gasto não implementado (A7 flagged ⚠️)
- A fails R8.1: cron job real para coleta diária não implementado (A8 flagged ⚠️)

---

## Current Implementation Status

### Implemented (Bootstrap Phase)
- Stack completa: Next.js 15.5, Prisma 6/Neon, Auth.js v5 Resend, Storybook 8 react-vite
- 18 entidades + 4 Auth.js synced no Neon
- Todas as rotas criadas (public, bootstrap, tenant app, admin)
- Design system com tokens tipados + CSS variables
- Deploy em produção: nimbus-frugal.vercel.app
- Git: main branch, single commit, github.com/fiap7abdr/startupone-nimbusfrugal

### Pending (Next Phases)
- **A7 ⚠️** Lógica real de cálculo PRO (0,5% do gasto)
- **A8 ⚠️** Cron job real para coleta diária AWS
- Coleta real de dados AWS (atualmente só cria Integration + health check simulado)
- Flow de accept invitation (`/invitations/:token`)
- Conexão GitHub ↔ Vercel para auto-deploy on push
