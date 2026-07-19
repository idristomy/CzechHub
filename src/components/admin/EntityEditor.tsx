"use client";

import { useState } from "react";
import { COLORS } from "@/lib/theme";
import { adminMutate } from "@/lib/admin-client";
import type { Entity, EntityKey, Field } from "@/lib/admin-entities";
import ImageCropModal from "./ImageCropModal";

type Row = Record<string, unknown>;

export default function EntityEditor({
  entity,
  initial,
  optionSources,
  onClose,
  onSaved,
}: {
  entity: Entity;
  initial: Row | null;
  optionSources: Record<EntityKey, Row[]>;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = initial != null;
  const originalId = initial ? initial[entity.idField] : undefined;

  const [values, setValues] = useState<Record<string, string>>(() => {
    const v: Record<string, string> = {};
    for (const f of entity.fields) {
      const raw = initial?.[f.key];
      v[f.key] = raw == null ? "" : String(raw);
    }
    return v;
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState<string | null>(null);
  // Pending file to crop before upload.
  const [crop, setCrop] = useState<{ field: Field; src: string } | null>(null);

  const set = (key: string, val: string) => setValues((p) => ({ ...p, [key]: val }));

  const uploadImage = async (f: Field, file: Blob) => {
    setError("");
    setUploading(f.key);
    try {
      const fd = new FormData();
      fd.append("file", file, "photo.jpg");
      if (f.uploadFolder) fd.append("folder", f.uploadFolder);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json?.url) {
        setError(json?.error || `Upload failed (${res.status})`);
        return;
      }
      set(f.key, json.url as string);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const closeCrop = () => {
    if (crop) URL.revokeObjectURL(crop.src);
    setCrop(null);
  };

  const norm = (s: unknown) => String(s ?? "").trim().toLowerCase();
  // For an "auto lead" field: the MC member responsible for this area (matched
  // on the member's Area/Department against the area code or name).
  const autoLeadValue = (): string => {
    const mc = optionSources["mc"] || [];
    const code = values["code"];
    const name = values["name"];
    const isReal = (n: unknown) => {
      const v = norm(n);
      return v !== "" && v !== "to be announced";
    };
    const m = mc.find(
      (mm) => mm.area && isReal(mm.name) && (norm(mm.area) === norm(code) || norm(mm.area) === norm(name))
    );
    return m ? String(m.name) : "To be announced";
  };

  const resolveOptions = (f: Field): { value: string; label: string }[] => {
    if (f.optionsFrom) {
      const rows = optionSources[f.optionsFrom.entity] || [];
      return rows.map((r) => ({
        value: String(r[f.optionsFrom!.value] ?? ""),
        label: String(r[f.optionsFrom!.label] ?? r[f.optionsFrom!.value] ?? ""),
      }));
    }
    return (f.options || []).map((o) => ({ value: o, label: o }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    for (const f of entity.fields) {
      if (f.readOnly) continue;
      if (f.required && !values[f.key]?.trim()) {
        setError(`"${f.label}" is required.`);
        return;
      }
    }
    // Read-only (auto-derived) fields are never written back.
    const payload: Record<string, string> = {};
    for (const f of entity.fields) if (!f.readOnly) payload[f.key] = values[f.key];
    setBusy(true);
    const res = await adminMutate({
      table: entity.table,
      action: isEdit ? "update" : "insert",
      values: payload,
      id: isEdit ? (originalId as string | number) : undefined,
    });
    setBusy(false);
    if (!res.ok) {
      setError(res.error || "Could not save.");
      return;
    }
    onSaved();
    onClose();
  };

  return (
    <>
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(13,27,62,0.6)",
        backdropFilter: "blur(4px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: 24,
        overflowY: "auto",
      }}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        style={{
          background: "#fff",
          borderRadius: 18,
          width: "100%",
          maxWidth: 620,
          margin: "40px 0",
          boxShadow: "0 30px 90px rgba(0,0,0,0.35)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: "20px 26px", borderBottom: "1px solid #eef1f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ margin: 0, color: "#0d1b3e", fontWeight: 900, fontSize: 19 }}>
            {isEdit ? `Edit ${entity.singular}` : `Add ${entity.singular}`}
          </h2>
          <button type="button" onClick={onClose} style={{ border: "none", background: "#f1f3f8", width: 30, height: 30, borderRadius: "50%", cursor: "pointer", fontSize: 15, color: "#52565e" }}>✕</button>
        </div>

        <div style={{ padding: 26, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          {entity.fields.map((f) => {
            const opts = f.type === "select" ? resolveOptions(f) : [];
            return (
              <label key={f.key} style={{ display: "block", gridColumn: f.full || f.type === "textarea" ? "1 / -1" : "auto" }}>
                <span style={{ display: "block", color: "#0d1b3e", fontSize: 12.5, fontWeight: 700, marginBottom: 6 }}>
                  {f.label}{f.required && <span style={{ color: COLORS.red }}> *</span>}
                </span>
                {f.readOnly ? (
                  <input
                    type="text"
                    value={f.autoLead ? autoLeadValue() : values[f.key]}
                    readOnly
                    disabled
                    style={{ ...inputStyle, background: "#f1f3f8", color: "#52565e", cursor: "not-allowed" }}
                  />
                ) : f.type === "textarea" ? (
                  <textarea
                    value={values[f.key]}
                    onChange={(e) => set(f.key, e.target.value)}
                    rows={3}
                    placeholder={f.placeholder}
                    style={inputStyle}
                  />
                ) : f.type === "select" ? (
                  <select value={values[f.key]} onChange={(e) => set(f.key, e.target.value)} style={inputStyle}>
                    <option value="">— select —</option>
                    {opts.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : f.type === "combo" ? (
                  <>
                    <input
                      type="text"
                      list={`dl-${f.key}`}
                      value={values[f.key]}
                      onChange={(e) => set(f.key, e.target.value)}
                      placeholder={f.placeholder || "Type or pick…"}
                      style={inputStyle}
                    />
                    <datalist id={`dl-${f.key}`}>
                      {resolveOptions(f).map((o) => (
                        <option key={o.value} value={o.value}>{o.label}</option>
                      ))}
                    </datalist>
                  </>
                ) : f.type === "image" ? (
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div
                      style={{
                        width: 72,
                        height: 96,
                        borderRadius: 8,
                        flexShrink: 0,
                        border: "1.5px solid #dde3ec",
                        background: values[f.key]
                          ? `#eef1f6 center top / cover no-repeat url(${values[f.key]})`
                          : "#f1f3f8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#9aa3b2",
                        fontSize: 10,
                        textAlign: "center",
                      }}
                    >
                      {!values[f.key] && "No\nphoto"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
                        disabled={uploading === f.key}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) setCrop({ field: f, src: URL.createObjectURL(file) });
                          e.target.value = "";
                        }}
                        style={{ fontSize: 13, color: "#0d1b3e", maxWidth: "100%" }}
                      />
                      <input
                        type="url"
                        value={values[f.key]}
                        onChange={(e) => set(f.key, e.target.value)}
                        placeholder="…or paste an image URL"
                        style={{ ...inputStyle, marginTop: 8 }}
                      />
                      {uploading === f.key && (
                        <span style={{ display: "block", marginTop: 6, color: COLORS.blue, fontSize: 12, fontWeight: 700 }}>Uploading…</span>
                      )}
                      {values[f.key] && uploading !== f.key && (
                        <button
                          type="button"
                          onClick={() => set(f.key, "")}
                          style={{ marginTop: 6, border: "none", background: "none", color: COLORS.red, fontSize: 12, fontWeight: 700, cursor: "pointer", padding: 0 }}
                        >
                          Remove photo
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <input
                    type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                    value={values[f.key]}
                    onChange={(e) => set(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    style={inputStyle}
                  />
                )}
                {f.hint && (
                  <span style={{ display: "block", marginTop: 6, color: "#8a92a3", fontSize: 11.5, lineHeight: 1.4 }}>{f.hint}</span>
                )}
              </label>
            );
          })}
        </div>

        {error && (
          <div style={{ padding: "0 26px 6px", color: COLORS.red, fontSize: 13, fontWeight: 600 }}>{error}</div>
        )}

        <div style={{ padding: "16px 26px 22px", display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button type="button" onClick={onClose} style={{ border: "1px solid #dde3ec", background: "#fff", color: "#52565e", fontSize: 14, fontWeight: 700, padding: "10px 18px", borderRadius: 10, cursor: "pointer" }}>Cancel</button>
          <button type="submit" disabled={busy} style={{ border: "none", background: COLORS.blue, color: "#fff", fontSize: 14, fontWeight: 800, padding: "10px 22px", borderRadius: 10, cursor: busy ? "wait" : "pointer", opacity: busy ? 0.7 : 1 }}>
            {busy ? "Saving…" : isEdit ? "Save changes" : "Create"}
          </button>
        </div>
      </form>
    </div>
    {crop && (
      <ImageCropModal
        src={crop.src}
        onCancel={closeCrop}
        onApply={async (blob) => {
          const f = crop.field;
          await uploadImage(f, blob);
          closeCrop();
        }}
      />
    )}
    </>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 9,
  border: "1.5px solid #dde3ec",
  fontSize: 14,
  color: "#0d1b3e",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};
