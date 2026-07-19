"use client";

// Thin client wrapper around the secure admin write API.

type MutateArgs = {
  table: string;
  action: "insert" | "update" | "delete";
  values?: Record<string, unknown>;
  id?: string | number;
};

export async function adminMutate(args: MutateArgs): Promise<{ ok: boolean; error?: string }> {
  try {
    const res = await fetch("/api/admin/mutate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(args),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: json?.error || `Request failed (${res.status})` };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}
