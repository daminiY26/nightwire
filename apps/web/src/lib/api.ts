import type { ApiResponse, SignalCard, Watch } from "@nightwire/types";

/**
 * Thin server-side fetch helper for apps/api. Only called from Server
 * Components/Route Handlers so far — nothing client-side hits apps/api
 * directly yet (that starts with the chat/LUI work, not this session).
 * Every call is wrapped by the caller in try/catch: apps/api being down
 * should degrade the desk to its Session 1 empty state, not crash the page.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function fetchWatches(): Promise<Watch[]> {
  const res = await fetch(`${API_URL}/watches`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`GET /watches failed: ${res.status}`);
  }
  const body: ApiResponse<Watch[]> = await res.json();
  return body.data ?? [];
}

export async function fetchSignalCards(watchId: string): Promise<SignalCard[]> {
  const res = await fetch(`${API_URL}/watches/${watchId}/signals`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`GET /watches/${watchId}/signals failed: ${res.status}`);
  }
  const body: ApiResponse<SignalCard[]> = await res.json();
  return body.data ?? [];
}
