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
  bio: string;
  linkedin: string;
  photo: string | null;
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
