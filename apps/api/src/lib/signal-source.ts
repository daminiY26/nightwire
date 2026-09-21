import type { SignalCard, Watch } from "@nightwire/types";

/**
 * The seam between the desk UI and wherever signal data actually comes
 * from. Session 2 ships one implementation of this — FixtureSignalSource,
 * clearly labeled — so the ledger renders through a real, complete code
 * path. Session 3's job is a second implementation backed by bitget-signal
 * (news-briefing + macro-analyst) and, likely, an LLM orchestration loop.
 * Nothing that consumes SignalSource should need to change when that
 * happens — that's the point of the interface.
 */
export interface SignalSource {
  listWatches(): Promise<Watch[]>;
  listSignalCards(watchId: string): Promise<SignalCard[]>;
  /**
   * Given a free-text research question, produce a Watch + its SignalCard(s).
   * Added in Session 3. FixtureSignalSource ignores the question and returns
   * its one canned scenario; LiveSignalSource actually runs the bitget-signal
   * + Claude orchestration loop — see lib/orchestrator/research-agent.ts.
   */
  runResearch(question: string): Promise<{ watch: Watch; signalCards: SignalCard[] }>;
}

/**
 * Picks the active implementation via SIGNAL_SOURCE (default "fixture").
 * "fixture" (Session 2) and "live" (Session 3) exist. Anything else throws
 * rather than silently falling back, so a misconfigured env var fails loudly
 * instead of quietly serving fixture data under a "live" label.
 */
export async function getSignalSource(): Promise<SignalSource> {
  const mode = process.env.SIGNAL_SOURCE ?? "fixture";

  if (mode === "fixture") {
    const { FixtureSignalSource } = await import("./signal-sources/fixture-signal-source.js");
    return new FixtureSignalSource();
  }

  if (mode === "live") {
    const { LiveSignalSource } = await import("./signal-sources/live-signal-source.js");
    return new LiveSignalSource();
  }

  throw new Error(
    `SIGNAL_SOURCE="${mode}" is not implemented. Valid values are "fixture" and "live". ` +
      `See SESSION_REPORT.md, "Known stubs/mocks/TODOs".`
  );
}
