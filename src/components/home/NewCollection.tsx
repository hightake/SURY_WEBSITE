import { Link } from "@tanstack/react-router";
import { featured, imgSmUrl, imgUrl, site, srcSet, type FeaturedItem } from "../../lib/content";
import { Reveal } from "../Reveal";

/*
 * Block 3 – the new collection, as an editorial spread: one feature piece
 * in an arch and the rest in a staggered magazine rhythm. Every image links
 * to its product page.
 */
export function NewCollection() {
  return <Editorial items={featured.slice(0, 8)} />;
}

function ItemLink({ item, children, className = "" }: { item: FeaturedItem; children: React.ReactNode; className?: string }) {
  return (
    <Link to="/collection/$category/$product" params={{ category: item.category.slug, product: item.product.slug }} className={`group block ${className}`}>
      {children}
    </Link>
  );
}

function Editorial({ items }: { items: FeaturedItem[] }) {
  const t = site.home.newCollection;
  const [hero, ...rest] = items;
  return (
    <section className="relative overflow-hidden py-20 md:py-32" aria-labelledby="new-title">
      {/* oversized outline word in the background */}
      <p aria-hidden className="latin pointer-events-none absolute -top-2 left-0 right-0 select-none whitespace-nowrap text-center text-[22vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(201,160,74,0.28)] md:text-[15vw]">
        SURY
      </p>
      <div className="container-x relative">
        <Reveal className="mb-12 grid gap-6 md:mb-20 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <p className="eyebrow mb-3">New Collection · {new Date().getFullYear()}</p>
            <h2 id="new-title" className="text-4xl font-light md:text-6xl">{t.title}</h2>
          </div>
          <div className="flex items-center gap-4 md:border-s md:border-accent/60 md:ps-8 md:pb-2">
            <span aria-hidden className="h-px w-10 bg-accent md:hidden" />
            <p className="text-lg font-light text-ink/80 md:max-w-[15rem] md:text-xl">
              <span className="block text-sm tracking-wide text-accent">חדש בחנויות</span>
              {t.text}
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-12 md:gap-x-8 md:gap-y-16">
          {/* feature piece */}
          <Reveal className="col-span-2 md:col-span-6 md:row-span-2">
            <ItemLink item={hero}>
              <div className="arch relative aspect-[4/5] overflow-hidden bg-surface">
                <img src={imgUrl(hero.product.images[0].src)} srcSet={srcSet(hero.product.images[0])} sizes="(min-width: 768px) 45vw, 100vw" alt={hero.product.images[0].alt} loading="lazy" className="size-full object-cover transition-transform duration-[1.6s] ease-[var(--ease-soft)] group-hover:scale-[1.04]" />
              </div>
              <div className="mt-5">
                <p className="text-xs tracking-wide text-muted">{hero.category.shortName} · {hero.sub.name}</p>
                <h3 className="mt-1 text-xl font-light md:text-2xl">{hero.product.name}</h3>
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
                  <div className="mt-3">
                    <p className="text-xs tracking-wide text-muted">{item.category.shortName}</p>
                    <h3 className="mt-0.5 text-[15px] leading-snug">{item.product.name}</h3>
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

