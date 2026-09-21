import type { SupabaseClient } from "@supabase/supabase-js";
import type { SignalCard, SignalConfidence, SourceTrailEntry, Watch } from "@nightwire/types";

interface WatchRow {
  id: string;
  label: string;
  thesis_question: string;
  created_at: string;
}

interface SignalCardRow {
  id: string;
  watch_id: string;
  headline: string;
  gap_summary: string;
  confidence: SignalConfidence;
  source_trail: SourceTrailEntry[];
  created_at: string;
  updated_at: string;
}

function rowToWatch(row: WatchRow): Watch {
  return { id: row.id, label: row.label, thesisQuestion: row.thesis_question, createdAt: row.created_at };
}

function rowToSignalCard(row: SignalCardRow): SignalCard {
  return {
    id: row.id,
    watchId: row.watch_id,
    headline: row.headline,
    gapSummary: row.gap_summary,
    confidence: row.confidence,
    sourceTrail: row.source_trail,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Saves a research result under `userId`. `db` must be a request-scoped,
 * user-authenticated client (see auth-middleware.ts) — RLS's `with check
 * (auth.uid() = user_id)` policies mean an insert under the wrong user_id
 * fails at the database, not silently succeeds. `userId` is still passed
 * explicitly (rather than relying on RLS alone) so the insert payload is
 * correct in the first place.
 */
export async function saveResearchResult(
  db: SupabaseClient,
  userId: string,
  watch: Watch,
  signalCards: SignalCard[]
): Promise<void> {
  const { error: watchError } = await db.from("watches").insert({
    id: watch.id,
    user_id: userId,
    label: watch.label,
    thesis_question: watch.thesisQuestion,
    created_at: watch.createdAt,
  });
  if (watchError) {
    throw new Error(`Failed to save watch: ${watchError.message}`);
  }

  if (signalCards.length === 0) return;

  const { error: cardsError } = await db.from("signal_cards").insert(
    signalCards.map((card) => ({
      id: card.id,
      watch_id: card.watchId,
      user_id: userId,
      headline: card.headline,
      gap_summary: card.gapSummary,
      confidence: card.confidence,
      source_trail: card.sourceTrail,
      created_at: card.createdAt,
      updated_at: card.updatedAt,
    }))
  );
  if (cardsError) {
    throw new Error(`Failed to save signal cards: ${cardsError.message}`);
  }
}

export async function listWatchesForUser(db: SupabaseClient): Promise<Watch[]> {
  const { data, error } = await db
    .from("watches")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    throw new Error(`Failed to list watches: ${error.message}`);
  }
  return (data ?? []).map(rowToWatch);
}

export async function listSignalCardsForWatch(db: SupabaseClient, watchId: string): Promise<SignalCard[]> {
  const { data, error } = await db
    .from("signal_cards")
    .select("*")
    .eq("watch_id", watchId)
    .order("created_at", { ascending: true });
  if (error) {
    throw new Error(`Failed to list signal cards: ${error.message}`);
  }
  return (data ?? []).map(rowToSignalCard);
}
