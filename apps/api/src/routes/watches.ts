import { Router } from "express";
import type { ApiResponse, SignalCard, Watch } from "@nightwire/types";
import { getSignalSource } from "../lib/signal-source.js";

export const watchesRouter = Router();

watchesRouter.get("/", async (_req, res) => {
  const source = await getSignalSource();
  const watches = await source.listWatches();

  const body: ApiResponse<Watch[]> = { data: watches, error: null };
  res.json(body);
});

watchesRouter.get("/:watchId/signals", async (req, res) => {
  const source = await getSignalSource();
  const cards = await source.listSignalCards(req.params.watchId);

  const body: ApiResponse<SignalCard[]> = { data: cards, error: null };
  res.json(body);
});
