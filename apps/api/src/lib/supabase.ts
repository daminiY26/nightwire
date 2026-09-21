import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client for apps/api ONLY. Never expose SUPABASE_SERVICE_ROLE_KEY
 * to the browser — apps/web uses the anon key via @supabase/ssr instead.
 * Nothing calls this yet in Session 1; it exists so Session 2+ doesn't have
 * to re-derive the right pattern.
 */
export function createServiceClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set — see apps/api/.env.example"
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
