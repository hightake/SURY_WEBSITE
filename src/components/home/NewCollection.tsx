import { featured, site } from "../../lib/content";
import { ProductCard } from "../ProductCard";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

export function NewCollection() {
  const items = featured.slice(0, 8);
  return (
    <section className="py-20 md:py-28" aria-labelledby="new-title">
      <div className="container-x">
        <SectionHeading id="new-title" eyebrow="New Collection" title={site.home.newCollection.title} text={site.home.newCollection.text} />
        <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4 md:gap-x-6 md:gap-y-14">
          {items.map(({ category, sub, product }, i) => (
            <Reveal key={`${category.slug}-${product.slug}`} delay={(i % 4) * 90}>
              <ProductCard product={product} categorySlug={category.slug} label={`${category.shortName} · ${sub.name}`} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
