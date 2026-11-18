/*
 * Admin state: a working copy of the content, edited through the services
 * (controllers). Nothing reaches the site until "שמירה" publishes it.
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { SiteData } from "../../models/content";
import type { AdminUser } from "../../models/user";
import { applyContent } from "../../services/contentState";
import { loadContent, publishContent } from "../../services/contentService";

export type SaveStatus = "clean" | "dirty" | "saving" | "saved" | "error";
type Ctx = {
  data: SiteData;
  user: AdminUser;
  status: SaveStatus;
  dirty: boolean;
  /** Change the working copy (usually through a service). Nothing is published until save(). */
  update: (fn: (draft: SiteData) => void) => void;
  /** Publish the working copy to the site. */
  save: () => Promise<void>;
  /** Throw away unsaved changes. */
  discard: () => Promise<void>;
  reload: () => Promise<void>;
};

const AdminCtx = createContext<Ctx | null>(null);

export function AdminStore({ user, children }: { user: AdminUser; children: ReactNode }) {
  const [data, setData] = useState<SiteData | null>(null);
  const [status, setStatus] = useState<SaveStatus>("clean");
  const latest = useRef<SiteData | null>(null);
  const dirty = status === "dirty" || status === "error";

  const reload = useCallback(async () => {
    const d = await loadContent();
    latest.current = d;
    setData(d);
    applyContent(d);
    setStatus("clean");
  }, []);
  useEffect(() => void reload(), [reload]);

  const save = useCallback(async () => {
    if (!latest.current) return;
    setStatus("saving");
    try {
      await publishContent(latest.current); // the site shows the change from now on
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }, []);

  const discard = useCallback(async () => {
    if (confirm("לבטל את כל השינויים שלא נשמרו?")) await reload();
  }, [reload]);

  const update = useCallback((fn: (draft: SiteData) => void) => {
    if (!latest.current) return;
    const next = structuredClone(latest.current);
    try {
      fn(next);
    } catch (e) {
      alert(e instanceof Error ? e.message : String(e)); // validation errors from the services
      return;
    }
    latest.current = next;
    setData(next);
    setStatus("dirty");
  }, []);

  // Ctrl/⌘+S saves; leaving the page with unsaved changes asks first
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save();
      }
    };
    const onLeave = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [dirty, save]);

  if (!data) return <p className="p-8 text-muted">טוען…</p>;
  return <AdminCtx.Provider value={{ data, user, status, dirty, update, save, discard, reload }}>{children}</AdminCtx.Provider>;
}

export function useAdmin() {
  const c = useContext(AdminCtx);
  if (!c) throw new Error("useAdmin must be used inside <AdminStore>");
  return c;
}
