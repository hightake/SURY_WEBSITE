/*
 * Permissions controller: who may sign in to the admin.
 * Invariant: there is always at least one owner.
 */
import type { SiteData } from "../models/content";
import type { Role } from "../models/user";
import { isEmail } from "../models/validation";

export class UsersError extends Error {}

const ownersCount = (d: SiteData) => (d.admins ?? []).filter((a) => a.role === "owner").length;

export function addEditor(d: SiteData, rawEmail: string) {
  const email = rawEmail.trim().toLowerCase();
  if (!isEmail(email)) throw new UsersError("כתובת מייל לא תקינה");
  if ((d.admins ?? []).some((a) => a.email === email)) throw new UsersError("הכתובת כבר ברשימה");
  d.admins = [...(d.admins ?? []), { email, role: "editor" }];
}

export function setRole(d: SiteData, email: string, role: Role) {
  const u = d.admins?.find((a) => a.email === email);
  if (!u) return;
  if (u.role === "owner" && role !== "owner" && ownersCount(d) === 1) throw new UsersError("חייבת להישאר לפחות בעלת אתר אחת");
  u.role = role;
}

export function removeUser(d: SiteData, email: string) {
  const u = d.admins?.find((a) => a.email === email);
  if (!u) return;
  if (u.role === "owner" && ownersCount(d) === 1) throw new UsersError("חייבת להישאר לפחות בעלת אתר אחת");
  d.admins = d.admins!.filter((a) => a !== u);
}

export const canRemove = (d: SiteData, email: string) => {
  const u = d.admins?.find((a) => a.email === email);
  return !!u && !(u.role === "owner" && ownersCount(d) === 1);
};
