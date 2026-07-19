import { COLORS } from "./theme";
import type {
  Area,
  EventItem,
  LC,
  LCMember,
  Member,
  NewsItem,
  Resource,
} from "./types";

/**
 * Static data layer. Each export will later be swapped for a Supabase query.
 * Keep the function signatures stable so the page components don't need to change.
 */

/** Placeholder shown until real member data is published. */
const TBA = "To be announced";

export const AREAS: Area[] = [
  { code: "MKT", name: "Marketing & Communications", desc: "Brand, digital presence, and member engagement across Czech Republic.", mcvp: TBA, slides: "" },
  { code: "OGX", name: "Outgoing Exchange", desc: "Facilitating outgoing volunteer & professional exchange opportunities.", mcvp: TBA, slides: "" },
  { code: "ICX", name: "Incoming Exchange", desc: "Managing incoming global talent and volunteer exchange programs.", mcvp: TBA, slides: "" },
  { code: "BD", name: "Business Development", desc: "Building partnerships and corporate relationships nationwide.", mcvp: TBA, slides: "" },
  { code: "TM", name: "Talent Management", desc: "Recruitment, member development, and HR practices across all LCs.", mcvp: TBA, slides: "" },
  { code: "FIN", name: "Finance", desc: "Financial governance, reporting, and accountability for the entity.", mcvp: TBA, slides: "" },
];

const M0 = { bio: "", area_desc: "", slides: "", linkedin: "", instagram: "", facebook: "", twitter: "", tiktok: "", email: "", photo: null };
export const MC_MEMBERS: Member[] = [
  { id: 1, role: "MCP", name: TBA, area: "President", ...M0 },
  { id: 2, role: "MCVP", name: TBA, area: "MKT", ...M0 },
  { id: 3, role: "MCVP", name: TBA, area: "OGX", ...M0 },
  { id: 4, role: "MCVP", name: TBA, area: "ICX", ...M0 },
  { id: 5, role: "MCVP", name: TBA, area: "BD", ...M0 },
  { id: 6, role: "MCVP", name: TBA, area: "TM", ...M0 },
  { id: 8, role: "MCVP", name: TBA, area: "FIN", ...M0 },
];

export const LCS: LC[] = [
  { id: 1, slug: "prague", name: "AIESEC in Prague", city: "Prague", university: "Charles University / CTU", lcp: TBA, intro: "The largest and oldest LC in Czech Republic, based in Prague at Charles University and CTU.", color: COLORS.blue },
  { id: 2, slug: "brno", name: "AIESEC in Brno", city: "Brno", university: "Masaryk University / BUT", lcp: TBA, intro: "A vibrant LC at Masaryk University and Brno University of Technology.", color: COLORS.teal },
  { id: 3, slug: "ostrava", name: "AIESEC in Ostrava", city: "Ostrava", university: "VŠB-TUO", lcp: TBA, intro: "Growing LC focused on industrial and business partnerships in the Moravian-Silesian region.", color: COLORS.orange },
  { id: 4, slug: "liberec", name: "AIESEC in Liberec", city: "Liberec", university: "TU Liberec", lcp: TBA, intro: "Dynamic LC with strong exchange track record at TU Liberec.", color: COLORS.purple },
  { id: 5, slug: "olomouc", name: "AIESEC in Olomouc", city: "Olomouc", university: "Palacký University", lcp: TBA, intro: "Palacký University LC known for high-quality incoming volunteer projects.", color: COLORS.green },
];

export const LC_EB: Record<string, LCMember[]> = {
  prague: [
    { name: TBA, role: "LCP", area: "President" },
    { name: TBA, role: "LCVP", area: "MKT" },
    { name: TBA, role: "LCVP", area: "OGX" },
    { name: TBA, role: "LCVP", area: "ICX" },
    { name: TBA, role: "LCVP", area: "TM" },
    { name: TBA, role: "LCVP", area: "BD" },
  ],
  brno: [
    { name: TBA, role: "LCP", area: "President" },
    { name: TBA, role: "LCVP", area: "OGX" },
    { name: TBA, role: "LCVP", area: "ICX" },
    { name: TBA, role: "LCVP", area: "TM" },
  ],
  ostrava: [
    { name: TBA, role: "LCP", area: "President" },
    { name: TBA, role: "LCVP", area: "BD" },
    { name: TBA, role: "LCVP", area: "OGX" },
  ],
  liberec: [
    { name: TBA, role: "LCP", area: "President" },
    { name: TBA, role: "LCVP", area: "MKT" },
    { name: TBA, role: "LCVP", area: "TM" },
  ],
  olomouc: [
    { name: TBA, role: "LCP", area: "President" },
    { name: TBA, role: "LCVP", area: "ICX" },
    { name: TBA, role: "LCVP", area: "FIN" },
  ],
};

/** Flat version of LC_EB (one row per member) — fallback for the lc_members table. */
export const LC_MEMBERS_FLAT: (LCMember & { lc_slug: string })[] = Object.entries(LC_EB).flatMap(
  ([lc_slug, members]) => members.map((m) => ({ lc_slug, ...m }))
);

export const RESOURCES: Resource[] = [
  { cat: "MKT", label: "How to Handle the Promotion of Multiple Products at Once", desc: "Guide to promoting several AIESEC products simultaneously without diluting your message.", url: "https://drive.google.com/file/d/1k1I7LolQOqGnt8-sy43jN5oqtm7RofGJ/view?usp=sharing", type: "pdf" },
  { cat: "MKT", label: "Pre-Attraction Period 101", desc: "Fundamentals of running an effective pre-attraction period for your marketing funnel.", url: "https://drive.google.com/file/d/15mR2nxTTCSdJg59x6Tn83eubnn5vvTOB/view?usp=sharing", type: "pdf" },
  { cat: "MKT", label: "What AIESEC Offers — Value & Benefits of Our Products", desc: "Overview of the value and benefits behind AIESEC's products for messaging and positioning.", url: "https://drive.google.com/file/d/1G7K8z6SzKc-9AY8QX0XLB8TsyFzpv5im/view?usp=sharing", type: "pdf" },
];

export const EVENTS: EventItem[] = [];

export const NEWS: NewsItem[] = [];

// ── Fetcher functions (swap bodies to Supabase queries later) ──────
export async function getAreas(): Promise<Area[]> { return AREAS; }
export async function getArea(code: string): Promise<Area | null> { return AREAS.find((a) => a.code === code) ?? null; }
export async function getMcMembers(): Promise<Member[]> { return MC_MEMBERS; }
export async function getLcs(): Promise<LC[]> { return LCS; }
export async function getLc(slug: string): Promise<LC | null> { return LCS.find((l) => l.slug === slug) ?? null; }
export async function getLcEb(slug: string): Promise<LCMember[]> { return LC_EB[slug] ?? []; }
export async function getResources(): Promise<Resource[]> { return RESOURCES; }
export async function getEvents(): Promise<EventItem[]> { return EVENTS; }
export async function getNews(): Promise<NewsItem[]> { return NEWS; }
