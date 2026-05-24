"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui";
import { COLORS, areaColor } from "@/lib/theme";
import { AREAS, EVENTS, LCS, LC_EB, MC_MEMBERS, NEWS, RESOURCES } from "@/lib/data";

type SectionKey = "dashboard" | "mc" | "lcs" | "areas" | "resources" | "events" | "news";

const NAV: { key: SectionKey; label: string }[] = [
  { key: "dashboard", label: "Dashboard" },
  { key: "mc", label: "MC Board" },
  { key: "lcs", label: "Local Committees" },
  { key: "areas", label: "Functional Areas" },
  { key: "resources", label: "Resources" },
  { key: "events", label: "Events" },
  { key: "news", label: "News" },
];

const TYPE_COLORS: Record<string, string> = {
  National: COLORS.blue,
  Training: COLORS.green,
  Deadline: COLORS.red,
  International: COLORS.purple,
};

function Icon({ name }: { name: SectionKey }) {
  const c = {
    width: 19,
    height: 19,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.9,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  switch (name) {
    case "dashboard":
      return (<svg {...c}><rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" /><rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" /></svg>);
    case "mc":
      return (<svg {...c}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>);
    case "lcs":
      return (<svg {...c}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>);
    case "areas":
      return (<svg {...c}><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></svg>);
    case "resources":
      return (<svg {...c}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></svg>);
    case "events":
      return (<svg {...c}><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>);
    case "news":
      return (<svg {...c}><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-4 0v-9h4" /><path d="M18 14h-8M15 18h-5M10 6h8v4h-8z" /></svg>);
  }
}

const thStyle: CSSProperties = { textAlign: "left", padding: "13px 18px", fontSize: 11, fontWeight: 800, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8a909c", whiteSpace: "nowrap" };
const tdStyle: CSSProperties = { padding: "14px 18px", fontSize: 13.5, color: "#0d1b3e", verticalAlign: "middle" };

function DisabledBtn({ children, danger }: { children: ReactNode; danger?: boolean }) {
  return (
    <button
      disabled
      title="Connect Supabase to enable editing"
      style={{
        border: `1px solid ${danger ? "#f3c7c2" : "#dde3ec"}`,
        background: "#fff",
        color: danger ? "#c0473b" : "#52565e",
        fontSize: 12,
        fontWeight: 700,
        padding: "6px 12px",
        borderRadius: 8,
        cursor: "not-allowed",
        opacity: 0.6,
        marginLeft: 8,
      }}
    >
      {children}
    </button>
  );
}

function Table({ head, rows }: { head: string[]; rows: ReactNode[][] }) {
  return (
    <div style={{ overflowX: "auto", background: "#fff", border: "1px solid #e7ebf2", borderRadius: 14, boxShadow: "0 1px 3px rgba(13,27,62,0.05)" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 660 }}>
        <thead>
          <tr style={{ background: "#f8fafc", borderBottom: "1px solid #eef1f6" }}>
            {head.map((h, i) => (<th key={i} style={thStyle}>{h}</th>))}
            <th style={{ ...thStyle, textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((cells, ri) => (
            <tr key={ri} style={{ borderTop: ri === 0 ? "none" : "1px solid #f0f2f6" }}>
              {cells.map((cell, ci) => (<td key={ci} style={tdStyle}>{cell}</td>))}
              <td style={{ ...tdStyle, textAlign: "right", whiteSpace: "nowrap" }}>
                <DisabledBtn>Edit</DisabledBtn>
                <DisabledBtn danger>Delete</DisabledBtn>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ReadOnlyNotice() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, background: "#eef6ff", border: "1px solid #cfe4fd", borderRadius: 12, padding: "12px 16px", marginBottom: 22 }}>
      <span style={{ flexShrink: 0, width: 22, height: 22, borderRadius: "50%", background: COLORS.blue, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 900 }}>i</span>
      <span style={{ color: "#0d4a8a", fontSize: 13.5, lineHeight: 1.5 }}>
        <strong>Read-only preview.</strong> Data is loaded from the static layer. Connect Supabase to enable creating, editing and deleting.
      </span>
    </div>
  );
}

function SectionHeader({ title, subtitle, addLabel }: { title: string; subtitle: string; addLabel: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 22 }}>
      <div>
        <h2 style={{ color: "#0d1b3e", fontWeight: 900, fontSize: 24, margin: "0 0 4px", letterSpacing: "-0.02em" }}>{title}</h2>
        <p style={{ color: "#52565e", fontSize: 14, margin: 0 }}>{subtitle}</p>
      </div>
      <button
        disabled
        title="Connect Supabase to enable editing"
        style={{ border: "none", background: COLORS.blue, color: "#fff", fontSize: 13.5, fontWeight: 800, padding: "11px 18px", borderRadius: 10, cursor: "not-allowed", opacity: 0.5 }}
      >
        + {addLabel}
      </button>
    </div>
  );
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" });
}

function Dashboard({ go }: { go: (s: SectionKey) => void }) {
  const cards: { key: SectionKey; label: string; count: number }[] = [
    { key: "mc", label: "MC Members", count: MC_MEMBERS.length },
    { key: "lcs", label: "Local Committees", count: LCS.length },
    { key: "areas", label: "Functional Areas", count: AREAS.length },
    { key: "resources", label: "Resources", count: RESOURCES.length },
    { key: "events", label: "Events", count: EVENTS.length },
    { key: "news", label: "News Posts", count: NEWS.length },
  ];
  const today = new Date("2026-05-23");
  const upcoming = [...EVENTS].filter((e) => new Date(e.date) >= today).sort((a, b) => +new Date(a.date) - +new Date(b.date)).slice(0, 4);

  return (
    <>
      <SectionHeaderLite title="Dashboard" subtitle="Overview of all CzechHub content." />
      <ReadOnlyNotice />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
        {cards.map((c) => (
          <button
            key={c.key}
            onClick={() => go(c.key)}
            style={{ textAlign: "left", cursor: "pointer", background: "#fff", border: "1px solid #e7ebf2", borderRadius: 14, padding: "20px 22px", boxShadow: "0 1px 3px rgba(13,27,62,0.05)", transition: "transform 0.2s, box-shadow 0.2s, border-color 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(3,126,243,0.14)"; e.currentTarget.style.borderColor = "rgba(3,126,243,0.4)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 3px rgba(13,27,62,0.05)"; e.currentTarget.style.borderColor = "#e7ebf2"; }}
          >
            <div style={{ color: COLORS.blue, marginBottom: 12 }}><Icon name={c.key} /></div>
            <div style={{ color: "#0d1b3e", fontWeight: 900, fontSize: 32, lineHeight: 1, letterSpacing: "-0.02em" }}>{c.count}</div>
            <div style={{ color: "#8a909c", fontSize: 12, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", marginTop: 6 }}>{c.label}</div>
          </button>
        ))}
      </div>

      <h3 style={{ color: "#0d1b3e", fontWeight: 900, fontSize: 17, margin: "0 0 14px" }}>Upcoming events</h3>
      <Table
        head={["Event", "Date", "Location", "Type"]}
        rows={upcoming.map((e) => [
          <span key="n" style={{ fontWeight: 700 }}>{e.name}</span>,
          fmtDate(e.date),
          e.location,
          <Badge key="t" label={e.type} color={TYPE_COLORS[e.type] || COLORS.blue} />,
        ])}
      />
    </>
  );
}

function SectionHeaderLite({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <h2 style={{ color: "#0d1b3e", fontWeight: 900, fontSize: 24, margin: "0 0 4px", letterSpacing: "-0.02em" }}>{title}</h2>
      <p style={{ color: "#52565e", fontSize: 14, margin: 0 }}>{subtitle}</p>
    </div>
  );
}

function Content({ section, go }: { section: SectionKey; go: (s: SectionKey) => void }) {
  if (section === "dashboard") return <Dashboard go={go} />;

  if (section === "mc") {
    return (
      <>
        <SectionHeader title="MC Board" subtitle="National Managing Committee members." addLabel="Add member" />
        <ReadOnlyNotice />
        <Table
          head={["Name", "Role", "Area", "LinkedIn"]}
          rows={MC_MEMBERS.map((m) => [
            <span key="n" style={{ fontWeight: 700 }}>{m.name}</span>,
            <Badge key="r" label={m.role} color={m.role === "MCP" ? COLORS.blue : areaColor(m.area)} />,
            m.area,
            <a key="l" href={m.linkedin} target="_blank" rel="noreferrer" style={{ color: COLORS.blue, textDecoration: "none", fontWeight: 600 }}>Profile ↗</a>,
          ])}
        />
      </>
    );
  }

  if (section === "lcs") {
    return (
      <>
        <SectionHeader title="Local Committees" subtitle="The five Czech local committees." addLabel="Add LC" />
        <ReadOnlyNotice />
        <Table
          head={["Name", "City", "University", "President", "EB"]}
          rows={LCS.map((l) => [
            <span key="n" style={{ fontWeight: 700 }}>{l.name}</span>,
            l.city,
            <span key="u" style={{ color: "#52565e" }}>{l.university}</span>,
            l.lcp,
            `${(LC_EB[l.slug] || []).length} members`,
          ])}
        />
      </>
    );
  }

  if (section === "areas") {
    return (
      <>
        <SectionHeader title="Functional Areas" subtitle="The seven functional areas." addLabel="Add area" />
        <ReadOnlyNotice />
        <Table
          head={["Code", "Name", "MCVP Lead"]}
          rows={AREAS.map((a) => [
            <span key="c" style={{ display: "inline-block", border: `1.5px solid ${areaColor(a.code)}`, color: areaColor(a.code), fontWeight: 800, fontSize: 12, padding: "3px 9px", borderRadius: 7, letterSpacing: "0.04em" }}>{a.code}</span>,
            <span key="n" style={{ fontWeight: 700 }}>{a.name}</span>,
            a.mcvp,
          ])}
        />
      </>
    );
  }

  if (section === "resources") {
    return (
      <>
        <SectionHeader title="Resources" subtitle="Documents, tools and templates." addLabel="Add resource" />
        <ReadOnlyNotice />
        <Table
          head={["Resource", "Category", "Type"]}
          rows={RESOURCES.map((r) => [
            <span key="l" style={{ fontWeight: 700 }}>{r.label}</span>,
            r.cat,
            <Badge key="t" label={r.type} color={COLORS.gray} />,
          ])}
        />
      </>
    );
  }

  if (section === "events") {
    return (
      <>
        <SectionHeader title="Events" subtitle="Conferences, trainings and deadlines." addLabel="Add event" />
        <ReadOnlyNotice />
        <Table
          head={["Event", "Date", "Location", "Type"]}
          rows={EVENTS.map((e) => [
            <span key="n" style={{ fontWeight: 700 }}>{e.name}</span>,
            e.date === e.end ? fmtDate(e.date) : `${fmtDate(e.date)} – ${fmtDate(e.end)}`,
            e.location,
            <Badge key="t" label={e.type} color={TYPE_COLORS[e.type] || COLORS.blue} />,
          ])}
        />
      </>
    );
  }

  // news
  return (
    <>
      <SectionHeader title="News" subtitle="Announcements and updates." addLabel="Add post" />
      <ReadOnlyNotice />
      <Table
        head={["Date", "Title", "Excerpt"]}
        rows={NEWS.map((n) => [
          <span key="d" style={{ whiteSpace: "nowrap", color: "#52565e" }}>{fmtDate(n.date)}</span>,
          <span key="t" style={{ fontWeight: 700 }}>{n.title}</span>,
          <span key="b" style={{ color: "#52565e", display: "inline-block", maxWidth: 360, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{n.body}</span>,
        ])}
      />
    </>
  );
}

export default function AdminShell({ onLogout }: { onLogout: () => void }) {
  const [section, setSection] = useState<SectionKey>("dashboard");
  const title = NAV.find((n) => n.key === section)?.label ?? "Admin";

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
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  width: "100%",
                  textAlign: "left",
                  border: "none",
                  cursor: "pointer",
                  padding: "11px 14px",
                  borderRadius: 10,
                  fontSize: 14,
                  fontWeight: active ? 800 : 600,
                  color: active ? "#fff" : "rgba(255,255,255,0.62)",
                  background: active ? COLORS.blue : "transparent",
                  whiteSpace: "nowrap",
                  transition: "background 0.15s, color 0.15s",
                }}
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
            <button
              onClick={onLogout}
              style={{ border: "none", background: "#0d1b3e", color: "#fff", fontSize: 13.5, fontWeight: 700, padding: "9px 16px", borderRadius: 9, cursor: "pointer" }}
            >
              Log out
            </button>
          </div>
        </header>

        <main style={{ padding: 28, maxWidth: 1100, width: "100%" }}>
          <Content section={section} go={setSection} />
        </main>
      </div>

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
