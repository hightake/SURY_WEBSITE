/* Admin frame: side menu (by site page), save status, sign-out. Rendered after requireAdmin. */
import { Link, Outlet, useNavigate, useRouteContext, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { Logo } from "../../components/Logo";
import { can, type AdminUser } from "../../models/user";
import { signOut } from "../../services/authService";
import { AdminStore, useAdmin, type SaveStatus } from "../state/AdminStore";

const NAV = [
  { to: "/admin", label: "סקירה", exact: true },
  { to: "/admin/home", label: "דף הבית" },
  { to: "/admin/categories", label: "קטגוריות" },
  { to: "/admin/products", label: "מוצרים" },
  { to: "/admin/stores", label: "חנויות" },
  { to: "/admin/story", label: "הסיפור שלנו" },
  { to: "/admin/legal", label: "פרטיות ונגישות" },
  { to: "/admin/settings", label: "פרטי קשר וטופס" },
  { to: "/admin/users", label: "הרשאות", ownerOnly: true },
] as const;

export function useNoIndex(title: string) {
  useEffect(() => {
    document.title = title;
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, [title]);
}

export default function AdminLayout() {
  const { user } = useRouteContext({ strict: false }) as { user: AdminUser };
  useNoIndex("ניהול | SURY");
  return (
    <AdminStore user={user}>
      <Shell />
    </AdminStore>
  );
}

function Shell() {
  const { user, status, dirty, save, discard } = useAdmin();
  const navigate = useNavigate();
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const path = useRouterState({ select: (s) => s.location.pathname }).replace(base, "");
  const current = [...NAV].reverse().find((n) => ("exact" in n ? path === n.to || path === `${n.to}/` : path.startsWith(n.to)));
  const out = async () => {
    if (dirty && !confirm("יש שינויים שלא נשמרו. לצאת בלי לשמור?")) return;
    await signOut();
    navigate({ to: "/admin/login" });
  };
  return (
    <div className="adm-root min-h-svh md:grid md:grid-cols-[15rem_1fr]">
      <aside className="adm-side">
        <div className="flex items-center justify-between gap-3 p-5 md:block">
          <Logo className="h-9" />
          <p className="text-xs text-muted md:mt-2">ניהול האתר</p>
        </div>
        <nav aria-label="ניהול" className="no-scrollbar flex gap-1 overflow-x-auto px-3 pb-3 md:grid">
          {NAV.filter((n) => !("ownerOnly" in n) || can.manageUsers(user)).map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: "exact" in n }} className="adm-nav" activeProps={{ className: "is-active" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="hidden border-t border-shade p-5 text-sm md:block">
          <p dir="ltr" className="truncate text-start text-xs text-muted">{user.email}</p>
          <div className="mt-3 flex gap-3">
            <a href={import.meta.env.BASE_URL} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">לאתר ↗</a>
            <button type="button" onClick={out} className="text-muted hover:text-ink">יציאה</button>
          </div>
        </div>
      </aside>
      <div className="min-w-0">
        <header className="adm-top">
          <h1 className="text-xl font-light md:text-2xl">{current?.label}</h1>
          <div className="flex items-center gap-3">
            <SaveIndicator status={status} />
            {dirty && <button type="button" onClick={discard} className="adm-btn hidden sm:inline-flex">ביטול שינויים</button>}
            <button type="button" onClick={save} disabled={!dirty || status === "saving"} className="adm-btn adm-btn-primary disabled:!bg-shade disabled:!border-shade disabled:!text-muted" title="שמירה (Ctrl+S)">
              {status === "saving" ? "שומרת…" : "שמירה"}
            </button>
            <button type="button" onClick={out} className="text-sm text-muted hover:text-ink md:hidden">יציאה</button>
          </div>
        </header>
        <main className="mx-auto max-w-5xl p-4 pb-24 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function SaveIndicator({ status }: { status: SaveStatus }) {
  const map: Record<SaveStatus, [string, string]> = {
    clean: ["", ""],
    dirty: ["● יש שינויים שלא נשמרו", "text-[#a8701e]"],
    saving: ["", ""],
    saved: ["✓ נשמר ומופיע באתר", "text-[#3f7d4e]"],
    error: ["השמירה נכשלה – נסי שוב", "text-primary"],
  };
  const [text, cls] = map[status];
  return <p role="status" aria-live="polite" className={`hidden text-sm sm:block ${cls}`}>{text}</p>;
}
