import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { imgUrl, site, type HeroSlide } from "../../lib/content";
import { IconChevron } from "../Icons";

/*
 * Block 1 – opening. One lit plaster niche; the product on the brass stand
 * changes every few seconds ("one brand, endless options").
 *
 * DEMO: three transition styles to choose from, picked with ?hero=a|b|c
 *   a – fade & rise   b – lights off / on   c – turntable
 * Once one is chosen the other two are removed.
 */
type Variant = "a" | "b" | "c";
const HOLD_MS = 4200;

const fitStyle: Record<HeroSlide["fit"], React.CSSProperties> = {
  compact: { ["--ib" as string]: "35%", ["--ih" as string]: "34%", ["--iw" as string]: "74%" },
  medium: { ["--ib" as string]: "27%", ["--ih" as string]: "46%", ["--iw" as string]: "70%" },
  tall: { ["--ib" as string]: "21%", ["--ih" as string]: "54%", ["--iw" as string]: "60%" },
};

function useVariant(): Variant {
  const [v, setV] = useState<Variant>("a");
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("hero");
    if (q === "b" || q === "c") setV(q);
  }, []);
  return v;
}

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function Hero() {
  const h = site.home.hero;
  const slides = h.slides;
  const variant = useVariant();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");

  useEffect(() => {
    if (slides.length < 2 || prefersReducedMotion()) return;
    // b and c hide the product first, swap it, then show it again
    const outMs = variant === "a" ? 0 : variant === "b" ? 650 : 420;
    let swap: number | undefined;
    const timer = window.setInterval(() => {
      if (document.hidden) return;
      if (!outMs) return setIndex((i) => (i + 1) % slides.length);
      setPhase("out");
      swap = window.setTimeout(() => {
        setIndex((i) => (i + 1) % slides.length);
        setPhase("in");
      }, outMs);
    }, HOLD_MS);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(swap);
    };
  }, [slides.length, variant]);

  const current = slides[index];

  return (
    <section className="relative overflow-hidden bg-hero" aria-labelledby="hero-title">
      {/* warm spotlight */}
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
          <div className="relative mx-auto w-[78%] max-w-[480px] animate-[fadeIn_1.6s_var(--ease-soft)_both] md:w-full">
            {/* gold hairline arch behind the niche */}
            <div aria-hidden className="absolute -inset-3 rounded-t-full border border-accent/60 md:-inset-5" />
            <div className={`hero-stage hero-${variant} ${variant === "b" && phase === "out" ? "" : "is-lit"} ${phase === "out" ? "is-out" : ""}`}>
              <div className="niche hero-niche shadow-[0_40px_60px_-40px_rgba(80,50,20,0.45)]">
                <span className="niche-beam" aria-hidden />
                <span className="niche-spot" aria-hidden />
                <span className="niche-pedestal" aria-hidden />
                <span className="niche-stand-base" aria-hidden />
                <span className="niche-stand-pole" aria-hidden style={{ ["--pole" as string]: "24%" }} />
                {slides.map((s, i) => (
                  <span key={s.image.src} className={`niche-item hero-slide ${i === index ? "is-active" : ""}`} style={fitStyle[s.fit]} aria-hidden={i !== index}>
                    <img src={imgUrl(s.image.src)} alt={s.image.alt} fetchPriority={i === 0 ? "high" : "low"} />
                  </span>
                ))}
                <span className="niche-dim" aria-hidden />
              </div>
            </div>
            {/* which world is on display – links to it */}
            <div className="relative mt-6 flex items-center justify-center gap-4 md:mt-8" aria-live="polite">
              <Link to="/collection/$category" params={{ category: current.category }} className="link-underline text-sm tracking-wide text-ink">
                {current.label}
              </Link>
              <span aria-hidden className="flex gap-1.5">
                {slides.map((s, i) => (
                  <span key={s.image.src} className={`h-px transition-all duration-700 ${i === index ? "w-6 bg-primary" : "w-3 bg-shade"}`} />
                ))}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
