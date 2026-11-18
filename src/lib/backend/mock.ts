import { defaultContent, type AdminUser, type Img, type SiteData } from "../content";
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

/** The client's account is the first owner. */
export const SEED_ADMINS: AdminUser[] = [{ email: "sury025408888@gmail.com", role: "owner" }];

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

const withAdmins = (d: SiteData): SiteData => (d.admins?.length ? d : { ...d, admins: SEED_ADMINS });

export const mockBackend: Backend = {
  kind: "mock",
  async loadContent() {
    try {
      const saved = await idb<SiteData | undefined>("readonly", (s) => s.get("content") as IDBRequest<SiteData | undefined>);
      return withAdmins(saved ?? structuredClone(defaultContent));
    } catch {
      return withAdmins(structuredClone(defaultContent));
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
  async reset() {
    await idb("readwrite", (s) => s.delete("content"));
  },
};
