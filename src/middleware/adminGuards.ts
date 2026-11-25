/*
 * Route middleware for the admin (TanStack Router beforeLoad).
 * Runs before an admin page loads: no session → sign-in page;
 * owner-only pages → back to the overview. The backend enforces the same
 * rules on every write; these guards keep the UI honest.
 */
import { redirect } from "@tanstack/react-router";
import { can } from "../models/user";
import { getSessionUser } from "../services/authService";

export async function requireAdmin({ location }: { location: { pathname: string } }) {
  const user = await getSessionUser();
  // remember where she was heading, so the sign-in brings her back there
  if (!can.editContent(user)) throw redirect({ to: "/admin/login", search: { redirect: location.pathname } });
  return { user: user! };
}

/** Only a path inside the admin is accepted as the place to return to – never another site. */
export const safeAdminPath = (p: unknown) => (typeof p === "string" && /^\/admin(\/[\w\-/]*)?$/.test(p) && !p.startsWith("/admin/login") ? p : "/admin");

export async function requireOwner() {
  const user = await getSessionUser();
  if (!can.manageUsers(user)) throw redirect({ to: "/admin" });
  return { user: user! };
}

export async function redirectIfSignedIn() {
  if (await getSessionUser()) throw redirect({ to: "/admin" });
}
