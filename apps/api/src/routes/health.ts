import { Router } from "express";
import type { ApiResponse, HealthCheck } from "@nightwire/types";

export const healthRouter = Router();

healthRouter.get("/", (_req, res) => {
  const body: ApiResponse<HealthCheck> = {
    data: {
      status: "ok",
      service: "nightwire-api",
      timestamp: new Date().toISOString(),
    },
    error: null,
  };

  res.json(body);
});
