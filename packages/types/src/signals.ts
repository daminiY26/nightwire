/**
 * Domain types for the "Information Extraction & Signal Generation" theme.
 * Added in Session 2 — do not backdate assumptions about these existing
 * before that session's report.
 *
 * A Watch is a standing research question. A SignalCard is one detected
 * expectation-gap for that Watch, backed by a SourceTrail of the specific
 * evidence that fed it — the trail is the artifact that proves integration
 * *effectiveness* to a judge, not just a claims list.
 */

export type SignalConfidence = "low" | "medium" | "high";

/**
 * Where a piece of evidence came from. "fixture" is Session 2's own labeled
 * stand-in for real sources — see SESSION_REPORT.md. It should never appear
 * once a real SignalSource (Session 3+) is wired in.
 */
export type SourceKind =
  | "news-briefing"
  | "macro-analyst"
  | "finnhub"
  | "manual"
  | "fixture";

export interface SourceTrailEntry {
  id: string;
  source: SourceKind;
  timestamp: string; // ISO 8601
  summary: string;
  /** false = evidence that cuts against the thesis (rendered as wire-red) */
  supportsThesis: boolean;
}

export interface SignalCard {
  id: string;
  watchId: string;
  headline: string;
  gapSummary: string;
  confidence: SignalConfidence;
  sourceTrail: SourceTrailEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface Watch {
  id: string;
  label: string;
  thesisQuestion: string;
  createdAt: string;
}
