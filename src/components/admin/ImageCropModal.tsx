"use client";

import { useCallback, useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { COLORS } from "@/lib/theme";

// Draw the selected crop region to a canvas and return a JPEG blob, capping the
// longest side so uploads stay small.
async function getCroppedBlob(src: string, area: Area): Promise<Blob> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = src;
  });
  const maxW = 900;
  const scale = area.width > maxW ? maxW / area.width : 1;
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(area.width * scale));
  canvas.height = Math.max(1, Math.round(area.height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");
  ctx.drawImage(image, area.x, area.y, area.width, area.height, 0, 0, canvas.width, canvas.height);
  return new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Crop failed"))), "image/jpeg", 0.9)
  );
}

export default function ImageCropModal({
  src,
  aspect = 3 / 4,
  onCancel,
  onApply,
}: {
  src: string;
  aspect?: number;
  onCancel: () => void;
  onApply: (blob: Blob) => void;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);

  const onComplete = useCallback((_: Area, px: Area) => setArea(px), []);

  const apply = async () => {
    if (!area) return;
    setBusy(true);
    try {
      onApply(await getCroppedBlob(src, area));
    } finally {
      setBusy(false);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      onClick={(e) => { e.stopPropagation(); onCancel(); }}
      style={{ position: "fixed", inset: 0, background: "rgba(13,27,62,0.75)", zIndex: 10000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, width: "100%", maxWidth: 460, overflow: "hidden", boxShadow: "0 30px 90px rgba(0,0,0,0.4)" }}>
        <div style={{ padding: "16px 20px", borderBottom: "1px solid #eef1f6", fontWeight: 900, color: "#0d1b3e", fontSize: 16 }}>
          Crop photo <span style={{ color: "#8a909c", fontWeight: 600, fontSize: 12.5 }}>— drag to reposition, scroll or use the slider to zoom</span>
        </div>
        <div style={{ position: "relative", width: "100%", height: 360, background: "#0d1b3e" }}>
          <Cropper
            image={src}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onComplete}
            objectFit="contain"
          />
        </div>
        <div style={{ padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 12, color: "#52565e", fontWeight: 700 }}>Zoom</span>
          <input type="range" min={1} max={4} step={0.01} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} style={{ flex: 1 }} />
        </div>
        <div style={{ padding: "0 20px 18px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button type="button" onClick={onCancel} style={{ border: "1px solid #dde3ec", background: "#fff", color: "#52565e", fontSize: 14, fontWeight: 700, padding: "9px 16px", borderRadius: 10, cursor: "pointer" }}>Cancel</button>
          <button type="button" onClick={apply} disabled={busy || !area} style={{ border: "none", background: COLORS.blue, color: "#fff", fontSize: 14, fontWeight: 800, padding: "9px 20px", borderRadius: 10, cursor: busy ? "wait" : "pointer", opacity: busy || !area ? 0.7 : 1 }}>
            {busy ? "Applying…" : "Apply & upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
