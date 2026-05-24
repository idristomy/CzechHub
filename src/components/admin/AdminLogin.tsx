"use client";

import { useState } from "react";
import { COLORS } from "@/lib/theme";

export default function AdminLogin({ onUnlock }: { onUnlock: (password: string) => boolean }) {
  const [pw, setPw] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUnlock(pw)) {
      setError(true);
      setPw("");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(135deg, #0a1530 0%, #0d2151 45%, #0561c4 120%)",
      }}
    >
      <div aria-hidden style={{ position: "absolute", top: "-10%", right: "-8%", width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(98,183,255,0.28), transparent 70%)", filter: "blur(40px)", animation: "float1 18s ease-in-out infinite", pointerEvents: "none" }} />
      <div aria-hidden style={{ position: "absolute", bottom: "-15%", left: "-10%", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(117,82,204,0.25), transparent 70%)", filter: "blur(40px)", animation: "float2 22s ease-in-out infinite", pointerEvents: "none" }} />

      <form
        onSubmit={submit}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 410,
          background: "#fff",
          borderRadius: 22,
          padding: "40px 36px",
          boxShadow: "0 30px 90px rgba(0,0,0,0.45)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 26 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/aiesec-logo.png" alt="AIESEC" style={{ height: 30 }} />
          <div style={{ width: 1, height: 26, background: "rgba(13,27,62,0.15)" }} />
          <div>
            <div style={{ color: "#0d1b3e", fontWeight: 900, fontSize: 15, lineHeight: 1.1 }}>CzechHub</div>
            <div style={{ color: COLORS.blue, fontSize: 10.5, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Admin</div>
          </div>
        </div>

        <h1 style={{ color: "#0d1b3e", fontWeight: 900, fontSize: 26, margin: "0 0 8px", letterSpacing: "-0.02em" }}>Admin access</h1>
        <p style={{ color: "#52565e", fontSize: 14.5, margin: "0 0 24px", lineHeight: 1.5 }}>
          Enter the admin password to manage CzechHub content.
        </p>

        <label style={{ display: "block", color: "#0d1b3e", fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>Password</label>
        <input
          type="password"
          value={pw}
          autoFocus
          onChange={(e) => {
            setPw(e.target.value);
            if (error) setError(false);
          }}
          placeholder="••••••••"
          style={{
            width: "100%",
            padding: "13px 16px",
            borderRadius: 12,
            border: `1.5px solid ${error ? COLORS.red : "#dde3ec"}`,
            fontSize: 15,
            outline: "none",
            color: "#0d1b3e",
            transition: "border-color 0.15s",
            fontFamily: "inherit",
          }}
        />
        {error && (
          <div style={{ color: COLORS.red, fontSize: 13, fontWeight: 600, marginTop: 8 }}>
            Incorrect password. Please try again.
          </div>
        )}

        <button
          type="submit"
          style={{
            width: "100%",
            marginTop: 22,
            padding: "13px 20px",
            borderRadius: 12,
            border: "none",
            background: COLORS.blue,
            color: "#fff",
            fontSize: 15,
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "0 8px 22px rgba(3,126,243,0.35)",
          }}
        >
          Unlock →
        </button>

        <a
          href="/"
          style={{ display: "block", textAlign: "center", marginTop: 18, color: "#52565e", fontSize: 13, textDecoration: "none", fontWeight: 600 }}
        >
          ← Back to site
        </a>
      </form>
    </div>
  );
}
