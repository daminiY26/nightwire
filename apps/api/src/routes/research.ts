import { Router } from "express";
import type { ApiResponse, SignalCard, Watch } from "@nightwire/types";
import { getSignalSource } from "../lib/signal-source.js";

export const researchRouter = Router();

researchRouter.post("/", async (req, res) => {
  const question = typeof req.body?.question === "string" ? req.body.question.trim() : "";

  if (!question) {
    const body: ApiResponse<never> = {
      data: null,
      error: { code: "invalid_request", message: "Body must include a non-empty `question` string." },
    };
    res.status(400).json(body);
    return;
  }

  try {
    const source = await getSignalSource();
    const result = await source.runResearch(question);

    const body: ApiResponse<{ watch: Watch; signalCards: SignalCard[] }> = {
      data: result,
      error: null,
    };
    res.json(body);
  } catch (err) {
    console.error("POST /research failed:", err);
    const body: ApiResponse<never> = {
      data: null,
      error: {
        code: "research_failed",
        message: err instanceof Error ? err.message : "Unknown error running research agent.",
      },
    };
    res.status(502).json(body);
  }
});
