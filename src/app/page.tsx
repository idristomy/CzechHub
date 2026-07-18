"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Badge, Btn, PageWrapper, Section, SectionHeader } from "@/components/ui";
import { COLORS } from "@/lib/theme";
import { EVENTS, NEWS } from "@/lib/data";

const STATS = [
  { value: 5, suffix: "", label: "Local Committees" },
  { value: 340, suffix: "+", label: "Active Members" },
  { value: 12, suffix: "", label: "Exchange Programs" },
  { value: 28, suffix: "", label: "Countries Reached" },
] as const;

function Counter({ end, active, duration = 1400 }: { end: number; active: boolean; duration?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.floor(eased * end));
      if (p < 1) raf = requestAnimationFrame(step);
      else setN(end);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [active, end, duration]);
  return <span>{n}</span>;
}

function StatsSection() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setVisible(true); }),
      { threshold: 0.3 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ background: "#fff", padding: "48px 24px 0" }}>
      <div
        className="stats-grid"
        style={{
          maxWidth: 1000,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          paddingBottom: 48,
          borderBottom: "1px solid #eef1f6",
        }}
      >
        {STATS.map((s, i) => (
          <div
            key={i}
            style={{
              textAlign: "center",
              padding: "4px 16px",
              borderLeft: i === 0 ? "none" : "1px solid #eef1f6",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(14px)",
              transition: `opacity 0.6s ease ${i * 0.08}s, transform 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.08}s`,
            }}
          >
            <div
              style={{
                color: "#0d1b3e",
                fontWeight: 900,
                fontSize: "clamp(28px, 3.6vw, 40px)",
                lineHeight: 1,
                letterSpacing: "-0.03em",
                display: "flex",
                alignItems: "baseline",
                justifyContent: "center",
              }}
            >
              <Counter end={s.value} active={visible} />
              <span style={{ color: COLORS.blue }}>{s.suffix}</span>
            </div>
            <div
              style={{
                color: "#8a909c",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginTop: 9,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <style>{`@media (max-width: 640px) {
        .stats-grid { grid-template-columns: repeat(2, 1fr) !important; row-gap: 28px; }
        .stats-grid > div { border-left: none !important; }
        .stats-grid > div:nth-child(even) { border-left: 1px solid #eef1f6 !important; }
      }`}</style>
    </div>
  );
}

const TYPE_COLORS: Record<string, string> = {
  National: "#037ef3",
  Training: "#00c16e",
  Deadline: "#f85a40",
  International: "#7552cc",
};

function ComingSoon({ message }: { message: string }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 14,
        alignItems: "center",
        background: `${COLORS.blue}0d`,
        border: `1px solid ${COLORS.blue}26`,
        borderRadius: 16,
        padding: "18px 20px",
      }}
    >
      <div style={{ fontSize: 22, lineHeight: 1 }}>🚧</div>
      <div>
        <div style={{ color: "#0d1b3e", fontWeight: 800, fontSize: 15, marginBottom: 2 }}>
          Coming soon
        </div>
        <p style={{ color: "#52565e", fontSize: 13, lineHeight: 1.5, margin: 0 }}>{message}</p>
      </div>
    </div>
  );
}

export default function HomePage() {
  const words = ["Czech Members.", "LC Leaders.", "MC Board.", "AIESEC Czechia."];
  const [twIdx, setTwIdx] = useState(0);
  const [twText, setTwText] = useState("");
  const [twDel, setTwDel] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const word = words[twIdx];
    let t: ReturnType<typeof setTimeout>;
    if (!twDel && twText.length < word.length) {
      t = setTimeout(() => setTwText(word.slice(0, twText.length + 1)), 80);
    } else if (!twDel && twText.length === word.length) {
      t = setTimeout(() => setTwDel(true), 1800);
    } else if (twDel && twText.length > 0) {
      t = setTimeout(() => setTwText(twText.slice(0, -1)), 40);
    } else {
      t = setTimeout(() => {
        setTwDel(false);
        setTwIdx((twIdx + 1) % words.length);
      }, 100);
    }
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [twText, twDel, twIdx]);

  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement | null>(null);
  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!heroRef.current) return;
    const r = heroRef.current.getBoundingClientRect();
    setMouse({
      x: (e.clientX - r.left - r.width / 2) / r.width,
      y: (e.clientY - r.top - r.height / 2) / r.height,
    });
  };

  const quickLinks = [
    { icon: "👥", label: "MC Board", sub: "Meet our national leadership", href: "/mc", color: COLORS.blue },
    { icon: "📋", label: "Functional Areas", sub: "Explore all 7 MC areas", href: "/areas", color: COLORS.purple },
    { icon: "🏙️", label: "Local Committees", sub: "5 LCs across Czech Republic", href: "/lcs", color: COLORS.teal },
    { icon: "📚", label: "Resources", sub: "Docs, guides & tools", href: "/resources", color: COLORS.orange },
  ];

  const today = new Date("2026-04-29");
  const upcoming = EVENTS.filter((e) => new Date(e.date) >= today).slice(0, 3);

  return (
    <>
      <Nav />
      <PageWrapper>
        {/* HERO */}
        <div
          ref={heroRef}
          onMouseMove={onMouseMove}
          style={{
            padding: "80px 24px 80px",
            position: "relative",
            overflow: "hidden",
            background:
              "linear-gradient(135deg, #0a1530 0%, #0d2151 30%, #0561c4 65%, #037ef3 100%)",
          }}
        >
          {/* Blob 1 */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "-15%",
              right: "-10%",
              width: 600,
              height: 600,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(98,183,255,0.3) 40%, transparent 70%)",
              filter: "blur(40px)",
              transform: `translate(${mouse.x * 30}px, ${mouse.y * 30}px)`,
              transition: "transform 0.5s ease-out",
              animation: "float1 16s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              bottom: "-20%",
              left: "-10%",
              width: 520,
              height: 520,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(0,193,110,0.25) 0%, rgba(3,126,243,0.15) 50%, transparent 75%)",
              filter: "blur(40px)",
              transform: `translate(${mouse.x * -20}px, ${mouse.y * -20}px)`,
              transition: "transform 0.5s ease-out",
              animation: "float2 22s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: "30%",
              left: "40%",
              width: 300,
              height: 300,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(117,82,204,0.45) 0%, transparent 70%)",
              filter: "blur(50px)",
              transform: `translate(${mouse.x * 15}px, ${mouse.y * 15}px)`,
              transition: "transform 0.6s ease-out",
              animation: "float1 18s ease-in-out infinite 2s",
              pointerEvents: "none",
            }}
          />

          {/* Floating dots */}
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: `${(i * 37) % 100}%`,
                left: `${(i * 53) % 100}%`,
                width: 4 + (i % 3) * 2,
                height: 4 + (i % 3) * 2,
                borderRadius: "50%",
                background: "rgba(98,183,255,0.4)",
                animation: `floatDot ${6 + (i % 5)}s ease-in-out infinite ${i * 0.2}s`,
                pointerEvents: "none",
              }}
            />
          ))}

          <div
            className="hero-grid"
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              position: "relative",
              display: "grid",
              gridTemplateColumns: "1fr auto",
              gap: 60,
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  marginBottom: 24,
                  padding: "8px 16px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 100,
                  backdropFilter: "blur(10px)",
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(20px)",
                  transition: "all 0.6s",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#62b7ff",
                    boxShadow: "0 0 12px #62b7ff",
                    animation: "pulse-dot 2s infinite",
                  }}
                />
                <span
                  style={{
                    color: "rgba(255,255,255,0.85)",
                    fontSize: 12.5,
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                  }}
                >
                  NATIONAL KNOWLEDGE HUB · CZECH REPUBLIC
                </span>
              </div>

              <h1
                style={{
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: "clamp(44px, 6.5vw, 84px)",
                  margin: "0 0 20px",
                  lineHeight: 0.98,
                  letterSpacing: "-0.03em",
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(30px)",
                  transition: "all 0.8s 0.1s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                Welcome to
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, #62b7ff 0%, #037ef3 50%, #62b7ff 100%)",
                    backgroundSize: "200% 100%",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    animation: "gradientShift 6s linear infinite",
                  }}
                >
                  CzechHub.
                </span>
              </h1>

              <p
                style={{
                  color: "rgba(255,255,255,0.78)",
                  fontSize: "clamp(17px, 1.8vw, 22px)",
                  margin: "0 0 12px",
                  lineHeight: 1.5,
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(20px)",
                  transition: "all 0.8s 0.2s",
                }}
              >
                Your national knowledge hub for{" "}
                <span style={{ color: "#62b7ff", fontWeight: 800 }}>
                  {twText}
                  <span style={{ animation: "blink 1s infinite" }}>|</span>
                </span>
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 15,
                  margin: "0 0 40px",
                  opacity: mounted ? 1 : 0,
                  transition: "all 0.8s 0.3s",
                }}
              >
                Resources, people, areas, and dates — all in one place.
              </p>

              <div
                style={{
                  display: "flex",
                  gap: 12,
                  flexWrap: "wrap",
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? "translateY(0)" : "translateY(20px)",
                  transition: "all 0.8s 0.4s",
                }}
              >
                <Btn variant="white" href="/areas">
                  Explore Areas →
                </Btn>
                <Btn variant="white-outline" href="/mc">
                  Meet the MC
                </Btn>
              </div>
            </div>

            {/* Orbital hub diagram */}
            <div
              className="hide-mobile"
              style={{ position: "relative", width: 380, height: 420 }}
            >
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, rgba(98,183,255,0.25) 0%, transparent 60%)",
                  animation: "pulseRingHero 4s ease-in-out infinite",
                  pointerEvents: "none",
                }}
              />
              <svg
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  animation: "spin360 40s linear infinite",
                  pointerEvents: "none",
                }}
                viewBox="0 0 380 420"
              >
                <ellipse
                  cx="190"
                  cy="210"
                  rx="170"
                  ry="180"
                  fill="none"
                  stroke="rgba(98,183,255,0.25)"
                  strokeWidth="1"
                  strokeDasharray="2 8"
                />
              </svg>
              <svg
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  animation: "spinReverse 60s linear infinite",
                  pointerEvents: "none",
                }}
                viewBox="0 0 380 420"
              >
                <ellipse
                  cx="190"
                  cy="210"
                  rx="135"
                  ry="145"
                  fill="none"
                  stroke="rgba(98,183,255,0.18)"
                  strokeWidth="1"
                  strokeDasharray="3 6"
                />
              </svg>

              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: `translate(-50%,-50%) translate(${mouse.x * 4}px, ${mouse.y * 4}px)`,
                  transition: "transform 0.4s ease-out",
                  width: 200,
                  padding: "24px 22px",
                  borderRadius: 24,
                  background:
                    "linear-gradient(140deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 100%)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  boxShadow:
                    "0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
                  opacity: mounted ? 1 : 0,
                  transitionDelay: "0.5s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#62b7ff",
                      boxShadow: "0 0 12px #62b7ff",
                      animation: "pulse-dot 2s infinite",
                    }}
                  />
                  <span
                    style={{
                      color: "rgba(255,255,255,0.55)",
                      fontSize: 10,
                      fontWeight: 800,
                      letterSpacing: "0.18em",
                    }}
                  >
                    LIVE
                  </span>
                </div>
                <div
                  style={{
                    color: "#fff",
                    fontWeight: 900,
                    fontSize: 28,
                    lineHeight: 1,
                    marginBottom: 4,
                    letterSpacing: "-0.02em",
                  }}
                >
                  CzechHub
                </div>
                <div
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 11.5,
                    marginBottom: 16,
                  }}
                >
                  Your single source of truth.
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {[
                    ["340+", "Members"],
                    ["5", "LCs"],
                    ["7", "Areas"],
                    ["12+", "Programs"],
                  ].map(([v, l]) => (
                    <div
                      key={l}
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        borderRadius: 8,
                        padding: "8px 10px",
                      }}
                    >
                      <div
                        style={{
                          color: "#62b7ff",
                          fontWeight: 900,
                          fontSize: 15,
                        }}
                      >
                        {v}
                      </div>
                      <div
                        style={{
                          color: "rgba(255,255,255,0.55)",
                          fontSize: 9.5,
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {l}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {[
                { icon: "👥", label: "MC", angle: -90, color: "#037ef3", delay: 0.6 },
                { icon: "📋", label: "Areas", angle: -30, color: "#7552cc", delay: 0.7 },
                { icon: "🏙️", label: "LCs", angle: 30, color: "#0cb9c1", delay: 0.8 },
                { icon: "📚", label: "Docs", angle: 90, color: "#f48924", delay: 0.9 },
                { icon: "📅", label: "Dates", angle: 150, color: "#f85a40", delay: 1.0 },
                { icon: "⚡", label: "News", angle: 210, color: "#62b7ff", delay: 1.1 },
              ].map((b, i) => {
                const rad = (b.angle * Math.PI) / 180;
                const r = 170;
                const x = 190 + Math.cos(rad) * r;
                const y = 210 + Math.sin(rad) * 0.95 * r;
                return (
                  <div
                    key={i}
                    style={{
                      position: "absolute",
                      left: x,
                      top: y,
                      transform: "translate(-50%,-50%)",
                      width: 62,
                      height: 62,
                      borderRadius: 18,
                      background: `linear-gradient(135deg, ${b.color}, ${b.color}cc)`,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 2,
                      boxShadow: `0 12px 30px ${b.color}66, inset 0 1px 0 rgba(255,255,255,0.25)`,
                      border: "1px solid rgba(255,255,255,0.15)",
                      opacity: mounted ? 1 : 0,
                      transitionProperty: "opacity, transform",
                      transitionDuration: "0.6s",
                      transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                      transitionDelay: `${b.delay}s`,
                      animation: `bubbleFloat ${4 + i * 0.3}s ease-in-out infinite ${i * 0.2}s`,
                    }}
                  >
                    <span style={{ fontSize: 20, lineHeight: 1 }}>{b.icon}</span>
                    <span
                      style={{
                        color: "#fff",
                        fontWeight: 900,
                        fontSize: 9,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {b.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Wave */}
          <svg
            aria-hidden
            style={{ position: "absolute", bottom: -1, left: 0, width: "100%", height: 80 }}
            viewBox="0 0 1440 80"
            preserveAspectRatio="none"
          >
            <path fill="#ffffff" d="M0,40 C360,80 720,0 1440,40 L1440,80 L0,80 Z" />
          </svg>
        </div>

        <StatsSection />

        {/* Quick access */}
        <Section>
          <SectionHeader
            eyebrow="Quick Access"
            title="Everything you need"
            subtitle="Navigate to any section of CzechHub from here."
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))",
              gap: 20,
            }}
          >
            {quickLinks.map((ql, i) => (
              <Link
                key={i}
                href={ql.href}
                className="qcard"
                style={{
                  position: "relative",
                  background: "#fff",
                  borderRadius: 24,
                  padding: 28,
                  cursor: "pointer",
                  overflow: "hidden",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  border: "1px solid rgba(13,27,62,0.05)",
                  boxShadow: "0 4px 20px rgba(13,27,62,0.06)",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = `0 20px 50px ${ql.color}33`;
                  const blob = e.currentTarget.querySelector<HTMLElement>(".qcard-blob");
                  if (blob) blob.style.transform = "scale(2.5)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 20px rgba(13,27,62,0.06)";
                  const blob = e.currentTarget.querySelector<HTMLElement>(".qcard-blob");
                  if (blob) blob.style.transform = "scale(1)";
                }}
              >
                <div
                  className="qcard-blob"
                  style={{
                    position: "absolute",
                    top: -30,
                    right: -30,
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    background: `radial-gradient(circle, ${ql.color}25, transparent 70%)`,
                    transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                    pointerEvents: "none",
                  }}
                />
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 16,
                      background: `linear-gradient(135deg, ${ql.color}, ${ql.color}cc)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 24,
                      marginBottom: 18,
                      boxShadow: `0 8px 20px ${ql.color}44`,
                    }}
                  >
                    {ql.icon}
                  </div>
                  <div
                    style={{
                      fontWeight: 900,
                      fontSize: 18,
                      color: "#0d1b3e",
                      marginBottom: 4,
                    }}
                  >
                    {ql.label}
                  </div>
                  <div style={{ color: "#52565e", fontSize: 13.5 }}>{ql.sub}</div>
                  <div
                    style={{
                      color: ql.color,
                      fontSize: 13,
                      fontWeight: 800,
                      marginTop: 14,
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    Explore <span>→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Section>

        {/* News + Events */}
        <div style={{ background: "#fff" }}>
          <Section>
            <div
              className="news-grid"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}
            >
              <div>
                <SectionHeader eyebrow="Updates" title="Latest News" />
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {NEWS.length === 0 && <ComingSoon message="News and updates will be shared here soon." />}
                  {NEWS.map((n) => (
                    <div
                      key={n.id}
                      style={{
                        display: "flex",
                        gap: 16,
                        alignItems: "flex-start",
                        paddingBottom: 16,
                        borderBottom: "1px solid #f0f0f0",
                        transition: "transform 0.2s",
                      }}
                    >
                      <div
                        style={{
                          minWidth: 56,
                          textAlign: "center",
                          background: "#f8f8f8",
                          borderRadius: 12,
                          padding: "10px 4px",
                        }}
                      >
                        <div
                          style={{
                            color: "#037ef3",
                            fontWeight: 900,
                            fontSize: 20,
                          }}
                        >
                          {new Date(n.date).getDate()}
                        </div>
                        <div
                          style={{
                            color: "#52565e",
                            fontSize: 10.5,
                            textTransform: "uppercase",
                            fontWeight: 700,
                          }}
                        >
                          {new Date(n.date).toLocaleString("en", { month: "short" })}
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: 15.5,
                            color: "#0d1b3e",
                            marginBottom: 4,
                          }}
                        >
                          {n.title}
                        </div>
                        <div
                          style={{
                            color: "#52565e",
                            fontSize: 13.5,
                            lineHeight: 1.5,
                          }}
                        >
                          {n.body}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <SectionHeader eyebrow="Calendar" title="Upcoming Events" />
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {upcoming.length === 0 && <ComingSoon message="Upcoming events and key dates will be shared here soon." />}
                  {upcoming.map((e) => {
                    const d = new Date(e.date);
                    const daysLeft = Math.ceil((d.getTime() - today.getTime()) / 86400000);
                    const col = TYPE_COLORS[e.type] || COLORS.blue;
                    return (
                      <div
                        key={e.id}
                        style={{
                          display: "flex",
                          gap: 16,
                          alignItems: "center",
                          padding: "18px 20px",
                          background: "#fff",
                          borderRadius: 16,
                          border: "1px solid #eef0f5",
                          transition: "all 0.2s",
                        }}
                      >
                        <div
                          style={{
                            minWidth: 54,
                            textAlign: "center",
                            background: col + "18",
                            borderRadius: 12,
                            padding: "10px 4px",
                          }}
                        >
                          <div style={{ color: col, fontWeight: 900, fontSize: 20 }}>
                            {d.getDate()}
                          </div>
                          <div
                            style={{
                              color: col,
                              fontSize: 10.5,
                              textTransform: "uppercase",
                              fontWeight: 800,
                            }}
                          >
                            {d.toLocaleString("en", { month: "short" })}
                          </div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <div
                            style={{
                              fontWeight: 800,
                              fontSize: 14.5,
                              color: "#0d1b3e",
                            }}
                          >
                            {e.name}
                          </div>
                          <div style={{ color: "#52565e", fontSize: 12.5 }}>📍 {e.location}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <Badge label={e.type} color={col} />
                          <div
                            style={{ color: "#52565e", fontSize: 11, marginTop: 4 }}
                          >
                            {daysLeft}d away
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <Btn variant="ghost" href="/dates" small>
                    View all dates →
                  </Btn>
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* What is AIESEC */}
        <Section>
          <div
            className="aiesec-block"
            style={{
              background: "linear-gradient(135deg,#0d1b3e,#0a2a6e)",
              borderRadius: 32,
              padding: "64px 56px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 40,
              alignItems: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -100,
                right: -100,
                width: 300,
                height: 300,
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(3,126,243,0.3), transparent 70%)",
                animation: "float1 12s ease-in-out infinite",
              }}
            />
            <div>
              <p
                style={{
                  color: "#62b7ff",
                  fontWeight: 800,
                  fontSize: 12,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginBottom: 14,
                }}
              >
                About
              </p>
              <h2
                style={{
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: 36,
                  margin: "0 0 20px",
                  letterSpacing: "-0.02em",
                }}
              >
                What is AIESEC?
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.78)",
                  fontSize: 15.5,
                  lineHeight: 1.7,
                  margin: "0 0 14px",
                }}
              >
                AIESEC is the world&apos;s largest youth-run organisation, present in over 120
                countries and territories. It provides young people with leadership development,
                cross-cultural exchange, and professional experience.
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.78)",
                  fontSize: 15.5,
                  lineHeight: 1.7,
                  margin: "0 0 28px",
                }}
              >
                AIESEC in Czech Republic operates through 5 Local Committees, connecting hundreds
                of young people with global opportunities every year.
              </p>
              <Btn variant="white-outline" small href="/resources">
                Learn More
              </Btn>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              {[
                ["🌍", "Peace & Fulfillment"],
                ["🚀", "Leadership"],
                ["🤝", "Global Understanding"],
                ["💡", "Entrepreneurial Outlook"],
              ].map(([icon, v], i) => (
                <div
                  key={i}
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    borderRadius: 18,
                    padding: "22px 18px",
                    border: "1px solid rgba(255,255,255,0.1)",
                    transition: "all 0.3s",
                  }}
                >
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{icon}</div>
                  <div
                    style={{
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: 14,
                      lineHeight: 1.4,
                    }}
                  >
                    {v}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Footer />

        <style>{`
          @media (max-width: 900px) {
            .hero-grid { grid-template-columns: 1fr !important; }
            .news-grid { grid-template-columns: 1fr !important; }
            .aiesec-block { grid-template-columns: 1fr !important; padding: 40px 28px !important; }
          }
        `}</style>
      </PageWrapper>
    </>
  );
}
