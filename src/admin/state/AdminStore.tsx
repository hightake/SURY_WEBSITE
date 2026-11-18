/*
 * Admin state: the working copy of the content, edited through the services
 * (controllers) and saved automatically through the data layer.
 */
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import type { SiteData } from "../../models/content";
import type { AdminUser } from "../../models/user";
import { applyContent } from "../../services/contentState";
import { loadContent, publishContent } from "../../services/contentService";

export type SaveStatus = "idle" | "saving" | "saved" | "error";
type Ctx = {
  data: SiteData;
  user: AdminUser;
  status: SaveStatus;
  /** Apply a change (usually a service function) to a copy; it is saved a moment later. */
  update: (fn: (draft: SiteData) => void) => void;
  reload: () => Promise<void>;
};

const AdminCtx = createContext<Ctx | null>(null);
const SAVE_DELAY = 600;

export function AdminStore({ user, children }: { user: AdminUser; children: ReactNode }) {
  const [data, setData] = useState<SiteData | null>(null);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const timer = useRef<number | undefined>(undefined);
  const latest = useRef<SiteData | null>(null);

  const reload = useCallback(async () => {
    const d = await loadContent();
    latest.current = d;
    setData(d);
    applyContent(d);
  }, []);
  useEffect(() => void reload(), [reload]);

  const flush = useCallback(async () => {
    if (!latest.current) return;
    timer.current = undefined;
    try {
      await publishContent(latest.current); // the site shows the change right away
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }, []);

  const update = useCallback(
    (fn: (draft: SiteData) => void) => {
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
      setStatus("saving");
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(flush, SAVE_DELAY);
    },
    [flush],
  );

  // warn before leaving with an unsaved change
  useEffect(() => {
    const onLeave = (e: BeforeUnloadEvent) => {
      if (timer.current) e.preventDefault();
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, []);

  if (!data) return <p className="p-8 text-muted">טוען…</p>;
  return <AdminCtx.Provider value={{ data, user, status, update, reload }}>{children}</AdminCtx.Provider>;
}

export function useAdmin() {
  const c = useContext(AdminCtx);
  if (!c) throw new Error("useAdmin must be used inside <AdminStore>");
  return c;
}
