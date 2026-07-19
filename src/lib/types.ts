export type AreaCode = "MKT" | "OGX" | "ICX" | "BD" | "TM" | "PM" | "FIN";

export type Area = {
  code: AreaCode;
  name: string;
  desc: string;
  mcvp: string;
  slides: string;
};

export type Member = {
  id: number;
  role: "MCP" | "MCVP";
  name: string;
  area: string;
  bio: string; // personal bio (member)
  area_desc: string; // area description (functional area)
  slides: string; // area slides (functional area)
  linkedin: string;
  instagram: string;
  facebook: string;
  twitter: string;
  tiktok: string;
  email: string;
  photo: string | null;
};

export type Socials = {
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
};

export type LC = {
  id: number;
  slug: string;
  name: string;
  city: string;
  university: string;
  lcp: string;
  intro: string;
  color: string;
};

export type LCMember = {
  name: string;
  role: "LCP" | "LCVP";
  area: string;
  bio?: string;
  email?: string;
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
  photo?: string | null;
};

export type Resource = {
  cat: string;
  label: string;
  desc: string;
  url: string;
  type: "pdf" | "doc" | "link" | "sheet" | "folder";
};

export type EventItem = {
  id: number;
  name: string;
  date: string;
  end: string;
  location: string;
  type: "National" | "Training" | "Deadline" | "International";
  reg: string | null;
};

export type NewsItem = {
  id: number;
  date: string;
  title: string;
  body: string;
};
