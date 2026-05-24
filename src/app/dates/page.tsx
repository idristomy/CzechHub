"use client";

import { useEffect, useMemo, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero, { HeroHighlight } from "@/components/Hero";
import { Badge, PageWrapper, Section } from "@/components/ui";
import { COLORS } from "@/lib/theme";
import { EVENTS } from "@/lib/data";
import type { EventItem } from "@/lib/types";

const TYPE_COLORS: Record<EventItem["type"], string> = {
  National: COLORS.blue,
  Training: COLORS.green,
  Deadline: COLORS.red,
  International: COLORS.purple,
};

const TYPES: Array<EventItem["type"] | "All"> = ["All", "National", "Training", "Deadline", "International"];

function fmtRange(start: string, end: string) {
  const s = new Date(start);
  const e = new Date(end);
  const opts: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
  if (start === end) return s.toLocaleDateString("en", { ...opts, year: "numeric" });
  return `${s.toLocaleDateString("en", opts)} – ${e.toLocaleDateString("en", { ...opts, year: "numeric" })}`;
}

export default function DatesPage() {
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<EventItem["type"] | "All">("All");
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const today = useMemo(() => new Date("2026-05-22"), []);
  const sorted = useMemo(
    () => [...EVENTS].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    []
  );
  const visible = useMemo(
    () => (filter === "All" ? sorted : sorted.filter((e) => e.type === filter)),
    [sorted, filter]
  );

  return (
    <>
      <Nav />
      <PageWrapper>
        <Hero
          eyebrow="National Calendar"
          title={<>Key <HeroHighlight>Dates</HeroHighlight></>}
          subtitle="Conferences, trainings, deadlines and international events across the Czech entity."
        />

        <Section>
          {/* Type filter */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 36 }}>
            {TYPES.map((t) => {
              const active = t === filter;
              const col = t === "All" ? COLORS.blue : TYPE_COLORS[t];
              return (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  style={{
                    border: "none",
                    cursor: "pointer",
                    padding: "9px 18px",
                    borderRadius: 100,
                    fontSize: 13.5,
                    fontWeight: 700,
                    background: active ? col : "#f1f3f8",
                    color: active ? "#fff" : "#52565e",
                    boxShadow: active ? `0 6px 16px ${col}4d` : "none",
                    transition: "all 0.2s",
                  }}
                >
                  {t}
                </button>
              );
            })}
          </div>

          {/* Timeline */}
          <div style={{ position: "relative", paddingLeft: 28 }}>
            <div aria-hidden style={{ position: "absolute", left: 7, top: 8, bottom: 8, width: 2, background: "linear-gradient(180deg, #62b7ff, #eef0f5)" }} />
            {visible.map((e, i) => {
              const col = TYPE_COLORS[e.type];
              const d = new Date(e.date);
              const isPast = d < today;
              const daysLeft = Math.ceil((d.getTime() - today.getTime()) / 86400000);
              return (
                <div
                  key={e.id}
                  style={{
                    position: "relative",
                    marginBottom: 18,
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateX(0)" : "translateX(-14px)",
                    transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * 0.05}s`,
                  }}
                >
                  <div aria-hidden style={{ position: "absolute", left: -28, top: 22, width: 16, height: 16, borderRadius: "50%", background: isPast ? "#c0c8d8" : col, border: "3px solid #fff", boxShadow: `0 0 0 2px ${isPast ? "#c0c8d8" : col}` }} />
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: 16,
                      padding: "20px 24px",
                      border: "1px solid #eef0f5",
                      boxShadow: "0 4px 16px rgba(13,27,62,0.05)",
                      borderLeft: `4px solid ${isPast ? "#c0c8d8" : col}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: 14,
                      opacity: isPast ? 0.72 : 1,
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <Badge label={e.type} color={col} />
                        {!isPast && daysLeft <= 14 && (
                          <span style={{ color: COLORS.red, fontSize: 11.5, fontWeight: 800 }}>● {daysLeft === 0 ? "Today" : `${daysLeft}d away`}</span>
                        )}
                        {isPast && <span style={{ color: "#9aa0ab", fontSize: 11.5, fontWeight: 700 }}>Past</span>}
                      </div>
                      <div style={{ color: "#0d1b3e", fontWeight: 900, fontSize: 18, marginBottom: 4 }}>{e.name}</div>
                      <div style={{ color: "#52565e", fontSize: 13.5, display: "flex", gap: 16, flexWrap: "wrap" }}>
                        <span>📅 {fmtRange(e.date, e.end)}</span>
                        <span>📍 {e.location}</span>
                      </div>
                    </div>
                    {e.reg && !isPast && (
                      <a href={e.reg} style={{ display: "inline-flex", alignItems: "center", gap: 6, background: col, color: "#fff", fontWeight: 800, fontSize: 13.5, padding: "10px 20px", borderRadius: 10, textDecoration: "none", whiteSpace: "nowrap" }}>
                        Register →
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
            {visible.length === 0 && (
              <p style={{ color: "#52565e", fontSize: 15, paddingLeft: 4 }}>No events of this type.</p>
            )}
          </div>
        </Section>

        <Footer />
      </PageWrapper>
    </>
  );
}
