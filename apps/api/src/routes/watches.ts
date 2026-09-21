import { Router } from "express";
import type { ApiResponse, SignalCard, Watch } from "@nightwire/types";
import { requireAuth } from "../lib/auth-middleware.js";
import { listSignalCardsForWatch, listWatchesForUser } from "../lib/db/watches-repo.js";

export const watchesRouter = Router();

watchesRouter.use(requireAuth);

watchesRouter.get("/", async (req, res) => {
  try {
    const watches = await listWatchesForUser(req.db!);
    const body: ApiResponse<Watch[]> = { data: watches, error: null };
    res.json(body);
  } catch (err) {
    console.error("GET /watches failed:", err);
    const body: ApiResponse<never> = {
      data: null,
      error: { code: "list_watches_failed", message: err instanceof Error ? err.message : "Unknown error." },
    };
    res.status(502).json(body);
  }
});

watchesRouter.get("/:watchId/signals", async (req, res) => {
  try {
    const cards = await listSignalCardsForWatch(req.db!, req.params.watchId);
    const body: ApiResponse<SignalCard[]> = { data: cards, error: null };
    res.json(body);
  } catch (err) {
    console.error("GET /watches/:watchId/signals failed:", err);
    const body: ApiResponse<never> = {
      data: null,
      error: { code: "list_signals_failed", message: err instanceof Error ? err.message : "Unknown error." },
    };
    res.status(502).json(body);
  }
});
