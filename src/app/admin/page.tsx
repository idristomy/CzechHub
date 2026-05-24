"use client";

import { useEffect, useState } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminShell from "@/components/admin/AdminShell";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "czechhub2026";
const STORAGE_KEY = "czechhub_admin_auth";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAuthed(sessionStorage.getItem(STORAGE_KEY) === "1");
    setReady(true);
  }, []);

  const unlock = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setAuthed(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
  };

  if (!ready) return <div style={{ minHeight: "100vh", background: "#0a1530" }} />;
  return authed ? <AdminShell onLogout={logout} /> : <AdminLogin onUnlock={unlock} />;
}
