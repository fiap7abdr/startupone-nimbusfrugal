# BOILERPLATE MANUAL — MVP Generator

> **Objetivo:** Qualquer pessoa pode usar este boilerplate para criar um MVP SaaS completo.
> Basta substituir a seção `[MEU PRODUTO]` no final e rodar o prompt no Claude Code.
>
> **Fonte:** https://github.com/lbrezende/taskflow/blob/main/BOILERPLATE_MANUAL.md

---

## PRE-REQUISITOS

Antes de comecar, instale estas ferramentas na sua maquina:

| Ferramenta | Versao minima | Como instalar |
|---|---|---|
| **Node.js** | v18+ | [nodejs.org](https://nodejs.org) ou `brew install node` |
| **npm** | v9+ | Vem com o Node.js |
| **Git** | v2+ | [git-scm.com](https://git-scm.com) ou `brew install git` |
| **GitHub CLI** | v2+ | `brew install gh` ou [cli.github.com](https://cli.github.com) |
| **Vercel CLI** | latest | `npm install -g vercel` |

Para verificar se esta tudo instalado:
```bash
node --version    # deve mostrar v18+
npm --version     # deve mostrar v9+
git --version     # deve mostrar v2+
gh --version      # deve mostrar v2+
vercel --version  # deve mostrar um numero de versao
```

Contas necessarias (crie antes de comecar):
- [GitHub](https://github.com) — repositorio de codigo
- [Vercel](https://vercel.com) — hosting (login com GitHub)
- [Neon](https://neon.tech) — banco PostgreSQL
- [Google Cloud Console](https://console.cloud.google.com) — OAuth
- [Resend](https://resend.com) — envio de emails
- [Stripe](https://dashboard.stripe.com) — pagamentos

---

## ETAPAS DE BUILD (ordem obrigatoria)

### ETAPA 0 — INFRAESTRUTURA (FACA PRIMEIRO!)
1. **Criar repositorio no GitHub** (publico ou privado)
2. **Conectar Vercel ao repo** para deploy automatico
3. **Criar banco PostgreSQL no Neon** (free tier)
4. **Subir hello world** — confirmar que o site esta no ar
5. **Configurar dominio** (opcional, Vercel da um `.vercel.app` gratis)

> **Resultado esperado:** Ao terminar esta etapa, voce deve ter:
> - Um repo no GitHub com o codigo
> - Um site funcionando em `https://seu-projeto.vercel.app`
> - Deploy automatico: cada push no GitHub atualiza o site

### ETAPA 1 — SCHEMA DO BANCO (Prisma)
Crie o `prisma/schema.prisma` com as entidades obrigatorias:
- **User**: id, name, email, image, emailVerified, stripeCustomerId, stripePriceId, stripeSubscriptionId, stripeCurrentPeriodEnd, trialEndsAt, plan (enum: FREE/TRIAL/PRO)
- **Account, Session, VerificationToken**: padrao Auth.js
- **Entidades do produto**: definidas na secao [MEU PRODUTO]

Tambem crie o Design System (Single Source of Truth):

`design-system/tokens.ts` — Fonte unica de design tokens:
* Definir objeto tipado `DesignTokens` com: colors, sidebar, radius, spacing, typography
* Todas as cores do tema, tokens de sidebar, escala tipografica
* Exportar tokens e tipo `DesignTokens`

`design-system/utils.ts` — Helpers de conversao:
* `tokenKeyToCssVar(key)` — converte camelCase para CSS var (ex: `"cardForeground"` -> `"--card-foreground"`)
* `sidebarKeyToCssVar(key)` — converte para sidebar CSS var (ex: `"primary"` -> `"--sidebar-primary"`)

`design-system/generate-css.ts` — Gerador de CSS:
* Importa `tokens.ts` e gera bloco `:root {}` no `globals.css` entre marcadores de comentario
* Preserva todo conteudo fora do `:root` (imports, @theme inline, @layer base)
* Flag `--check` para CI (verifica se `globals.css` esta sincronizado)

`package.json` — Adicionar scripts:
* `"tokens": "tsx design-system/generate-css.ts"`
* `"tokens:check": "tsx design-system/generate-css.ts --check"`

**REGRA:** Nunca usar hex hardcoded nos componentes. Sempre usar tokens semanticos Tailwind (`bg-primary`, `text-foreground`, etc).

### ETAPA 2 — AUTENTICACAO (Auth.js v5)
- Google OAuth + Email Magic Link (via Resend)
- Primeiro login -> `plan=TRIAL`, `trialEndsAt=now+14dias`
- Middleware protegendo rotas `/dashboard/*`, `/app/*`, `/settings/*`
- Pagina customizada `/login`

### ETAPA 3 — TRIAL E ASSINATURA
Funcoes em `lib/subscription.ts`:
- `isTrialActive(user)` — trialEndsAt > now E plan === TRIAL
- `isSubscribed(user)` — plan === PRO E stripeCurrentPeriodEnd > now
- `hasAccess(user)` — isTrialActive OR isSubscribed
- `daysLeftInTrial(user)` — dias restantes

Fluxo:
1. Primeiro login -> TRIAL 14 dias
2. Trial ativo -> acesso total + banner "X dias restantes"
3. Trial expirado -> BLOQUEADO -> redirect pricing
4. Pagou -> PRO -> acesso total
5. Cancelou -> acesso ate fim do periodo

### ETAPA 4 — PAYWALL E LIMITES
- Constante `PLAN_LIMITS` com limites por plano
- Funcao `checkUsageLimit(user, resource)`
- Componente `<PaywallGate>` que bloqueia com card bonito + CTA upgrade

### ETAPA 5 — STRIPE (PAGAMENTOS)
- Checkout Session (subscription + trial)
- Customer Portal
- Webhook: `checkout.session.completed`, `invoice.payment_succeeded`, `customer.subscription.deleted/updated`
- Pagina `/settings/billing`

### ETAPA 6 — FEATURES DO PRODUTO
Implementar as features descritas em [MEU PRODUTO] com:
- TanStack Query para CRUD
- Zod para validacao
- API routes com auth
- PaywallGate nos limites

Apos implementar as features, configure o Storybook (Design System wired):

1. Instalar Storybook: `npx storybook@latest init`
2. Configurar `.storybook/preview.ts` para importar `globals.css` e usar tokens de `design-system/tokens.ts` nos backgrounds
3. Criar stories para Design Tokens:
   * `stories/design-tokens/Colors.stories.tsx` — Grid visual de todas as cores importadas de `tokens.ts`
   * `stories/design-tokens/Typography.stories.tsx` — Escala tipografica importada de `tokens.typography`
   * `stories/design-tokens/Spacing.stories.tsx` — Barras visuais importadas de `tokens.spacing`
4. Criar stories para cada componente UI (Button, Card, Input, Badge, Dialog, Select, Tabs)
5. Criar stories para componentes do produto (PaywallGate, TrialBanner)
6. Todas as stories DEVEM importar tokens de `design-system/tokens.ts` — isso garante que mudancas nos tokens propagam automaticamente

**REGRA WIRED:** Editar `tokens.ts` -> rodar `npm run tokens` -> mudancas refletem no produto E no Storybook.

### ETAPA 7 — LANDING PAGE
Secoes: Hero -> Features -> Screenshots -> Pricing -> Footer

### ETAPA 8 — SCREENSHOTS
Tirar screenshots reais do app e colocar na landing page.

### ETAPA 9 — CONFIGURACAO FINAL
- `.env.example` completo
- `.gitignore`
- `README.md` com setup passo a passo

Tambem verifique o Design System wired:
* Rodar `npm run tokens:check` para verificar sincronizacao
* Verificar zero hex hardcoded nos componentes (`grep -r "bg-\[#" components/ app/`)
* Adicionar `npm run tokens:check` no CI/CD pipeline

---

## STACK OBRIGATORIA

| Tecnologia | Funcao |
|---|---|
| Next.js 14+ (App Router) | Framework full-stack |
| TypeScript strict | Tipagem |
| Tailwind CSS 4 | Estilizacao |
| TanStack Query | Data fetching client |
| Prisma | ORM + migrations (PostgreSQL) |
| Zod | Validacao |
| Auth.js v5 (NextAuth) | Autenticacao |
| Stripe | Pagamentos |
| shadcn/ui | Componentes UI |
| Resend | Emails transacionais |
| Storybook | Design System documentation & testing |
| design-system/tokens.ts | Design tokens single source of truth |

## HOSPEDAGEM

| Servico | Funcao | Tier |
|---|---|---|
| Vercel | App hosting | Free |
| Neon | PostgreSQL | Free |
| Resend | Emails | Free (3k/mes) |
| Stripe | Pagamentos | Test mode |

## ESTRUTURA DE PASTAS

```
my-mvp/
├── app/
│   ├── (public)/          # Rotas publicas (landing, pricing, login)
│   ├── (auth)/            # Rotas protegidas (dashboard, settings)
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   └── stripe/webhook/route.ts
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                # shadcn/ui
│   ├── forms/
│   ├── layout/
│   └── paywall/
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   ├── stripe.ts
│   ├── email.ts
│   ├── validations.ts
│   └── subscription.ts
├── hooks/
├── types/
├── prisma/
│   └── schema.prisma
├── design-system/
│   ├── tokens.ts          # Source of truth for all design tokens
│   ├── utils.ts           # Token conversion helpers
│   └── generate-css.ts    # CSS generator script
├── stories/
│   ├── design-tokens/     # Colors, Typography, Spacing stories
│   ├── ui/                # UI component stories
│   └── components/        # Product component stories
├── .storybook/
│   ├── main.ts
│   └── preview.ts
├── public/
│   └── screenshots/
├── .env.example
├── middleware.ts
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## VARIAVEIS DE AMBIENTE

```env
# Database (Neon - https://neon.tech)
DATABASE_URL=

# Auth.js v5
AUTH_SECRET=              # openssl rand -base64 32
AUTH_GOOGLE_ID=           # Google Cloud Console
AUTH_GOOGLE_SECRET=
AUTH_RESEND_KEY=          # Resend API Key (para magic links)

# Stripe (https://dashboard.stripe.com)
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID_PRO=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Resend (emails transacionais)
RESEND_API_KEY=
```

---

## DECISOES E AJUSTES

> Esta secao registra todas as decisoes tomadas durante o build que alteram o manual original.

1. **ETAPA 0 adicionada** — Criar GitHub + Vercel + Neon ANTES de codar features.
2. **Toast -> Sonner** — O componente `toast` do shadcn/ui foi depreciado. Usamos `sonner` no lugar.
3. **React Compiler: No** — Nao ativamos o React Compiler experimental.
4. **Pre-requisitos adicionados** — Secao com todas as ferramentas e contas necessarias antes de comecar.
5. **Prisma 6 (nao 7)** — Prisma 7 mudou completamente a config do datasource. Usamos Prisma ^6 que e estavel e compativel com o padrao Auth.js.
6. **Vercel CLI** — Necessario instalar globalmente (`npm install -g vercel`) para deploy via terminal.
7. **`.claude/` directory adicionado** — Docs de contexto para AI.
8. **CLAUDE.md na raiz** — Convencoes do projeto para agentes AI.
9. **Script de setup interativo** — `npm run setup` para configurar .env automaticamente.
10. **Analise competitiva:** supastarter ($299 pago), Memberstack (gratis, auth-only), LastSaaS (gratis, Go+MongoDB). Nosso: **gratis, Next.js, Prisma+PostgreSQL, cobertura essencial SaaS.**
11. **Stripe SDK v20 breaking changes** — `current_period_end` removido de Subscription. Usamos `invoice.period_end` via latest_invoice.
12. **Stripe client lazy init** — Proxy pattern para evitar crash no build quando STRIPE_SECRET_KEY nao esta configurada.
13. **Auth.js v5 env vars** — Usa `AUTH_SECRET` em vez de `NEXTAUTH_SECRET`.
14. **Middleware leve (Edge Function < 1MB)** — O middleware NAO importa `auth` do Auth.js. Checa diretamente o cookie `authjs.session-token`.
15. **Variaveis de ambiente na Vercel** — Todas as env vars do `.env.example` devem ser configuradas na Vercel via `vercel env add`.
16. **Upgrade durante trial** — O checkout Stripe NAO define `trial_period_days` em `subscription_data`, entao o usuario pode virar PRO imediatamente.
17. **Figma MCP** — Para design-to-code, instale `@anthropic-ai/figma-mcp-server` como MCP server no Claude Code.
18. **Design System Wired** — O design system usa arquivo TypeScript como fonte unica de verdade. Script gera CSS custom properties. Stories importam tokens.

---

## [MEU PRODUTO] — Nimbus Frugal

```
Nome do produto: Nimbus Frugal
Headline: "Controle de custos em nuvem, inteligencia para economizar"
Subtitulo: "Plataforma FinOps SaaS multi-tenant para AWS com atualizacao diaria e foco em visibilidade, priorizacao e governanca operacional."

Features:
1. Onboarding self-service via CloudFormation
2. Dashboard consolidado com freshness de dados
3. Recomendacoes priorizadas de economia (Cost Optimization Hub, Compute Optimizer, Trusted Advisor)
4. Arvore de OUs/contas AWS Organization
5. Gestao de integracao com health check

Entidades extras (alem de User, Account, Session):
- Tenant, TenantMember, TenantInvitation
- AwsOrganization, OrganizationalUnit, AwsAccount
- Integration, IntegrationTestResult
- CollectionBatch, Recommendation, DataFreshnessStatus
- BillingSubscription, AuditLog
- AdminUser, AdminInvitation, AdminImpersonationSession
- PlatformSetupState, PlatformConfiguration

Limites por plano:
- TRIAL (90 dias): tudo ilimitado
- PRO: tudo ilimitado

Preco:
- PRO: 0,5% do gasto mensal consolidado AWS

Cores:
- Primaria: #2F6FE4
- Secundaria: #5FA8FF
- Fundo: #F1F5F9
- Dark: #1E3A8A
- Positiva: #22C55E
- Negativa: #EF4444
- Card: #FFFFFF
```
