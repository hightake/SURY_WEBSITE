import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { categories, imgSmUrl, imgUrl, site } from "../../lib/content";
import { IconChevron } from "../Icons";
import { Sketch, worldSketches } from "./Sketches";

/*
 * Block 1 – opening: atmosphere rather than specific products.
 * In a lit plaster arch, one world at a time is sketched in gold from a real
 * product photo, held for a moment, and gives way to the next.
 */
const CYCLE_MS = 5200;

function SketchHero() {
  const h = site.home.hero;
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => !document.hidden && setI((n) => (n + 1) % worldSketches.length), CYCLE_MS);
    return () => window.clearInterval(t);
  }, []);
  const s = worldSketches[i];

  return (
    <section className="relative overflow-hidden bg-hero" aria-labelledby="hero-title">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_30%_30%,rgba(255,240,215,0.9),transparent_70%)]" />
      <div className="container-x relative grid min-h-[calc(100svh-4rem)] items-center gap-8 pb-10 pt-6 md:min-h-[calc(100svh-5rem)] md:grid-cols-[1fr_1fr] md:gap-12 md:py-10">
        <div className="order-2 text-center md:order-1 md:text-start">
          <p className="eyebrow animate-[fadeUp_1s_var(--ease-soft)_both]">{h.eyebrow}</p>
          <h1 id="hero-title" className="mt-5 text-[2.6rem] leading-[1.05] tracking-tight sm:text-6xl lg:text-[5.5rem] animate-[fadeUp_1s_var(--ease-soft)_0.15s_both]">
            <span className="block font-extrabold">{h.titleBold}</span>
            <span className="block font-extralight">{h.titleLight}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-lg text-muted md:mx-0 animate-[fadeUp_1s_var(--ease-soft)_0.3s_both]">{h.text}</p>
          <div className="mt-9 animate-[fadeUp_1s_var(--ease-soft)_0.45s_both]">
            <a href="#worlds" className="btn btn-primary px-10">
              {h.cta}
              <IconChevron />
            </a>
          </div>
        </div>

        <div className="order-1 md:order-2">
          <div className="mx-auto w-[82%] max-w-[500px] animate-[fadeIn_1.6s_var(--ease-soft)_both] md:w-full">
            <div className="relative">
              <div aria-hidden className="absolute -inset-3 rounded-t-full border border-accent/60 md:-inset-5" />
              <div className="is-lit">
                <div className="niche hero-niche">
                  <span className="niche-beam" aria-hidden />
                  <span className="niche-spot" aria-hidden />
                  <Sketch key={s.name} name={s.name} className="sketch-cycle absolute left-1/2 top-[22%] z-[3] h-[64%] w-[78%] -translate-x-1/2" />
                </div>
              </div>
            </div>
            <div className="mt-8 flex items-center justify-center gap-4 md:mt-10" aria-live="polite">
              <Link to="/collection/$category" params={{ category: s.category }} className="link-underline text-sm tracking-wide">
                {s.label}
              </Link>
              <span aria-hidden className="flex gap-1.5">
                {worldSketches.map((w, n) => (
                  <span key={w.name} className={`h-px transition-all duration-700 ${n === i ? "w-6 bg-primary" : "w-3 bg-shade"}`} />
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/*
 * DEMO: two openings to compare – the banner slider (default) and the gold
 * sketch (?hero=sketch). Once one is chosen the other is removed.
 */
export function Hero() {
  const [sketch, setSketch] = useState(false);
  useEffect(() => setSketch(new URLSearchParams(window.location.search).get("hero") === "sketch"), []);
  return sketch ? <SketchHero /> : <BannerHero />;
}

const SLIDE_MS = 6000;

/*
 * Banner opening: full-width photos, each one wiping in over the previous
 * with a slow zoom; the brand promise stays fixed on top, and a strip of the
 * five worlds sits along the bottom.
 */
function BannerHero() {
  const h = site.home.hero;
  const slides = h.banners;
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  useEffect(() => {
    if (slides.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(() => {
      if (document.hidden) return;
      setCur((c) => {
        setPrev(c);
        return (c + 1) % slides.length;
      });
    }, SLIDE_MS);
    return () => window.clearInterval(t);
  }, [slides.length]);

  const s = slides[cur];
  return (
    <section className="banner-hero relative overflow-hidden bg-ink text-bg" aria-labelledby="hero-title">
      <div className="relative min-h-[calc(100svh-4rem-5.5rem)] md:h-[calc(100svh-5rem-6rem)] md:min-h-[560px]">
        {slides.map((b, i) => {
          const state = i === cur ? "is-current" : i === prev ? "is-prev" : "";
          return (
            <div key={b.image.src + (i === cur ? cur : "")} className={`banner-slide ${state}`} aria-hidden={i !== cur}>
              <img src={imgUrl(b.image.src)} alt={i === cur ? b.image.alt : ""} fetchPriority={i === 0 ? "high" : "low"} loading={i === 0 ? "eager" : "lazy"} />
            </div>
          );
        })}
        <div aria-hidden className="banner-shade" />

        <div className="container-x relative z-[5] flex min-h-[inherit] flex-col justify-end pb-20 pt-16 md:h-full md:justify-center md:pb-0 md:pt-0">
          <div className="max-w-xl">
            <p className="eyebrow !text-accent animate-[fadeUp_1s_var(--ease-soft)_both]">{h.eyebrow}</p>
            <h1 id="hero-title" className="mt-4 text-[2.7rem] leading-[1.05] tracking-tight drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)] sm:text-6xl lg:text-[5.5rem] animate-[fadeUp_1s_var(--ease-soft)_0.15s_both]">
              <span className="block font-extrabold">{h.titleBold}</span>
              <span className="block font-extralight text-[#f3dca8]">{h.titleLight}</span>
            </h1>
            <span aria-hidden className="mt-6 block h-px w-24 bg-gradient-to-l from-accent to-transparent" />
            <p className="mt-5 max-w-md text-base text-bg/85 md:mt-6 md:text-lg animate-[fadeUp_1s_var(--ease-soft)_0.3s_both]">{h.text}</p>
            <div className="mt-8 flex flex-wrap gap-3 animate-[fadeUp_1s_var(--ease-soft)_0.45s_both]">
              <a href="#worlds" className="btn bg-accent px-9 font-medium text-ink hover:bg-[#d8b25e]">
                {h.cta}
                <IconChevron />
              </a>
              <Link to="/stores" className="btn hidden border border-bg/60 px-8 text-bg hover:bg-bg/10 sm:inline-flex">
                החנויות שלנו
              </Link>
            </div>
          </div>
        </div>

        {/* caption of the photo on display + progress */}
        <div className="absolute bottom-5 left-0 right-0 z-[5]">
          <div className="container-x flex items-center justify-end gap-4 text-sm" aria-live="polite">
            {s.category ? (
              <Link to="/collection/$category" params={{ category: s.category }} className="link-underline text-bg/90">{s.caption}</Link>
            ) : (
              <Link to="/stores" className="link-underline text-bg/90">{s.caption}</Link>
            )}
            <span aria-hidden className="flex gap-1.5">
              {slides.map((b, i) => (
                <span key={b.image.src} className="relative h-[2px] w-8 overflow-hidden bg-bg/25">
                  {i === cur && <span key={cur} className="banner-progress absolute inset-0 bg-accent" />}
                  {i < cur && <span className="absolute inset-0 bg-accent/70" />}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>

      {/* the five worlds – quick entry */}
      <nav aria-label="עולמות SURY" className="relative z-[5] border-t border-accent/60">
        <ul className="no-scrollbar grid auto-cols-[46%] grid-flow-col overflow-x-auto sm:auto-cols-[30%] md:grid-flow-row md:grid-cols-5 md:overflow-visible">
          {categories.map((c, i) => (
            <li key={c.slug}>
              <Link to="/collection/$category" params={{ category: c.slug }} className={`banner-tile group tile-${i}`}>
                <img src={imgSmUrl(c.cover.src)} alt="" loading="lazy" />
                <span className="relative z-[1] flex w-full items-end justify-between gap-2">
                  <span>
                    <span className="block text-[11px] tracking-[0.2em] text-accent">{String(i + 1).padStart(2, "0")}</span>
                    <span className="block text-base font-medium leading-tight md:text-lg">{c.shortName}</span>
                  </span>
                  <span aria-hidden className="text-accent transition-transform duration-300 group-hover:-translate-x-1">←</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}
