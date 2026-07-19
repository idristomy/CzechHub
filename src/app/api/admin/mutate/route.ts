import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { isWritableTable, tableFields, tableIdField } from "@/lib/admin-entities";
import { supabaseAdmin } from "@/lib/supabase/admin";

type Body = {
  table?: string;
  action?: "insert" | "update" | "delete";
  values?: Record<string, unknown>;
  id?: string | number;
};

export async function POST(req: Request) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  const { table, action, values, id } = body;
  if (!table || !isWritableTable(table) || !action) {
    return NextResponse.json({ ok: false, error: "Unknown table or action" }, { status: 400 });
  }

  const fields = tableFields(table);
  const idField = tableIdField(table);

  // Keep only whitelisted columns (union across the table's forms) and coerce numbers.
  const clean: Record<string, unknown> = {};
  if (values && typeof values === "object") {
    for (const f of fields) {
      if (!(f.key in values)) continue;
      const raw = values[f.key];
      if (f.type === "number") {
        clean[f.key] = raw === "" || raw == null ? 0 : Number(raw);
      } else {
        clean[f.key] = raw ?? null;
      }
    }
  }

  const sb = supabaseAdmin();

  try {
    if (action === "insert") {
      const { data, error } = await sb.from(table).insert(clean).select();
      if (error) throw error;
      return NextResponse.json({ ok: true, data });
    }

    if (action === "update") {
      if (id === undefined || id === null || id === "") {
        return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
      }
      const { data, error } = await sb.from(table).update(clean).eq(idField, id).select();
      if (error) throw error;
      return NextResponse.json({ ok: true, data });
    }

    if (action === "delete") {
      if (id === undefined || id === null || id === "") {
        return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
      }
      const { error } = await sb.from(table).delete().eq(idField, id);
      if (error) throw error;
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false, error: "Unknown action" }, { status: 400 });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Database error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
