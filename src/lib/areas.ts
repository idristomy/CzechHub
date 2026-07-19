import type { Member } from "./types";

// Functional Areas are derived from the MC board: every MCVP with a department
// becomes one area, named exactly by that department field. The MCVP is its
// lead, and its description + slides come from that member. Deleting the MCVP
// therefore removes the area automatically.

export type DerivedArea = {
  slug: string; // URL id
  name: string; // department, verbatim (e.g. "MKT & OGV")
  code: string; // short badge label
  desc: string; // from the member's Description (bio) field
  slides: string; // from the member's Slides field
  lead: Member; // the MCVP
};

/** URL-safe id for an area name. */
export function slugifyArea(name: string): string {
  return (
    String(name ?? "")
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "area"
  );
}

/** Short label for the square badge (first token, upper-cased). */
export function areaCode(name: string): string {
  const first = String(name ?? "").trim().split(/[^A-Za-z0-9]+/).filter(Boolean)[0] || "AREA";
  return first.slice(0, 5).toUpperCase();
}

/** Email handle for an area (first token, lower-cased). */
export function areaHandle(name: string): string {
  const first = String(name ?? "").trim().split(/[^A-Za-z0-9]+/).filter(Boolean)[0] || "mc";
  return first.toLowerCase();
}

/** One derived area per MCVP that has a department, in board order. */
export function areasFromMembers(members: Member[]): DerivedArea[] {
  const seen = new Set<string>();
  const out: DerivedArea[] = [];
  for (const m of members) {
    if (m.role !== "MCVP") continue;
    const name = String(m.area ?? "").trim();
    if (!name) continue;
    let slug = slugifyArea(name);
    while (seen.has(slug)) slug += "-2";
    seen.add(slug);
    out.push({ slug, name, code: areaCode(name), desc: m.area_desc ?? "", slides: m.slides ?? "", lead: m });
  }
  return out;
}
