import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { site } from "../../lib/content";
import { IconChevron } from "../Icons";
import { Sketch, worldSketches } from "./Sketches";

/*
 * Block 1 – opening: atmosphere rather than specific products.
 * In a lit plaster arch, one world at a time is sketched in gold from a real
 * product photo, held for a moment, and gives way to the next.
 */
const CYCLE_MS = 5200;

export function Hero() {
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
