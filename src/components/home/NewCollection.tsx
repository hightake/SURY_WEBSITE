import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { featured, imgSmUrl, imgUrl, site, srcSet, type FeaturedItem } from "../../lib/content";
import { IconArrow } from "../Icons";
import { Reveal } from "../Reveal";

/*
 * Block 3 – the new collection.
 * DEMO: three directions, picked with ?nc=a|b|c
 *   a – editorial spread (magazine layout, mixed sizes)
 *   b – showcase rail (large arched cards in a horizontal scroll)
 *   c – display window (each piece in a lit plaster niche)
 * Once one is chosen the other two are removed.
 */
type Variant = "a" | "b" | "c";

function useVariant(): Variant {
  const [v, setV] = useState<Variant>("a");
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("nc");
    if (q === "b" || q === "c") setV(q);
  }, []);
  return v;
}

const num = (i: number) => String(i + 1).padStart(2, "0");

export function NewCollection() {
  const variant = useVariant();
  const items = featured.slice(0, 8);
  if (variant === "b") return <Rail items={items} />;
  if (variant === "c") return <Window items={items} />;
  return <Editorial items={items} />;
}

function ItemLink({ item, children, className = "" }: { item: FeaturedItem; children: React.ReactNode; className?: string }) {
  return (
    <Link to="/collection/$category/$product" params={{ category: item.category.slug, product: item.product.slug }} className={`group block ${className}`}>
      {children}
    </Link>
  );
}

/* ---------- a – editorial spread ---------- */
function Editorial({ items }: { items: FeaturedItem[] }) {
  const t = site.home.newCollection;
  const [hero, ...rest] = items;
  return (
    <section className="relative overflow-hidden py-20 md:py-32" aria-labelledby="new-title">
      {/* oversized outline word in the background */}
      <p aria-hidden className="latin pointer-events-none absolute -top-2 left-0 right-0 select-none whitespace-nowrap text-center text-[22vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(201,160,74,0.28)] md:text-[15vw]">
        Nouveau
      </p>
      <div className="container-x relative">
        <Reveal className="mb-12 flex flex-col gap-4 md:mb-20 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow mb-3">New Collection · {new Date().getFullYear()}</p>
            <h2 id="new-title" className="text-4xl font-light md:text-6xl">{t.title}</h2>
          </div>
          <p className="max-w-xs text-muted md:text-end">{t.text}</p>
        </Reveal>

        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-12 md:gap-x-8 md:gap-y-16">
          {/* feature piece */}
          <Reveal className="col-span-2 md:col-span-6 md:row-span-2">
            <ItemLink item={hero}>
              <div className="arch relative aspect-[4/5] overflow-hidden bg-surface">
                <img src={imgUrl(hero.product.images[0].src)} srcSet={srcSet(hero.product.images[0])} sizes="(min-width: 768px) 45vw, 100vw" alt={hero.product.images[0].alt} loading="lazy" className="size-full object-cover transition-transform duration-[1.6s] ease-[var(--ease-soft)] group-hover:scale-[1.04]" />
              </div>
              <div className="mt-5 flex items-baseline gap-4">
                <span className="latin text-3xl text-accent">{num(0)}</span>
                <div>
                  <p className="text-xs tracking-wide text-muted">{hero.category.shortName} · {hero.sub.name}</p>
                  <h3 className="text-xl font-light md:text-2xl">{hero.product.name}</h3>
                </div>
              </div>
            </ItemLink>
          </Reveal>
          {rest.map((item, i) => {
            // staggered magazine rhythm
            const layout = ["md:col-span-3", "md:col-span-3 md:mt-24", "md:col-span-3 md:-mt-8", "md:col-span-3 md:mt-12", "md:col-span-4", "md:col-span-4 md:mt-16", "md:col-span-4"][i] ?? "md:col-span-3";
            return (
              <Reveal key={item.product.slug} delay={(i % 3) * 110} className={layout}>
                <ItemLink item={item}>
                  <div className="relative aspect-[3/4] overflow-hidden bg-surface">
                    <img src={imgSmUrl(item.product.images[0].src)} alt={item.product.images[0].alt} loading="lazy" className="size-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-soft)] group-hover:scale-[1.05]" />
                    <span className="absolute inset-x-0 bottom-0 translate-y-full bg-bg/90 py-2 text-center text-sm text-primary transition-transform duration-500 group-hover:translate-y-0">לפרטים</span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-3">
                    <span className="latin text-lg text-accent">{num(i + 1)}</span>
                    <h3 className="text-[15px] leading-snug">{item.product.name}</h3>
                  </div>
                </ItemLink>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- b – showcase rail ---------- */
function Rail({ items }: { items: FeaturedItem[] }) {
  const t = site.home.newCollection;
  const track = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? Math.abs(el.scrollLeft) / max : 0);
  };
  // RTL: "next" moves the track to the left
  const go = (dir: 1 | -1) => track.current?.scrollBy({ left: -dir * track.current.clientWidth * 0.6, behavior: "smooth" });
  return (
    <section className="nc-rail py-20 md:py-28" aria-labelledby="new-title">
      <div className="container-x mb-10 flex items-end justify-between gap-6 md:mb-14">
        <Reveal>
          <p className="eyebrow mb-3">New Collection</p>
          <h2 id="new-title" className="text-4xl font-light md:text-6xl">{t.title}</h2>
          <p className="mt-3 text-muted">{t.text}</p>
        </Reveal>
        <div className="hidden gap-3 md:flex">
          <button type="button" onClick={() => go(-1)} aria-label="הקודם" className="grid size-12 place-items-center rounded-full border border-ink/30 transition hover:border-ink">
            <IconArrow className="size-4 rotate-180" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="הבא" className="grid size-12 place-items-center rounded-full border border-ink/30 transition hover:border-ink">
            <IconArrow className="size-4" />
          </button>
        </div>
      </div>
      <div ref={track} onScroll={onScroll} className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-5 px-5 pb-2 md:gap-8 md:scroll-px-10 md:px-10">
        {items.map((item, i) => (
          <ItemLink key={item.product.slug} item={item} className="w-[72vw] shrink-0 snap-start sm:w-[44vw] md:w-[30vw] lg:w-[24vw]">
            <div className="relative">
              <div className="arch aspect-[3/4] overflow-hidden bg-surface shadow-[0_30px_50px_-35px_rgba(80,50,20,0.5)]">
                <img src={imgSmUrl(item.product.images[0].src)} alt={item.product.images[0].alt} loading="lazy" className="size-full object-cover transition-transform duration-[1.4s] ease-[var(--ease-soft)] group-hover:scale-[1.06]" />
              </div>
              <span aria-hidden className="pointer-events-none absolute -inset-2 rounded-t-full border border-accent/0 transition-colors duration-500 group-hover:border-accent/70" />
            </div>
            <div className="mt-5 text-center">
              <p className="latin text-sm text-accent">{num(i)}</p>
              <h3 className="mt-1 text-lg font-light">{item.product.name}</h3>
              <p className="mt-1 text-xs tracking-wide text-muted">{item.category.shortName}</p>
            </div>
          </ItemLink>
        ))}
      </div>
      <div className="container-x mt-10">
        <div className="relative h-px bg-shade" aria-hidden>
          <span className="absolute inset-y-0 right-0 bg-primary transition-[width] duration-300" style={{ width: `${Math.max(12, progress * 100)}%` }} />
        </div>
      </div>
    </section>
  );
}

/* ---------- c – display window ---------- */
function Window({ items }: { items: FeaturedItem[] }) {
  const t = site.home.newCollection;
  return (
    <section className="niches-wall py-20 md:py-28" aria-labelledby="new-title">
      <div className="container-x">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <p className="eyebrow mb-3">New Collection</p>
          <h2 id="new-title" className="text-4xl font-light md:text-6xl">{t.title}</h2>
          <span aria-hidden className="mx-auto mt-5 block h-px w-12 bg-accent" />
          <p className="mt-5 text-muted">{t.text}</p>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-4 md:gap-x-8 md:gap-y-16">
          {items.map((item, i) => (
            <Reveal key={item.product.slug} delay={(i % 4) * 100}>
              <ItemLink item={item}>
                <div className="nc-window">
                  <span className="nc-window-spot" aria-hidden />
                  <div className="nc-window-photo">
                    <img src={imgSmUrl(item.product.images[0].src)} alt={item.product.images[0].alt} loading="lazy" />
                  </div>
                </div>
                <div className="mt-5 text-center">
                  <h3 className="text-[15px] font-normal md:text-base">{item.product.name}</h3>
                  <p className="mt-1 text-xs tracking-wide text-muted">{item.category.shortName}</p>
                  <span className="link-underline mt-2 inline-block text-sm text-primary opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">לפרטים</span>
                </div>
              </ItemLink>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
