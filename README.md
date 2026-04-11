# Nimbus Frugal

**Controle de custos em nuvem, inteligência para economizar**

Plataforma FinOps SaaS multi-tenant para AWS com atualização diária e foco em visibilidade, priorização e governança operacional.

## Stack

- Next.js 15 (App Router) + TypeScript
- Tailwind CSS 4 + design system baseado em tokens
- Prisma 6 + PostgreSQL (Neon)
- Auth.js v5 (magic link via Resend)
- Storybook 8 (react-vite)

## Rotas

### Público
- `/` — landing page
- `/pricing` — pricing Trial / Pro (0,5% do gasto consolidado)
- `/signup` — criação self-service de tenant
- `/login` — magic link

### Bootstrap
- `/nimbus-setup` — cria o primeiro Administrador Geral (uso único)
- `/admin/login` — login administrativo

### Tenant App
- `/app/dashboard` — visão consolidada + freshness
- `/app/onboarding` — wizard AWS Organization + CloudFormation
- `/app/integrations` — conectores + role ARN + health check
- `/app/organization` — árvore OUs/contas descoberta
- `/app/recommendations` — oportunidades priorizadas
- `/app/users` — membros, convites, grupos owner/read
- `/app/settings` — billing e preferências

### Admin Global
- `/admin` — overview
- `/admin/tenants`
- `/admin/integrations`
- `/admin/batches`
- `/admin/admin-users`

## Dev

```bash
npm run dev          # Next.js em :3000
npm run storybook    # Storybook em :6006
npm run db:push      # sync Prisma schema com Neon
npm run tokens       # regenerar CSS variables do design system
npm run tokens:check # CI guard: falha se tokens ficaram fora de sync
```

## Variáveis de ambiente

Ver [.env.example](./.env.example). Configuradas:

- `DATABASE_URL` — Neon Postgres
- `AUTH_SECRET` — `openssl rand -base64 32`
- `AUTH_RESEND_KEY` / `RESEND_API_KEY` — magic link
- `NIMBUS_PLATFORM_AWS_ACCOUNT_ID` — conta AWS da Nimbus (trust principal)
- `VERCEL_TOKEN` — deploy

## Bootstrap (`/nimbus-setup`)

A rota `/nimbus-setup` é o ponto de entrada inicial da plataforma — uso único. Ela cria o primeiro **Administrador Geral** do sistema.

1. Acesse `https://nimbusfrugal.cloud/nimbus-setup`
2. Preencha nome e e-mail do administrador
3. Um magic link será enviado para o e-mail informado
4. Após autenticação, o admin terá acesso ao painel em `/admin`

> **Atenção:** essa rota só funciona uma vez. Após o setup inicial, ela retorna 404. Novos admins devem ser convidados pelo painel `/admin/admin-users`.

## Modelo operacional

- Nimbus Frugal roda em conta AWS própria
- Cada tenant cria IAM Role na própria AWS via CloudFormation
- Trust policy referencia o AWS Account ID da Nimbus com External ID único
- Coleta assíncrona em batch a cada 24h
- Dados não são real-time — freshness sempre exibido

## Time

- Fábio Damião Barbosa Rizzi — RM365066
- Carlos Eduardo dos Santos Junior — RM360401
- Vinicius Cordeiro — RM364840
- Rodrigo Oliveira Brito — RM364187
