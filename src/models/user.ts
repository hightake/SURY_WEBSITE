export type Role = "owner" | "editor";
export type AdminUser = { email: string; role: Role };

/** What each role may do – checked in the UI guards and enforced again by the backend. */
export const can = {
  editContent: (u: AdminUser | null) => !!u,
  manageUsers: (u: AdminUser | null) => u?.role === "owner",
};
