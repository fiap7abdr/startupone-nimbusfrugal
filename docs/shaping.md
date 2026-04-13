---
shaping: true
---

# Nimbus Frugal — Shaping

## Requirements (R)

| ID | Requirement | Status |
|----|-------------|--------|
| **R0** | Plataforma FinOps SaaS multi-tenant com onboarding self-service para AWS | Core goal |
| **R1** | **Autenticação e acesso** | Must-have |
| R1.1 | Google OAuth como único provider de autenticação | Must-have |
| R1.2 | 3 perfis: Admin Geral, Owner do Tenant, Read | Must-have |
| R1.3 | Bootstrap one-shot via Google OAuth para criar primeiro Admin Geral (`/nimbus-setup`) | Must-have |
| R1.4 | Middleware protege rotas `/app/*` e `/admin/*` (exceto `/admin/login`) | Must-have |
| R1.5 | Signup cria apenas User (sem tenant); tenant criado em etapa separada | Must-have |
| **R2** | **Multi-tenancy** | Must-have |
| R2.1 | Usuário sem tenant é redirecionado para criar tenant após login | Must-have |
| R2.2 | Slug globalmente único por tenant (com sufixo aleatório) | Must-have |
| R2.3 | Convites para membros com grupo owner/read via link com token | Must-have |
| R2.4 | Isolamento de dados por tenant em todas as entidades | Must-have |
| R2.5 | Usuário pode pertencer a múltiplos tenants | Must-have |
| R2.6 | Tenant switcher no sidebar com cookie `active-tenant-id` | Must-have |
| R2.7 | Aceite de convite em `/invitations/[token]` com sign-out automático e flow de signup/login com callbackUrl | Must-have |
| R2.8 | Excluir convite remove membro do tenant se já cadastrado | Must-have |
| **R3** | **AWS Organizations e Integrações** | Must-have |
| R3.1 | Gerenciar múltiplas AWS Organizations (adicionar/editar/remover) em página única `/app/integrations` | Must-have |
| R3.2 | CloudFormation gerado por integração (por conector, não por org inteira) | Must-have |
| R3.3 | Trust policy referencia AWS Account ID da plataforma Nimbus | Must-have |
| R3.4 | 7 conectores: Organizations, CUR, Cost Explorer, Cost Optimization Hub, Compute Optimizer, Trusted Advisor, SSM Explorer | Must-have |
| R3.5 | Cada conector recebe Role ARN da conta admin delegada ou management | Must-have |
| **R4** | **Health check** | Must-have |
| R4.1 | Conectores exibidos dentro da sua AWS Organization (não em página separada) | Must-have |
| R4.2 | Health check simula validação de Role ARN e cria IntegrationTestResult | Must-have |
| R4.3 | Health check ativa integração e descobre OUs/contas placeholder | Must-have |
| **R5** | **Visibilidade e dashboard** | Must-have |
| R5.1 | Dashboard consolidado com métricas e freshness de dados | Must-have |
| R5.2 | Árvore de OUs/contas descobertas por Organization | Must-have |
| R5.3 | Recomendações priorizadas (low/medium/high) com estimated savings | Must-have |
| R5.4 | Data freshness sempre exibido (fresh/stale/delayed/unknown) | Must-have |
| **R6** | **Admin global** | Must-have |
| R6.1 | Painel admin: overview, tenants, integrações, batches, admin-users, usuários, auditoria | Must-have |
| R6.2 | Impersonation de tenant com reason e audit trail | Must-have |
| R6.3 | Convite de novos admins | Must-have |
| R6.4 | Gestão de usuários: listar todos os usuários, excluir usuário (cascade deleta tenants owned) | Must-have |
| **R7** | **Billing** | Must-have |
| R7.1 | TRIAL: 90 dias, tudo ilimitado | Must-have |
| R7.2 | PRO: ao fim do mês soma estimated savings dos recursos identificados com potencial de economia e cobra 10% desse valor | Must-have |
| R7.3 | Status de billing: trial → active → past_due → canceled | Must-have |
| **R8** | **Coleta de dados** | Must-have |
| R8.1 | Batch assíncrono a cada 24h (não real-time) | Must-have |
| R8.2 | CollectionBatch com status (scheduled/running/success/failed/partial) | Must-have |
| R8.3 | Freshness delay calculado por conector | Must-have |
| **R9** | **Auditoria** | Must-have |
| R9.1 | Audit log centralizado com módulo, resumo, before/after JSON em todas as ações | Must-have |
| R9.2 | Página de auditoria global no admin com filtros (módulo, ator, tipo de ator, ação, tenant, período) e paginação | Must-have |
| R9.3 | Página de auditoria por tenant com isolamento multi-tenant e filtros similares | Must-have |

---

## Selected Shape: A — Next.js Full-Stack Monolith

Shape A was selected and implemented in the bootstrap phase.

### Parts

| Part | Mechanism | Flag |
|------|-----------|:----:|
| **A1** | **Auth & Access** — Auth.js v5 + Google OAuth (único provider), JWT strategy, PrismaAdapter. Middleware cookie-based (não importa auth.ts para manter middleware lean < 1MB). AdminUser table separada de User. Bootstrap `/nimbus-setup` usa Google OAuth. | |
| **A2** | **Multi-tenancy** — Tenant model com slug único. TenantMember com targetGroup (owner/read). TenantInvitation com token e expiração. Server-side `requireTenant()` / `requireAdmin()` helpers. Invite accept com sign-out automático + `?flow=accept` para callback. Delete invite cascade remove membro se já cadastrado. | |
| **A3** | **AWS Organizations & Integrações** — Página única `/app/integrations` com CRUD de múltiplas AWS Organizations. Cada org lista seus 7 conectores com status, Role ARN, External ID. CloudFormation individual por conector via `buildConnectorCloudFormation()`. Registro de org cria 7 integrations via `createMany`. Remoção de org remove integrations em cascade. | |
| **A4** | **Health check por conector** — Server Action por conector dentro do contexto da org. Valida Role ARN → ativa integração → cria IntegrationTestResult → descobre OUs/contas → upsert DataFreshnessStatus. | |
| **A5** | **Dashboard & Visibilidade** — `/app/dashboard` com métricas consolidadas + freshness badges. `/app/organization` com árvore OUs/contas. `/app/recommendations` com lista priorizada. | |
| **A6** | **Admin Panel** — Route group `(protected)` com layout que chama `requireAdmin()`. Páginas: overview, tenants, integrations, batches, admin-users, users (com delete cascade), audit (global com filtros). `/admin/login` fora do group. | |
| **A7** | **Billing** — BillingSubscription criada no signup (TRIAL, 90 dias). Upgrade para PRO com consentimento. Job mensal que soma estimated savings das recomendações e cobra 10%. | ⚠️ |
| **A8** | **Coleta de Dados** — CollectionBatch model com scheduling. DataFreshnessStatus por conector por tenant. Cron job placeholder (não implementado real). | ⚠️ |
| **A9** | **Design System** — Tokens tipados em TS → CSS variables geradas automaticamente. Tailwind 4 `@theme inline`. shadcn-style components com cva. Storybook 8 react-vite. | |
| **A10** | **Auditoria** — `lib/audit.ts` centralizado com `createAuditLog()`. AuditLog com module, summary, beforeJson, afterJson, indexes por tenant+timestamp, actor+timestamp, module+timestamp. Páginas `/admin/audit` (global com filtros) e `/app/audit` (tenant-scoped). Sidebar links em ambos painéis. | |

---

## Fit Check: R × A

| Req | Requirement | Status | A |
|-----|-------------|--------|---|
| R0 | Plataforma FinOps SaaS multi-tenant com onboarding self-service para AWS | Core goal | ✅ |
| R1.1 | Google OAuth como único provider de autenticação | Must-have | ✅ |
| R1.2 | 3 perfis: Admin Geral, Owner do Tenant, Read | Must-have | ✅ |
| R1.3 | Bootstrap one-shot via Google OAuth para criar primeiro Admin Geral (`/nimbus-setup`) | Must-have | ✅ |
| R1.4 | Middleware protege rotas `/app/*` e `/admin/*` (exceto `/admin/login`) | Must-have | ✅ |
| R1.5 | Signup cria apenas User (sem tenant); tenant criado em etapa separada | Must-have | ✅ |
| R2.1 | Usuário sem tenant é redirecionado para criar tenant após login | Must-have | ✅ |
| R2.2 | Slug globalmente único por tenant (com sufixo aleatório) | Must-have | ✅ |
| R2.3 | Convites para membros com grupo owner/read via link com token | Must-have | ✅ |
| R2.4 | Isolamento de dados por tenant em todas as entidades | Must-have | ✅ |
| R2.5 | Usuário pode pertencer a múltiplos tenants | Must-have | ✅ |
| R2.6 | Tenant switcher no sidebar com cookie `active-tenant-id` | Must-have | ✅ |
| R2.7 | Aceite de convite em `/invitations/[token]` com sign-out automático e flow de signup/login com callbackUrl | Must-have | ✅ |
| R2.8 | Excluir convite remove membro do tenant se já cadastrado | Must-have | ✅ |
| R3.1 | Gerenciar múltiplas AWS Organizations (adicionar/editar/remover) em página única `/app/integrations` | Must-have | ✅ |
| R3.2 | CloudFormation gerado por integração (por conector, não por org inteira) | Must-have | ✅ |
| R3.3 | Trust policy referencia AWS Account ID da plataforma Nimbus | Must-have | ✅ |
| R3.4 | 7 conectores com roles least-privilege | Must-have | ✅ |
| R3.5 | Cada conector recebe Role ARN da conta admin delegada ou management | Must-have | ✅ |
| R4.1 | Conectores exibidos dentro da sua AWS Organization (não em página separada) | Must-have | ✅ |
| R4.2 | Health check simula validação de Role ARN e cria IntegrationTestResult | Must-have | ✅ |
| R4.3 | Health check ativa integração e descobre OUs/contas placeholder | Must-have | ✅ |
| R5.1 | Dashboard consolidado com métricas e freshness de dados | Must-have | ✅ |
| R5.2 | Árvore de OUs/contas descobertas por Organization | Must-have | ✅ |
| R5.3 | Recomendações priorizadas (low/medium/high) com estimated savings | Must-have | ✅ |
| R5.4 | Data freshness sempre exibido (fresh/stale/delayed/unknown) | Must-have | ✅ |
| R6.1 | Painel admin: overview, tenants, integrações, batches, admin-users, usuários, auditoria | Must-have | ✅ |
| R6.2 | Impersonation de tenant com reason e audit trail | Must-have | ✅ |
| R6.3 | Convite de novos admins | Must-have | ✅ |
| R6.4 | Gestão de usuários: listar todos os usuários, excluir usuário (cascade deleta tenants owned) | Must-have | ✅ |
| R7.1 | TRIAL: 90 dias, tudo ilimitado | Must-have | ✅ |
| R7.2 | PRO: ao fim do mês soma estimated savings dos recursos identificados com potencial de economia e cobra 10% desse valor | Must-have | ❌ |
| R7.3 | Status de billing: trial → active → past_due → canceled | Must-have | ✅ |
| R8.1 | Batch assíncrono a cada 24h (não real-time) | Must-have | ❌ |
| R8.2 | CollectionBatch com status (scheduled/running/success/failed/partial) | Must-have | ✅ |
| R8.3 | Freshness delay calculado por conector | Must-have | ✅ |
| R9.1 | Audit log centralizado com módulo, resumo, before/after JSON em todas as ações | Must-have | ✅ |
| R9.2 | Página de auditoria global no admin com filtros e paginação | Must-have | ✅ |
| R9.3 | Página de auditoria por tenant com isolamento multi-tenant e filtros similares | Must-have | ✅ |

**Notes:**
- A fails R7.2: job mensal que soma estimated savings das recomendações e cobra 10% não implementado (A7 flagged ⚠️)
- A fails R8.1: cron job real para coleta diária não implementado (A8 flagged ⚠️)

---

## Current Implementation Status

### Implemented
- Stack completa: Next.js 15.5, Prisma 6/Neon, Auth.js v5 (Google OAuth only), Storybook 8 react-vite
- 18+ entidades no Neon com indexes de auditoria
- Todas as rotas criadas (public, bootstrap, tenant app, admin)
- Design system com tokens tipados + CSS variables
- Deploy em produção: nimbusfrugal.cloud
- Git: main branch, github.com/fiap7abdr/startupone-nimbusfrugal
- Página única `/app/integrations` com gestão de múltiplas AWS Organizations e 7 conectores por org
- CloudFormation individual por conector com least-privilege
- Invite accept flow com sign-out + `?flow=accept` + callbackUrl propagation
- Delete invite com remoção de membro se já cadastrado
- Admin: gestão de usuários com delete cascade, auditoria global com filtros
- Tenant: auditoria scoped com filtros, sidebar com link de auditoria
- `lib/audit.ts` centralizado — todas as ações passam por `createAuditLog()`
- i18n: pt-BR e en completos para todos os módulos

### Pending (Next Phases)
- **A7 ⚠️** Job mensal de cálculo PRO (soma estimated savings das recomendações, cobra 10%)
- **A8 ⚠️** Cron job real para coleta diária AWS
- Coleta real de dados AWS (atualmente só cria Integration + health check simulado)
