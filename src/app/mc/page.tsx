"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero, { HeroHighlight } from "@/components/Hero";
import MemberModal from "@/components/MemberModal";
import PyramidCard from "@/components/PyramidCard";
import { PageWrapper, Section } from "@/components/ui";
import { MC_MEMBERS, PORTRAITS } from "@/lib/data";
import type { Member } from "@/lib/types";

export default function MCPage() {
  const mcp = MC_MEMBERS.find((m) => m.role === "MCP")!;
  const mcvps = MC_MEMBERS.filter((m) => m.role === "MCVP");
  const [hovered, setHovered] = useState<number | "mcp" | null>(null);
  const [mounted, setMounted] = useState(false);
  const [selected, setSelected] = useState<Member | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Nav />
      <PageWrapper>
        <Hero
          eyebrow="2025 — 2026 Term"
          title={<>The <HeroHighlight>National</HeroHighlight><br />Leadership</>}
          subtitle="Meet the Managing Committee of AIESEC in Czech Republic — eight leaders shaping the future of youth development across the country."
          waveColor="#0a1530"
        />

        {/* Pyramid */}
        <div style={{ background: "linear-gradient(180deg, #0a1530 0%, #0d1f4a 35%, #103365 70%, #0e2b58 100%)", padding: "80px 24px 80px", position: "relative", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", top: "10%", right: "-10%", width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(3,126,243,0.3), transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
          <div aria-hidden style={{ position: "absolute", bottom: "-20%", left: "-10%", width: 450, height: 450, borderRadius: "50%", background: "radial-gradient(circle, rgba(98,183,255,0.2), transparent 70%)", filter: "blur(40px)", pointerEvents: "none" }} />
          <div style={{ maxWidth: 1300, margin: "0 auto", position: "relative" }}>
            <svg style={{ position: "absolute", top: 340, left: 0, right: 0, width: "100%", height: 60, pointerEvents: "none", zIndex: 1 }} preserveAspectRatio="none">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#62b7ff" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#037ef3" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              {[0, 1, 2, 3, 4, 5, 6].map((i) => {
                const total = 7;
                const endX = `${100 / (total * 2) + (i * 100) / total}%`;
                return (
                  <line
                    key={i}
                    x1="50%"
                    y1="0"
                    x2={endX}
                    y2="100%"
                    stroke="url(#lineGrad)"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    style={{ opacity: mounted ? 0.7 : 0, transition: `opacity 1s ease ${0.6 + i * 0.08}s` }}
                  />
                );
              })}
            </svg>

            <div style={{ display: "flex", justifyContent: "center", marginBottom: 60, position: "relative", zIndex: 2 }}>
              <PyramidCard
                name={mcp.name}
                area={mcp.area}
                role="MCP"
                photo={PORTRAITS[0]}
                isApex
                bio={mcp.bio}
                hovered={hovered === "mcp"}
                onHover={() => setHovered("mcp")}
                onLeave={() => setHovered(null)}
                onClick={() => setSelected(mcp)}
                animDelay={0.3}
                mounted={mounted}
              />
            </div>

            <div
              className="mcvp-grid"
              style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 14, position: "relative", zIndex: 2 }}
            >
              {mcvps.map((m, i) => (
                <PyramidCard
                  key={m.id}
                  name={m.name}
                  area={m.area}
                  role="MCVP"
                  photo={PORTRAITS[i + 1]}
                  isApex={false}
                  bio={m.bio}
                  hovered={hovered === m.id}
                  dimmed={hovered !== null && hovered !== m.id && hovered !== "mcp"}
                  onHover={() => setHovered(m.id)}
                  onLeave={() => setHovered(null)}
                  onClick={() => setSelected(m)}
                  animDelay={0.6 + i * 0.08}
                  mounted={mounted}
                />
              ))}
            </div>
          </div>
        </div>

        {selected && (
          <MemberModal
            member={selected}
            photo={PORTRAITS[MC_MEMBERS.indexOf(selected)]}
            onClose={() => setSelected(null)}
          />
        )}

        {/* Term info */}
        <Section style={{ padding: "40px 24px 80px" }}>
          <div className="info-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div style={{ background: "linear-gradient(135deg,#037ef3,#0267cc)", borderRadius: 20, padding: 32, position: "relative", overflow: "hidden", color: "#fff" }}>
              <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(255,255,255,0.08)" }} />
              <div style={{ position: "absolute", bottom: -60, right: 30, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 12px", position: "relative" }}>Current Term</p>
              <h3 style={{ color: "#fff", fontWeight: 900, fontSize: 28, margin: "0 0 8px", position: "relative" }}>July 2025 — June 2026</h3>
              <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, margin: 0, position: "relative", lineHeight: 1.6 }}>National committee serving all 5 Czech LCs and 340+ active members.</p>
            </div>
            <div style={{ background: "#fff", borderRadius: 20, padding: 32, border: "1px solid #eef0f5", boxShadow: "0 4px 24px rgba(13,27,62,0.06)" }}>
              <p style={{ color: "#037ef3", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.15em", margin: "0 0 12px", fontWeight: 800 }}>Contact the MC</p>
              <h3 style={{ color: "#0d1b3e", fontWeight: 900, fontSize: 24, margin: "0 0 8px" }}>Get in touch</h3>
              <p style={{ color: "#52565e", fontSize: 15, margin: "0 0 20px", lineHeight: 1.6 }}>For partnerships, collaboration or any national matters.</p>
              <a href="mailto:mc@aiesec.cz" style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#fff", background: "#037ef3", fontWeight: 700, fontSize: 15, textDecoration: "none", padding: "12px 22px", borderRadius: 10, transition: "all 0.2s" }}>
                mc@aiesec.cz →
              </a>
            </div>
          </div>
        </Section>

        <Footer />
        <style>{`
          @media (max-width: 1024px) { .mcvp-grid { grid-template-columns: repeat(4, 1fr) !important; } }
          @media (max-width: 640px) {
            .mcvp-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .info-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </PageWrapper>
    </>
  );
}
