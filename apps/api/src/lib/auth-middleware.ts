import type { NextFunction, Request, Response } from "express";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Verifies the caller's Supabase access token and attaches a client
 * scoped to that user for the rest of the request.
 *
 * Deliberately does NOT use the service-role client here. `req.db` is
 * built with the anon key plus the caller's own token in the Authorization
 * header, so every query made through it runs as that user — Postgres RLS
 * (see supabase/migrations/) enforces row ownership, not a hand-rolled
 * `where user_id = ...` filter we could get wrong. Session 1 shipped
 * `createServiceClient()` in lib/supabase.ts for anything that genuinely
 * needs to bypass RLS; nothing does yet, so it's still unused.
 */
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      userId?: string;
      db?: SupabaseClient;
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;

  if (!token) {
    res.status(401).json({
      data: null,
      error: { code: "unauthorized", message: "Missing Authorization: Bearer <token> header." },
    });
    return;
  }

  const url = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    res.status(500).json({
      data: null,
      error: {
        code: "server_misconfigured",
        message: "SUPABASE_URL and SUPABASE_ANON_KEY must be set on apps/api — see .env.example.",
      },
    });
    return;
  }

  const db = createClient(url, anonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false },
  });

  const { data, error } = await db.auth.getUser(token);
  if (error || !data.user) {
    res.status(401).json({
      data: null,
      error: { code: "unauthorized", message: "Invalid or expired token." },
    });
    return;
  }

  req.userId = data.user.id;
  req.db = db;
  next();
}
