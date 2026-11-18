import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { categories, imgUrl, site } from "../../lib/content";
import { useInView } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

// How each item sits in its niche (% of niche height/width). pole: 0 = no stand.
type Placement = { bottom: number; height: number; width: number; pole: number };
const placement: Record<string, Placement> = {
  hats: { bottom: 35, height: 30, width: 84, pole: 26 },
  bandanas: { bottom: 25, height: 46, width: 80, pole: 30 },
  cloa: { bottom: 21, height: 54, width: 74, pole: 12 },
  scarves: { bottom: 29, height: 40, width: 88, pole: 22 },
  blanche: { bottom: 30, height: 36, width: 84, pole: 22 },
};
const defaultPlacement: Placement = { bottom: 34, height: 34, width: 72, pole: 26 };

// Spots light up from the centre outwards: 3rd, then 2nd+4th, then 1st+5th.
const lightOrder = (i: number, n: number) => Math.abs(i - (n - 1) / 2);

type Cat = (typeof categories)[number];

/** One lit plaster niche with the world's product on its stand. */
function Niche({ c, delay = 0, className = "" }: { c: Cat; delay?: number; className?: string }) {
  const pl = placement[c.slug] ?? defaultPlacement;
  return (
    <div className={`niche ${className}`} style={{ ["--d" as string]: `${delay}ms` }}>
      <span className="niche-beam" aria-hidden />
      <span className="niche-spot" aria-hidden />
      <span className="niche-pedestal" aria-hidden />
      {pl.pole > 0 && (
        <>
          <span className="niche-stand-base" aria-hidden />
          <span className="niche-stand-pole" aria-hidden style={{ ["--pole" as string]: `${pl.pole}%` }} />
        </>
      )}
      <span className="niche-item" style={{ ["--ib" as string]: `${pl.bottom}%`, ["--ih" as string]: `${pl.height}%`, ["--iw" as string]: `${pl.width}%` }}>
        <img src={imgUrl(c.niche.src)} alt="" loading="lazy" decoding="async" />
      </span>
      <span className="niche-dim" aria-hidden />
    </div>
  );
}

/*
 * Mobile: DEMO – three layouts, picked with ?wm=a|b|c (desktop is unchanged)
 *   a – list: a row per world, small lit niche beside its name
 *   b – grid: niches two by two, the fifth centred
 *   c – one stage: a large niche, the five names as tabs underneath
 */
function MobileWorlds({ lit }: { lit: boolean }) {
  const [v, setV] = useState<"a" | "b" | "c">("a");
  const [sel, setSel] = useState(0);
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("wm");
    if (q === "b" || q === "c") setV(q);
  }, []);
  const lightCls = lit ? "is-lit" : "";

  if (v === "b")
    return (
      <div className={`niches-panel mx-auto px-4 pb-6 pt-8 ${lightCls}`}>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-6">
          {categories.map((c, i) => (
            <li key={c.slug} className={i === categories.length - 1 && categories.length % 2 ? "col-span-2 mx-auto w-1/2" : ""}>
              <Link to="/collection/$category" params={{ category: c.slug }} className="block">
                <Niche c={c} delay={i * 250} />
                <div className="niches-ledge" aria-hidden />
                <p className="mt-3 text-center text-base font-medium">{c.shortName}</p>
                <p className="text-center text-xs text-muted">{c.tagline}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    );

  if (v === "c") {
    const c = categories[sel];
    return (
      <div className={`niches-panel mx-auto px-6 pb-6 pt-8 ${lightCls}`}>
        <Link to="/collection/$category" params={{ category: c.slug }} className="mx-auto block w-[64%]" aria-label={c.name}>
          <Niche key={c.slug} c={c} className="animate-[fadeIn_0.6s_var(--ease-soft)_both]" />
          <div className="niches-ledge" aria-hidden />
        </Link>
        <div className="mt-4 text-center">
          <p className="latin text-sm text-accent">{String(sel + 1).padStart(2, "0")}</p>
          <p className="text-xl font-medium">{c.shortName}</p>
          <p className="text-sm text-muted">{c.tagline}</p>
          <Link to="/collection/$category" params={{ category: c.slug }} className="link-underline mt-2 inline-block text-sm text-primary">לגלות</Link>
        </div>
        <ul className="mt-5 flex flex-wrap justify-center gap-2" aria-label="בחירת עולם">
          {categories.map((w, i) => (
            <li key={w.slug}>
              <button type="button" onClick={() => setSel(i)} aria-pressed={i === sel} className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${i === sel ? "border-primary bg-primary text-bg" : "border-accent/60"}`}>
                {w.shortName}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <ul className={`niches-panel mx-auto divide-y divide-accent/30 px-4 py-2 ${lightCls}`}>
      {categories.map((c, i) => (
        <li key={c.slug}>
          <Link to="/collection/$category" params={{ category: c.slug }} className="flex items-center gap-5 py-4">
            <div className="w-24 shrink-0">
              <Niche c={c} delay={i * 250} />
              <div className="niches-ledge !h-2" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="latin text-xs text-accent">{String(i + 1).padStart(2, "0")}</p>
              <p className="text-xl font-medium">{c.shortName}</p>
              <p className="text-sm text-muted">{c.tagline}</p>
            </div>
            <span aria-hidden className="text-xl text-accent">←</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function BrandWorlds() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, 0.3);
  const [lit, setLit] = useState(false);
  useEffect(() => {
    if (inView) setLit(true);
  }, [inView]);

  return (
    <section ref={ref} id="worlds" className="niches-wall worlds-fit scroll-mt-16 py-20 md:py-6" aria-labelledby="worlds-title">
      <div className="container-x">
        <SectionHeading id="worlds-title" eyebrow="SURY Worlds" title={site.home.worlds.title} text={site.home.worlds.text} />
      </div>
      <div className="container-x md:hidden">
        <MobileWorlds lit={lit} />
      </div>
      <div className="container-x hidden md:block">
        <div className={`niches-panel worlds-panel overflow-hidden ${lit ? "is-lit" : ""}`}>
          <div className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto px-3 pt-12 md:grid md:grid-cols-5 md:overflow-visible md:px-6 md:pt-10 lg:px-10 lg:pt-12">
            {categories.map((c, i) => {
              const pl = placement[c.slug] ?? defaultPlacement;
              return (
                <Link key={c.slug} to="/collection/$category" params={{ category: c.slug }} className="group w-[60vw] max-w-[260px] shrink-0 snap-center md:w-auto md:max-w-none">
                  <div className="px-2.5 lg:px-3.5">
                  <div className="niche" style={{ ["--d" as string]: `${lightOrder(i, categories.length) * 450}ms` }}>
                    <span className="niche-beam" aria-hidden />
                    <span className="niche-spot" aria-hidden />
                    <span className="niche-pedestal" aria-hidden />
                    {pl.pole > 0 && (
                      <>
                        <span className="niche-stand-base" aria-hidden />
                        <span className="niche-stand-pole" aria-hidden style={{ ["--pole" as string]: `${pl.pole}%` }} />
                      </>
                    )}
                    <span
                      className="niche-item"
                      style={{ ["--ib" as string]: `${pl.bottom}%`, ["--ih" as string]: `${pl.height}%`, ["--iw" as string]: `${pl.width}%` }}
                    >
                      <img src={imgUrl(c.niche.src)} alt="" loading="lazy" decoding="async" />
                    </span>
                    <span className="niche-dim" aria-hidden />
                  </div>
                  </div>
                  <div className="niches-ledge" aria-hidden />
                  <div className="px-2 pb-8 pt-5 text-center md:pb-5 md:pt-3">
                    <p className="latin text-sm text-accent">{String(i + 1).padStart(2, "0")}</p>
                    <h3 className="mt-1 text-lg font-medium md:text-xl">{c.shortName}</h3>
                    <p className="mt-1 text-sm text-muted">{c.tagline}</p>
                    <span className="link-underline mt-3 inline-block text-sm text-primary">לגלות</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
