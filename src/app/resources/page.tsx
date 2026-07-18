"use client";

import { useEffect, useMemo, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero, { HeroHighlight } from "@/components/Hero";
import { PageWrapper, Section } from "@/components/ui";
import { COLORS } from "@/lib/theme";
import { RESOURCES } from "@/lib/data";
import type { Resource } from "@/lib/types";

const TYPE_META: Record<Resource["type"], { icon: string; label: string; color: string }> = {
  pdf: { icon: "📄", label: "PDF", color: COLORS.red },
  doc: { icon: "📝", label: "Doc", color: COLORS.blue },
  link: { icon: "🔗", label: "Link", color: COLORS.teal },
  sheet: { icon: "📊", label: "Sheet", color: COLORS.green },
  folder: { icon: "📁", label: "Folder", color: COLORS.orange },
};

export default function ResourcesPage() {
  const [mounted, setMounted] = useState(false);
  const [activeCat, setActiveCat] = useState<string>("All");
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const cats = useMemo(() => ["All", ...Array.from(new Set(RESOURCES.map((r) => r.cat)))], []);
  const grouped = useMemo(() => {
    const visible = activeCat === "All" ? RESOURCES : RESOURCES.filter((r) => r.cat === activeCat);
    const map = new Map<string, Resource[]>();
    for (const r of visible) {
      if (!map.has(r.cat)) map.set(r.cat, []);
      map.get(r.cat)!.push(r);
    }
    return map;
  }, [activeCat]);

  return (
    <>
      <Nav />
      <PageWrapper>
        <Hero
          eyebrow="Knowledge Base"
          title={<><HeroHighlight>Resources</HeroHighlight> &amp; Docs</>}
          subtitle="Brand guidelines, governance, tools and templates — everything the entity needs in one library."
        />

        <Section>
          {/* Category filter */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 36 }}>
            {cats.map((c) => {
              const active = c === activeCat;
              return (
                <button
                  key={c}
                  onClick={() => setActiveCat(c)}
                  style={{
                    border: "none",
                    cursor: "pointer",
                    padding: "9px 18px",
                    borderRadius: 100,
                    fontSize: 13.5,
                    fontWeight: 700,
                    background: active ? COLORS.blue : "#f1f3f8",
                    color: active ? "#fff" : "#52565e",
                    boxShadow: active ? "0 6px 16px rgba(3,126,243,0.3)" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  {c}
                </button>
              );
            })}
          </div>

          {/* Coming soon notice */}
          <div
            style={{
              display: "flex",
              gap: 14,
              alignItems: "center",
              background: `${COLORS.blue}0d`,
              border: `1px solid ${COLORS.blue}26`,
              borderRadius: 16,
              padding: "16px 20px",
              marginBottom: 36,
            }}
          >
            <div style={{ fontSize: 22, lineHeight: 1 }}>🚧</div>
            <div>
              <div style={{ color: "#0d1b3e", fontWeight: 800, fontSize: 15, marginBottom: 2 }}>
                More resources coming soon
              </div>
              <p style={{ color: "#52565e", fontSize: 13, lineHeight: 1.5, margin: 0 }}>
                We&apos;re still curating the full library. Additional brand, governance, tools and
                conference materials will be shared here soon.
              </p>
            </div>
          </div>

          {Array.from(grouped.entries()).map(([cat, items]) => (
            <div key={cat} style={{ marginBottom: 44 }}>
              <h2 style={{ color: "#0d1b3e", fontWeight: 900, fontSize: 22, margin: "0 0 18px", display: "flex", alignItems: "center", gap: 10 }}>
                {cat}
                <span style={{ color: "#9aa0ab", fontSize: 14, fontWeight: 600 }}>({items.length})</span>
              </h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 16 }}>
                {items.map((r, i) => {
                  const meta = TYPE_META[r.type];
                  return (
                    <a
                      key={i}
                      href={r.url}
                      target={r.url.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer"
                      style={{
                        position: "relative",
                        display: "flex",
                        gap: 14,
                        alignItems: "flex-start",
                        background: "#fff",
                        borderRadius: 18,
                        padding: "20px 20px 20px 24px",
                        textDecoration: "none",
                        overflow: "hidden",
                        border: "1px solid #eef0f5",
                        boxShadow: "0 4px 16px rgba(13,27,62,0.05)",
                        transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                        opacity: mounted ? 1 : 0,
                        transform: mounted ? "translateY(0)" : "translateY(14px)",
                        transitionDelay: `${i * 0.04}s`,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-5px)";
                        e.currentTarget.style.boxShadow = `0 16px 40px ${meta.color}2e`;
                        const stripe = e.currentTarget.querySelector<HTMLElement>(".res-stripe");
                        if (stripe) stripe.style.transform = "scaleY(1)";
                        const icon = e.currentTarget.querySelector<HTMLElement>(".res-icon");
                        if (icon) icon.style.transform = "scale(1.1) rotate(-4deg)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 4px 16px rgba(13,27,62,0.05)";
                        const stripe = e.currentTarget.querySelector<HTMLElement>(".res-stripe");
                        if (stripe) stripe.style.transform = "scaleY(0)";
                        const icon = e.currentTarget.querySelector<HTMLElement>(".res-icon");
                        if (icon) icon.style.transform = "scale(1) rotate(0deg)";
                      }}
                    >
                      <div
                        className="res-stripe"
                        aria-hidden
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          bottom: 0,
                          width: 4,
                          background: meta.color,
                          transform: "scaleY(0)",
                          transformOrigin: "center",
                          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                        }}
                      />
                      <div className="res-icon" style={{ width: 44, height: 44, borderRadius: 12, background: meta.color + "18", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0, transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>
                        {meta.icon}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ color: "#0d1b3e", fontWeight: 800, fontSize: 15 }}>{r.label}</span>
                        </div>
                        <p style={{ color: "#52565e", fontSize: 13, lineHeight: 1.5, margin: "0 0 8px" }}>{r.desc}</p>
                        <span style={{ display: "inline-block", background: meta.color + "14", color: meta.color, fontSize: 10.5, fontWeight: 800, letterSpacing: "0.06em", padding: "2px 8px", borderRadius: 10, textTransform: "uppercase" }}>{meta.label}</span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </Section>

        <Footer />
      </PageWrapper>
    </>
  );
}
