import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client placeholder.
 *
 * The frontend currently reads from src/lib/data.ts (static).
 * Once Supabase is provisioned, set NEXT_PUBLIC_SUPABASE_URL and
 * NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local and swap the bodies of
 * the getX() functions in data.ts to use this client.
 *
 * Example schema (tables mirror the types in lib/types.ts):
 *   areas        — code, name, desc, mcvp, slides
 *   mc_members   — id, role, name, area, bio, linkedin, photo
 *   lcs          — id, slug, name, city, university, lcp, intro, color
 *   lc_members   — lc_slug, name, role, area
 *   resources    — cat, label, desc, url, type
 *   events       — id, name, date, end, location, type, reg
 *   news         — id, date, title, body
 *   admin_users  — id, email, role
 */

let _client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (_client) return _client;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  _client = createClient(url, key);
  return _client;
}
