import type { Socials } from "@/lib/types";

const PLATFORMS: { key: keyof Socials; label: string }[] = [
  { key: "linkedin", label: "LinkedIn" },
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "twitter", label: "X" },
  { key: "tiktok", label: "TikTok" },
];

/** Renders a pill link for each social platform the member has filled in. */
export default function SocialLinks({ socials }: { socials: Socials }) {
  const items = PLATFORMS.filter((p) => {
    const v = socials[p.key];
    return typeof v === "string" && v.trim() !== "";
  });
  if (items.length === 0) return null;
  return (
    <>
      {items.map((p) => (
        <a
          key={p.key}
          href={socials[p.key]}
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "10px 16px",
            background: "#f1f3f8",
            color: "#0d1b3e",
            borderRadius: 10,
            fontWeight: 700,
            fontSize: 13.5,
            textDecoration: "none",
          }}
        >
          {p.label}
        </a>
      ))}
    </>
  );
}
