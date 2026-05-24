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

export const AREAS: Area[] = [
  { code: "MKT", name: "Marketing & Communications", desc: "Brand, digital presence, and member engagement across Czech Republic.", mcvp: "Jana Novotná", slides: "https://docs.google.com/presentation/d/e/2PACX-1vSample/embed?start=false&loop=false&delayms=3000" },
  { code: "OGX", name: "Outgoing Exchange", desc: "Facilitating outgoing volunteer & professional exchange opportunities.", mcvp: "Tomáš Kratochvíl", slides: "" },
  { code: "ICX", name: "Incoming Exchange", desc: "Managing incoming global talent and volunteer exchange programs.", mcvp: "Lucie Horáková", slides: "" },
  { code: "BD", name: "Business Development", desc: "Building partnerships and corporate relationships nationwide.", mcvp: "Martin Šimánek", slides: "" },
  { code: "TM", name: "Talent Management", desc: "Recruitment, member development, and HR practices across all LCs.", mcvp: "Barbora Vlčková", slides: "" },
  { code: "PM", name: "Product Management", desc: "Digital products, tools, and platform strategy for Czech Republic.", mcvp: "Ondřej Pospíšil", slides: "" },
  { code: "FIN", name: "Finance", desc: "Financial governance, reporting, and accountability for the entity.", mcvp: "Klára Dvořáčková", slides: "" },
];

export const MC_MEMBERS: Member[] = [
  { id: 1, role: "MCP", name: "Adéla Marková", area: "President", bio: "Adéla is a final-year student at Charles University passionate about youth leadership. She joined AIESEC in 2022 and has held roles in TM and OGX before becoming MCP.", linkedin: "https://linkedin.com", photo: null },
  { id: 2, role: "MCVP", name: "Jana Novotná", area: "MKT", bio: "Jana leads brand strategy and digital communications for the Czech entity, with a background in graphic design.", linkedin: "https://linkedin.com", photo: null },
  { id: 3, role: "MCVP", name: "Tomáš Kratochvíl", area: "OGX", bio: "Tomáš drives outgoing exchange, helping Czech students find meaningful global experiences.", linkedin: "https://linkedin.com", photo: null },
  { id: 4, role: "MCVP", name: "Lucie Horáková", area: "ICX", bio: "Lucie manages partnerships with Czech host organizations and universities for incoming exchange.", linkedin: "https://linkedin.com", photo: null },
  { id: 5, role: "MCVP", name: "Martin Šimánek", area: "BD", bio: "Martin builds corporate partnerships and fundraises for the national entity.", linkedin: "https://linkedin.com", photo: null },
  { id: 6, role: "MCVP", name: "Barbora Vlčková", area: "TM", bio: "Barbora oversees member recruitment, onboarding, and ongoing development across all Czech LCs.", linkedin: "https://linkedin.com", photo: null },
  { id: 7, role: "MCVP", name: "Ondřej Pospíšil", area: "PM", bio: "Ondřej leads the digital product strategy, from internal tools to member-facing platforms.", linkedin: "https://linkedin.com", photo: null },
  { id: 8, role: "MCVP", name: "Klára Dvořáčková", area: "FIN", bio: "Klára ensures financial transparency and governance across the Czech entity and all LCs.", linkedin: "https://linkedin.com", photo: null },
];

export const LCS: LC[] = [
  { id: 1, slug: "prague", name: "AIESEC in Prague", city: "Prague", university: "Charles University / CTU", lcp: "Jakub Fiala", intro: "The largest and oldest LC in Czech Republic, based in Prague at Charles University and CTU.", color: COLORS.blue },
  { id: 2, slug: "brno", name: "AIESEC in Brno", city: "Brno", university: "Masaryk University / BUT", lcp: "Veronika Blahová", intro: "A vibrant LC at Masaryk University and Brno University of Technology.", color: COLORS.teal },
  { id: 3, slug: "ostrava", name: "AIESEC in Ostrava", city: "Ostrava", university: "VŠB-TUO", lcp: "Radek Kučera", intro: "Growing LC focused on industrial and business partnerships in the Moravian-Silesian region.", color: COLORS.orange },
  { id: 4, slug: "liberec", name: "AIESEC in Liberec", city: "Liberec", university: "TU Liberec", lcp: "Simona Procházková", intro: "Dynamic LC with strong exchange track record at TU Liberec.", color: COLORS.purple },
  { id: 5, slug: "olomouc", name: "AIESEC in Olomouc", city: "Olomouc", university: "Palacký University", lcp: "Pavel Strakoš", intro: "Palacký University LC known for high-quality incoming volunteer projects.", color: COLORS.green },
];

export const LC_EB: Record<string, LCMember[]> = {
  prague: [
    { name: "Jakub Fiala", role: "LCP", area: "President" },
    { name: "Petra Součková", role: "LCVP", area: "MKT" },
    { name: "Marek Horak", role: "LCVP", area: "OGX" },
    { name: "Anna Kopecká", role: "LCVP", area: "ICX" },
    { name: "Filip Novák", role: "LCVP", area: "TM" },
    { name: "Denisa Vlčková", role: "LCVP", area: "BD" },
  ],
  brno: [
    { name: "Veronika Blahová", role: "LCP", area: "President" },
    { name: "Jan Král", role: "LCVP", area: "OGX" },
    { name: "Kateřina Mašková", role: "LCVP", area: "ICX" },
    { name: "Tomáš Urban", role: "LCVP", area: "TM" },
  ],
  ostrava: [
    { name: "Radek Kučera", role: "LCP", area: "President" },
    { name: "Eva Černá", role: "LCVP", area: "BD" },
    { name: "Lukáš Procházka", role: "LCVP", area: "OGX" },
  ],
  liberec: [
    { name: "Simona Procházková", role: "LCP", area: "President" },
    { name: "David Krejčí", role: "LCVP", area: "MKT" },
    { name: "Klára Bartošová", role: "LCVP", area: "TM" },
  ],
  olomouc: [
    { name: "Pavel Strakoš", role: "LCP", area: "President" },
    { name: "Tereza Pokorná", role: "LCVP", area: "ICX" },
    { name: "Jiří Doležal", role: "LCVP", area: "FIN" },
  ],
};

export const RESOURCES: Resource[] = [
  { cat: "Brand", label: "AIESEC Blue Book 2016", desc: "Official brand guidelines — colors, typography, logo usage.", url: "#", type: "pdf" },
  { cat: "Brand", label: "AIESEC Way Document", desc: "Organizational philosophy and movement framework.", url: "#", type: "pdf" },
  { cat: "Governance", label: "Blue Code of Ethics", desc: "AIESEC ethics and conduct framework.", url: "#", type: "pdf" },
  { cat: "Governance", label: "Czech Entity Policy Pack", desc: "National entity policies, procedures, and governance documents.", url: "#", type: "doc" },
  { cat: "Tools", label: "GIS — Global Information System", desc: "AIESEC's global platform for exchange management.", url: "#", type: "link" },
  { cat: "Tools", label: "ExPa Exchange Platform", desc: "Platform for managing exchange participants and projects.", url: "#", type: "link" },
  { cat: "Tools", label: "AI International Portal", desc: "AIESEC International resources and global programs.", url: "#", type: "link" },
  { cat: "Templates", label: "National Contact List", desc: "Updated contacts for all MC members and LCPs.", url: "#", type: "sheet" },
  { cat: "Templates", label: "LC Tracker Template", desc: "Standardized tracker for LC reporting.", url: "#", type: "sheet" },
  { cat: "Conference", label: "NatCo Spring 2026 Materials", desc: "Presentations, outcomes and documentation from NatCo Spring 2026.", url: "#", type: "folder" },
  { cat: "Conference", label: "NatCo Autumn 2025 Materials", desc: "Presentations, outcomes and documentation from NatCo Autumn 2025.", url: "#", type: "folder" },
];

export const EVENTS: EventItem[] = [
  { id: 1, name: "NatCo Spring 2026", date: "2026-05-16", end: "2026-05-18", location: "Prague", type: "National", reg: "#" },
  { id: 2, name: "TM National Summit", date: "2026-05-25", end: "2026-05-25", location: "Brno", type: "Training", reg: "#" },
  { id: 3, name: "MKT Workshop", date: "2026-06-07", end: "2026-06-07", location: "Online", type: "Training", reg: "#" },
  { id: 4, name: "Reporting Deadline — Q2", date: "2026-06-30", end: "2026-06-30", location: "—", type: "Deadline", reg: null },
  { id: 5, name: "International Congress", date: "2026-07-10", end: "2026-07-18", location: "Budapest", type: "International", reg: "#" },
  { id: 6, name: "NatCo Autumn 2026", date: "2026-10-02", end: "2026-10-04", location: "Ostrava", type: "National", reg: null },
  { id: 7, name: "BD Bootcamp", date: "2026-09-12", end: "2026-09-12", location: "Prague", type: "Training", reg: null },
  { id: 8, name: "Reporting Deadline — Q3", date: "2026-09-30", end: "2026-09-30", location: "—", type: "Deadline", reg: null },
];

export const NEWS: NewsItem[] = [
  { id: 1, date: "2026-04-22", title: "Applications Open for NatCo Spring 2026", body: "Registration for the national conference is now open. Apply before May 1st." },
  { id: 2, date: "2026-04-15", title: "New LC Tracker Template Released", body: "TM has published the updated LC Tracker Template for the Spring term." },
  { id: 3, date: "2026-04-08", title: "CzechHub v1.0 Launched", body: "Welcome to CzechHub — the national knowledge and resource hub for AIESEC in Czech Republic." },
];

export const PORTRAITS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=faces",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop&crop=faces",
];

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
