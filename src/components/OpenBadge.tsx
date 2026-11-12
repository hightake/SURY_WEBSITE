import { useEffect, useState } from "react";
import type { Store } from "../lib/content";
import { openStatus } from "../lib/openNow";

/** "Open now until 21:00" / "Closed now" – computed in the browser, refreshed every minute. */
export function OpenBadge({ store, className = "" }: { store: Store; className?: string }) {
  const [status, setStatus] = useState<ReturnType<typeof openStatus>>(null);
  useEffect(() => {
    const tick = () => setStatus(openStatus(store));
    tick();
    const t = window.setInterval(tick, 60_000);
    return () => window.clearInterval(t);
  }, [store]);
  if (!status) return null;
  return (
    <span className={`inline-flex items-center gap-2 text-sm ${className}`}>
      <span aria-hidden className={`size-2 rounded-full ${status.open ? "bg-[#3f7d4e] shadow-[0_0_0_3px_rgba(63,125,78,0.18)]" : "bg-muted/60"}`} />
      {status.open ? `פתוח עכשיו · עד ${status.until}` : "סגור עכשיו"}
    </span>
  );
}
