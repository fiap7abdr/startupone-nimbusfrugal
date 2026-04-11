# Nimbus Frugal

**Controle de custos em nuvem, inteligencia para economizar**

Plataforma FinOps SaaS multi-tenant para AWS com atualizacao diaria e foco em visibilidade, priorizacao e governanca operacional.

> Deploy: [nimbusfrugal.cloud](https://nimbusfrugal.cloud) | [nimbus-frugal.vercel.app](https://nimbus-frugal.vercel.app)

## Stack

| Tecnologia | Funcao |
|---|---|
| Next.js 15 (App Router) | Framework full-stack |
| TypeScript strict | Tipagem |
| Tailwind CSS 4 | Estilizacao via design tokens |
| Prisma 6 + PostgreSQL (Neon) | ORM + banco |
| Auth.js v5 | Autenticacao (Google OAuth + Resend magic link) |
| Storybook 8 (react-vite) | Documentacao de componentes |
| TanStack Query | Data fetching client |
| Zod | Validacao |
| shadcn/ui (cva) | Componentes UI |

## Rotas

### Publico
- `/` — landing page (Hero, Features, Screenshots, CTA, Footer)
- `/pricing` — pricing Trial / Pro (0,5% do gasto consolidado)
- `/signup` — criacao self-service de tenant
- `/login` — Google OAuth ou magic link

### Bootstrap
- `/nimbus-setup` — cria o primeiro Administrador Geral (uso unico)
- `/admin/login` — login administrativo

### Tenant App
- `/app/dashboard` — visao consolidada + freshness
- `/app/onboarding` — wizard AWS Organization + CloudFormation
- `/app/integrations` — conectores + role ARN + health check
- `/app/organization` — arvore OUs/contas descoberta
- `/app/recommendations` — oportunidades priorizadas
- `/app/users` — membros, convites, grupos owner/read
- `/app/settings` — billing e preferencias

### Admin Global
- `/admin` — overview
- `/admin/tenants` — gestao de tenants
- `/admin/integrations` — integracoes globais
- `/admin/batches` — batches de coleta
- `/admin/admin-users` — gestao de admins

## Entidades (Prisma)

18 entidades de dominio + 4 Auth.js:

| Grupo | Entidades |
|---|---|
| Auth.js | User, Account, Session, VerificationToken |
| Plataforma | PlatformSetupState, PlatformConfiguration, AdminUser, AdminInvitation, AdminImpersonationSession |
| Tenant | Tenant, TenantMember, TenantInvitation |
| AWS | AwsOrganization, OrganizationalUnit, AwsAccount |
| Integracao | Integration, IntegrationTestResult |
| Dados | CollectionBatch, Recommendation, DataFreshnessStatus |
| Billing | BillingSubscription, AuditLog |

## Perfis de acesso

| Perfil | Escopo | Rotas |
|---|---|---|
| Admin Geral | Toda a plataforma | `/admin/*` |
| Owner do Tenant | Seu tenant (leitura + escrita) | `/app/*` |
| Read | Seu tenant (somente leitura) | `/app/*` |

## Conectores AWS

7 conectores iniciais por integracao:

1. **AWS Organizations** — arvore de OUs e contas
2. **CUR (Cost and Usage Report)** — dados detalhados de custo
3. **Cost Explorer** — metricas agregadas de custo
4. **Cost Optimization Hub** — recomendacoes centralizadas
5. **Compute Optimizer** — rightsizing de EC2, Lambda, EBS
6. **Trusted Advisor** — checks de custo e performance
7. **SSM Explorer** — inventario de recursos

## Pricing

| Plano | Preco | Duracao |
|---|---|---|
| **Trial** | Gratis | 90 dias, tudo ilimitado |
| **Pro** | 0,5% do gasto mensal consolidado AWS | Ilimitado |

## Design System

Single source of truth em TypeScript com propagacao automatica:

```
design-system/tokens.ts  →  npm run tokens  →  globals.css (CSS vars)  →  Tailwind + Storybook
```

- Tokens: cores, sidebar, radius, spacing, tipografia
- Componentes: Button, Card, Badge, Input, Label, Dialog, Tabs
- Componentes de produto: PaywallGate, TrialBanner
- **Regra:** nunca usar hex hardcoded — sempre tokens semanticos (`bg-primary`, `text-foreground`)

## Trial e Subscription

Helpers em `lib/subscription.ts`:

- `isTrialActive(billing)` — trial ainda valido?
- `isSubscribed(billing)` — plano PRO ativo?
- `hasAccess(billing)` — trial OR PRO?
- `daysLeftInTrial(billing)` — dias restantes
- `billingStatusLabel(billing)` — label para UI

Componentes:
- `<TrialBanner daysLeft={N} />` — banner com countdown e link de upgrade
- `<PaywallGate hasAccess={bool}>` — bloqueia conteudo com CTA de upgrade

## Bootstrap (`/nimbus-setup`)

A rota `/nimbus-setup` e o ponto de entrada inicial da plataforma — uso unico. Ela cria o primeiro **Administrador Geral** do sistema.

1. Acesse `https://nimbusfrugal.cloud/nimbus-setup`
2. Preencha nome e e-mail do administrador
3. Um magic link sera enviado para o e-mail informado
4. Apos autenticacao, o admin tera acesso ao painel em `/admin`

> **Atencao:** essa rota so funciona uma vez. Apos o setup inicial, ela retorna 404. Novos admins devem ser convidados pelo painel `/admin/admin-users`.

## Modelo operacional

- Nimbus Frugal roda em conta AWS propria
- Cada tenant cria IAM Role na propria AWS via CloudFormation
- Trust policy referencia o AWS Account ID da Nimbus com External ID unico
- Coleta assincrona em batch a cada 24h
- Dados nao sao real-time — freshness sempre exibido

## Dev

```bash
npm run dev          # Next.js em :3000
npm run storybook    # Storybook em :6006
npm run db:push      # sync Prisma schema com Neon
npm run db:studio    # Prisma Studio (visual DB browser)
npm run tokens       # regenerar CSS variables do design system
npm run tokens:check # CI guard: falha se tokens ficaram fora de sync
```

## Variaveis de ambiente

Ver [.env.example](./.env.example):

| Variavel | Descricao |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `AUTH_GOOGLE_ID` | Google Cloud Console OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google Cloud Console OAuth client secret |
| `AUTH_RESEND_KEY` | Resend API key (magic links) |
| `RESEND_API_KEY` | Resend API key (transactional emails) |
| `NEXT_PUBLIC_APP_URL` | URL base da aplicacao |
| `NIMBUS_PLATFORM_AWS_ACCOUNT_ID` | Conta AWS da Nimbus (trust principal) |
| `VERCEL_TOKEN` | Token de deploy Vercel |

## Estrutura de pastas

```
nimbus-frugal/
├── app/                     # Next.js App Router
│   ├── page.tsx             # Landing page
│   ├── pricing/             # Pricing
│   ├── signup/              # Signup self-service
│   ├── login/               # Login (magic link + Google)
│   ├── nimbus-setup/        # Bootstrap (uso unico)
│   ├── app/                 # Tenant app (protegido)
│   │   ├── dashboard/
│   │   ├── onboarding/
│   │   ├── integrations/
│   │   ├── organization/
│   │   ├── recommendations/
│   │   ├── users/
│   │   └── settings/
│   ├── admin/               # Admin global
│   │   ├── login/
│   │   └── (protected)/     # Route group com requireAdmin()
│   └── api/auth/            # Auth.js handlers
├── components/
│   ├── ui/                  # shadcn/ui (Button, Card, Badge, Input, Dialog, Tabs, Label)
│   ├── paywall/             # PaywallGate, TrialBanner
│   ├── forms/               # Form components
│   ├── app/                 # Tenant app layout (sidebar, page-header)
│   ├── admin/               # Admin layout (admin-sidebar)
│   └── marketing/           # Site header/footer
├── lib/
│   ├── prisma.ts            # Prisma client singleton
│   ├── utils.ts             # cn() helper
│   ├── tenant.ts            # requireUser, requireTenant, requireAdmin
│   ├── subscription.ts      # Trial/access helpers
│   └── aws-cloudformation.ts # CloudFormation template generator
├── design-system/
│   ├── tokens.ts            # Source of truth (cores, spacing, tipografia)
│   ├── utils.ts             # tokenKeyToCssVar, sidebarKeyToCssVar
│   └── generate-css.ts      # Gera CSS vars no globals.css
├── stories/
│   ├── design-tokens/       # Colors, Typography, Spacing
│   └── components/          # Button, Card, Badge, Input, Dialog, Select, Tabs, PaywallGate, TrialBanner
├── hooks/                   # Custom React hooks
├── types/                   # TypeScript types
├── prisma/
│   └── schema.prisma        # 22 modelos (18 dominio + 4 Auth.js)
├── public/
│   └── screenshots/         # Screenshots para landing page
├── docs/
│   ├── BOILERPLATE_MANUAL.md
│   ├── frame.md             # Framing doc (problem/outcome)
│   └── shaping.md           # Shaping doc (R, shapes, fit check)
├── .storybook/              # Storybook config (react-vite)
├── .env.example
├── CLAUDE.md                # Convencoes do projeto para AI
├── middleware.ts             # Protecao de rotas (cookie-based, Edge < 1MB)
└── auth.ts                  # Auth.js v5 config (Google + Resend)
```

## Boilerplate

Este projeto foi criado seguindo o [BOILERPLATE_MANUAL.md](./docs/BOILERPLATE_MANUAL.md), baseado no [taskflow boilerplate](https://github.com/lbrezende/taskflow/blob/main/BOILERPLATE_MANUAL.md).

## Time

- Fabio Damiao Barbosa Rizzi — RM365066
- Carlos Eduardo dos Santos Junior — RM360401
- Vinicius Cordeiro — RM364840
- Rodrigo Oliveira Brito — RM364187
