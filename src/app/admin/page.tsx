"use client";

import { useEffect, useState } from "react";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminShell from "@/components/admin/AdminShell";

const STORAGE_KEY = "czechhub_admin_auth";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAuthed(sessionStorage.getItem(STORAGE_KEY) === "1");
    setReady(true);
  }, []);

  const unlock = async (password: string) => {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      sessionStorage.setItem(STORAGE_KEY, "1");
      setAuthed(true);
      return true;
    }
    return false;
  };

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    sessionStorage.removeItem(STORAGE_KEY);
    setAuthed(false);
  };

  if (!ready) return <div style={{ minHeight: "100vh", background: "#0a1530" }} />;
  return authed ? <AdminShell onLogout={logout} /> : <AdminLogin onUnlock={unlock} />;
}
