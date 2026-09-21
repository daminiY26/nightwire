# Nightwire

AI Trading Desk submission for Bitget AI Base Camp Hackathon S2 — sub-theme
**Information Extraction & Signal Generation**. A natural-language research
workbench: ask a question, the desk checks it against research sources and
pins a signal card — headline, confidence, and a full source trail — to the
ledger. A human trader makes the call.

Built under `AGENT_BUILD_RULESET.md`, session by session. See
`SESSION_REPORT.md` for the authoritative, cumulative state of the project
(file tree, dependencies, known stubs, assumptions) — this README is the
setup guide, that file is the source of truth on what's actually built.

## Structure

```
apps/
  web/      Next.js 16 (App Router) — the desk UI, Supabase auth, the chat panel
  api/      Express server — auth-gated routes, the bitget-signal + Claude
            orchestration loop, Supabase persistence
packages/
  ui/       Shared shadcn-style primitives (Button, Card, Input, Badge, Separator)
  types/    Shared TypeScript types — generic (api.ts) and domain (signals.ts)
  config/   Design tokens (canonical source, mirrored into Tailwind's @theme)
supabase/
  migrations/   SQL for the watches / signal_cards tables + RLS policies
docs/
  design/preview.html   Static mockup of the filled-state screen (Build Ruleset §8.7)
```

## Prerequisites

- Node.js ≥ 20
- pnpm (`corepack enable` will pick up the pinned version from `package.json`)
- A Supabase project (free tier is enough) with email/password auth enabled
- For `SIGNAL_SOURCE=live` only: an Anthropic API key, and a bitget-signal
  MCP server URL (see apps/api's `.env.example` — getting this one requires
  a one-time manual step, it's not a value you can just look up)

## Setup

```bash
pnpm install
cp apps/web/.env.example apps/web/.env.local
cp apps/api/.env.example apps/api/.env.local
```

Fill in `apps/web/.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from your
  Supabase project's API settings.

Fill in `apps/api/.env.local`:
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY` — same
  Supabase project as above.
- `SIGNAL_SOURCE` — `fixture` (default, no external calls) or `live` (see
  Prerequisites).

Run the database migration once, before first use — paste
`supabase/migrations/20260914000000_create_watches_and_signal_cards.sql`
into your Supabase project's SQL editor (Dashboard → SQL Editor), or
`supabase db push` if you have the CLI linked to the project. Without this,
every request that needs the database will fail with a clear Postgres error
rather than silently doing nothing.

```bash
pnpm dev
```

This runs both apps via Turborepo. Web defaults to `http://localhost:3000`,
API to `http://localhost:4000/health`.

## A note on how this was built

This scaffold was written in a sandboxed environment with **no outbound
network access** at any point across all sessions — every file was
hand-written and reviewed, but nothing here has actually been through
`pnpm install`, a real build, or a live Supabase/Anthropic/Bitget call.
Package versions and API usage patterns were checked against current
docs/releases via web search at write time, not by resolving or running
them. The **first real verification step is running `pnpm install` and
`pnpm dev` yourself** in an environment with real network access — your
machine, a deploy target, or a coding environment with internet access.

See `SESSION_REPORT.md` for the full, current anti-hallucination state.
