"use client";

import { Silhouette } from "@/components/ui";
import { areaColor, COLORS } from "@/lib/theme";
import type { CSSProperties } from "react";

type CardProps = {
  name: string;
  area: string;
  role: "MCP" | "MCVP" | "LCP" | "LCVP";
  photo?: string | null;
  isApex: boolean;
  color?: string;
  bio?: string;
  hovered: boolean;
  dimmed?: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
  mounted: boolean;
  animDelay: number;
};

export default function PyramidCard(props: CardProps) {
  const {
    name,
    area,
    role,
    photo,
    isApex,
    hovered,
    dimmed,
    onHover,
    onLeave,
    onClick,
    mounted,
    animDelay,
    bio,
  } = props;
  const isPresident = role === "MCP" || role === "LCP";
  const placeholder = !photo;
  const col = props.color ?? (isPresident ? COLORS.blue : areaColor(area));
  const apexLabel = role === "MCP" ? "★ MCP" : "★ LCP";
  const vpLabel = role === "MCVP" ? "MCVP " + area : "LCVP " + area;

  const cardW: number | "auto" = isApex ? (role === "MCP" ? 260 : 240) : "auto";
  const cardH: number = isApex ? (role === "MCP" ? 340 : 320) : role === "MCVP" ? 240 : 220;

  const transform = !mounted
    ? "translateY(40px) scale(0.9)"
    : hovered
      ? "translateY(-8px) scale(1.04)"
      : dimmed
        ? "scale(0.96)"
        : "scale(1)";

  const containerStyle: CSSProperties = {
    position: "relative",
    width: cardW,
    height: cardH,
    borderRadius: role === "MCVP" || role === "MCP" ? 18 : 20,
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
    transform,
    opacity: !mounted ? 0 : dimmed ? 0.5 : 1,
    transitionDelay: !mounted ? `${animDelay}s` : "0s",
    boxShadow: hovered
      ? `0 24px 60px ${col}55, 0 0 0 2px ${col}`
      : isApex
        ? `0 12px 40px rgba(3,126,243,0.3), 0 0 0 2px rgba(98,183,255,0.4)`
        : "0 8px 24px rgba(13,27,62,0.18)",
    background: "#0d1b3e",
  };

  const gradient =
    role === "MCP" || role === "MCVP"
      ? isApex
        ? "linear-gradient(180deg, rgba(3,126,243,0.0) 0%, rgba(3,126,243,0.1) 40%, rgba(13,27,62,0.95) 100%)"
        : "linear-gradient(180deg, rgba(3,126,243,0.0) 0%, rgba(3,126,243,0.15) 40%, rgba(13,27,62,0.96) 100%)"
      : `linear-gradient(180deg, transparent 30%, ${col}40 60%, rgba(13,27,62,0.95) 100%)`;

  return (
    <div onMouseEnter={onHover} onMouseLeave={onLeave} onClick={onClick} style={containerStyle}>
      {/* Background photo / silhouette placeholder */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          ...(placeholder
            ? {}
            : {
                backgroundImage: `url(${photo})`,
                backgroundSize: "cover",
                backgroundPosition: "center top",
                filter: "saturate(1.05)",
              }),
          transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: hovered ? "scale(1.08)" : "scale(1)",
        }}
      >
        {placeholder && <Silhouette bg="#12244a" fg="#31518a" />}
      </div>
      {/* Gradient overlay */}
      <div style={{ position: "absolute", inset: 0, background: gradient, transition: "all 0.4s" }} />
      {/* Hover blue tint (MC only) */}
      {(role === "MCP" || role === "MCVP") && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(135deg, rgba(3,126,243,${hovered ? 0.25 : 0}) 0%, transparent 70%)`,
            transition: "opacity 0.4s",
            mixBlendMode: "overlay",
          }}
        />
      )}

      {/* Apex badge */}
      {isApex && (
        <div
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 3,
            background: "rgba(255,255,255,0.95)",
            color: role === "MCP" ? COLORS.blue : col,
            fontWeight: 900,
            fontSize: 11,
            letterSpacing: "0.15em",
            padding: "6px 12px",
            borderRadius: 20,
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          {apexLabel}
        </div>
      )}

      {/* Pulse rings on apex */}
      {isApex && role === "MCP" && (
        <>
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: "2px solid rgba(98,183,255,0.4)",
              animation: "pulseRing 3s ease-out infinite",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "30%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              width: 120,
              height: 120,
              borderRadius: "50%",
              border: "2px solid rgba(98,183,255,0.4)",
              animation: "pulseRing 3s ease-out infinite 1.5s",
              pointerEvents: "none",
            }}
          />
        </>
      )}

      {/* Content */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: isApex ? 22 : 16,
          zIndex: 2,
          color: "#fff",
          transform: hovered ? "translateY(-4px)" : "translateY(0)",
          transition: "transform 0.4s",
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: isApex ? "rgba(255,255,255,0.18)" : col,
            color: "#fff",
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: "0.1em",
            padding: "4px 10px",
            borderRadius: 6,
            backdropFilter: "blur(10px)",
            marginBottom: 10,
            textTransform: "uppercase",
          }}
        >
          {isApex ? "President" : vpLabel}
        </div>

        <h3
          style={{
            fontWeight: 900,
            fontSize: isApex ? 22 : 15,
            margin: "0 0 4px",
            lineHeight: 1.15,
            letterSpacing: "-0.01em",
            whiteSpace: isApex ? "normal" : "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {placeholder ? "To be announced" : name}
        </h3>

        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: isApex ? 13 : 11,
            margin: 0,
            fontWeight: 400,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {placeholder ? "Awaiting appointment" : isApex ? bio?.split(".")[0] + "." : "Leading " + area}
        </p>

        {!placeholder && (role === "MCP" || role === "MCVP") && (
          <div
            style={{
              marginTop: hovered ? 10 : 0,
              maxHeight: hovered ? 30 : 0,
              opacity: hovered ? 1 : 0,
              overflow: "hidden",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              display: "flex",
              alignItems: "center",
              gap: 6,
              color: "#62b7ff",
              fontSize: 11.5,
              fontWeight: 700,
            }}
          >
            View Profile <span>→</span>
          </div>
        )}
      </div>

      {/* Shimmer line on hover */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          background:
            "linear-gradient(90deg, transparent 0%, #62b7ff 50%, transparent 100%)",
          backgroundSize: "200% 100%",
          opacity: hovered ? 1 : 0,
          animation: hovered ? "shimmer 2s linear infinite" : "none",
          transition: "opacity 0.3s",
          zIndex: 3,
        }}
      />
    </div>
  );
}
