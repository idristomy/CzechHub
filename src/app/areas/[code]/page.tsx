"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Avatar, Btn, PageWrapper, Section } from "@/components/ui";
import { areaColor } from "@/lib/theme";
import { AREAS, MC_MEMBERS } from "@/lib/data";

export default function AreaDetailPage() {
  const params = useParams();
  const code = String(params.code || "").toUpperCase();
  const area = AREAS.find((a) => a.code === code);
  const lead = MC_MEMBERS.find((m) => m.area === code);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  if (!area) {
    return (
      <>
        <Nav />
        <PageWrapper>
          <Section style={{ textAlign: "center", padding: "120px 24px" }}>
            <h1 style={{ color: "#0d1b3e", fontWeight: 900, fontSize: 36, marginBottom: 12 }}>Area not found</h1>
            <p style={{ color: "#52565e", fontSize: 16, marginBottom: 24 }}>We couldn&apos;t find a functional area with code &quot;{code}&quot;.</p>
            <Btn href="/areas">← Back to all areas</Btn>
          </Section>
          <Footer />
        </PageWrapper>
      </>
    );
  }

  const col = areaColor(area.code);

  return (
    <>
      <Nav />
      <PageWrapper>
        {/* Hero */}
        <div style={{ background: `linear-gradient(135deg, #0d1b3e 0%, ${col}55 140%)`, padding: "100px 24px 70px", position: "relative", overflow: "hidden" }}>
          <div aria-hidden style={{ position: "absolute", top: -120, right: -80, width: 460, height: 460, borderRadius: "50%", background: `radial-gradient(circle, ${col}55, transparent 70%)`, filter: "blur(30px)", animation: "float1 20s ease-in-out infinite", pointerEvents: "none" }} />
          <div style={{ maxWidth: 1000, margin: "0 auto", position: "relative" }}>
            <Link href="/areas" style={{ color: "rgba(255,255,255,0.7)", fontSize: 13.5, fontWeight: 700, textDecoration: "none" }}>← All areas</Link>
            <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 24, opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)", transition: "all 0.8s cubic-bezier(0.16, 1, 0.3, 1)" }}>
              <div style={{ width: 84, height: 84, borderRadius: 22, background: `linear-gradient(135deg, ${col}, ${col}cc)`, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 900, fontSize: 26, boxShadow: `0 12px 30px ${col}66`, flexShrink: 0 }}>
                {area.code}
              </div>
              <div>
                <h1 style={{ color: "#fff", fontWeight: 900, fontSize: "clamp(32px,5vw,52px)", margin: 0, lineHeight: 1.05, letterSpacing: "-0.02em" }}>{area.name}</h1>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.78)", fontSize: 18, maxWidth: 640, marginTop: 20, lineHeight: 1.6, opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)", transition: "all 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s" }}>
              {area.desc}
            </p>
          </div>
        </div>

        {/* Body */}
        <Section>
          <div className="area-detail-grid" style={{ display: "grid", gridTemplateColumns: lead ? "1fr 320px" : "1fr", gap: 40, alignItems: "start" }}>
            <div>
              <h2 style={{ color: "#0d1b3e", fontWeight: 900, fontSize: 24, margin: "0 0 16px" }}>Area materials</h2>
              {area.slides ? (
                <div style={{ position: "relative", width: "100%", paddingTop: "59%", borderRadius: 16, overflow: "hidden", boxShadow: "0 8px 30px rgba(13,27,62,0.12)", border: "1px solid #eef0f5" }}>
                  <iframe
                    src={area.slides}
                    title={`${area.name} slides`}
                    allowFullScreen
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
                  />
                </div>
              ) : (
                <div style={{ background: "#f8f9fb", border: "1px dashed #d4dae6", borderRadius: 16, padding: "48px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>📊</div>
                  <p style={{ color: "#52565e", fontSize: 15, margin: 0 }}>Slides &amp; materials for {area.name} will be published here soon.</p>
                </div>
              )}
            </div>

            {lead && (
              <aside style={{ background: "#fff", borderRadius: 20, padding: 28, border: "1px solid #eef0f5", boxShadow: "0 4px 24px rgba(13,27,62,0.06)" }}>
                <p style={{ color: col, fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 800, margin: "0 0 16px" }}>Area Lead</p>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
                  <Avatar name={lead.name} size={56} color={col} photo={lead.photo} />
                  <div>
                    <div style={{ color: "#0d1b3e", fontWeight: 800, fontSize: 16 }}>{lead.name}</div>
                    <div style={{ color: "#52565e", fontSize: 13 }}>MCVP {area.code}</div>
                  </div>
                </div>
                <p style={{ color: "#52565e", fontSize: 14, lineHeight: 1.6, margin: "0 0 18px" }}>{lead.bio}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <a href={`mailto:${area.code.toLowerCase()}@aiesec.cz`} style={{ display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center", padding: "11px 18px", background: col, color: "#fff", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                    ✉ {area.code.toLowerCase()}@aiesec.cz
                  </a>
                  {lead.linkedin && (
                    <a href={lead.linkedin} target="_blank" rel="noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center", padding: "11px 18px", background: "#f8f8f8", color: "#0d1b3e", borderRadius: 10, fontWeight: 700, fontSize: 14, textDecoration: "none" }}>
                      🔗 LinkedIn
                    </a>
                  )}
                </div>
              </aside>
            )}
          </div>
        </Section>

        <Footer />
        <style>{`@media (max-width: 880px) { .area-detail-grid { grid-template-columns: 1fr !important; } }`}</style>
      </PageWrapper>
    </>
  );
}
