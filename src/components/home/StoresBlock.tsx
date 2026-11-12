import { useEffect, useState } from "react";
import { navLink, site, telLink, type Store } from "../../lib/content";
import { IconClock, IconPhone, IconPin } from "../Icons";
import { OpenBadge } from "../OpenBadge";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

/*
 * Block 6 – our stores.
 * DEMO: three directions, picked with ?st=a|b|c
 *   a – gates: each store in a lit plaster arch
 *   b – route: an abstract gold map of the three stores + details panel
 *   c – typographic: large city names, the chosen one opens its details
 * Once one is chosen the other two are removed.
 */
type Variant = "a" | "b" | "c";

function useVariant(): Variant {
  const [v, setV] = useState<Variant>("a");
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("st");
    if (q === "b" || q === "c") setV(q);
  }, []);
  return v;
}

export function StoresBlock() {
  const v = useVariant();
  if (v === "b") return <Route />;
  if (v === "c") return <Typographic />;
  return <Gates />;
}

function Hours({ store, className = "" }: { store: Store; className?: string }) {
  return (
    <dl className={`grid grid-cols-[auto_auto] justify-start gap-x-4 gap-y-1 ${className}`}>
      {store.hours.map(([days, time]) => (
        <div key={days} className="contents">
          <dt className="text-muted">{days}</dt>
          <dd dir="ltr" className="text-end">{time}</dd>
        </div>
      ))}
    </dl>
  );
}

function Actions({ store, className = "" }: { store: Store; className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a href={navLink(store.navQuery)} target="_blank" rel="noopener noreferrer" className="btn btn-primary flex-1 px-6">
        ניווט לחנות
      </a>
      <a href={telLink(store.phone)} className="btn btn-outline flex-1 px-6">
        חיוג
      </a>
    </div>
  );
}

/* ---------- a – gates ---------- */
function Gates() {
  return (
    <section className="niches-wall py-20 md:py-28" aria-labelledby="stores-title">
      <div className="container-x">
        <SectionHeading id="stores-title" eyebrow="Our Stores" title={site.home.stores.title} text={site.home.stores.text} />
        <div className="grid gap-8 md:grid-cols-3 md:gap-8">
          {site.stores.map((store, i) => (
            <Reveal key={store.city} delay={i * 120}>
              <article className="store-gate">
                <span className="niche-spot" aria-hidden />
                <div className="relative z-[2] flex h-full flex-col items-center px-7 pb-8 pt-[28%] text-center md:px-8">
                  <p className="eyebrow text-[11px]">SURY</p>
                  <h3 className="mt-2 text-3xl font-light md:text-4xl">{store.city}</h3>
                  <OpenBadge store={store} className="mt-3" />
                  <span aria-hidden className="my-6 block h-px w-10 bg-accent" />
                  <p className="flex items-center gap-2 text-[15px]">
                    <IconPin className="size-4 text-muted" />
                    {store.address}
                  </p>
                  <Hours store={store} className="mt-4 text-[15px]" />
                  <a href={telLink(store.phone)} dir="ltr" className="mt-3 text-[15px] hover:text-primary">{store.phone}</a>
                  <Actions store={store} className="mt-auto w-full pt-8" />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- b – route map ---------- */
// rough relative positions (north up, west left): Bnei Brak – Beit Shemesh – Jerusalem
const PINS: Record<string, { x: number; y: number }> = {
  "בני ברק": { x: 22, y: 26 },
  "בית שמש": { x: 52, y: 70 },
  "ירושלים": { x: 80, y: 52 },
};

function Route() {
  const [sel, setSel] = useState(0);
  const store = site.stores[sel];
  const pts = site.stores.map((s) => PINS[s.city] ?? { x: 50, y: 50 });
  return (
    <section className="bg-surface/60 py-20 md:py-28" aria-labelledby="stores-title">
      <div className="container-x">
        <SectionHeading id="stores-title" eyebrow="Our Stores" title={site.home.stores.title} text={site.home.stores.text} />
        <div className="grid items-center gap-10 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <Reveal>
            <div className="relative aspect-[5/4] rounded-[2rem] bg-bg/70 shadow-[inset_0_0_0_1px_rgba(201,160,74,0.35)]">
              <svg viewBox="0 0 100 80" className="absolute inset-0 size-full" aria-hidden>
                {/* the coast, very loosely */}
                <path d="M6 0 C10 20 12 40 16 80" fill="none" stroke="rgba(110,18,24,0.12)" strokeWidth="0.6" />
                <path
                  d={`M${pts[1]?.x ?? 0} ${(pts[1]?.y ?? 0) * 0.8} Q 40 ${70 * 0.8} ${pts[2]?.x ?? 0} ${(pts[2]?.y ?? 0) * 0.8} T ${pts[0]?.x ?? 0} ${(pts[0]?.y ?? 0) * 0.8}`}
                  fill="none"
                  stroke="#c9a04a"
                  strokeWidth="0.5"
                  strokeDasharray="1.2 1.6"
                  className="store-route"
                />
              </svg>
              {site.stores.map((s, i) => (
                <button
                  key={s.city}
                  type="button"
                  onClick={() => setSel(i)}
                  aria-pressed={sel === i}
                  className="group absolute -translate-x-1/2 -translate-y-1/2 text-center"
                  style={{ left: `${pts[i].x}%`, top: `${pts[i].y}%` }}
                >
                  <span className={`store-pin ${sel === i ? "is-active" : ""}`} aria-hidden />
                  <span className={`mt-3 block whitespace-nowrap text-sm transition-colors md:text-base ${sel === i ? "text-primary" : "text-ink/70 group-hover:text-ink"}`}>{s.city}</span>
                </button>
              ))}
            </div>
          </Reveal>
          <div aria-live="polite">
            <article key={store.city} className="animate-[fadeUp_0.6s_var(--ease-soft)_both]">
              <p className="latin text-sm text-accent">{String(sel + 1).padStart(2, "0")} / {String(site.stores.length).padStart(2, "0")}</p>
              <h3 className="mt-2 text-4xl font-light md:text-6xl">{store.city}</h3>
              <OpenBadge store={store} className="mt-4" />
              <span aria-hidden className="my-7 block h-px w-12 bg-accent" />
              <ul className="space-y-4 text-[15px] md:text-base">
                <li className="flex gap-3"><IconPin className="mt-0.5 size-5 shrink-0 text-muted" />{store.address}</li>
                <li className="flex gap-3"><IconClock className="mt-0.5 size-5 shrink-0 text-muted" /><Hours store={store} /></li>
                <li className="flex gap-3"><IconPhone className="mt-0.5 size-5 shrink-0 text-muted" /><a href={telLink(store.phone)} dir="ltr">{store.phone}</a></li>
              </ul>
              <Actions store={store} className="mt-9 max-w-sm" />
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- c – typographic list ---------- */
function Typographic() {
  const [open, setOpen] = useState(0);
  return (
    <section className="py-20 md:py-28" aria-labelledby="stores-title">
      <div className="container-x">
        <Reveal className="mb-10 flex flex-col gap-3 md:mb-14 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-3">Our Stores</p>
            <h2 id="stores-title" className="text-4xl font-light md:text-6xl">{site.home.stores.title}</h2>
          </div>
          <p className="text-muted">{site.home.stores.text}</p>
        </Reveal>
        <ul className="border-t border-ink/15">
          {site.stores.map((store, i) => {
            const isOpen = open === i;
            return (
              <li key={store.city} className="border-b border-ink/15">
                <button type="button" onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen} className="group flex w-full items-center justify-between gap-4 py-6 text-start md:py-8">
                  <span className="flex items-baseline gap-5">
                    <span className="latin text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`text-4xl font-extralight tracking-tight transition-colors md:text-7xl ${isOpen ? "text-primary" : "group-hover:text-primary"}`}>{store.city}</span>
                  </span>
                  <OpenBadge store={store} className="hidden text-muted md:inline-flex" />
                  <span aria-hidden className={`text-3xl font-extralight transition-transform duration-500 ${isOpen ? "rotate-45" : ""}`}>+</span>
                </button>
                <div className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-soft)] ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <div className="grid gap-6 pb-8 md:grid-cols-[1fr_1fr_auto] md:items-center md:gap-10 md:pb-10 md:ps-12">
                      <OpenBadge store={store} className="md:hidden" />
                      <p className="flex gap-3"><IconPin className="mt-0.5 size-5 shrink-0 text-muted" />{store.address}</p>
                      <div className="flex gap-3"><IconClock className="mt-0.5 size-5 shrink-0 text-muted" /><Hours store={store} /></div>
                      <Actions store={store} className="md:w-80" />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
