import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { backend } from "../lib/backend";
import { applyContent, type AdminUser, type SiteData } from "../lib/content";

type Status = "idle" | "saving" | "saved" | "error";
type Ctx = {
  data: SiteData;
  user: AdminUser;
  status: Status;
  /** Change the content; it is saved automatically a moment later. */
  update: (fn: (draft: SiteData) => void) => void;
  reload: () => Promise<void>;
};

const AdminCtx = createContext<Ctx | null>(null);

export function AdminStore({ user, initial, children }: { user: AdminUser; initial: SiteData; children: ReactNode }) {
  const [data, setData] = useState(initial);
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<number | undefined>(undefined);
  const latest = useRef(data);

  const flush = useCallback(async () => {
    setStatus("saving");
    try {
      await backend.saveContent(latest.current);
      applyContent(latest.current); // the site shows the change right away
      setStatus("saved");
    } catch {
      setStatus("error");
    }
  }, []);

  const update = useCallback(
    (fn: (draft: SiteData) => void) => {
      setData((prev) => {
        const next = structuredClone(prev);
        fn(next);
        latest.current = next;
        return next;
      });
      setStatus("saving");
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(flush, 600);
    },
    [flush],
  );

  // save before leaving the page
  useEffect(() => {
    const onLeave = (e: BeforeUnloadEvent) => {
      if (timer.current && status === "saving") {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", onLeave);
    return () => window.removeEventListener("beforeunload", onLeave);
  }, [status]);

  const reload = useCallback(async () => {
    const d = await backend.loadContent();
    latest.current = d;
    setData(d);
    applyContent(d);
  }, []);

  return <AdminCtx.Provider value={{ data, user, status, update, reload }}>{children}</AdminCtx.Provider>;
}

export function useAdmin() {
  const c = useContext(AdminCtx);
  if (!c) throw new Error("useAdmin outside AdminStore");
  return c;
}
