"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import MemberModal from "@/components/MemberModal";
import PyramidCard from "@/components/PyramidCard";
import { Btn, PageWrapper, Section } from "@/components/ui";
import { COLORS } from "@/lib/theme";
import { LCS, LC_MEMBERS_FLAT } from "@/lib/data";
import { useCollection } from "@/lib/useData";
import { usePyramidConnectors } from "@/lib/usePyramidConnectors";
import type { LC, LCMember } from "@/lib/types";

export default function LcDetailPage() {
  const params = useParams();
  const slug = String(params.slug || "");
  const { data: lcs } = useCollection<LC>("lcs", LCS, "sort");
  const { data: lcMembers } = useCollection<LCMember & { lc_slug: string }>(
    "lc_members",
    LC_MEMBERS_FLAT,
    "sort"
  );
  const lc = lcs.find((l) => l.slug === slug);
  const eb = lcMembers.filter((m) => m.lc_slug === slug);
  const lcp = eb.find((m) => m.role === "LCP");
  const lcvps = eb.filter((m) => m.role === "LCVP");

  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<number | "apex" | null>(null);
  const [selected, setSelected] = useState<{ member: LCMember; photo: string | null } | null>(null);
  const { containerRef, apexRef, setItemRef, lines } = usePyramidConnectors(lcvps.length);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (!lc) {
    return (
      <>
        <Nav />
        <PageWrapper>
          <Section style={{ textAlign: "center", padding: "120px 24px" }}>
            <h1 style={{ color: "#0d1b3e", fontWeight: 900, fontSize: 36, marginBottom: 12 }}>LC not found</h1>
            <p style={{ color: "#52565e", fontSize: 16, marginBottom: 24 }}>We couldn&apos;t find a local committee at &quot;{slug}&quot;.</p>
            <Btn href="/lcs">← Back to all LCs</Btn>
          </Section>
          <Footer />
        </PageWrapper>
      </>
    );
  }

  return (
    <>
      <Nav />
      <PageWrapper>
        {/* Hero */}
        <div style={{ background: `linear-gradient(135deg, #0d1b3e 0%, ${lc.color}66 140%)`, padding: "100px 24px 70px", position: "relative", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", top: -120, right: -80, width: 460, height: 460, borderRadius: "50%", background: `radial-gradient(circle, ${lc.color}55, transparent 70%)`, filter: "blur(30px)", animation: "float1 20s ease-in-out infinite", pointerEvents: "none" }} />
          <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
            <Link href="/lcs" style={{ color: "rgba(255,255,255,0.7)", fontSize: 13.5, fontWeight: 700, textDecoration: "none" }}>← All committees</Link>
            <div style={{ marginTop: 24, opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              <span style={{ display: "inline-block", background: "rgba(255,255,255,0.14)", color: "#fff", fontSize: 12, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", padding: "6px 14px", borderRadius: 20, marginBottom: 16 }}>📍 {lc.city}</span>
              <h1 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(36px,5.5vw,60px)", margin: 0, lineHeight: 1.05, letterSpacing: "-0.02em" }}>{lc.name}</h1>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, marginTop: 10 }}>🎓 {lc.university}</p>
            </div>
            <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 18, maxWidth: 640, marginTop: 18, lineHeight: 1.6, opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)", transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s" }}>
              {lc.intro}
            </p>
          </div>
        </div>

        {/* Executive Board — same cards as the MC page */}
        <div style={{ background: "linear-gradient(180deg, #0a1530 0%, #0d1f4a 35%, #103365 70%, #0e2b58 100%)", padding: "72px 24px 84px", position: "relative", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", top: "8%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(3,126,243,0.3), transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
          <div aria-hidden style={{ position: "absolute", bottom: "-20%", left: "-10%", width: 450, height: 450, borderRadius: "50%", background: "radial-gradient(circle, rgba(98,183,255,0.18), transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />

          <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", textAlign: "center", marginBottom: 48 }}>
            <p style={{ color: "#62b7ff", fontWeight: 800, fontSize: 12, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 12px" }}>Executive Board</p>
            <h2 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(28px,4vw,40px)", margin: 0, letterSpacing: "-0.02em" }}>Meet the {lc.city} team</h2>
          </div>

          <div ref={containerRef} style={{ position: "relative", maxWidth: 1100, margin: "0 auto" }}>
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1, overflow: "visible" }}>
              <defs>
                <linearGradient id="lineGradLc" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#62b7ff" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#037ef3" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              {lines.map((l, i) => (
                <line
                  key={i}
                  x1={l.x1}
                  y1={l.y1}
                  x2={l.x2}
                  y2={l.y2}
                  stroke="url(#lineGradLc)"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                  style={{ opacity: mounted ? 0.7 : 0, transition: `opacity 0.8s ease ${0.45 + i * 0.08}s` }}
                />
              ))}
            </svg>

            {lcp && (
              <div style={{ display: "flex", justifyContent: "center", marginBottom: 48, position: "relative", zIndex: 2 }}>
                <div ref={apexRef}>
                  <PyramidCard
                    name={lcp.name}
                    area={lcp.area}
                    role="LCP"
                    photo={lcp.photo ?? null}
                    isApex
                    bio={`Leading AIESEC in ${lc.city}.`}
                    hovered={hovered === "apex"}
                    onHover={() => setHovered("apex")}
                    onLeave={() => setHovered(null)}
                    onClick={() => setSelected({ member: lcp, photo: lcp.photo ?? null })}
                    animDelay={0.3}
                    mounted={mounted}
                  />
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, position: "relative", zIndex: 2 }}>
              {lcvps.map((m, i) => (
                <div key={i} ref={setItemRef(i)} style={{ width: 190, maxWidth: "44vw" }}>
                  <PyramidCard
                    name={m.name}
                    area={m.area}
                    role="LCVP"
                    photo={m.photo ?? null}
                    isApex={false}
                    hovered={hovered === i}
                    dimmed={hovered !== null && hovered !== i && hovered !== "apex"}
                    onHover={() => setHovered(i)}
                    onLeave={() => setHovered(null)}
                    onClick={() => setSelected({ member: m, photo: m.photo ?? null })}
                    animDelay={0.45 + i * 0.08}
                    mounted={mounted}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {selected && (
          <MemberModal
            member={selected.member}
            photo={selected.photo}
            onClose={() => setSelected(null)}
          />
        )}

        {/* Contact CTA */}
        <Section>
          <div style={{ background: "linear-gradient(135deg,#037ef3,#0267cc)", borderRadius: 20, padding: 32, color: "#fff", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16, position: "relative", overflow: "hidden" }}>
            <div aria-hidden style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
            <div style={{ position: "relative" }}>
              <h3 style={{ fontWeight: 900, fontSize: 22, margin: "0 0 6px" }}>Interested in {lc.city}?</h3>
              <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 15, margin: 0 }}>Reach out to the local board to get involved.</p>
            </div>
            <a href={`mailto:${lc.slug}@aiesec.cz`} style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 8, background: "#fff", color: COLORS.blue, fontWeight: 800, fontSize: 15, padding: "13px 24px", borderRadius: 12, textDecoration: "none" }}>
              {lc.slug}@aiesec.cz →
            </a>
          </div>
        </Section>

        <Footer />
      </PageWrapper>
    </>
  );
}
