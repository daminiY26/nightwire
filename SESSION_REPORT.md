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

---

## Session 2: Signal Cards, Read Path
**Date:** 2026-09-14
**Goal:** Render real signal cards end to end — through a defined, swappable data-source interface — so the ledger and desk log show real data instead of Session 1's empty state. Read-only. No chat wiring, no watch creation, no live bitget-signal/MCP integration — all explicitly deferred (see below).

**Files added/changed:**
- `packages/types/src/api.ts` — the generic types from Session 1's `index.ts`, moved here unchanged
- `packages/types/src/signals.ts` — new: `SignalConfidence`, `SourceKind`, `SourceTrailEntry`, `SignalCard`, `Watch`
- `packages/types/src/index.ts` — now barrels both `./api` and `./signals`
- `apps/api/src/lib/signal-source.ts` — new: `SignalSource` interface + `getSignalSource()` factory (env-var-selected, throws on anything but `"fixture"`)
- `apps/api/src/lib/signal-sources/fixture-signal-source.ts` — new: hand-written fixture data, mirrors `docs/design/preview.html`'s scenario, every entry tagged `source: "fixture"`
- `apps/api/src/routes/watches.ts` — new: `GET /watches`, `GET /watches/:watchId/signals`
- `apps/api/src/index.ts` — mounts `watchesRouter`
- `apps/api/.env.example` — added `SIGNAL_SOURCE` (default `fixture`)
- `apps/web/src/lib/api.ts` — new: server-side fetch helpers (`fetchWatches`, `fetchSignalCards`), `no-store` cache, callers must try/catch
- `apps/web/src/components/signal-card.tsx` — new: `SignalCardView`, the source-trail signature element rendered for real
- `apps/web/src/components/desk-shell.tsx` — now takes `watches`/`signalCards` props; desk log and ledger render real data; falls back to Session 1's exact empty-state copy when either array is empty
- `apps/web/src/app/(desk)/desk/page.tsx` — fetches from apps/api server-side inside try/catch; degrades to empty state on failure rather than crashing

**Current full file tree:**
(regenerated via `find`, not recalled)
```
.github/workflows/ci.yml
.gitignore
README.md
SESSION_REPORT.md
apps/api/.env.example
apps/api/package.json
apps/api/railway.json
apps/api/src/index.ts
apps/api/src/lib/signal-source.ts
apps/api/src/lib/signal-sources/fixture-signal-source.ts
apps/api/src/lib/supabase.ts
apps/api/src/routes/health.ts
apps/api/src/routes/watches.ts
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
apps/web/src/components/signal-card.tsx
apps/web/src/lib/api.ts
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
packages/types/src/api.ts
packages/types/src/index.ts
packages/types/src/signals.ts
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

**Dependencies:** none added this session. Everything runs on what Session 1 already declared.

**Supabase schema state:** unchanged — still no custom tables. Watches/signal cards are NOT in Supabase; they come from apps/api's `SignalSource`, currently in-memory fixture data (nothing persisted anywhere yet).

**Env vars required:** unchanged from Session 1, plus `SIGNAL_SOURCE` (apps/api, default `fixture`) — see updated `apps/api/.env.example`.

**API endpoints live:**
- `GET /health` (apps/api)
- `GET /watches` (apps/api) — returns fixture watch list
- `GET /watches/:watchId/signals` (apps/api) — returns fixture signal cards for that watch
- `POST /auth/sign-out` (apps/web)

**Known stubs/mocks/TODOs:**
- **All carried over from Session 1** re: no live network verification this whole build — still true, still unresolved, still needs a real `pnpm install` in a networked environment.
- **Signal data is 100% fixture, clearly labeled.** `FixtureSignalSource` returns hand-written data; every `SourceTrailEntry.source` is `"fixture"`, and `SignalCardView` renders a visible "fixture data" badge whenever a card is fixture-sourced. This is NOT a claim of working bitget-signal integration — don't let this get mistaken for that in the submission's Project Description.
- **Live bitget-signal/MCP integration is still fully undesigned**, and it's more architecturally involved than initially assumed. New finding this session: Bitget's `bitget-mcp-server` (from `BitgetLimited/agent_hub`) **runs locally via stdio transport** — confirmed via web search this session (source: mcp.directory listing for Agent Hub). That means apps/api, if deployed to Railway as planned, can't treat it as a remote MCP server the way e.g. Anthropic's hosted-MCP-connector pattern expects. Realistic options for Session 3, none yet chosen:
  1. apps/api spawns `bitget-mcp-server` as a local child process (stdio) using the MCP TypeScript SDK, and itself becomes the MCP client — feasible in Node/Express, but means apps/api's deploy target needs to be able to spawn that process (may complicate the Railway plan).
  2. The actual demo runs through Claude Code / Claude Desktop directly (where a human or agent session has the MCP server attached locally), with our web app as a secondary viewer rather than the live orchestrator.
  3. Some hybrid: apps/api pre-fetches/caches skill output on a schedule from a machine that does have the MCP server attached, and only serves cached results.
  This wasn't resolved now because it's a real architecture fork with consequences for apps/api's runtime and deploy target, and this sandbox can't test any of the three paths. Flagging for a decision when picking Session 3's scope, rather than guessing.
- **No watch creation, no chat.** The "+ New Watch" button and the chat input are both still `disabled` in `DeskShell` — intentionally out of this session's scope.
- **`SignalSource.listSignalCards` takes a bare `watchId` string with no auth/ownership check** — fine for a single-fixture-watch demo, not fine once real users have real watches. Flag for whichever session adds persistence.

**Assumptions carried into next session:**
- Everything from Session 1's list still holds (sub-theme, LUI shape, full stack, pnpm/turborepo, Vercel/Railway, no-network sandbox).
- Session 3 needs to pick one of the three live-integration paths above before writing more `signal-source` code — this is the biggest open decision in the project right now, bigger than any remaining UI work.
- The chat/LUI panel wiring and the live signal source are likely two different sessions even once the architecture is chosen, per the ruleset's session-sizing guidance — flagging again rather than deciding unilaterally.

**Style history:** no new UI-touching design decisions this session — `SignalCardView` and the updated `DeskShell` states apply Session 1's approved tokens directly (badge variants, mono source-trail styling, teal/red supports-thesis split) rather than introducing anything new. Nothing to log.

---

## Session 3: Live Orchestration Engine
**Date:** 2026-09-14
**Goal:** Build the real bitget-signal + Claude orchestration loop behind `SIGNAL_SOURCE=live`, per the person's explicit choice: apps/api owns the MCP connection itself. Backend only — no chat UI wiring (still Session 4+, per Session 2's flag).

**Important correction to Session 2's report:** Session 2 concluded the Bitget MCP server "runs locally via stdio transport" and that apps/api couldn't treat it as remote. That was true of `bitget-mcp-server` (Bitget Agent Hub's *trading* tools — account, orders, positions) but **not** of `bitget-signal` (the 5 *research* skills this project actually needs: macro-analyst, market-intel, news-briefing, sentiment-analyst, technical-analysis). Re-verified this session via glama.ai's own listing: `bitget-signal` is installed via `npx @bitget-ai/bitget-signal --target <tool>`, which registers **the public bitget-signal MCP server (HTTP transport)** — no account, no API key, no local process to spawn. Session 2 conflated the two servers. Corrected in `apps/api/src/lib/mcp/bitget-signal-client.ts`'s own doc comment so this doesn't get re-litigated later.

**What's still genuinely unresolved:** the exact HTTP endpoint URL. Bitget's installer writes it into the target tool's MCP config at install time; it isn't published as a static doc URL, and it didn't surface through glama.ai's overview page, schema page (server "not inspected yet" — no tools/schema listed there either), or general web search. This session's code reads the URL from `BITGET_SIGNAL_MCP_URL` and refuses to guess it — see the doc comment in `bitget-signal-client.ts` for the exact one-time step to get it (run the installer once on a networked machine, read the URL back out of that tool's MCP config). Exact tool names/input schemas the server exposes are similarly unconfirmed — the code doesn't hardcode any tool name; it fetches whatever `listTools()` returns at runtime and hands all of it to Claude, so this isn't blocking, but it does mean the system prompt can only describe tools generically.

**Files added/changed:**
- `packages/types/src/signals.ts` — `SourceKind` gains `"live"`; `SourceTrailEntry` gains optional `toolName`
- `apps/api/src/lib/mcp/bitget-signal-client.ts` — new: MCP client over `StreamableHTTPClientTransport`, cached connection, `listBitgetSignalTools()`, `callBitgetSignalTool()`
- `apps/api/src/lib/orchestrator/tools.ts` — new: `EMIT_SIGNAL_CARD_TOOL` (local structured-output tool, not from MCP) + its input type
- `apps/api/src/lib/orchestrator/research-agent.ts` — new: the actual tool-use loop against `claude-sonnet-5` (max 8 turns), converts MCP tools → `Anthropic.Tool[]`, includes an anti-fabrication check (see below)
- `apps/api/src/lib/signal-sources/live-signal-source.ts` — new: `SignalSource` implementation; `listWatches`/`listSignalCards` intentionally return `[]` (no persistence layer exists — see stubs below), `runResearch` calls the real agent loop
- `apps/api/src/lib/signal-source.ts` — `SignalSource` interface gains `runResearch()`; factory now also handles `SIGNAL_SOURCE=live`
- `apps/api/src/lib/signal-sources/fixture-signal-source.ts` — gains `runResearch()`, ignores the question, returns the same canned scenario
- `apps/api/src/routes/research.ts` — new: `POST /research { question }` → `{ watch, signalCards }`
- `apps/api/src/index.ts` — mounts `researchRouter` at `/research`
- `apps/api/package.json` — adds `@anthropic-ai/sdk`, `@modelcontextprotocol/sdk`
- `apps/api/.env.example` — adds `ANTHROPIC_API_KEY`, `BITGET_SIGNAL_MCP_URL`, updates `SIGNAL_SOURCE` comment
- `apps/web/src/components/signal-card.tsx` — new `sourceLabel()` resolver: falls back to `entry.toolName` for `"live"` entries instead of a fixed label map

**A safety feature worth calling out explicitly:** the agent loop tracks every bitget-signal tool call it actually makes (`toolCallLog`). When Claude's final `emit_signal_card` call cites a source, `research-agent.ts` cross-checks the cited `toolName` against that log and **drops any entry that doesn't match a real call** (logs a warning, and if every cited entry gets dropped, forces `confidence: "low"` and appends a note to `gapSummary`). This stops the model from fabricating a source in its own structured output — which would otherwise be exactly the kind of quiet failure this whole product is supposed to catch in *other* people's research.

**Current full file tree:**
(regenerated via `find`, not recalled)
```
.github/workflows/ci.yml
.gitignore
README.md
SESSION_REPORT.md
apps/api/.env.example
apps/api/package.json
apps/api/railway.json
apps/api/src/index.ts
apps/api/src/lib/mcp/bitget-signal-client.ts
apps/api/src/lib/orchestrator/research-agent.ts
apps/api/src/lib/orchestrator/tools.ts
apps/api/src/lib/signal-source.ts
apps/api/src/lib/signal-sources/fixture-signal-source.ts
apps/api/src/lib/signal-sources/live-signal-source.ts
apps/api/src/lib/supabase.ts
apps/api/src/routes/health.ts
apps/api/src/routes/research.ts
apps/api/src/routes/watches.ts
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
apps/web/src/components/signal-card.tsx
apps/web/src/lib/api.ts
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
packages/types/src/api.ts
packages/types/src/index.ts
packages/types/src/signals.ts
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

**Dependencies added:** `@anthropic-ai/sdk@^0.93.0`, `@modelcontextprotocol/sdk@^1.29.0` (apps/api) — both version-pinned from web search this session (npm/GitHub sources, current as of ~mid-2026); confirm exact patch on first real `pnpm install`. SDK usage pattern (`Anthropic.Tool[]`, `Anthropic.MessageParam[]`, `Anthropic.ToolResultBlockParam[]`, the `messages.create` → check `stop_reason === "tool_use"` → loop pattern) was cross-checked against an Anthropic-sourced example (docs.deno.com/examples/anthropic_tool_use, mirroring Anthropic's own cookbook) found this session — high confidence on shape correctness, zero confidence it's been run.

**Supabase schema state:** unchanged — still no custom tables.

**Env vars required:** everything from Sessions 1–2, plus (apps/api, required only when `SIGNAL_SOURCE=live`): `ANTHROPIC_API_KEY`, `BITGET_SIGNAL_MCP_URL`.

**API endpoints live:**
- `GET /health`, `GET /watches`, `GET /watches/:watchId/signals` (unchanged from Session 2)
- `POST /research` (apps/api) — new. Body `{ "question": string }` → `{ data: { watch, signalCards }, error: null }`. In fixture mode, ignores the question and returns the canned scenario; in live mode, runs the full agent loop and can fail with a 502 + `{ code: "research_failed", message }` if the MCP server or Anthropic API call fails.
- `POST /auth/sign-out` (apps/web, unchanged)

**Known stubs/mocks/TODOs:**
- **Still no live network verification anywhere in this build.** Nothing in `research-agent.ts` or `bitget-signal-client.ts` has actually talked to Bitget's server or the Anthropic API — this sandbox still has no network. This is the highest-risk unverified code in the project so far, precisely because it's the part that can't be sanity-checked by reading it carefully; it needs an actual run.
- **`BITGET_SIGNAL_MCP_URL` has no known value yet.** Getting it requires a one-time manual step in a networked environment — see the doc comment in `bitget-signal-client.ts`. Live mode will throw a clear error until this is set; it won't silently do anything wrong.
- **No persistence.** `LiveSignalSource.listWatches()`/`listSignalCards()` return `[]` always — a live research run's result only exists in the `POST /research` response, nothing is saved. Refreshing the desk page after a live run would lose it. This needs a real decision (Supabase tables, presumably) in a future session, not a quick in-memory-cache patch that would just move the honesty problem around.
- **Tool-name-to-badge mapping is generic.** Since exact bitget-signal tool names are unconfirmed, the UI shows whatever literal tool name Claude called (via `toolName`) rather than a polished label like "macro-analyst." Cosmetic, easy to fix once real tool names are known — not worth guessing now and risking a wrong-but-confident-looking label.
- **The system prompt describes tools generically** (no hardcoded tool names) since exact ones aren't confirmed. Once `BITGET_SIGNAL_MCP_URL` is set and `listTools()` can actually run, it's worth checking whether the model needs more specific guidance per tool (e.g., which one to reach for on a macro-vs-news question) — that's a fast follow-up, not a blocker.
- **No rate limiting, no request timeout, no caching** on `POST /research` — every call is a full fresh agent run against the live Anthropic API. Fine for a hackathon demo, not fine at any real traffic.
- **`MAX_TURNS = 8`** in `research-agent.ts` is a guess, not a tuned value — if the real tool set needs more back-and-forth to converge, raise it; if the loop reliably converges in 2-3 turns, consider lowering it to fail faster on a genuinely stuck run.

**Assumptions carried into next session:**
- Live-integration architecture is now settled: apps/api is the MCP client, connecting to bitget-signal's public HTTP server directly — no subprocess spawning, no separate always-on Claude Code session. This is simpler to deploy on Railway than the original stdio assumption implied.
- Session 4 (or whichever session tackles it) still needs to: (a) get a real `BITGET_SIGNAL_MCP_URL` and actually run this end to end once, (b) wire the chat panel to call `POST /research` and show the result, and (c) decide on persistence. Per the ruleset's session-sizing guidance, that's plausibly 2-3 more sessions, not one — flagging rather than deciding unilaterally, same as last time.
- The demo's one required "complete research task, question → actionable insight" (per the hackathon submission requirements) can now be either the fixture path (guaranteed to work, zero live-service risk) or the live path (the real pitch, but untested end to end) — worth deciding deliberately which one anchors the actual submission demo, ideally after live mode has been run at least once for real.

**Style history:** no UI-touching design decisions this session (backend-only). Nothing to log.

---

## Session 4: Interactive Chat → Ledger
**Date:** 2026-09-14
**Goal:** Wire the chat panel to `POST /research` so the desk is actually usable end to end — type a question, get a signal card pinned to the ledger. Works identically against `SIGNAL_SOURCE=fixture` or `=live`, since that's the entire point of the `SignalSource` abstraction from Session 2. No UI design changes beyond applying Session 1's already-approved tokens to new states (loading, error, multi-watch) — nothing here needed a design checkpoint.

**Why this session, not "get the live credentials and test" or "add persistence":** those were the other two options on the table. Getting live credentials isn't something buildable in this sandbox — it's a manual step for whoever has network access. Persistence is a real scope of its own (schema, RLS, migration). Wiring the chat was the largest piece of *buildable* value left, and it makes the fixture path fully demoable right now, independent of when live credentials get sorted out.

**Files changed (no new files this session):**
- `apps/web/src/components/desk-shell.tsx` — full rewrite. Now a Client Component (`"use client"`). Holds `watches`, `cardsByWatch` (keyed map, not a flat list — supports more than one watch existing in a session), `activeWatchId`, and a `messages` chat log as local state, seeded from `initialWatches`/`initialSignalCards` props. Submitting a question POSTs to `/research`, merges the returned watch + cards into state, and switches the ledger to show it. Watches in the rail are now clickable (`<button>`, was a plain `<div>`) to switch which one's shown. Stale "Live sources land in Session 3" copy removed.
- `apps/web/src/app/(desk)/desk/page.tsx` — props renamed `watches`/`signalCards` → `initialWatches`/`initialSignalCards`, matching that DeskShell now owns the data after first load.
- `apps/web/src/lib/api.ts` — `API_URL` now exported (was module-private); DeskShell imports it directly for the client-side fetch. Doc comment updated: this is the first session where a browser, not just the Next.js server, calls apps/api directly — Session 1's CORS middleware (`WEB_ORIGIN`) was written for this moment and had never actually been exercised until now.

**Current full file tree:** unchanged from Session 3's — this session only edited existing files, see list there.

**Dependencies:** none added.

**Supabase schema state:** unchanged — still no custom tables. Worth restating plainly now that it's more visible: refreshing the desk page after asking questions in chat loses everything asked — `watches`/`cardsByWatch` are React state, gone on reload. This was already true of `LiveSignalSource` since Session 3; Session 4 just makes it obvious in the UI instead of theoretical.

**Env vars required:** unchanged from Session 3.

**API endpoints live:** unchanged from Session 3 (`GET /health`, `GET /watches`, `GET /watches/:watchId/signals`, `POST /research`, `POST /auth/sign-out`) — this session is a consumer of `POST /research`, not a new endpoint.

**Known stubs/mocks/TODOs:**
- **Everything from Session 3 about live-mode being unverified still applies.** This session doesn't change that risk at all — it just means that once `BITGET_SIGNAL_MCP_URL`/`ANTHROPIC_API_KEY` are real, the chat UI is already there to exercise it with zero further UI work.
- **No loading/streaming feedback beyond a static "Checking the wire…" bubble.** A live research call can involve several tool-use turns (up to `MAX_TURNS = 8`) against a real LLM — that could take a while, and the UI currently gives no indication of progress within that wait, just a spinner-less static message. Worth revisiting once live mode is actually tested and its typical latency is known.
- **No way to delete/dismiss a watch from the rail**, and no cap on how many can pile up in one session — fine for a demo, would need attention for anything longer-lived.
- **No input validation beyond a client-side non-empty check** — the same trim-and-check `POST /research` already does server-side, just duplicated so the Send button disables correctly. Not a security boundary, just UX.
- **`crypto.randomUUID()` used client-side for chat message keys** — fine in any modern browser over HTTPS or localhost; would need a fallback if this ever needs to run in a non-secure context, which it shouldn't for a deployed app.

**Assumptions carried into next session:**
- The product is now demoable end to end in fixture mode: sign up → sign in → ask a question → see it land on the ledger with a full source trail. That's the "complete research task, question → actionable insight" the submission requires — it exists now, even before live mode is ever tested.
- Next real milestones, in rough priority order: (1) get real `BITGET_SIGNAL_MCP_URL` + `ANTHROPIC_API_KEY` and run `SIGNAL_SOURCE=live` for the first time ever, outside this sandbox; (2) decide on persistence if the submission wants a watch to survive a page refresh; (3) polish pass on the demo scenario specifically for the recording/screenshot the submission needs. None of these were started this session — flagging rather than assuming which one comes next.

**Style history:** no new tokens or layout decisions — new UI states (chat bubbles, clickable watch rail items, loading/error styling) all compose Session 1's existing palette and radius tokens. Nothing to log.
