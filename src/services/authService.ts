/*
 * Authentication & authorisation. The session comes from the backend; the
 * user is re-checked against the current allow-list on every check, so a
 * removed editor loses access immediately.
 */
import { backend } from "../data";
export { NotAllowedError } from "../data";
import type { AdminUser } from "../models/user";

export async function getSessionUser(): Promise<AdminUser | null> {
  const u = await backend.currentUser();
  if (!u) return null;
  const content = await backend.loadContent();
  return content.admins?.find((a) => a.email === u.email) ?? null;
}

export const signIn = (demoEmail?: string) => backend.signInWithGoogle(demoEmail);
export const signOut = () => backend.signOut();
