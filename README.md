# Nightwire

AI Trading Desk submission for Bitget AI Base Camp Hackathon S2 — sub-theme
**Information Extraction & Signal Generation**. A natural-language research
workbench: it ingests unstructured news/macro/earnings information and
surfaces where the information and the market's pricing disagree, with the
full evidence trail visible. A human trader makes the call.

This is **Session 1 — core infrastructure** under the project's
`AGENT_BUILD_RULESET.md`. It is theme-agnostic on purpose: auth, layout
shell, and shared packages only. No signal-detection logic, no Bitget
Agent Hub / bitget-signal integration yet — that's Session 2.

## Structure

```
apps/
  web/      Next.js 16 (App Router) — the desk UI + Supabase auth
  api/      Express server — health check only so far
packages/
  ui/       Shared shadcn-style primitives (Button, Card, Input, Badge, Separator)
  types/    Shared, theme-agnostic TypeScript types
  config/   Design tokens (canonical source, mirrored into Tailwind's @theme)
docs/
  design/preview.html   Static mockup of the filled-state screen (Build Ruleset §8.7)
```

## Prerequisites

- Node.js ≥ 20
- pnpm (`corepack enable` will pick up the pinned version from `package.json`)
- A Supabase project (free tier is enough) with email/password auth enabled

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
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — same project, service-role
  key (server-only, never expose this to the browser).

```bash
pnpm dev
```

This runs both apps via Turborepo. Web defaults to `http://localhost:3000`,
API to `http://localhost:4000/health`.

## A note on how this was built

This scaffold was written in a sandboxed environment with **no outbound
network access** — every file was hand-written and reviewed, but nothing
here has actually been through `pnpm install`, a real build, or a live
Supabase/API call yet. Package versions were verified by web search against
current docs/releases at write time (Next.js 16.2.x, Tailwind v4.3.x,
`@supabase/ssr` v0.12.x — shadcn/ui requires Tailwind v4's CSS-first config,
which this repo uses), but the **first real verification step is running
`pnpm install` and `pnpm dev` yourself**, or handing this to an environment
with live network access (your machine, a deploy target, or a coding
environment with internet access) to actually exercise it end to end.

See `SESSION_REPORT.md` for the full anti-hallucination state — file tree,
dependencies, known stubs, and assumptions carried into Session 2.
