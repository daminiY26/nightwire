import type { SignalCard, Watch } from "@nightwire/types";
import type { SignalSource } from "../signal-source.js";
import { runResearchAgent } from "../orchestrator/research-agent.js";

/**
 * Real live-data source. Known limitation, worth stating plainly: there's
 * no persistence layer yet (no database — see SESSION_REPORT.md), so
 * listWatches/listSignalCards have nothing to return between requests.
 * Only runResearch does real work; its result is returned directly to the
 * caller rather than something you can look up again later. Adding
 * persistence is future work, not something to fake here with an
 * in-memory cache that would silently vanish on restart and mislead
 * whoever's debugging why a watch disappeared.
 */
export class LiveSignalSource implements SignalSource {
  async listWatches(): Promise<Watch[]> {
    return [];
  }

  async listSignalCards(_watchId: string): Promise<SignalCard[]> {
    return [];
  }

  async runResearch(question: string): Promise<{ watch: Watch; signalCards: SignalCard[] }> {
    return runResearchAgent(question);
  }
}
