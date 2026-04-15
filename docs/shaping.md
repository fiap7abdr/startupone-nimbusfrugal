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
| 🟡 R1.2 | 3 perfis: Admin Global, Owner do Tenant, Read | Must-have |
| 🟡 R1.3 | Bootstrap one-shot via Google OAuth para criar primeiro Admin Global (`/nimbus-setup`) | Must-have |
| R1.4 | Middleware protege rotas `/app/*` e `/admin/*` (exceto `/admin/login`) | Must-have |
| R1.5 | Signup cria apenas User (sem tenant); tenant criado em etapa separada | Must-have |
| 🟡 R1.6 | Tentativa de acesso a `/admin/*` por não-admin encerra a sessão (signOut) e redireciona a `/admin/login?error=forbidden` | Must-have |
| 🟡 R1.7 | Botão de criação de tenant em `/new-tenant` previne duplo clique via `useFormStatus` | Must-have |
| 🟡 R1.8 | Todo botão que dispara Server Action ou mutação usa guard anti-duplo-clique (`SubmitButton`/`useFormStatus` ou `useTransition` com `disabled={pending}`) | Must-have |
| 🟡 R1.9 | Sidebar do app e do admin exibem o usuário logado (nome/email) no topo | Must-have |
| **R2** | **Multi-tenancy** | Must-have |
| R2.1 | Usuário sem tenant é redirecionado para criar tenant após login | Must-have |
| R2.2 | Slug globalmente único por tenant (com sufixo aleatório) | Must-have |
| R2.3 | Convites para membros com grupo owner/read via link com token | Must-have |
| R2.4 | Isolamento de dados por tenant em todas as entidades | Must-have |
| R2.5 | Usuário pode pertencer a múltiplos tenants | Must-have |
| R2.6 | Tenant switcher no sidebar com cookie `active-tenant-id` | Must-have |
| R2.7 | Aceite de convite em `/invitations/[token]` com sign-out automático e flow de signup/login com callbackUrl | Must-have |
| R2.8 | Excluir convite remove membro do tenant se já cadastrado | Must-have |
| 🟡 R2.9 | Link de convite é rota pública; botão "Aceitar Convite" dispara Google OAuth direto; após autenticação usuário é levado a `/app/dashboard` do tenant convidado | Must-have |
| 🟡 R2.10 | Se usuário logado tem email diferente do convite, página força logout antes de aceitar | Must-have |
| 🟡 R2.11 | Se usuário logado tem email igual ao convite, página exibe Aceitar/Recusar sem relogar; Recusar marca convite como `declined` e grava audit | Must-have |
| 🟡 R2.12 | Se o email convidado já é usuário da plataforma (mas não está logado), página exibe prompt "Você já tem conta" antes do OAuth | Must-have |
| 🟡 R2.13 | Somente owner do tenant pode excluir convite (server-side + UI esconde botão) | Must-have |
| 🟡 R2.14 | Dashboard do tenant exibe convites pendentes para outros tenants do usuário logado (com Aceitar/Recusar inline) | Must-have |
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
| 🟡 R9.4 | Eventos de autenticação (`login_success`, `login_failure`, `logout`) registrados no audit log com método (ex.: `google_oauth`), userId, email, nome | Must-have |
| 🟡 R9.5 | Auditoria do tenant inclui eventos de auth de usuários membros do tenant (isolamento multi-tenant preservado) | Must-have |
| 🟡 **R10** | **Modo demo** | Must-have |
| 🟡 R10.1 | Toggle por tenant para alternar entre dados reais e dados fake nas páginas de Integrações AWS, Organizações e Recomendações | Must-have |
| 🟡 R10.2 | Múltiplos cenários fake possíveis (dados variam a cada render via `@faker-js/faker`) | Must-have |
| 🟡 R10.3 | Mutações bloqueadas enquanto modo demo estiver ativo (não persistir dados simulados) | Must-have |
| 🟡 R10.4 | Badge visual "Modo demo" nas páginas afetadas quando ativo | Must-have |
| 🟡 R10.5 | Após criar tenant, usuário é levado a `/app/settings?welcome=1` com diálogo convidando a ativar o modo demo | Must-have |

---

## Selected Shape: A — Next.js Full-Stack Monolith

Shape A was selected and implemented in the bootstrap phase.

### Parts

| Part | Mechanism | Flag |
|------|-----------|:----:|
| 🟡 **A1** | **Auth & Access** — Auth.js v5 + Google OAuth (único provider), JWT strategy, PrismaAdapter. Middleware cookie-based (não importa auth.ts para manter middleware lean < 1MB). AdminUser table separada de User. Bootstrap `/nimbus-setup` usa Google OAuth. Rota `/admin/forbidden` (Route Handler) executa `signOut({ redirectTo: "/admin/login?error=forbidden" })`; `requireAdmin()` em `lib/tenant.ts` redireciona para ela quando user não é AdminUser ativo. | |
| 🟡 **A2** | **Multi-tenancy** — Tenant model com slug único. TenantMember com targetGroup (owner/read). TenantInvitation com token/status (pending/accepted/declined/revoked) e expiração. Server-side `requireTenant()` / `requireAdmin()` helpers. `deleteInvite` exige `tenant.ownerUserId === user.id`; UI esconde botão para não-owners. Invite flow em `/invitations/[token]` (público): (a) email logado ≠ convite → redirect `/logout`; (b) email logado = convite → UI inline Aceitar/Recusar; (c) não logado + email já usuário → prompt "Você já tem conta" + OAuth; (d) não logado + email novo → OAuth cria conta. Route Handlers: `/accept` cria TenantMember, marca `accepted`, seta cookie `active-tenant-id`, redireciona `/app/dashboard`; `/decline` marca `declined` + audit; `/logout` faz signOut. | |
| **A3** | **AWS Organizations & Integrações** — Página única `/app/integrations` com CRUD de múltiplas AWS Organizations. Cada org lista seus 7 conectores com status, Role ARN, External ID. CloudFormation individual por conector via `buildConnectorCloudFormation()`. Registro de org cria 7 integrations via `createMany`. Remoção de org remove integrations em cascade. | |
| **A4** | **Health check por conector** — Server Action por conector dentro do contexto da org. Valida Role ARN → ativa integração → cria IntegrationTestResult → descobre OUs/contas → upsert DataFreshnessStatus. | |
| 🟡 **A5** | **Dashboard & Visibilidade** — `/app/dashboard` com métricas consolidadas + freshness badges. Query extra `TenantInvitation.findMany({ email: user.email, status: "pending", expiresAt > now, tenantId != tenant.id })` renderiza card de convites pendentes com links diretos a `/invitations/[token]/accept` e `/decline`. `/app/organization` com árvore OUs/contas. `/app/recommendations` com lista priorizada. | |
| **A6** | **Admin Panel** — Route group `(protected)` com layout que chama `requireAdmin()`. Páginas: overview, tenants, integrations, batches, admin-users, users (com delete cascade), audit (global com filtros). `/admin/login` fora do group. | |
| **A7** | **Billing** — BillingSubscription criada no signup (TRIAL, 90 dias). Upgrade para PRO com consentimento. Job mensal que soma estimated savings das recomendações e cobra 10%. | ⚠️ |
| **A8** | **Coleta de Dados** — CollectionBatch model com scheduling. DataFreshnessStatus por conector por tenant. Cron job placeholder (não implementado real). | ⚠️ |
| **A9** | **Design System** — Tokens tipados em TS → CSS variables geradas automaticamente. Tailwind 4 `@theme inline`. shadcn-style components com cva. Storybook 8 react-vite. | |
| **A10** | **Auditoria** — `lib/audit.ts` centralizado com `createAuditLog()`. AuditLog com module, summary, beforeJson, afterJson, indexes por tenant+timestamp, actor+timestamp, module+timestamp. Páginas `/admin/audit` (global com filtros) e `/app/audit` (tenant-scoped). Sidebar links em ambos painéis. | |
| 🟡 **A11** | **Audit de autenticação** — `auth.ts` com `events.signIn`/`events.signOut` chamando `createAuditLog` (module="auth", action=`login_success`/`logout`, metadata com `method: google_oauth`, name, isNewUser). `lib/auth-actions.ts` captura exceções do `signIn` (preservando `RedirectError`) para registrar `login_failure`. Query da auditoria do tenant: `OR [{ tenantId }, { module: "auth", actor: { in: memberIds } }]` via lookup em `tenantMember`. | |
| 🟡 **A12** | **Modo demo** — coluna `Tenant.demoMode` (Boolean). Geradores em `lib/demo/generators.ts` com `@faker-js/faker` produzindo orgs/OUs/contas/conectores e recomendações variadas a cada render. Pages `/app/integrations`, `/app/organization`, `/app/recommendations` ramificam em `tenant.demoMode`. `lib/demo/guard.ts#assertNotDemo()` protege `integration-actions.ts` contra mutações. Toggle em `/app/settings` via `lib/demo/actions.ts#toggleDemoMode`. `<DemoBadge/>` exibido no PageHeader das páginas afetadas. `WelcomeDialog` em `/app/settings` abre quando `searchParams.welcome === "1" && !tenant.demoMode`; `createTenant` em `/new-tenant` redireciona para `/app/settings?welcome=1` após criação. | |
| 🟡 **A13** | **UX anti-duplo-clique global** — `components/ui/submit-button.tsx` reutilizável com `useFormStatus` + loader; login/signup/modals marketing/admin-login/nimbus-setup/admin-users/new-tenant logout convertidos para `SubmitButton`. Tabelas client (`members-table`, `invitations-table`, admin `users-table`) usam `useTransition` com `disabled={pending}` em ações de delete/change-role. |
| 🟡 **A14** | **Identidade visível no sidebar** — `AppSidebar` (via `requireTenant()`) e `AdminSidebar` (via `requireAdmin()`) recebem `userName`/`userEmail` e exibem no topo do header, com `title={email}` para tooltip. |

---

## Fit Check: R × A

| Req | Requirement | Status | A |
|-----|-------------|--------|---|
| R0 | Plataforma FinOps SaaS multi-tenant com onboarding self-service para AWS | Core goal | ✅ |
| R1.1 | Google OAuth como único provider de autenticação | Must-have | ✅ |
| 🟡 R1.2 | 3 perfis: Admin Global, Owner do Tenant, Read | Must-have | ✅ |
| 🟡 R1.3 | Bootstrap one-shot via Google OAuth para criar primeiro Admin Global (`/nimbus-setup`) | Must-have | ✅ |
| R1.4 | Middleware protege rotas `/app/*` e `/admin/*` (exceto `/admin/login`) | Must-have | ✅ |
| R1.5 | Signup cria apenas User (sem tenant); tenant criado em etapa separada | Must-have | ✅ |
| 🟡 R1.6 | Acesso admin por não-admin encerra sessão e redireciona a `/admin/login?error=forbidden` | Must-have | ✅ |
| 🟡 R1.7 | Criação de tenant em `/new-tenant` previne duplo clique | Must-have | ✅ |
| 🟡 R1.8 | Guard anti-duplo-clique global em botões que disparam mutação | Must-have | ✅ |
| 🟡 R1.9 | Sidebar app/admin exibem usuário logado (nome/email) no topo | Must-have | ✅ |
| R2.1 | Usuário sem tenant é redirecionado para criar tenant após login | Must-have | ✅ |
| R2.2 | Slug globalmente único por tenant (com sufixo aleatório) | Must-have | ✅ |
| R2.3 | Convites para membros com grupo owner/read via link com token | Must-have | ✅ |
| R2.4 | Isolamento de dados por tenant em todas as entidades | Must-have | ✅ |
| R2.5 | Usuário pode pertencer a múltiplos tenants | Must-have | ✅ |
| R2.6 | Tenant switcher no sidebar com cookie `active-tenant-id` | Must-have | ✅ |
| R2.7 | Aceite de convite em `/invitations/[token]` com sign-out automático e flow de signup/login com callbackUrl | Must-have | ✅ |
| R2.8 | Excluir convite remove membro do tenant se já cadastrado | Must-have | ✅ |
| 🟡 R2.9 | Link de convite público + Google OAuth direto + redirect a `/app/dashboard` | Must-have | ✅ |
| 🟡 R2.10 | Logout forçado quando email logado difere do convite | Must-have | ✅ |
| 🟡 R2.11 | Aceitar/Recusar inline quando email logado bate com o convite | Must-have | ✅ |
| 🟡 R2.12 | Prompt "Você já tem conta" quando email convidado já existe e não está logado | Must-have | ✅ |
| 🟡 R2.13 | Apenas owner pode excluir convite | Must-have | ✅ |
| 🟡 R2.14 | Dashboard mostra convites pendentes para outros tenants | Must-have | ✅ |
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
| 🟡 R9.4 | Eventos de autenticação registrados no audit log com método, userId, email, nome | Must-have | ✅ |
| 🟡 R9.5 | Auditoria do tenant inclui eventos de auth de membros (isolamento preservado) | Must-have | ✅ |
| 🟡 R10.1 | Toggle por tenant para dados reais/fake nas 3 páginas | Must-have | ✅ |
| 🟡 R10.2 | Múltiplos cenários fake via faker-js | Must-have | ✅ |
| 🟡 R10.3 | Mutações bloqueadas em modo demo | Must-have | ✅ |
| 🟡 R10.4 | Badge "Modo demo" nas páginas afetadas | Must-have | ✅ |
| 🟡 R10.5 | Welcome dialog pós-criação de tenant convidando a ativar modo demo | Must-have | ✅ |

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
- 🟡 Eventos de auth (`login_success`, `login_failure`, `logout`) via `events` do Auth.js + wrapper do server action
- 🟡 Auditoria do tenant expandida: mostra eventos de auth de membros via `memberIds` lookup
- 🟡 `/new-tenant`: botão de submit com `useFormStatus` (anti-duplo clique) + botão de logout
- 🟡 `/admin/forbidden` Route Handler + `requireAdmin()` fazem signOut ao bloquear não-admin
- 🟡 Welcome dialog em `/app/settings?welcome=1` após criação de tenant
- 🟡 Guard anti-duplo-clique global: `SubmitButton` reutilizável + `useTransition` em tabelas client (members, invitations, admin users)
- 🟡 Invite flow refatorado: `/invitations/[token]` público + Route Handlers `/accept` e `/logout`, OAuth direto, redirect final a `/app/dashboard`
- 🟡 Sidebar (app e admin) exibe usuário logado no topo (nome/email)
- 🟡 Dashboard exibe convites pendentes de outros tenants com Aceitar/Recusar inline
- i18n: pt-BR e en completos para todos os módulos

### Pending (Next Phases)
- **A7 ⚠️** Job mensal de cálculo PRO (soma estimated savings das recomendações, cobra 10%)
- **A8 ⚠️** Cron job real para coleta diária AWS
- Coleta real de dados AWS (atualmente só cria Integration + health check simulado)
