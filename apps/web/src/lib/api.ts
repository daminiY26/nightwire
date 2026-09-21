import type { ApiResponse, SignalCard, Watch } from "@nightwire/types";

/**
 * Server-side fetch helpers for apps/api, used by the desk page's initial
 * load. Session 4 also imports API_URL directly into DeskShell (a Client
 * Component) for the interactive chat → POST /research call — that one
 * runs in the browser, which is why apps/api's CORS middleware
 * (WEB_ORIGIN, set up in Session 1) actually matters now; it was inert
 * until this session.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

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
