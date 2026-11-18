import type { Img, SiteData } from "../models/content";
import type { AdminUser } from "../models/user";
import { seedAdmins, seedContent } from "./seed";
import { NotAllowedError, type Backend } from "./types";

/*
 * Stand-in backend for the preview stage: content and uploaded images are kept
 * in this browser (IndexedDB), and "Google sign-in" asks for the e-mail.
 * It is NOT secure – real protection comes from the Supabase backend (sign-in
 * with Google + row-level security), which replaces this file.
 */
const DB = "sury-admin-demo";
const STORE = "kv";
const SESSION_KEY = "sury-admin-demo-user";

function idb<T>(mode: IDBTransactionMode, run: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    const open = indexedDB.open(DB, 1);
    open.onupgradeneeded = () => open.result.createObjectStore(STORE);
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const tx = open.result.transaction(STORE, mode);
      const req = run(tx.objectStore(STORE));
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    };
  });
}

const toDataUrl = (b: Blob) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error);
    r.readAsDataURL(b);
  });

/** Fill fields added after a browser saved its copy, so older saves keep working. */
const upgrade = (d: SiteData): SiteData => ({
  ...seedContent,
  ...d,
  admins: d.admins?.length ? d.admins : seedAdmins,
  settings: { ...seedContent.settings, ...d.settings },
  pages: {
    ...seedContent.pages,
    ...d.pages,
    privacy: "blocks" in (d.pages?.privacy ?? {}) ? d.pages.privacy : seedContent.pages.privacy,
    accessibility: "blocks" in (d.pages?.accessibility ?? {}) ? d.pages.accessibility : seedContent.pages.accessibility,
  },
});

export const mockBackend: Backend = {
  kind: "mock",
  async loadContent() {
    try {
      const saved = await idb<SiteData | undefined>("readonly", (s) => s.get("content") as IDBRequest<SiteData | undefined>);
      return upgrade(saved ?? structuredClone(seedContent));
    } catch {
      return upgrade(structuredClone(seedContent));
    }
  },
  async saveContent(data) {
    await idb("readwrite", (s) => s.put(data, "content"));
  },
  async uploadImage(file, alt) {
    const [src, sm] = await Promise.all([toDataUrl(file.full), toDataUrl(file.small)]);
    const img: Img = { src, sm, w: file.w, h: file.h, alt };
    return img;
  },
  async currentUser() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as AdminUser) : null;
    } catch {
      return null;
    }
  },
  async signInWithGoogle(demoEmail) {
    const email = (demoEmail ?? "").trim().toLowerCase();
    const content = await this.loadContent();
    const user = content.admins?.find((a) => a.email.toLowerCase() === email);
    if (!user) throw new NotAllowedError(email || "(ריק)");
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));
    } catch {
      /* private mode – stays signed in for this page only */
    }
    return user;
  },
  async signOut() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  },
  async sendContact(msg) {
    // stand-in: nothing is sent. With Lovable Cloud a server function e-mails it to settings.contactInbox.
    void msg;
    await new Promise((r) => setTimeout(r, 400));
  },
  async reset() {
    await idb("readwrite", (s) => s.delete("content"));
  },
};
