import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { categories, imgUrl, site } from "../../lib/content";
import { useInView } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

// Spots light up from the centre outwards: 3rd, then 2nd+4th, then 1st+5th.
const lightOrder = (i: number, n: number) => Math.abs(i - (n - 1) / 2);

/**
 * Block 2 – brand worlds. Each world is a photo of a lit plaster niche
 * (the category's "niche image", managed from the admin later). The tiles sit
 * edge to edge so together they read as one wall, like the SURY ad.
 */
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
        <div ref={ref} className={`niches-panel ${lit ? "is-lit" : ""}`}>
          <div className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto md:grid md:grid-cols-5 md:overflow-visible">
            {categories.map((c, i) => (
              <Link
                key={c.slug}
                to="/collection/$category"
                params={{ category: c.slug }}
                className="group w-[58vw] max-w-[260px] shrink-0 snap-center md:w-auto md:max-w-none"
                style={{ ["--d" as string]: `${lightOrder(i, categories.length) * 450}ms` }}
              >
                <div className="niche-photo">
                  <img src={imgUrl(c.niche.src)} alt={c.niche.alt} width={c.niche.w} height={c.niche.h} loading="lazy" decoding="async" />
                </div>
                <div className="niche-label">
                  <p className="latin text-sm text-accent">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="mt-1 text-lg font-medium md:text-xl">{c.shortName}</h3>
                  <p className="mt-1 text-sm text-muted">{c.tagline}</p>
                  <span className="link-underline mt-3 inline-block text-sm text-primary">לגלות</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
