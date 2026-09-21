/**
 * Nightwire design tokens — canonical, documented source (Build Ruleset §8.7).
 *
 * These values are mirrored into the Tailwind v4 `@theme` block at
 * apps/web/src/app/globals.css. Tailwind v4 has no JS config file to import
 * design tokens from at build time (CSS-first config replaced tailwind.config.js),
 * so the two files must be kept in sync by hand. That duplication is a known,
 * accepted trade-off — see SESSION_REPORT.md "Known stubs/mocks/TODOs" — not
 * an oversight to silently fix by adding a build step nobody asked for.
 *
 * Concept: the after-hours desk. This hackathon's own framing is "humans
 * sleep, Agents don't" — the palette is a desk lamp still on at 3am, not a
 * daylight SaaS dashboard.
 */

export const colors = {
  duskLedger: { hex: "#171B2E", role: "Base background — the after-hours desk" },
  slateWire: { hex: "#232A44", role: "Card/panel surface, one step up from base" },
  paperFog: { hex: "#E7E3D8", role: "Primary text — warm off-white, reads like paper" },
  lampAmber: { hex: "#E8A33D", role: "Signature accent — marks a detected gap/signal" },
  ledgerTeal: { hex: "#4FA6A0", role: "Secondary accent — marks verified/sourced data" },
  wireRed: { hex: "#C1554A", role: "Muted accent — thesis-contradicting evidence" },
} as const;

export const type = {
  display: {
    family: "Newsreader",
    usage: "Headlines, thesis statements — editorial/dispatch register",
  },
  body: {
    family: "IBM Plex Sans",
    usage: "UI copy, controls",
  },
  mono: {
    family: "IBM Plex Mono",
    usage:
      "Reserved for live numbers and machine-sourced facts only — mono is a learned signal for 'this is data, not narrative'",
  },
} as const;

export const radius = {
  card: "8px",
} as const;

export const motion = {
  sourceTrailReveal: {
    description:
      "New source-trail entries print in with a brief left-to-right teletype reveal",
    durationMs: 220,
    respectsReducedMotion: true,
  },
} as const;
