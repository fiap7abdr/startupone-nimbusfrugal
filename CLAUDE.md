# Nimbus Frugal — Project Conventions

## Stack
- Next.js 15 (App Router) + TypeScript strict
- Tailwind CSS 4 + design system tokens (`design-system/tokens.ts`)
- Prisma 6 + PostgreSQL (Neon)
- Auth.js v5 (Google OAuth + Resend magic link, JWT strategy)
- Storybook 8 (react-vite)
- shadcn/ui-style components with `class-variance-authority`

## Key Rules
- **Never use hardcoded hex** in components. Always use Tailwind semantic tokens (`bg-primary`, `text-foreground`).
- **Design tokens are the single source of truth.** Edit `design-system/tokens.ts` then run `npm run tokens`.
- **Middleware is lightweight.** Never import `auth` or heavy libs in `middleware.ts` (Edge < 1MB). Check cookies directly.
- **Server Actions** for mutations. API routes only for webhooks and external integrations.
- **Multi-tenant isolation:** Every query must filter by `tenantId`.

## Auth
- Google OAuth + Resend magic link (dual provider)
- JWT session strategy with PrismaAdapter
- `requireUser()`, `requireTenant()`, `requireAdmin()` helpers in `lib/tenant.ts`
- Admin users stored in separate `AdminUser` table

## Routes
- `/app/*` — tenant app (protected by middleware)
- `/admin/*` — admin panel (protected, except `/admin/login`)
- `/nimbus-setup` — one-shot bootstrap (404 after first use)

## Design System
- Tokens: `design-system/tokens.ts`
- Generate CSS: `npm run tokens`
- CI check: `npm run tokens:check`
- Stories must import from `design-system/tokens.ts`

## Database
- Prisma only reads `.env`, not `.env.local`. Sync with `cp .env.local .env` if needed.
- `npm run db:push` to sync schema with Neon.

## Deploy
- Vercel (auto-deploy from GitHub)
- Domain: nimbusfrugal.cloud
- All env vars must be set in Vercel via `vercel env add`
