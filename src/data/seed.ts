import type { SiteData } from "../models/content";
import type { AdminUser } from "../models/user";
import data from "../content/site.json";

/** The bundled starting content – used by the stand-in backend and as a fallback. */
export const seedContent = data as unknown as SiteData;

/** The client's account is the first owner. */
export const seedAdmins: AdminUser[] = [{ email: "sury025408888@gmail.com", role: "owner" }];
