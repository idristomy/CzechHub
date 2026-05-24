"use client";

import { useEffect, useState, type ReactNode } from "react";

export function HeroHighlight({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        background: "linear-gradient(135deg, #62b7ff 0%, #037ef3 50%, #62b7ff 100%)",
        backgroundSize: "200% 100%",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        animation: "gradientShift 6s linear infinite",
      }}
    >
      {children}
    </span>
  );
}

export default function Hero({
  eyebrow,
  title,
  subtitle,
  compact = false,
  waveColor = "#ffffff",
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  compact?: boolean;
  /** Color of the bottom wave — match the section that follows. Pass null to hide. */
  waveColor?: string | null;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        padding: compact ? "120px 24px 96px" : "140px 24px 116px",
        background:
          "linear-gradient(135deg, #0a1530 0%, #0d2151 30%, #0561c4 65%, #037ef3 100%)",
      }}
    >
      {/* Grid overlay */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse at center, black 35%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 35%, transparent 80%)",
          animation: "gridMove 30s linear infinite",
          pointerEvents: "none",
        }}
      />

      {/* Blobs */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "-15%",
          right: "-8%",
          width: 540,
          height: 540,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(255,255,255,0.10) 0%, rgba(98,183,255,0.28) 40%, transparent 70%)",
          filter: "blur(40px)",
          animation: "float1 16s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: "-25%",
          left: "-10%",
          width: 480,
          height: 480,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,193,110,0.22) 0%, rgba(3,126,243,0.14) 50%, transparent 75%)",
          filter: "blur(40px)",
          animation: "float2 22s ease-in-out infinite",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "28%",
          left: "42%",
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(117,82,204,0.40) 0%, transparent 70%)",
          filter: "blur(50px)",
          animation: "float1 18s ease-in-out infinite 2s",
          pointerEvents: "none",
        }}
      />

      {/* Floating dots (deterministic positions for stable hydration) */}
      {Array.from({ length: 18 }).map((_, i) => (
        <div
          key={i}
          aria-hidden
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

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", textAlign: "center" }}>
        {eyebrow && (
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 22,
              padding: "8px 16px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 100,
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(16px)",
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
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              {eyebrow}
            </span>
          </div>
        )}

        <h1
          style={{
            color: "#fff",
            fontWeight: 900,
            fontSize: "clamp(40px, 6vw, 72px)",
            margin: "0 0 18px",
            lineHeight: 1.02,
            letterSpacing: "-0.03em",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(26px)",
            transition: "all 0.8s 0.1s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            style={{
              color: "rgba(255,255,255,0.72)",
              fontSize: "clamp(16px, 1.6vw, 19px)",
              maxWidth: 620,
              margin: "0 auto",
              lineHeight: 1.6,
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(18px)",
              transition: "all 0.8s 0.2s",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {waveColor && (
        <svg
          aria-hidden
          style={{ position: "absolute", bottom: -1, left: 0, width: "100%", height: 70 }}
          viewBox="0 0 1440 80"
          preserveAspectRatio="none"
        >
          <path fill={waveColor} d="M0,40 C360,80 720,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      )}
    </div>
  );
}
