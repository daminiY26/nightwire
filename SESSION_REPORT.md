## Session 1: Core Infrastructure
**Date:** 2026-09-13
**Goal:** Theme-agnostic scaffold — monorepo, Next.js web app with Supabase auth, Express API skeleton, shared packages, deploy stubs, and the approved Session 1 design direction — for the Nightwire AI Trading Desk submission (sub-theme: Information Extraction & Signal Generation).

**Files added/changed:**
- `package.json`, `pnpm-workspace.yaml`, `turbo.json`, `.gitignore` — root workspace config
- `README.md` — setup instructions, structure overview, environment caveat
- `apps/web/*` — Next.js 16 App Router skeleton: root layout + fonts, Tailwind v4 `@theme` tokens in `globals.css`, `middleware.ts` for session refresh, Supabase browser/server/middleware clients, sign-in/sign-up pages, sign-out route, auth-gated `(desk)` route group, `DeskShell` layout component, `Logo` wordmark, `components.json` (shadcn config), `vercel.json` deploy stub
- `apps/api/*` — Express bootstrap, `/health` route, Supabase service-role client (unused so far), `railway.json` deploy stub
- `packages/ui/*` — Button, Card, Input, Badge, Separator (shadcn-pattern, hand-written — CLI not run, see Assumptions), `cn()` helper
- `packages/types/*` — generic `ApiResponse`, `ApiError`, `AppUser`, `HealthCheck` (no domain types yet — intentional)
- `packages/config/*` — `design-tokens.ts`, the canonical token source
- `.github/workflows/ci.yml` — CI stub (install + lint + typecheck + build, not yet run)
- `docs/design/preview.html` — static filled-state mockup (Build Ruleset §8.7 deliverable)

**Current full file tree:**
(regenerated via `find`, not recalled — see below)
```
.github/workflows/ci.yml
.gitignore
README.md
apps/api/.env.example
apps/api/package.json
apps/api/railway.json
apps/api/src/index.ts
apps/api/src/lib/supabase.ts
apps/api/src/routes/health.ts
apps/api/tsconfig.json
apps/web/.env.example
apps/web/components.json
apps/web/middleware.ts
apps/web/next.config.ts
apps/web/package.json
apps/web/postcss.config.mjs
apps/web/public/logo.svg
apps/web/src/app/(auth)/layout.tsx
apps/web/src/app/(auth)/sign-in/page.tsx
apps/web/src/app/(auth)/sign-up/page.tsx
apps/web/src/app/(desk)/desk/page.tsx
apps/web/src/app/(desk)/layout.tsx
apps/web/src/app/auth/sign-out/route.ts
apps/web/src/app/globals.css
apps/web/src/app/layout.tsx
apps/web/src/app/page.tsx
apps/web/src/components/desk-shell.tsx
apps/web/src/components/logo.tsx
apps/web/src/lib/supabase/client.ts
apps/web/src/lib/supabase/middleware.ts
apps/web/src/lib/supabase/server.ts
apps/web/src/lib/utils.ts
apps/web/tsconfig.json
apps/web/vercel.json
docs/design/preview.html
package.json
packages/config/package.json
packages/config/src/design-tokens.ts
packages/config/src/index.ts
packages/config/tsconfig.json
packages/types/package.json
packages/types/src/index.ts
packages/types/tsconfig.json
packages/ui/package.json
packages/ui/src/badge.tsx
packages/ui/src/button.tsx
packages/ui/src/card.tsx
packages/ui/src/index.ts
packages/ui/src/input.tsx
packages/ui/src/lib/utils.ts
packages/ui/src/separator.tsx
packages/ui/tsconfig.json
pnpm-workspace.yaml
turbo.json
```

**Dependencies installed:**
*(declared in package.json files — not yet run through `pnpm install`; this sandbox has no network. See Assumptions.)*
- `next@^16.2.10`, `react@^19.2.0`, `react-dom@^19.2.0` — confirmed current stable line via web search this session
- `@supabase/ssr@^0.12.5`, `@supabase/supabase-js@^2.112.4` — confirmed current via GitHub releases this session
- `tailwindcss@^4.3.2`, `@tailwindcss/postcss@^4.3.2` — confirmed current v4 line this session; CSS-first config, no `tailwind.config.js`
- `class-variance-authority@^0.7.1`, `clsx@^2.1.1`, `tailwind-merge@^3.0.2`, `@radix-ui/react-slot@^1.1.1`, `lucide-react@^0.469.0` — plausible current versions, **not individually re-verified this session** — confirm on first real `pnpm install`
- `express@^4.21.2`, `cors@^2.8.5`, `dotenv@^16.4.7`, `tsx@^4.19.2` — long-stable, not re-verified this session
- `turbo@^2.3.3`, `typescript@^5.7.3` — plausible current, not individually re-verified

**Supabase schema state:**
- None. No tables, no RLS policies. Auth uses Supabase's built-in `auth.users` — no custom `profiles` table exists yet. If Session 2+ needs one (e.g. for saved watches/research calls), it must be created and declared explicitly in that session's report — do not assume it exists.

**Env vars required:**
- `apps/web`: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_API_URL`
- `apps/api`: `PORT`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `WEB_ORIGIN`

**API endpoints live:**
- `GET /health` (apps/api) — returns `{ data: { status, service, timestamp }, error: null }`
- `POST /auth/sign-out` (apps/web route handler) — signs out and redirects to `/sign-in`

**Known stubs/mocks/TODOs:**
- **No live network verification.** Every file was hand-written in a sandbox with no outbound network access. Nothing has been through `pnpm install`, a real build, or a live Supabase/API call. Package versions were checked against current docs/releases via web search, not by resolving them. First real milestone check (per ruleset §6.8) should be a full `pnpm install && pnpm turbo run build` in a networked environment.
- **shadcn/ui primitives hand-written, not CLI-generated.** `packages/ui` follows current shadcn conventions (Tailwind v4 CSS-first, `cn()`, CVA, Radix Slot) confirmed via search, but the actual `shadcn` CLI was never run (needs network). Fine to keep as-is, or run `shadcn add <component>` later for additional components — don't assume more exist than the five listed above.
- **No `profiles` table / user metadata beyond Supabase auth defaults.**
- **CI workflow (`ci.yml`) has never executed.** It will likely fail today: `apps/web`'s build doesn't strictly require env vars to succeed (no non-null assertions run at build time in a way that throws), but this hasn't been confirmed by actually running it.
- **Design tokens are duplicated by hand** between `packages/config/src/design-tokens.ts` (documented source) and `apps/web/src/app/globals.css` `@theme` block (what Tailwind actually reads) — Tailwind v4 has no JS config to import from, so this is accepted duplication, not an oversight.
- **`docs/design/preview.html` contains fictional sample data** (NVDA guidance scenario) for the design mockup only — this is intentionally different from the live app's empty-state `DeskShell`, which shows no fabricated data. Don't confuse the two.
- **apps/api has no real endpoints yet** beyond `/health` — no auth middleware, no route for anything Session 2 will need. Build it as explicit, declared work when that session needs it.

**Assumptions carried into next session:**
- Sub-theme is locked to **Information Extraction & Signal Generation** (news-briefing + macro-analyst as primary resources, per the research brief). If this changes, the DeskShell copy, thesis-bar wording, and eventual signal-card schema in `packages/types` all need revisiting — they're not deeply theme-coupled yet, but the wording ("thesis," "gap," "source trail") already leans into this theme.
- LUI shape is **dashboard + chat panel** (not pure chat) — the three-pane `DeskShell` grid is built to this, approved at the Session 1 design checkpoint.
- Stack is **full stack** (Next.js + Supabase + auth) per ruleset default — not the lighter no-auth option.
- Package manager/workspace tool: **pnpm + turborepo**, deploy targets **Vercel (web) / Railway (api)** — ruleset defaults, accepted without a separate confirmation round since the ruleset already names them as defaults.
- Zip naming convention: `session-0X-<kebab-title>.zip`, per ruleset §9 default.
- This chat's sandbox has **no outbound network access** for the whole build — flagged to the person before Session 1 started. Live verification (Bitget Agent Hub MCP, FRED, Yahoo Finance, Finnhub, and even `pnpm install` itself) has to happen in an environment with real network access.
- Session 2 is expected to be the first theme-specific session: wiring `bitget-signal`'s `news-briefing` and `macro-analyst` skills as the perception layer, populating the ledger with real signal cards, and replacing the disabled chat input with a working LUI. Per the ruleset, that should likely be split into more than one session if it starts touching many files at once (e.g. a "wire the two skills + define signal-card types" session, separate from "build the interactive chat + pin-to-ledger flow" session) — flagging this now rather than deciding it unilaterally later.

**Style history (first entry — nothing to compare against, log starts now):**
- **Palette family:** dusk-desk — deep indigo base (`#171B2E`), slate-blue surface (`#232A44`), warm paper-toned text (`#E7E3D8`), two restrained accents (amber `#E8A33D`, teal `#4FA6A0`), muted brick red for contradicting evidence (`#C1554A`)
- **Type pairing:** Newsreader (display, italic) / IBM Plex Sans (body) / IBM Plex Mono (data-only) — a three-way system, not a simple two-way pairing
- **Layout paradigm:** three-pane desk — left log rail, center evidence ledger, right persistent chat panel
- **Signature element:** the source trail — a monospace, teletype-style, timestamped strip under each signal card showing exactly which sources fed a detected gap
- **Logo approach:** typographic wordmark, "Nightwire," with one geometric modification — an amber underline beneath "wire" only, standing in for a ticker-tape tick
