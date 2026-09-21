import type { SignalCard, Watch } from "@nightwire/types";
import type { SignalSource } from "../signal-source.js";

/**
 * Hand-written fixture data, not a call to any real service. Mirrors the
 * scenario in docs/design/preview.html so the design mockup and the real
 * app agree on what a filled state looks like. Every SourceTrailEntry uses
 * source: "fixture" specifically so this is visually distinguishable in
 * the UI from a real "news-briefing" / "macro-analyst" entry once Session 3
 * adds those — see the Badge rendering in apps/web's SignalCardView.
 */
const WATCHES: Watch[] = [
  {
    id: "watch-nvda-guidance",
    label: "NVDA guidance gap",
    thesisQuestion: "Does NVDA's Q3 guidance contradict what the market already priced in?",
    createdAt: "2026-09-10T14:00:00.000Z",
  },
];

const SIGNAL_CARDS: Record<string, SignalCard[]> = {
  "watch-nvda-guidance": [
    {
      id: "signal-nvda-01",
      watchId: "watch-nvda-guidance",
      headline: "Guidance implies a gap the print hasn't closed",
      gapSummary:
        "Guidance language on data-center demand softened quarter over quarter, but same-day consensus EPS revisions moved the other way.",
      confidence: "medium",
      createdAt: "2026-09-10T14:02:00.000Z",
      updatedAt: "2026-09-10T14:05:00.000Z",
      sourceTrail: [
        {
          id: "trail-01",
          source: "fixture",
          timestamp: "2026-09-10T14:02:00.000Z",
          summary:
            "Guidance call flagged softer data-center demand language vs. last quarter (fixture — stands in for news-briefing)",
          supportsThesis: true,
        },
        {
          id: "trail-02",
          source: "fixture",
          timestamp: "2026-09-10T14:03:00.000Z",
          summary:
            "Semis sector correlation to 10Y yield loosened over the trailing 20 sessions (fixture — stands in for macro-analyst)",
          supportsThesis: true,
        },
        {
          id: "trail-03",
          source: "fixture",
          timestamp: "2026-09-10T14:05:00.000Z",
          summary:
            "Consensus EPS revised up 3% same-day — against the softer-guidance read (fixture — stands in for finnhub)",
          supportsThesis: false,
        },
      ],
    },
  ],
};

export class FixtureSignalSource implements SignalSource {
  async listWatches(): Promise<Watch[]> {
    return WATCHES;
  }

  async listSignalCards(watchId: string): Promise<SignalCard[]> {
    return SIGNAL_CARDS[watchId] ?? [];
  }

  /**
   * Deliberately ignores `question` — this is the fixture source. It always
   * returns the one canned NVDA scenario so the read path (Session 2) and
   * the research action (Session 3) agree on what data looks like in
   * fixture mode. See LiveSignalSource for the version that actually uses
   * the question.
   */
  async runResearch(_question: string): Promise<{ watch: Watch; signalCards: SignalCard[] }> {
    const watch = WATCHES[0];
    return { watch, signalCards: SIGNAL_CARDS[watch.id] ?? [] };
  }
}
