# Copliance

Le copilote administratif des entrepreneurs francais.

## Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **UI**: Tailwind CSS v3 + shadcn/ui (manual components in `src/components/ui/`)
- **Database**: Supabase PostgreSQL + Drizzle ORM
- **Auth**: Supabase Auth (email + Google OAuth)
- **Payments**: Stripe
- **Emails**: Resend
- **Hosting**: Vercel + Supabase

## Project Structure

- `src/app/` — Next.js App Router pages and API routes
- `src/components/ui/` — shadcn/ui base components
- `src/components/` — Feature-specific components (layout, onboarding, dashboard, etc.)
- `src/lib/` — Core libraries (supabase, stripe, db, engine, simulators)
- `src/lib/engine/` — Rules engine generating obligations from user profiles
- `src/lib/simulators/` — Calculation logic for Urssaf/TVA simulators
- `src/actions/` — Next.js Server Actions
- `src/types/` — Shared TypeScript types
- `supabase/migrations/` — SQL migration files
- `emails/` — React Email templates

## Commands

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run lint` — ESLint
- `npx drizzle-kit push` — Push schema to database
- `npx drizzle-kit generate` — Generate migrations

## Conventions

- English code, French user-facing strings
- All dates use `date-fns` with French locale
- Currency formatted with `Intl.NumberFormat("fr-FR")`
- All Supabase queries go through server client with RLS
- Every simulator page shows a disclaimer about not replacing professional advice
