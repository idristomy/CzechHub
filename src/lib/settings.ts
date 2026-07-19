"use client";

import { useCollection } from "./useData";

// Global site settings — editable from the admin "Site Settings" section and
// read across the public pages. Kept as a single row in the `settings` table.
export type SiteSettings = {
  term_label: string;
  term_dates: string;
  stat_members: string;
  stat_lcs: string;
  stat_programs: string;
  stat_countries: string;
  stat_areas: string;
};

export const SETTINGS_DEFAULTS: SiteSettings = {
  term_label: "2025 — 2026 Term",
  term_dates: "July 2025 — June 2026",
  stat_members: "340+",
  stat_lcs: "5",
  stat_programs: "12",
  stat_countries: "28",
  stat_areas: "6",
};

type SettingsRow = Partial<SiteSettings> & { id?: number };

/** Reads the single settings row, merged over defaults so pages never crash. */
export function useSettings(): SiteSettings {
  const { data } = useCollection<SettingsRow>("settings", [SETTINGS_DEFAULTS], "id");
  return { ...SETTINGS_DEFAULTS, ...(data[0] ?? {}) };
}

/** Splits a stat like "340+" into its number (for the count-up) and suffix. */
export function splitStat(value: string): { num: number; suffix: string } {
  const m = String(value ?? "").match(/^\s*(\d+)(.*)$/);
  if (!m) return { num: 0, suffix: String(value ?? "") };
  return { num: parseInt(m[1], 10), suffix: m[2].trim() };
}
