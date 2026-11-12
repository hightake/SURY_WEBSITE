import { Link } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { site } from "../../lib/content";
import { IconChevron } from "../Icons";
import { Sketch, worldSketches } from "./Sketches";

/*
 * Block 1 – opening: atmosphere rather than specific products.
 * Gold line sketches of the five worlds, drawn in light.
 *
 * DEMO: three directions, picked with ?hero=a|b|c
 *   a – sketch gallery inside a lit plaster arch
 *   b – floating sketches around the title, light rays from above
 *   c – one line: each world is drawn, held, and gives way to the next
 * Once one is chosen the other two are removed.
 */
type Variant = "a" | "b" | "c";

function useVariant(): Variant {
  const [v, setV] = useState<Variant>("a");
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("hero");
    if (q === "b" || q === "c") setV(q);
  }, []);
  return v;
}

export function Hero() {
  const variant = useVariant();
  if (variant === "b") return <HeroFloating />;
  return (
    <HeroSplit>{variant === "a" ? <ArchGallery /> : <OneLine />}</HeroSplit>
  );
}

function HeroText({ center = false }: { center?: boolean }) {
  const h = site.home.hero;
  return (
    <>
      <p className="eyebrow animate-[fadeUp_1s_var(--ease-soft)_both]">
        {h.eyebrow}
      </p>
      <h1
        id="hero-title"
        className="mt-5 text-[2.6rem] leading-[1.05] tracking-tight sm:text-6xl lg:text-[5.5rem] animate-[fadeUp_1s_var(--ease-soft)_0.15s_both]"
      >
        <span className="block font-extrabold">{h.titleBold}</span>
        <span className="block font-extralight">{h.titleLight}</span>
      </h1>
      <p
        className={`mt-6 max-w-md text-lg text-muted animate-[fadeUp_1s_var(--ease-soft)_0.3s_both] ${center ? "mx-auto" : "mx-auto md:mx-0"}`}
      >
        {h.text}
      </p>
      <div className="mt-9 animate-[fadeUp_1s_var(--ease-soft)_0.45s_both]">
        <a href="#worlds" className="btn btn-primary px-10">
          {h.cta}
          <IconChevron />
        </a>
      </div>
    </>
  );
}

function HeroSplit({ children }: { children: ReactNode }) {
  return (
    <section
      className="relative overflow-hidden bg-hero"
      aria-labelledby="hero-title"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_30%_30%,rgba(255,240,215,0.9),transparent_70%)]"
      />
      <div className="container-x relative grid min-h-[calc(100svh-4rem)] items-center gap-8 pb-10 pt-6 md:min-h-[calc(100svh-5rem)] md:grid-cols-[1fr_1fr] md:gap-12 md:py-10">
        <div className="order-2 text-center md:order-1 md:text-start">
          <HeroText />
        </div>
        <div className="order-1 md:order-2">
          <div className="relative mx-auto w-[82%] max-w-[500px] animate-[fadeIn_1.6s_var(--ease-soft)_both] md:w-full">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

/* a – five sketches hung in a lit plaster arch, drawn one after another */
function ArchGallery() {
  const spots = [
    { left: "50%", top: "20%", w: "34%" }, // hat – centre top
    { left: "24%", top: "40%", w: "26%" },
    { left: "76%", top: "40%", w: "26%" },
    { left: "33%", top: "66%", w: "25%" },
    { left: "67%", top: "66%", w: "25%" },
  ];
  return (
    <>
      <div
        aria-hidden
        className="absolute -inset-3 rounded-t-full border border-accent/60 md:-inset-5"
      />
      <div className="is-lit">
        <div className="niche hero-niche hero-sketch-arch">
          <span className="niche-beam" aria-hidden />
          <span className="niche-spot" aria-hidden />
          {worldSketches.map((s, i) => (
            <Link
              key={s.name}
              to="/collection/$category"
              params={{ category: s.category }}
              aria-label={s.label}
              className="hero-sketch-spot group absolute -translate-x-1/2"
              style={{
                left: spots[i].left,
                top: spots[i].top,
                width: spots[i].w,
              }}
            >
              <Sketch
                name={s.name}
                delay={400 + i * 650}
                className="sketch-float"
                style={{ ["--fl" as string]: `${i * 0.7}s` }}
              />
              <span className="mt-1 block text-center text-[11px] tracking-wide text-muted opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                {s.label}
              </span>
            </Link>
          ))}
          <Sketch
            name="branch"
            delay={400 + 5 * 650}
            className="absolute bottom-[3%] left-[4%] w-[22%] opacity-80"
          />
        </div>
      </div>
    </>
  );
}

/* c – one world at a time: drawn in gold, held, erased, next */
function OneLine() {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setInterval(
      () => !document.hidden && setI((n) => (n + 1) % worldSketches.length),
      4600,
    );
    return () => window.clearInterval(t);
  }, []);
  const s = worldSketches[i];
  return (
    <>
      <div className="relative">
        <div
          aria-hidden
          className="absolute -inset-3 rounded-t-full border border-accent/60 md:-inset-5"
        />
        <div className="is-lit">
          <div className="niche hero-niche">
            <span className="niche-beam" aria-hidden />
            <span className="niche-spot" aria-hidden />
            <Sketch
              key={s.name}
              name={s.name}
              className="sketch-cycle absolute left-1/2 top-[24%] w-[62%] -translate-x-1/2"
            />
          </div>
        </div>
      </div>
      <div
        className="relative mt-8 flex items-center justify-center gap-4 md:mt-10"
        aria-live="polite"
      >
        <Link
          to="/collection/$category"
          params={{ category: s.category }}
          className="link-underline text-sm tracking-wide"
        >
          {s.label}
        </Link>
        <span aria-hidden className="flex gap-1.5">
          {worldSketches.map((w, n) => (
            <span
              key={w.name}
              className={`h-px transition-all duration-700 ${n === i ? "w-6 bg-primary" : "w-3 bg-shade"}`}
            />
          ))}
        </span>
      </div>
    </>
  );
}

/* b – full-width: the title in the middle, sketches drifting around it in warm light */
function HeroFloating() {
  const placed = [
    {
      name: "hat",
      cls: "left-[4%] top-[10%] w-[22%] md:left-[8%] md:top-[14%] md:w-[13%]",
    },
    {
      name: "tichel",
      cls: "right-[4%] top-[8%] w-[20%] md:right-[9%] md:top-[12%] md:w-[11%]",
    },
    {
      name: "robe",
      cls: "left-[2%] bottom-[8%] w-[18%] md:left-[14%] md:bottom-[10%] md:w-[10%]",
    },
    {
      name: "bandana",
      cls: "right-[3%] bottom-[10%] w-[20%] md:right-[15%] md:bottom-[12%] md:w-[11%]",
    },
    {
      name: "scarf",
      cls: "hidden md:block left-[30%] top-[6%] w-[8%] opacity-70",
    },
    {
      name: "branch",
      cls: "hidden md:block right-[30%] bottom-[5%] w-[9%] opacity-70",
    },
  ] as const;
  return (
    <section
      className="hero-rays relative overflow-hidden bg-hero"
      aria-labelledby="hero-title"
    >
      {placed.map((p, i) => (
        <Sketch
          key={p.name}
          name={p.name}
          delay={300 + i * 450}
          className={`sketch-float absolute ${p.cls}`}
          style={{ ["--fl" as string]: `${i * 0.9}s` }}
        />
      ))}
      <div className="hero-dust" aria-hidden />
      <div className="container-x relative grid min-h-[calc(100svh-4rem)] place-items-center py-16 text-center md:min-h-[calc(100svh-5rem)]">
        <div>
          <HeroText center />
        </div>
      </div>
    </section>
  );
}
