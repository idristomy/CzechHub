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

export const areaColor = (code: string): string =>
  (AREA_COLORS as Record<string, string>)[code] ?? COLORS.blue;
