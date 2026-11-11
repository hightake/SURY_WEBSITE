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

export function BrandWorlds() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, 0.3);
  const [lit, setLit] = useState(false);
  useEffect(() => {
    if (inView) setLit(true);
  }, [inView]);

  return (
    <section id="worlds" className="niches-wall scroll-mt-16 py-20 md:py-28" aria-labelledby="worlds-title">
      <div className="container-x">
        <SectionHeading id="worlds-title" eyebrow="SURY Worlds" title={site.home.worlds.title} text={site.home.worlds.text} />
      </div>
      <div className="container-x">
        <div ref={ref} className={`niches-panel overflow-hidden ${lit ? "is-lit" : ""}`}>
          <div className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto px-3 pt-12 md:grid md:grid-cols-5 md:overflow-visible md:px-6 md:pt-16 lg:px-10 lg:pt-20">
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
                  <div className="px-2 pb-8 pt-5 text-center md:pb-10">
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
