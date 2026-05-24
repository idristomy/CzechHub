import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CzechHub — AIESEC in Czech Republic",
  description:
    "National knowledge & resource hub for AIESEC in Czech Republic — connecting members, leaders, and resources in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
