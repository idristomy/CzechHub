import type { AreaCode } from "./types";

export const COLORS = {
  blue: "#037ef3",
  navy: "#0d1b3e",
  deep: "#0a1530",
  sky: "#62b7ff",
  teal: "#0cb9c1",
  orange: "#f48924",
  red: "#f85a40",
  purple: "#7552cc",
  green: "#00c16e",
  yellow: "#ffc845",
  gray: "#52565e",
  light: "#f8f8f8",
} as const;

export const AREA_COLORS: Record<AreaCode, string> = {
  MKT: COLORS.orange,
  OGX: COLORS.teal,
  ICX: COLORS.green,
  BD: COLORS.purple,
  TM: COLORS.red,
  PM: COLORS.blue,
  FIN: COLORS.yellow,
};

const PALETTE = [COLORS.orange, COLORS.teal, COLORS.green, COLORS.purple, COLORS.red, COLORS.yellow, COLORS.blue];

// Accepts a known code ("MKT"), a department string ("MKT & OGV" → matches its
// first token), or any free text (deterministic palette colour as a fallback).
export const areaColor = (code: string): string => {
  const map = AREA_COLORS as Record<string, string>;
  const key = String(code ?? "").trim().toUpperCase();
  if (map[key]) return map[key];
  const first = key.split(/[^A-Z0-9]+/).filter(Boolean)[0];
  if (first && map[first]) return map[first];
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
};
