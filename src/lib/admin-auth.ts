import { createHash } from "crypto";
import { cookies } from "next/headers";

// Server-side admin gate. The password is compared on the server only; the
// browser never receives it. After a successful login we store a hash of the
// password in an httpOnly cookie and re-check it on every write request.

export const ADMIN_COOKIE = "czechhub_admin";

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "czechhub2026";
}

/** Opaque session token derived from the password (never the password itself). */
export function adminToken(): string {
  return createHash("sha256").update(`czechhub::${adminPassword()}`).digest("hex");
}

/** Whether the current request carries a valid admin session cookie. */
export async function isAdminRequest(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === adminToken();
}
