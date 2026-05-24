"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero, { HeroHighlight } from "@/components/Hero";
import { PageWrapper, Section, SectionHeader } from "@/components/ui";
import { areaColor } from "@/lib/theme";
import { AREAS } from "@/lib/data";

export default function AreasPage() {
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
          eyebrow="Functional Areas"
          title={<>The <HeroHighlight>Seven</HeroHighlight> Areas</>}
          subtitle="Every Local Committee and the MC operate through seven functional areas. Explore what each one does across AIESEC in Czech Republic."
        />

        {/* Grid */}
        <Section>
          <SectionHeader eyebrow="Explore" title="All functional areas" subtitle="Click any area to see its lead and resources." />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {AREAS.map((a, i) => {
              const col = areaColor(a.code);
              return (
                <Link
                  key={a.code}
                  href={`/areas/${a.code}`}
                  className="area-card"
                  style={{
                    position: "relative",
                    background: "#fff",
                    borderRadius: 24,
                    padding: 30,
                    overflow: "hidden",
                    textDecoration: "none",
                    border: "1px solid rgba(13,27,62,0.06)",
                    boxShadow: "0 6px 24px rgba(13,27,62,0.07)",
                    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateY(0)" : "translateY(20px)",
                    transitionDelay: `${i * 0.06}s`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px)";
                    e.currentTarget.style.boxShadow = `0 26px 60px ${col}38`;
                    const blob = e.currentTarget.querySelector<HTMLElement>(".area-blob");
                    if (blob) blob.style.transform = "scale(2.6)";
                    const icon = e.currentTarget.querySelector<HTMLElement>(".area-icon");
                    if (icon) icon.style.transform = "scale(1.08) rotate(-4deg)";
                    const arrow = e.currentTarget.querySelector<HTMLElement>(".area-arrow");
                    if (arrow) arrow.style.transform = "translateX(4px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "0 6px 24px rgba(13,27,62,0.07)";
                    const blob = e.currentTarget.querySelector<HTMLElement>(".area-blob");
                    if (blob) blob.style.transform = "scale(1)";
                    const icon = e.currentTarget.querySelector<HTMLElement>(".area-icon");
                    if (icon) icon.style.transform = "scale(1) rotate(0deg)";
                    const arrow = e.currentTarget.querySelector<HTMLElement>(".area-arrow");
                    if (arrow) arrow.style.transform = "translateX(0)";
                  }}
                >
                  <div
                    className="area-blob"
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: -36,
                      right: -36,
                      width: 110,
                      height: 110,
                      borderRadius: "50%",
                      background: `radial-gradient(circle, ${col}24, transparent 70%)`,
                      transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                      pointerEvents: "none",
                    }}
                  />
                  <div aria-hidden style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: `linear-gradient(90deg, ${col}, ${col}88)` }} />
                  <div style={{ position: "relative" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                      <div
                        className="area-icon"
                        style={{
                          width: 56,
                          height: 56,
                          borderRadius: 16,
                          background: `linear-gradient(135deg, ${col}, ${col}cc)`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          fontWeight: 900,
                          fontSize: 18,
                          letterSpacing: "0.02em",
                          boxShadow: `0 8px 20px ${col}44`,
                          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                          flexShrink: 0,
                        }}
                      >
                        {a.code}
                      </div>
                      <div style={{ fontWeight: 900, fontSize: 18, color: "#0d1b3e", lineHeight: 1.2 }}>{a.name}</div>
                    </div>
                    <p style={{ color: "#52565e", fontSize: 14, lineHeight: 1.6, margin: "0 0 20px" }}>{a.desc}</p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid #f0f2f6", paddingTop: 16 }}>
                      <div style={{ display: "flex", flexDirection: "column" }}>
                        <span style={{ color: "#9aa0ab", fontSize: 10.5, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 700 }}>Led by</span>
                        <span style={{ color: "#0d1b3e", fontSize: 14, fontWeight: 700 }}>{a.mcvp}</span>
                      </div>
                      <span style={{ color: col, fontSize: 13, fontWeight: 800, display: "flex", alignItems: "center", gap: 6 }}>
                        View <span className="area-arrow" style={{ display: "inline-block", transition: "transform 0.3s" }}>→</span>
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
