import type { ContactMessage, Img, SiteData } from "../models/content";
import type { AdminUser } from "../models/user";

/**
 * Data-access contract. Every read and write in the app goes through it.
 * Implementations: mock.ts (browser stand-in, today) and a Supabase
 * adapter (Lovable Cloud) – the rest of the code does not change.
 * Authorisation is enforced HERE (server side in Supabase via RLS),
 * the UI guards only mirror it.
 */
export interface Backend {
  readonly kind: "mock" | "supabase";

  // content
  loadContent(): Promise<SiteData>;
  saveContent(data: SiteData): Promise<void>;

  // media
  uploadImage(file: { full: Blob; small: Blob; w: number; h: number }, alt: string): Promise<Img>;

  // auth
  currentUser(): Promise<AdminUser | null>;
  signInWithGoogle(demoEmail?: string): Promise<AdminUser>;
  signOut(): Promise<void>;

  // contact form – e-mailed to settings.contactInbox, never stored
  sendContact(msg: ContactMessage): Promise<void>;

  /** Back to the starting content (stand-in only). */
  reset?(): Promise<void>;
}

export class NotAllowedError extends Error {
  constructor(email: string) {
    super(`החשבון ${email} אינו מורשה לנהל את האתר`);
  }
}
