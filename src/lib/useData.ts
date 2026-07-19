"use client";

import { useCallback, useEffect, useState } from "react";
import { supabaseBrowser } from "./supabase/client";

/**
 * Reads a collection from Supabase, seeded with static fallback data so the
 * page renders instantly and still works when Supabase isn't configured yet.
 * Returns `refresh` so the admin panel can re-pull after an edit.
 */
export function useCollection<T>(
  table: string,
  fallback: T[],
  order?: string,
  ascending = true
) {
  const [data, setData] = useState<T[]>(fallback);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    const sb = supabaseBrowser();
    if (!sb) return; // not configured → keep fallback
    setLoading(true);
    let query = sb.from(table).select("*");
    if (order) query = query.order(order, { ascending });
    // Deterministic tiebreaker so rows sharing a sort value keep a stable order.
    query = query.order("id", { ascending: true });
    const { data: rows, error } = await query;
    setLoading(false);
    if (!error && rows) setData(rows as T[]);
  }, [table, order, ascending]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, loading, refresh };
}

/** Group a flat list into a Record keyed by one field (e.g. lc_members by lc_slug). */
export function groupBy<T, K extends string>(rows: T[], key: (row: T) => K): Record<K, T[]> {
  const out = {} as Record<K, T[]>;
  for (const row of rows) {
    const k = key(row);
    (out[k] ||= []).push(row);
  }
  return out;
}
