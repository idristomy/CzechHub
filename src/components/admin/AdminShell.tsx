"use client";

import { useState, type CSSProperties } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui";
import { COLORS, areaColor } from "@/lib/theme";
import { EVENTS, LCS, LC_MEMBERS_FLAT, MC_MEMBERS, NEWS, RESOURCES } from "@/lib/data";
import { useCollection } from "@/lib/useData";
import { isSupabaseConfigured } from "@/lib/supabase/client";
import { adminMutate } from "@/lib/admin-client";
import { ENTITIES, SETTINGS_ENTITY, AREA_ADMIN_ENTITY, type Entity, type EntityKey, type Field } from "@/lib/admin-entities";
import { SETTINGS_DEFAULTS } from "@/lib/settings";
import EntityEditor from "./EntityEditor";

type Row = Record<string, unknown>;
type SectionKey = "dashboard" | "settings" | "areas" | EntityKey;

const SECTIONS: EntityKey[] = ["mc", "lcs", "lcmembers", "resources", "events", "news"];

const NAV: { key: SectionKey; label: string }[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "mc", label: ENTITIES.mc.navLabel },
  { key: "areas", label: AREA_ADMIN_ENTITY.navLabel },
  { key: "lcs", label: ENTITIES.lcs.navLabel },
  { key: "lcmembers", label: ENTITIES.lcmembers.navLabel },
  { key: "resources", label: ENTITIES.resources.navLabel },
  { key: "events", label: ENTITIES.events.navLabel },
  { key: "news", label: ENTITIES.news.navLabel },
  { key: "settings", label: SETTINGS_ENTITY.navLabel },
];

const TYPE_COLORS: Record<string, string> = {
  National: COLORS.blue,
  Training: COLORS.green,
  Deadline: COLORS.red,
  International: COLORS.purple,
};

const thStyle: CSSProperties = { textAlign: "left", padding: "13px 18px", fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8a909c", whiteSpace: "nowrap" };
const tdStyle: CSSProperties = { padding: "13px 18px", fontSize: 13.5, color: "#0d1b3e", verticalAlign: "middle" };

function Icon({ name }: { name: SectionKey }) {
  const c = { width: 19, height: 19, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (name) {
    case "dashboard":
      return (<svg {...c}><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>);
    case "mc":
      return (<svg {...c}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
    case "lcs":
      return (<svg {...c}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>);
    case "lcmembers":
      return (<svg {...c}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
    case "areas":
      return (<svg {...c}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></svg>);
    case "resources":
      return (<svg {...c}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>);
    case "events":
      return (<svg {...c}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>);
    case "news":
      return (<svg {...c}><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9h4" /><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z" /></svg>);
    case "settings":
      return (<svg {...c}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>);
  }
}

function fmtDate(d: string) {
  const parsed = new Date(d);
  if (isNaN(parsed.getTime())) return d;
  return parsed.toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" });
}

function badgeColor(f: Field, row: Row) {
  if (f.key === "type") return TYPE_COLORS[String(row.type)] || COLORS.gray;
  if (f.key === "role") return row.role === "MCP" || row.role === "LCP" ? COLORS.blue : areaColor(String(row.area || ""));
  return COLORS.blue;
}

function Cell({ f, row }: { f: Field; row: Row }) {
  const v = row[f.key];
  if (v == null || v === "") return <span style={{ color: "#c2c8d4" }}>—</span>;
  if (f.type === "date") return <span style={{ whiteSpace: "nowrap", color: "#52565e" }}>{fmtDate(String(v))}</span>;
  if (f.key === "role" || f.key === "type") return <Badge label={String(v)} color={badgeColor(f, row)} />;
  if (f.type === "url") return <a href={String(v)} target="_blank" rel="noreferrer" style={{ color: COLORS.blue, textDecoration: "none", fontWeight: 600 }}>Link ↗</a>;
  const s = String(v);
  const short = s.length > 44 ? s.slice(0, 44) + "…" : s;
  return <span style={{ fontWeight: f.key === "name" || f.key === "label" || f.key === "title" ? 700 : 400 }}>{short}</span>;
}

function ActionBtn({ children, onClick, danger }: { children: React.ReactNode; onClick: () => void; danger?: boolean }) {
  return (
    <button
      onClick={onClick}
      style={{ border: `1px solid ${danger ? "#f3c7c2" : "#dde3ec"}`, background: "#fff", color: danger ? "#c0473b" : "#52565e", fontSize: 12, fontWeight: 700, padding: "6px 12px", borderRadius: 8, cursor: "pointer", marginLeft: 8 }}
    >
      {children}
    </button>
  );
}

function EntitySection({
  entity,
  rows,
  onAdd,
  onEdit,
  onDelete,
}: {
  entity: Entity;
  rows: Row[];
  onAdd: () => void;
  onEdit: (row: Row) => void;
  onDelete: (row: Row) => void;
}) {
  const listFields = entity.fields.filter((f) => f.type !== "textarea" && f.key !== "sort").slice(0, 4);
  return (
    <>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 22 }}>
        <div>
          <h2 style={{ color: "#0d1b3e", fontWeight: 900, fontSize: 24, margin: "0 0 4px", letterSpacing: "-0.02em" }}>{entity.title}</h2>
          <p style={{ color: "#52565e", fontSize: 14, margin: 0 }}>{entity.subtitle}</p>
        </div>
        <button onClick={onAdd} style={{ border: "none", background: COLORS.blue, color: "#fff", fontSize: 13.5, fontWeight: 800, padding: "11px 18px", borderRadius: 10, cursor: "pointer", boxShadow: "0 6px 16px rgba(3,126,243,0.28)" }}>
          + Add {entity.singular}
        </button>
      </div>

      <div style={{ overflowX: "auto", background: "#fff", border: "1px solid #e7ebf2", borderRadius: 14, boxShadow: "0 1px 3px rgba(13,27,62,0.05)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640 }}>
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #eef1f6" }}>
              {listFields.map((f) => (<th key={f.key} style={thStyle}>{f.label}</th>))}
              <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} style={{ borderTop: ri === 0 ? "none" : "1px solid #f0f2f6" }}>
                {listFields.map((f) => (<td key={f.key} style={tdStyle}><Cell f={f} row={row} /></td>))}
                <td style={{ ...tdStyle, textAlign: "right", whiteSpace: "nowrap" }}>
                  <ActionBtn onClick={() => onEdit(row)}>Edit</ActionBtn>
                  <ActionBtn danger onClick={() => onDelete(row)}>Delete</ActionBtn>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr><td colSpan={listFields.length + 1} style={{ ...tdStyle, textAlign: "center", color: "#8a909c", padding: "28px 18px" }}>Nothing here yet — click “Add {entity.singular}”.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

function Dashboard({ counts, go }: { counts: Record<string, number>; go: (s: SectionKey) => void }) {
  const cards: { key: SectionKey; label: string }[] = [
    { key: "mc", label: "MC Members" },
    { key: "areas", label: "Functional Areas" },
    { key: "lcs", label: "Local Committees" },
    { key: "lcmembers", label: "LC Board Members" },
    { key: "resources", label: "Resources" },
    { key: "events", label: "Events" },
    { key: "news", label: "News Posts" },
  ];
  return (
    <>
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ color: "#0d1b3e", fontWeight: 900, fontSize: 24, margin: "0 0 4px", letterSpacing: "-0.02em" }}>Dashboard</h2>
        <p style={{ color: "#52565e", fontSize: 14, margin: 0 }}>Overview of all CzechHub content. Click a card to manage it.</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
        {cards.map((c) => (
          <button
            key={c.key}
            onClick={() => go(c.key)}
            style={{ textAlign: "left", cursor: "pointer", background: "#fff", border: "1px solid #e7ebf2", borderRadius: 14, padding: "20px 22px", boxShadow: "0 1px 3px rgba(13,27,62,0.05)", transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(3,126,243,0.14)"; e.currentTarget.style.borderColor = "rgba(3,126,243,0.4)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(13,27,62,0.05)"; e.currentTarget.style.borderColor = "#e7ebf2"; }}
          >
            <div style={{ color: COLORS.blue, marginBottom: 12 }}><Icon name={c.key} /></div>
            <div style={{ color: "#0d1b3e", fontWeight: 900, fontSize: 32, lineHeight: 1, letterSpacing: "-0.02em" }}>{counts[c.key]}</div>
            <div style={{ color: "#8a909c", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 6 }}>{c.label}</div>
          </button>
        ))}
      </div>
    </>
  );
}

function SettingsSection({ entity, row, onEdit }: { entity: Entity; row: Row | null; onEdit: () => void }) {
  return (
    <>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 22 }}>
        <div>
          <h2 style={{ color: "#0d1b3e", fontWeight: 900, fontSize: 24, margin: "0 0 4px", letterSpacing: "-0.02em" }}>{entity.title}</h2>
          <p style={{ color: "#52565e", fontSize: 14, margin: 0 }}>{entity.subtitle}</p>
        </div>
        <button onClick={onEdit} style={{ border: "none", background: COLORS.blue, color: "#fff", fontSize: 13.5, fontWeight: 800, padding: "11px 18px", borderRadius: 10, cursor: "pointer", boxShadow: "0 6px 16px rgba(3,126,243,0.28)" }}>
          Edit settings
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
        {entity.fields.map((f) => (
          <div key={f.key} style={{ background: "#fff", border: "1px solid #e7ebf2", borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 3px rgba(13,27,62,0.05)" }}>
            <div style={{ color: "#8a909c", fontSize: 11, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>{f.label}</div>
            <div style={{ color: "#0d1b3e", fontSize: 16, fontWeight: 700 }}>{row && row[f.key] != null && row[f.key] !== "" ? String(row[f.key]) : <span style={{ color: "#c2c8d4" }}>—</span>}</div>
          </div>
        ))}
      </div>
    </>
  );
}

export default function AdminShell({ onLogout }: { onLogout: () => void }) {
  const [section, setSection] = useState<SectionKey>("dashboard");
  const [editor, setEditor] = useState<{ entity: Entity; row: Row | null } | null>(null);

  const collections = {
    mc: useCollection<Row>("mc_members", MC_MEMBERS as unknown as Row[], "sort"),
    lcs: useCollection<Row>("lcs", LCS as unknown as Row[], "sort"),
    lcmembers: useCollection<Row>("lc_members", LC_MEMBERS_FLAT as unknown as Row[], "sort"),
    resources: useCollection<Row>("resources", RESOURCES as unknown as Row[], "sort"),
    events: useCollection<Row>("events", EVENTS as unknown as Row[], "date"),
    news: useCollection<Row>("news", NEWS as unknown as Row[], "date", false),
  };

  const settingsCol = useCollection<Row>("settings", [{ id: 1, ...SETTINGS_DEFAULTS }] as unknown as Row[], "id");
  const settingsRow = settingsCol.data[0] ?? null;

  // Functional Areas are the MCVPs (with a department), ordered by board sort.
  const areaRows = collections.mc.data.filter(
    (m) => String(m.role) === "MCVP" && String(m.area ?? "").trim() !== ""
  );

  const optionSources = Object.fromEntries(
    SECTIONS.map((k) => [k, collections[k].data])
  ) as Record<EntityKey, Row[]>;

  const counts: Record<string, number> = {
    ...Object.fromEntries(SECTIONS.map((k) => [k, collections[k].data.length])),
    areas: areaRows.length,
  };

  const configured = isSupabaseConfigured();
  const title = NAV.find((n) => n.key === section)?.label ?? "Admin";

  // Refresh whichever loaded collection owns a given table (settings and the
  // Functional Areas view both live in already-tracked tables).
  const refreshByTable = (table: string) => {
    if (table === SETTINGS_ENTITY.table) return settingsCol.refresh();
    for (const k of SECTIONS) if (ENTITIES[k].table === table) return collections[k].refresh();
  };

  const handleDelete = async (entity: Entity, row: Row) => {
    if (!window.confirm(`Delete this ${entity.singular}? This cannot be undone.`)) return;
    const res = await adminMutate({ table: entity.table, action: "delete", id: row[entity.idField] as string | number });
    if (!res.ok) { window.alert(res.error || "Delete failed."); return; }
    refreshByTable(entity.table);
  };

  return (
    <div className="admin-shell" style={{ minHeight: "100vh", display: "flex", background: "#f5f7fb" }}>
      {/* Sidebar */}
      <aside className="admin-sidebar" style={{ width: 248, flexShrink: 0, background: "#0d1b3e", display: "flex", flexDirection: "column", padding: "22px 16px" }}>
        <div className="admin-brand" style={{ display: "flex", alignItems: "center", gap: 11, padding: "4px 10px 22px" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/aiesec-logo.png" alt="AIESEC" style={{ height: 26, filter: "brightness(0) invert(1)" }} />
          <div style={{ width: 1, height: 22, background: "rgba(255,255,255,0.2)" }} />
          <div>
            <div style={{ color: "#fff", fontWeight: 900, fontSize: 14, lineHeight: 1.1 }}>CzechHub</div>
            <div style={{ color: "#62b7ff", fontSize: 9.5, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Admin</div>
          </div>
        </div>

        <nav className="admin-nav" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV.map((n) => {
            const active = n.key === section;
            return (
              <button
                key={n.key}
                onClick={() => setSection(n.key)}
                style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", border: "none", cursor: "pointer", padding: "11px 14px", borderRadius: 10, fontSize: 14, fontWeight: active ? 800 : 600, color: active ? "#fff" : "rgba(255,255,255,0.62)", background: active ? COLORS.blue : "transparent", whiteSpace: "nowrap", transition: "background 0.15s, color 0.15s" }}
              >
                <Icon name={n.key} />
                {n.label}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="admin-main" style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <header style={{ background: "#fff", borderBottom: "1px solid #e7ebf2", padding: "0 28px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <h1 style={{ color: "#0d1b3e", fontWeight: 900, fontSize: 18, margin: 0, letterSpacing: "-0.01em" }}>{title}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Link href="/" style={{ color: "#52565e", fontSize: 13.5, fontWeight: 700, textDecoration: "none", padding: "8px 14px", borderRadius: 9, border: "1px solid #e2e7f0" }}>View site ↗</Link>
            <button onClick={onLogout} style={{ border: "none", background: "#0d1b3e", color: "#fff", fontSize: 13.5, fontWeight: 700, padding: "9px 16px", borderRadius: 9, cursor: "pointer" }}>Log out</button>
          </div>
        </header>

        <main style={{ padding: 28, maxWidth: 1100, width: "100%" }}>
          {!configured && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 12, padding: "12px 16px", marginBottom: 22 }}>
              <span style={{ fontSize: 18 }}>⚠️</span>
              <span style={{ color: "#9a3412", fontSize: 13.5, lineHeight: 1.5 }}>
                <strong>Supabase not configured.</strong> Add your keys to <code>.env.local</code> and restart the dev server to load and save live data. Showing seed data for now.
              </span>
            </div>
          )}

          {section === "dashboard" ? (
            <Dashboard counts={counts} go={setSection} />
          ) : section === "settings" ? (
            <SettingsSection
              entity={SETTINGS_ENTITY}
              row={settingsRow}
              onEdit={() => setEditor({ entity: SETTINGS_ENTITY, row: settingsRow })}
            />
          ) : section === "areas" ? (
            <EntitySection
              entity={AREA_ADMIN_ENTITY}
              rows={areaRows}
              onAdd={() => setEditor({ entity: AREA_ADMIN_ENTITY, row: null })}
              onEdit={(row) => setEditor({ entity: AREA_ADMIN_ENTITY, row })}
              onDelete={(row) => handleDelete(AREA_ADMIN_ENTITY, row)}
            />
          ) : (
            <EntitySection
              entity={ENTITIES[section]}
              rows={collections[section].data}
              onAdd={() => setEditor({ entity: ENTITIES[section], row: null })}
              onEdit={(row) => setEditor({ entity: ENTITIES[section], row })}
              onDelete={(row) => handleDelete(ENTITIES[section], row)}
            />
          )}
        </main>
      </div>

      {editor && (
        <EntityEditor
          entity={editor.entity}
          initial={editor.row}
          optionSources={optionSources}
          onClose={() => setEditor(null)}
          onSaved={() => refreshByTable(editor.entity.table)}
        />
      )}

      <style>{`
        @media (max-width: 860px) {
          .admin-shell { flex-direction: column; }
          .admin-sidebar { width: 100% !important; padding: 14px 14px 10px; }
          .admin-brand { padding-bottom: 12px; }
          .admin-nav { flex-direction: row !important; overflow-x: auto; gap: 6px; padding-bottom: 4px; }
          .admin-nav button { flex-shrink: 0; }
        }
      `}</style>
    </div>
  );
}
