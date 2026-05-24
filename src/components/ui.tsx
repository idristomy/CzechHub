"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { COLORS } from "@/lib/theme";

// ── Avatar ─────────────────────────────────────────────────────────
export function Avatar({
  name,
  size = 56,
  color = COLORS.blue,
  photo,
}: {
  name: string;
  size?: number;
  color?: string;
  photo?: string | null;
}) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  if (photo)
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={photo}
        alt={name}
        style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover" }}
      />
    );
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: `linear-gradient(135deg, ${color}dd, ${color}88)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        fontWeight: 700,
        fontSize: size * 0.36,
        flexShrink: 0,
        letterSpacing: "0.02em",
      }}
    >
      {initials}
    </div>
  );
}

// ── Badge ──────────────────────────────────────────────────────────
export function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "3px 10px",
        borderRadius: 20,
        background: color + "18",
        color,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
      }}
    >
      {label}
    </span>
  );
}

// ── Card ───────────────────────────────────────────────────────────
export function Card({
  children,
  style = {},
  onClick,
  hover = true,
}: {
  children: ReactNode;
  style?: CSSProperties;
  onClick?: () => void;
  hover?: boolean;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => hover && setHov(true)}
      onMouseLeave={() => hover && setHov(false)}
      style={{
        background: "#fff",
        borderRadius: 20,
        padding: 24,
        boxShadow: hov
          ? "0 16px 48px rgba(3,126,243,0.18), 0 0 0 1px rgba(3,126,243,0.1)"
          : "0 4px 20px rgba(13,27,62,0.06)",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        cursor: onClick ? "pointer" : "default",
        transform: hov && onClick ? "translateY(-4px)" : "none",
        border: "1px solid rgba(13,27,62,0.04)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── SectionHeader ──────────────────────────────────────────────────
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  center = false,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <div style={{ textAlign: center ? "center" : "left", marginBottom: 40 }}>
      {eyebrow && (
        <p
          style={{
            color: COLORS.blue,
            fontWeight: 800,
            fontSize: 12,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            margin: "0 0 10px",
          }}
        >
          {eyebrow}
        </p>
      )}
      <h2
        style={{
          color: COLORS.navy,
          fontWeight: 900,
          fontSize: 36,
          margin: "0 0 12px",
          lineHeight: 1.15,
          letterSpacing: "-0.02em",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            color: COLORS.gray,
            fontSize: 16,
            margin: 0,
            maxWidth: center ? 560 : "100%",
            marginLeft: center ? "auto" : 0,
            marginRight: center ? "auto" : 0,
            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ── Btn ────────────────────────────────────────────────────────────
type BtnVariant = "primary" | "outline" | "ghost" | "white" | "white-outline";
export function Btn({
  children,
  variant = "primary",
  onClick,
  small,
  href,
}: {
  children: ReactNode;
  variant?: BtnVariant;
  onClick?: () => void;
  small?: boolean;
  href?: string;
}) {
  const [hov, setHov] = useState(false);
  const base: CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: small ? "8px 16px" : "13px 26px",
    borderRadius: 12,
    fontWeight: 800,
    cursor: "pointer",
    fontSize: small ? 13 : 15,
    transition: "all 0.2s",
    border: "none",
    letterSpacing: "0.01em",
    textDecoration: "none",
  };
  const variants: Record<BtnVariant, CSSProperties> = {
    primary: {
      background: hov ? "#0267cc" : COLORS.blue,
      color: "#fff",
      boxShadow: hov
        ? "0 10px 28px rgba(3,126,243,0.5)"
        : "0 6px 18px rgba(3,126,243,0.35)",
      transform: hov ? "translateY(-2px)" : "none",
    },
    outline: {
      background: "transparent",
      color: COLORS.blue,
      border: `2px solid ${COLORS.blue}`,
    },
    ghost: { background: hov ? "#f8f8f8" : "transparent", color: COLORS.blue },
    white: {
      background: hov ? "rgba(255,255,255,0.92)" : "#fff",
      color: COLORS.blue,
      boxShadow: hov ? "0 12px 30px rgba(0,0,0,0.2)" : "0 6px 18px rgba(0,0,0,0.12)",
      transform: hov ? "translateY(-2px)" : "none",
    },
    "white-outline": {
      background: "transparent",
      color: "#fff",
      border: "2px solid rgba(255,255,255,0.6)",
    },
  };
  const style = { ...base, ...variants[variant] };
  if (href) {
    return (
      <a
        href={href}
        style={style}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
      >
        {children}
      </a>
    );
  }
  return (
    <button
      style={style}
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      {children}
    </button>
  );
}

// ── Page primitives ────────────────────────────────────────────────
export function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div style={{ paddingTop: 72, minHeight: "100vh", background: "#ffffff" }}>{children}</div>
  );
}

export function Section({
  children,
  style = {},
}: {
  children: ReactNode;
  style?: CSSProperties;
}) {
  return (
    <section style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 24px", ...style }}>
      {children}
    </section>
  );
}
