import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { categories, imgUrl, site } from "../../lib/content";
import { useInView } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

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
      <div ref={ref} className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:container-x md:grid md:grid-cols-5 md:gap-6 md:overflow-visible md:px-10 lg:gap-8">
        {categories.map((c, i) => (
          <Link
            key={c.slug}
            to="/collection/$category"
            params={{ category: c.slug }}
            className="group w-[62vw] max-w-[260px] shrink-0 snap-center md:w-auto md:max-w-none"
          >
            <div className={`niche ${lit ? "is-lit" : ""}`} style={{ ["--d" as string]: `${lightOrder(i, categories.length) * 450}ms` }}>
              <span className="niche-spot" aria-hidden />
              <span className="niche-beam" aria-hidden />
              <span className="niche-pedestal" aria-hidden />
              <span className={`niche-item ${c.slug === "cloa" ? "is-tall" : ""}`}>
                <img src={imgUrl(c.niche.src)} alt="" loading="lazy" decoding="async" />
              </span>
              <span className="niche-dim" aria-hidden />
            </div>
            <div className="mt-5 text-center">
              <p className="latin text-sm text-accent">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-1 text-lg font-medium md:text-xl">{c.shortName}</h3>
              <p className="mt-1 text-sm text-muted">{c.tagline}</p>
              <span className="link-underline mt-3 inline-block text-sm text-primary">לגלות</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
