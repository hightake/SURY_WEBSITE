import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useId, useRef, useState } from "react";
import { categories, site, telLink } from "../lib/content";
import { Logo } from "./Logo";
import { IconChevron, IconClose, IconMenu, IconPhone } from "./Icons";

const pages = [
  { to: "/our-story", label: "הסיפור שלנו" },
  { to: "/stores", label: "החנויות שלנו" },
  { to: "/contact", label: "צור קשר" },
] as const;

export function Header() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const megaId = useId();
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setMegaOpen(false);
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setDrawerOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
  }, [drawerOpen]);

  const openMega = () => {
    window.clearTimeout(closeTimer.current);
    setMegaOpen(true);
  };
  const closeMegaSoon = () => {
    closeTimer.current = window.setTimeout(() => setMegaOpen(false), 120);
  };

  return (
    <header className={`sticky top-0 z-40 transition-[background-color,box-shadow] duration-500 ${scrolled || megaOpen ? "bg-bg/95 shadow-[0_1px_0_rgba(26,22,20,0.08)] backdrop-blur" : "bg-hero"}`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:right-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-bg">
        דילוג לתוכן
      </a>
      <div className="container-x flex h-16 items-center justify-between md:h-20">
        {/* Mobile: menu button */}
        <button type="button" className="-ms-2 p-2 lg:hidden" aria-label="פתיחת תפריט" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)}>
          <IconMenu />
        </button>

        <Link to="/" aria-label="SURY – דף הבית" className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0">
          <Logo className="h-9 md:h-11" />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="ניווט ראשי" className="hidden h-full items-center gap-9 lg:flex">
          <div className="h-full" onMouseEnter={openMega} onMouseLeave={closeMegaSoon}>
            <button
              type="button"
              className="flex h-full items-center gap-1.5 text-[15px] font-normal"
              aria-expanded={megaOpen}
              aria-controls={megaId}
              onClick={() => setMegaOpen((v) => !v)}
            >
              הקולקציות
              <IconChevron className={`size-3.5 transition-transform duration-300 ${megaOpen ? "rotate-180" : ""}`} />
            </button>
          </div>
          {pages.map((p) => (
            <Link key={p.to} to={p.to} className="link-underline text-[15px] font-normal" activeProps={{ className: "text-primary" }}>
              {p.label}
            </Link>
          ))}
        </nav>

        <a href={telLink(site.settings.phone)} className="flex items-center gap-2 p-2 text-sm -me-2" aria-label={`חיוג ל-SURY ${site.settings.phone}`}>
          <IconPhone />
          <span className="hidden md:inline" dir="ltr">
            {site.settings.phone}
          </span>
        </a>
      </div>

      {/* Desktop mega menu */}
      <div
        id={megaId}
        onMouseEnter={openMega}
        onMouseLeave={closeMegaSoon}
        className={`absolute inset-x-0 top-full hidden border-t border-shade/60 bg-bg shadow-[0_30px_40px_-30px_rgba(26,22,20,0.25)] transition-[opacity,visibility,transform] duration-300 lg:block ${megaOpen ? "visible opacity-100" : "invisible -translate-y-1 opacity-0"}`}
      >
        <div className="container-x grid grid-cols-5 gap-8 py-10">
          {categories.map((c, i) => (
            <div key={c.slug} className="border-s border-shade/70 ps-6 first:border-s-0 first:ps-0">
              <p className="latin mb-1 text-xs text-accent">{String(i + 1).padStart(2, "0")}</p>
              <Link to="/collection/$category" params={{ category: c.slug }} className="mb-4 block text-lg font-medium hover:text-primary">
                {c.name}
              </Link>
              <ul className="space-y-2.5">
                {c.subcategories.map((s) => (
                  <li key={s.slug}>
                    <Link to="/collection/$category" params={{ category: c.slug }} hash={s.slug} className="text-sm text-muted transition-colors hover:text-ink">
                      {s.name}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link to="/collection/$category" params={{ category: c.slug }} className="link-underline mt-5 inline-block text-sm text-primary">
                לכל הקולקציה
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile drawer */}
      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </header>
  );
}

function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [openCat, setOpenCat] = useState<string | null>(null);
  return (
    <div className={`fixed inset-0 z-50 lg:hidden ${open ? "visible" : "invisible"}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="תפריט"
        className={`absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col bg-bg transition-transform duration-500 ease-[var(--ease-soft)] ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex h-16 items-center justify-between border-b border-shade/60 px-5">
          <Logo className="h-8" />
          <button type="button" onClick={onClose} aria-label="סגירת תפריט" className="-me-2 p-2">
            <IconClose />
          </button>
        </div>
        <nav aria-label="ניווט ראשי" className="flex-1 overflow-y-auto px-5 py-4">
          <Link to="/" className="block py-3 text-lg">
            דף הבית
          </Link>
          {categories.map((c, i) => {
            const expanded = openCat === c.slug;
            return (
              <div key={c.slug} className="border-t border-shade/50">
                <button type="button" className="flex w-full items-center justify-between py-4 text-start text-lg" aria-expanded={expanded} onClick={() => setOpenCat(expanded ? null : c.slug)}>
                  <span>
                    <span className="latin me-3 text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
                    {c.name}
                  </span>
                  <IconChevron className={`size-4 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`} />
                </button>
                <div className={`grid transition-[grid-template-rows] duration-300 ${expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <ul className="overflow-hidden ps-7">
                    {c.subcategories.map((s) => (
                      <li key={s.slug}>
                        <Link to="/collection/$category" params={{ category: c.slug }} hash={s.slug} className="block py-2 text-muted" tabIndex={expanded ? 0 : -1}>
                          {s.name}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link to="/collection/$category" params={{ category: c.slug }} className="block pb-4 pt-2 text-primary" tabIndex={expanded ? 0 : -1}>
                        לכל הקולקציה
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            );
          })}
          <div className="mt-2 border-t border-shade/50 pt-2">
            {pages.map((p) => (
              <Link key={p.to} to={p.to} className="block py-3 text-lg">
                {p.label}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}
