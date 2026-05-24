"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/mc", label: "About the MC" },
  { href: "/areas", label: "Areas" },
  { href: "/lcs", label: "Local Committees" },
  { href: "/resources", label: "Resources" },
  { href: "/dates", label: "Dates" },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled ? "rgba(255,255,255,0.92)" : "#ffffff",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(3,126,243,0.12)"
          : "1px solid rgba(13,27,62,0.06)",
        boxShadow: scrolled ? "0 4px 30px rgba(13,27,62,0.06)" : "none",
        transition: "all 0.3s",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          height: 72,
        }}
      >
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            cursor: "pointer",
            marginRight: "auto",
            flexShrink: 0,
            textDecoration: "none",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/aiesec-logo.png" alt="AIESEC" style={{ height: 34, display: "block" }} />
          <div style={{ width: 1, height: 28, background: "rgba(13,27,62,0.15)" }} />
          <div>
            <div
              style={{
                color: "#0d1b3e",
                fontWeight: 900,
                fontSize: 15,
                letterSpacing: "0.02em",
                lineHeight: 1.1,
              }}
            >
              CzechHub
            </div>
            <div
              style={{
                color: "#52565e",
                fontSize: 10.5,
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Czech Republic
            </div>
          </div>
        </Link>

        <div className="desktop-nav" style={{ display: "flex", gap: 2, alignItems: "center" }}>
          {NAV_LINKS.map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                style={{
                  background: active ? "rgba(3,126,243,0.1)" : "transparent",
                  color: active ? "#037ef3" : "#0d1b3e",
                  padding: "10px 16px",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontSize: 13.5,
                  fontWeight: active ? 800 : 500,
                  transition: "all 0.15s",
                  textDecoration: "none",
                }}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/admin"
            style={{
              marginLeft: 10,
              background: "#037ef3",
              color: "#fff",
              padding: "10px 20px",
              borderRadius: 10,
              cursor: "pointer",
              fontSize: 13.5,
              fontWeight: 800,
              boxShadow: "0 4px 14px rgba(3,126,243,0.35)",
              transition: "all 0.2s",
              textDecoration: "none",
            }}
          >
            Admin ↗
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="burger-btn"
          style={{
            display: "none",
            background: "none",
            border: "none",
            color: "#0d1b3e",
            fontSize: 22,
            cursor: "pointer",
            padding: 8,
          }}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {menuOpen && (
        <div
          style={{
            background: "#fff",
            borderTop: "1px solid rgba(13,27,62,0.08)",
            padding: "12px 24px 20px",
          }}
        >
          {[...NAV_LINKS, { href: "/admin", label: "Admin Panel" }].map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  background: active ? "rgba(3,126,243,0.1)" : "transparent",
                  color: active ? "#037ef3" : "#0d1b3e",
                  padding: "12px 16px",
                  borderRadius: 8,
                  cursor: "pointer",
                  fontSize: 15,
                  fontWeight: active ? 800 : 500,
                  marginBottom: 4,
                  textDecoration: "none",
                }}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}
