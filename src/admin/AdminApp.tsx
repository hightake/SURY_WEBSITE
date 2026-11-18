import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "../components/Logo";
import { backend, NotAllowedError } from "../lib/backend";
import type { AdminUser, SiteData } from "../lib/content";
import { AdminStore, useAdmin } from "./store";

/* Admin shell: sign-in gate, side menu (by site page), save status. */
export default function AdminApp() {
  const [user, setUser] = useState<AdminUser | null | undefined>(undefined);
  const [content, setContent] = useState<SiteData | null>(null);

  useEffect(() => {
    document.title = "ניהול | SURY";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    backend.currentUser().then(async (u) => {
      // re-check against the current list on every visit
      const c = await backend.loadContent();
      const still = u && c.admins?.find((a) => a.email === u.email);
      setContent(c);
      setUser(still ?? null);
    });
    return () => meta.remove();
  }, []);

  if (user === undefined || !content) return <div className="adm-root grid min-h-svh place-items-center text-muted">טוען…</div>;
  if (!user) return <SignIn onIn={async (u) => { setContent(await backend.loadContent()); setUser(u); }} />;
  return (
    <AdminStore user={user} initial={content}>
      <Shell onOut={async () => { await backend.signOut(); setUser(null); }} />
    </AdminStore>
  );
}

function SignIn({ onIn }: { onIn: (u: AdminUser) => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const isMock = backend.kind === "mock";
  const go = async () => {
    setError("");
    try {
      onIn(await backend.signInWithGoogle(email));
    } catch (e) {
      setError(e instanceof NotAllowedError ? e.message : "הכניסה נכשלה, נסי שוב");
    }
  };
  return (
    <div className="adm-root grid min-h-svh place-items-center p-5">
      <div className="adm-card w-full max-w-sm text-center">
        <Logo className="mx-auto h-12" />
        <h1 className="mt-6 text-2xl font-light">ניהול האתר</h1>
        <p className="mt-2 text-sm text-muted">הכניסה למורשות בלבד, עם חשבון Google.</p>
        {isMock && (
          <div className="mt-6 grid gap-2 text-start">
            <label htmlFor="demo-email" className="text-sm font-medium">מייל Google <span className="text-xs text-muted">(הדמיה)</span></label>
            <input id="demo-email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()} className="adm-input" placeholder="name@gmail.com" autoComplete="email" />
          </div>
        )}
        <button type="button" onClick={go} className="adm-google mt-4">
          <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true"><path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.5-.2-2.2H12v4.2h6a5.1 5.1 0 0 1-2.2 3.4v2.8h3.6c2-1.9 3.2-4.7 3.2-8.2Z"/><path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.9 0-5.3-1.9-6.2-4.5H2.1v2.9A11 11 0 0 0 12 23Z"/><path fill="#FBBC05" d="M5.8 14.1a6.6 6.6 0 0 1 0-4.2V7H2.1a11 11 0 0 0 0 10l3.7-2.9Z"/><path fill="#EA4335" d="M12 5.4c1.6 0 3.1.6 4.2 1.7l3.2-3.2A11 11 0 0 0 2.1 7l3.7 2.9C6.7 7.3 9.1 5.4 12 5.4Z"/></svg>
          כניסה עם Google
        </button>
        {error && <p role="alert" className="mt-4 text-sm text-primary">{error}</p>}
        {isMock && <p className="mt-6 text-xs leading-relaxed text-muted">בתצוגה המקדימה הכניסה מדומה ונשמרת בדפדפן הזה בלבד. באתר האמיתי – חלון של Google, ואבטחה בצד השרת.</p>}
      </div>
    </div>
  );
}

const NAV = [
  { to: "/admin", label: "סקירה", exact: true },
  { to: "/admin/home", label: "דף הבית" },
  { to: "/admin/categories", label: "קטגוריות" },
  { to: "/admin/products", label: "מוצרים" },
  { to: "/admin/stores", label: "חנויות" },
  { to: "/admin/story", label: "הסיפור שלנו" },
  { to: "/admin/settings", label: "פרטי קשר" },
  { to: "/admin/users", label: "הרשאות", owner: true },
] as const;

function Shell({ onOut }: { onOut: () => void }) {
  const { user, status } = useAdmin();
  const path = useRouterState({ select: (s) => s.location.pathname }).replace(import.meta.env.BASE_URL.replace(/\/$/, ""), "");
  const title = [...NAV].reverse().find((n) => (("exact" in n && n.exact) ? path === n.to || path === n.to + "/" : path.startsWith(n.to)))?.label ?? "";
  return (
    <div className="adm-root min-h-svh md:grid md:grid-cols-[15rem_1fr]">
      <aside className="adm-side">
        <div className="flex items-center justify-between gap-3 p-5 md:block">
          <Logo className="h-9" />
          <p className="text-xs text-muted md:mt-2">ניהול האתר</p>
        </div>
        <nav aria-label="ניהול" className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 md:grid md:px-3">
          {NAV.filter((n) => !("owner" in n) || user.role === "owner").map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: "exact" in n }} className="adm-nav" activeProps={{ className: "is-active" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden border-t border-shade p-5 text-sm md:block">
          <p dir="ltr" className="truncate text-start text-xs text-muted">{user.email}</p>
          <div className="mt-3 flex gap-3">
            <a href={import.meta.env.BASE_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">לאתר ↗</a>
            <button type="button" onClick={onOut} className="text-muted hover:text-ink">יציאה</button>
          </div>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="adm-top">
          <h1 className="text-xl font-light md:text-2xl">{title}</h1>
          <div className="flex items-center gap-4">
            <SaveStatus status={status} />
            <button type="button" onClick={onOut} className="text-sm text-muted hover:text-ink md:hidden">יציאה</button>
          </div>
        </header>
        <main className="mx-auto max-w-5xl p-4 pb-24 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SaveStatus({ status }: { status: string }) {
  const map: Record<string, [string, string]> = {
    idle: ["", ""],
    saving: ["שומרת…", "text-muted"],
    saved: ["✓ נשמר ומופיע באתר", "text-[#3f7d4e]"],
    error: ["השמירה נכשלה", "text-primary"],
  };
  const [text, cls] = map[status] ?? map.idle;
  return <p role="status" aria-live="polite" className={`text-sm ${cls}`}>{text}</p>;
}
