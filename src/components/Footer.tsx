import Link from "next/link";

function FooterCol({
  title,
  items,
}: {
  title: string;
  items: Array<[string, string]>;
}) {
  return (
    <div className="footer-col">
      <div
        style={{
          color: "#fff",
          fontWeight: 800,
          fontSize: 13,
          marginBottom: 14,
          letterSpacing: "0.05em",
        }}
      >
        {title}
      </div>
      <div className="footer-links" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map(([label, href], i) => {
          const isExternal = href.startsWith("#") || href.startsWith("http") || href.startsWith("mailto:");
          if (isExternal) {
            return (
              <a key={i} href={href} className="footer-link" style={{ fontSize: 13, textDecoration: "none" }}>
                {label}
              </a>
            );
          }
          return (
            <Link key={i} href={href} className="footer-link" style={{ fontSize: 13, textDecoration: "none" }}>
              {label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function Footer() {
  return (
    <footer
      style={{
        background: "#0a1530",
        padding: "56px 24px 32px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -60,
          right: "10%",
          width: 200,
          height: 200,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(3,126,243,0.18), transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
        <div
          className="footer-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr",
            gap: 40,
            paddingBottom: 32,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div className="footer-brand">
            <div className="footer-brand-row" style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/aiesec-logo.png"
                alt="AIESEC"
                style={{ height: 30, filter: "brightness(0) invert(1)" }}
              />
              <div style={{ width: 1, height: 24, background: "rgba(255,255,255,0.2)" }} />
              <span
                style={{
                  color: "#fff",
                  fontWeight: 900,
                  fontSize: 14,
                  letterSpacing: "0.02em",
                }}
              >
                CzechHub
              </span>
            </div>
            <p
              className="footer-tagline"
              style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: 13.5,
                lineHeight: 1.7,
                maxWidth: 340,
              }}
            >
              The national knowledge hub for AIESEC in Czech Republic — connecting members,
              leaders, and resources in one place.
            </p>
          </div>
          <FooterCol
            title="Explore"
            items={[
              ["Home", "/"],
              ["About the MC", "/mc"],
              ["Areas", "/areas"],
            ]}
          />
          <FooterCol
            title="Network"
            items={[
              ["Local Committees", "/lcs"],
              ["Resources", "/resources"],
              ["Dates", "/dates"],
            ]}
          />
          <FooterCol
            title="Connect"
            items={[
              ["LinkedIn", "#"],
              ["Facebook", "#"],
              ["Instagram", "#"],
              ["czechhub@aiesec.cz", "mailto:czechhub@aiesec.cz"],
            ]}
          />
        </div>
        <div
          className="footer-bottom"
          style={{
            paddingTop: 24,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            color: "rgba(255,255,255,0.4)",
            fontSize: 12.5,
          }}
        >
          <span>© 2026 AIESEC in Czech Republic. All rights reserved.</span>
          <span>
            Made with <span style={{ color: "#62b7ff" }}>♥</span> by the MC team
          </span>
        </div>
      </div>
    </footer>
  );
}
