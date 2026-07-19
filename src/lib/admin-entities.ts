// Shared, declarative config for every editable collection.
// Used by the admin UI (to render tables + forms) and the write API (to
// validate the table name and whitelist which columns may be written).

export type FieldType = "text" | "textarea" | "url" | "date" | "number" | "select" | "image" | "combo";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  options?: string[];
  // populate a select from another loaded entity's rows
  optionsFrom?: { entity: EntityKey; value: string; label: string };
  required?: boolean;
  placeholder?: string;
  full?: boolean; // span both form columns
  uploadFolder?: string; // for "image" fields: storage subfolder to upload into
  hint?: string; // small helper text under the field
  readOnly?: boolean; // shown but not editable, and never written back
  autoLead?: boolean; // derive value from the MC member assigned to this area
};

export type EntityKey =
  | "mc"
  | "lcs"
  | "lcmembers"
  | "resources"
  | "events"
  | "news";

export type Entity = {
  key: EntityKey;
  table: string;
  navLabel: string;
  title: string;
  subtitle: string;
  singular: string;
  idField: string; // primary key used for update/delete
  order: string; // column to sort by when listing
  fields: Field[];
};

const AREA_CODES = ["President", "MKT", "OGX", "ICX", "BD", "TM", "FIN"];

// Social platform links every member can fill in (rendered on their card/modal).
const SOCIAL_FIELDS: Field[] = [
  { key: "linkedin", label: "LinkedIn", type: "url", placeholder: "https://linkedin.com/in/…" },
  { key: "instagram", label: "Instagram", type: "url", placeholder: "https://instagram.com/…" },
  { key: "facebook", label: "Facebook", type: "url", placeholder: "https://facebook.com/…" },
  { key: "twitter", label: "X (Twitter)", type: "url", placeholder: "https://x.com/…" },
  { key: "tiktok", label: "TikTok", type: "url", placeholder: "https://tiktok.com/@…" },
];

export const ENTITIES: Record<EntityKey, Entity> = {
  mc: {
    key: "mc",
    table: "mc_members",
    navLabel: "MC Board",
    title: "MC Board",
    subtitle: "National Managing Committee members.",
    singular: "member",
    idField: "id",
    order: "sort",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "role", label: "Role", type: "select", options: ["MCP", "MCVP"], required: true },
      { key: "area", label: "Area / Department", type: "text", required: true, placeholder: "MKT & OGV", hint: "For an MCVP this becomes a Functional Area page, named exactly as typed. Deleting this member removes that area." },
      { key: "bio", label: "Bio", type: "textarea", full: true, hint: "The member's personal bio. (The area's description is set in Functional Areas.)" },
      ...SOCIAL_FIELDS,
      { key: "photo", label: "Profile photo", type: "image", full: true, uploadFolder: "mc", hint: "Portrait, ~3:4 (e.g. 600×800px). Face centered near the top." },
      { key: "sort", label: "Sort order", type: "number" },
    ],
  },
  lcs: {
    key: "lcs",
    table: "lcs",
    navLabel: "Local Committees",
    title: "Local Committees",
    subtitle: "The Czech local committees.",
    singular: "LC",
    idField: "id",
    order: "sort",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "slug", label: "Slug (URL id)", type: "text", required: true, placeholder: "prague" },
      { key: "city", label: "City", type: "text", required: true },
      { key: "university", label: "University", type: "text" },
      { key: "lcp", label: "President (LCP)", type: "text" },
      { key: "intro", label: "Intro", type: "textarea", full: true },
      { key: "color", label: "Accent color (hex)", type: "text", placeholder: "#037ef3" },
      { key: "sort", label: "Sort order", type: "number" },
    ],
  },
  lcmembers: {
    key: "lcmembers",
    table: "lc_members",
    navLabel: "LC Boards",
    title: "LC Executive Boards",
    subtitle: "Executive board members of each local committee.",
    singular: "board member",
    idField: "id",
    order: "sort",
    fields: [
      { key: "lc_slug", label: "Local Committee", type: "select", optionsFrom: { entity: "lcs", value: "slug", label: "city" }, required: true },
      { key: "name", label: "Name", type: "text", required: true },
      { key: "role", label: "Role", type: "select", options: ["LCP", "LCVP"], required: true },
      { key: "area", label: "Area", type: "select", options: AREA_CODES, required: true },
      { key: "bio", label: "Bio", type: "textarea", full: true, hint: "Shown on the member's profile card." },
      { key: "email", label: "Email", type: "text", placeholder: "name@aiesec.cz" },
      ...SOCIAL_FIELDS,
      { key: "photo", label: "Profile photo", type: "image", full: true, uploadFolder: "lc", hint: "Portrait, ~3:4 (e.g. 600×800px). Face centered near the top." },
      { key: "sort", label: "Sort order", type: "number" },
    ],
  },
  resources: {
    key: "resources",
    table: "resources",
    navLabel: "Resources",
    title: "Resources",
    subtitle: "Documents, tools and templates.",
    singular: "resource",
    idField: "id",
    order: "sort",
    fields: [
      { key: "label", label: "Title", type: "text", required: true },
      { key: "cat", label: "Category", type: "combo", optionsFrom: { entity: "mc", value: "area", label: "area" }, required: true, hint: "Type a department (e.g. MKT) or pick an MC area." },
      { key: "desc", label: "Description", type: "textarea", full: true },
      { key: "url", label: "Link URL", type: "url", full: true, required: true },
      { key: "type", label: "Type", type: "select", options: ["pdf", "doc", "link", "sheet", "folder"], required: true },
      { key: "sort", label: "Sort order", type: "number" },
    ],
  },
  events: {
    key: "events",
    table: "events",
    navLabel: "Events",
    title: "Events",
    subtitle: "Conferences, trainings and deadlines.",
    singular: "event",
    idField: "id",
    order: "date",
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "date", label: "Start date", type: "date", required: true },
      { key: "end", label: "End date", type: "date", required: true },
      { key: "location", label: "Location", type: "text" },
      { key: "type", label: "Type", type: "select", options: ["National", "Training", "Deadline", "International"], required: true },
      { key: "reg", label: "Registration URL", type: "url", full: true },
      { key: "sort", label: "Sort order", type: "number" },
    ],
  },
  news: {
    key: "news",
    table: "news",
    navLabel: "News",
    title: "News",
    subtitle: "Announcements and updates.",
    singular: "post",
    idField: "id",
    order: "date",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "date", label: "Date", type: "date", required: true },
      { key: "body", label: "Body", type: "textarea", full: true, required: true },
      { key: "sort", label: "Sort order", type: "number" },
    ],
  },
};

// Functional Areas admin view. Areas are generated from the MC board (one per
// MCVP), so this "entity" writes to the mc_members table: adding an area creates
// an MCVP, editing changes its department/description/slides, deleting removes
// the MCVP (and thus the area). It shares the mc_members table with the `mc`
// entity; the write API unions both forms' columns per table (see tableFields).
export const AREA_ADMIN_ENTITY: Entity = {
  key: "areas" as EntityKey,
  table: "mc_members",
  navLabel: "Functional Areas",
  title: "Functional Areas",
  subtitle: "Generated from the MC board — each MCVP leads one area. Add areas or edit their description, slides and order here.",
  singular: "area",
  idField: "id",
  order: "sort",
  fields: [
    { key: "area", label: "Area / Department", type: "text", required: true, placeholder: "MKT & OGV", hint: "The area name, exactly as shown on the site." },
    { key: "name", label: "Lead (MCVP name)", type: "text", hint: "The MCVP who leads this area." },
    { key: "area_desc", label: "Description", type: "textarea", full: true, hint: "Shown on the area card and page (not on the member)." },
    { key: "slides", label: "Slides embed URL", type: "url", full: true, hint: "Optional. Shown on the area page." },
    { key: "sort", label: "Sort order", type: "number", hint: "Shared with the MC board — the MCP is 1, so the first area is 2." },
  ],
};

// Global site settings — a single-row table edited from its own admin section
// (not part of the ENTITIES table list). Registered below so the write API
// accepts it and whitelists its columns.
export const SETTINGS_ENTITY: Entity = {
  key: "settings" as EntityKey,
  table: "settings",
  navLabel: "Site Settings",
  title: "Site Settings",
  subtitle: "Global text and numbers shown across the public site.",
  singular: "settings",
  idField: "id",
  order: "id",
  fields: [
    { key: "term_label", label: "Term label", type: "text", full: true, hint: 'Badge on the MC page, e.g. "2025 — 2026 Term".' },
    { key: "term_dates", label: "Term dates", type: "text", full: true, hint: 'e.g. "July 2025 — June 2026".' },
    { key: "stat_members", label: "Active members", type: "text", hint: 'Home stat — a suffix is allowed, e.g. "340+".' },
    { key: "stat_lcs", label: "Local committees", type: "text" },
    { key: "stat_programs", label: "Exchange programs", type: "text" },
    { key: "stat_countries", label: "Countries reached", type: "text" },
    { key: "stat_areas", label: "Functional areas", type: "text" },
  ],
};

// Every entity that maps to a database table. Multiple entities can share a
// table (e.g. `mc` and the Functional Areas view both write to mc_members), so
// column/type lookups below union their fields per table.
const ALL_ENTITIES: Entity[] = [...Object.values(ENTITIES), AREA_ADMIN_ENTITY, SETTINGS_ENTITY];

/** Whether the write API recognises this table. */
export function isWritableTable(table: string): boolean {
  return ALL_ENTITIES.some((e) => e.table === table);
}

/** All field definitions that write to a table, unioned by column (first wins). */
export function tableFields(table: string): Field[] {
  const byKey = new Map<string, Field>();
  for (const e of ALL_ENTITIES) {
    if (e.table !== table) continue;
    for (const f of e.fields) if (!byKey.has(f.key)) byKey.set(f.key, f);
  }
  return [...byKey.values()];
}

/** Primary key column for a table. */
export function tableIdField(table: string): string {
  return ALL_ENTITIES.find((e) => e.table === table)?.idField ?? "id";
}

/** Columns the API is allowed to write for a given table. */
export function writableColumns(table: string): string[] {
  return tableFields(table).map((f) => f.key);
}
