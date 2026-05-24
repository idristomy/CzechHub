"use client";

import { useEffect } from "react";
import { areaColor, COLORS } from "@/lib/theme";

type ModalMember = {
  name: string;
  role: string;
  area: string;
  bio?: string;
  linkedin?: string;
};

export default function MemberModal({
  member,
  photo,
  onClose,
}: {
  member: ModalMember;
  photo: string;
  onClose: () => void;
}) {
  const isPresident = member.role === "MCP" || member.role === "LCP";
  const col = isPresident ? COLORS.blue : areaColor(member.area);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(13,27,62,0.85)",
        backdropFilter: "blur(8px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        animation: "modalIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-grid"
        style={{
          background: "#fff",
          borderRadius: 24,
          maxWidth: 760,
          width: "100%",
          display: "grid",
          gridTemplateColumns: "320px 1fr",
          overflow: "hidden",
          boxShadow: "0 40px 100px rgba(0,0,0,0.5)",
          animation: "modalIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div
          style={{
            backgroundImage: `url(${photo})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: 380,
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, transparent 50%, rgba(13,27,62,0.7) 100%)",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: 16,
              left: 16,
              background: col,
              color: "#fff",
              padding: "6px 14px",
              borderRadius: 6,
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: "0.1em",
            }}
          >
            {member.role}
            {member.role === "MCVP" || member.role === "LCVP" ? " " + member.area : ""}
          </div>
        </div>

        <div style={{ padding: 32, position: "relative" }}>
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "#f8f8f8",
              border: "none",
              width: 32,
              height: 32,
              borderRadius: "50%",
              cursor: "pointer",
              fontSize: 16,
              color: "#52565e",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "all 0.15s",
            }}
          >
            ✕
          </button>
          <h2
            style={{
              color: "#0d1b3e",
              fontWeight: 900,
              fontSize: 28,
              margin: "0 0 6px",
              letterSpacing: "-0.02em",
            }}
          >
            {member.name}
          </h2>
          <p style={{ color: col, fontSize: 14, fontWeight: 700, margin: "0 0 20px" }}>
            {member.role === "MCP"
              ? "National President"
              : member.role === "LCP"
                ? "Local Committee President"
                : `Vice President — ${member.area}`}
          </p>
          {member.bio && (
            <p
              style={{
                color: "#52565e",
                fontSize: 15,
                lineHeight: 1.7,
                margin: "0 0 24px",
              }}
            >
              {member.bio}
            </p>
          )}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 20px",
                  background: "#037ef3",
                  color: "#fff",
                  borderRadius: 10,
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: "none",
                  transition: "background 0.15s",
                }}
              >
                🔗 LinkedIn
              </a>
            )}
            <a
              href={`mailto:${member.area?.toLowerCase() || "mc"}@aiesec.cz`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 20px",
                background: "#f8f8f8",
                color: "#0d1b3e",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                transition: "background 0.15s",
              }}
            >
              ✉ Email
            </a>
          </div>
        </div>
      </div>
      <style>{`@media (max-width: 640px) { .modal-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
