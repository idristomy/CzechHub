"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero, { HeroHighlight } from "@/components/Hero";
import { Avatar, PageWrapper, Section, SectionHeader } from "@/components/ui";
import { COLORS } from "@/lib/theme";
import { LCS, LC_EB } from "@/lib/data";

export default function LcsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      <Nav />
      <PageWrapper>
        <Hero
          eyebrow="The Network"
          title={<>Local <HeroHighlight>Committees</HeroHighlight></>}
          subtitle="Five Local Committees across the Czech Republic, each rooted in a university city and connecting students to global opportunities."
        />

        {/* Grid */}
        <Section>
          <SectionHeader eyebrow="5 Committees" title="Find your LC" subtitle="Click a committee to meet its executive board." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 22 }}>
            {LCS.map((lc, i) => {
              const ebCount = (LC_EB[lc.slug] || []).length;
              return (
                <Link
                  key={lc.id}
                  href={`/lcs/${lc.slug}`}
                  className="lc-card"
                  style={{
                    position: "relative",
                    background: "#fff",
                    borderRadius: 18,
                    overflow: "hidden",
                    textDecoration: "none",
                    border: "1px solid #e7ebf2",
                    boxShadow: "0 2px 10px rgba(13,27,62,0.05)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateY(0)" : "translateY(16px)",
                    transitionDelay: `${i * 0.05}s`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 16px 36px rgba(3,126,243,0.16)";
                    e.currentTarget.style.borderColor = "rgba(3,126,243,0.35)";
                    const arrow = e.currentTarget.querySelector<HTMLElement>(".lc-arrow");
                    if (arrow) arrow.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 2px 10px rgba(13,27,62,0.05)";
                    e.currentTarget.style.borderColor = "#e7ebf2";
                    const arrow = e.currentTarget.querySelector<HTMLElement>(".lc-arrow");
                    if (arrow) arrow.style.transform = "translateX(0)";
                  }}
                >
                  {/* AIESEC blue accent rail */}
                  <div aria-hidden style={{ position: "absolute", top: 0, left: 0, bottom: 0, width: 5, background: COLORS.blue }} />
                  {/* AIESEC logo watermark */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/aiesec-logo.png"
                    alt=""
                    aria-hidden
                    style={{ position: "absolute", top: 22, right: 22, height: 26, opacity: 0.1, pointerEvents: "none" }}
                  />

                  <div style={{ padding: "28px 28px 22px 34px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: COLORS.blue }} />
                      <span style={{ color: COLORS.blue, fontSize: 11, fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase" }}>Local Committee</span>
                    </div>

                    <h3 style={{ color: "#0d1b3e", fontWeight: 900, fontSize: 30, margin: "0 0 2px", letterSpacing: "-0.02em", lineHeight: 1.05 }}>{lc.city}</h3>
                    <div style={{ color: COLORS.blue, fontSize: 14, fontWeight: 700, marginBottom: 10 }}>{lc.name}</div>
                    <div style={{ color: "#52565e", fontSize: 13, marginBottom: 16 }}>🎓 {lc.university}</div>

                    <p style={{ color: "#52565e", fontSize: 14, lineHeight: 1.65, margin: "0 0 20px" }}>{lc.intro}</p>

                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #eef1f6", paddingTop: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                        <Avatar name={lc.lcp} size={38} color={COLORS.blue} />
                        <div style={{ display: "flex", flexDirection: "column" }}>
                          <span style={{ color: "#0d1b3e", fontSize: 14, fontWeight: 700, lineHeight: 1.2 }}>{lc.lcp}</span>
                          <span style={{ color: "#9aa0ab", fontSize: 11.5, fontWeight: 600 }}>President</span>
                        </div>
                      </div>
                      <span style={{ color: COLORS.blue, fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", gap: 6, whiteSpace: "nowrap" }}>
                        {ebCount} members <span className="lc-arrow" style={{ display: "inline-block", transition: "transform 0.3s" }}>→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </Section>

        <Footer />
      </PageWrapper>
    </>
  );
}
