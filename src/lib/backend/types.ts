import type { AdminUser, Img, SiteData } from "../content";

/**
 * Everything the site and the admin need from a backend.
 * Today: the browser stand-in (mock.ts). With Lovable Cloud: a Supabase
 * implementation of the same interface – no screen changes.
 */
export interface Backend {
  readonly kind: "mock" | "supabase";
  /** Load the published content (public). */
  loadContent(): Promise<SiteData>;
  /** Save the whole content (admins only – enforced by the backend). */
  saveContent(data: SiteData): Promise<void>;
  /** Store a prepared image and return it ready to use. */
  uploadImage(file: { full: Blob; small: Blob; w: number; h: number }, alt: string): Promise<Img>;
  /** Signed-in admin, or null. */
  currentUser(): Promise<AdminUser | null>;
  /** Start Google sign-in. The mock asks for the e-mail instead. */
  signInWithGoogle(demoEmail?: string): Promise<AdminUser>;
  signOut(): Promise<void>;
  /** Back to the original demo content (mock only). */
  reset?(): Promise<void>;
}

export class NotAllowedError extends Error {
  constructor(email: string) {
    super(`החשבון ${email} אינו מורשה לנהל את האתר`);
  }
}
