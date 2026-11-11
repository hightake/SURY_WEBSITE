import { useParams } from "@tanstack/react-router";
import { useEffect } from "react";
import { PageHero } from "../components/PageHero";
import { ProductCard } from "../components/ProductCard";
import { Reveal } from "../components/Reveal";
import { getCategory } from "../lib/content";
import { usePageTitle } from "../lib/usePageTitle";
import { NotFound } from "./NotFound";

export function Category() {
  const { category: slug } = useParams({ from: "/collection/$category" });
  const category = getCategory(slug);
  usePageTitle(category?.name);

  // Jump to a sub-category when arriving from the menu (#slug).
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    if (id) requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
  }, [slug]);

  if (!category) return <NotFound />;
  const index = category.order;

  return (
    <>
      <PageHero eyebrow={`${String(index).padStart(2, "0")} · SURY`} title={category.name} text={category.intro} image={category.cover} />

      {/* Sub-category quick links (anchors, not filters) */}
      <nav aria-label="תתי־קטגוריות" className="sticky top-16 z-20 border-y border-shade/60 bg-bg/95 backdrop-blur md:top-20">
        <ul className="container-x no-scrollbar flex gap-2 overflow-x-auto py-3 lg:flex-wrap">
          {category.subcategories.map((s) => (
            <li key={s.slug} className="shrink-0">
              <a href={`#${s.slug}`} className="block rounded-full border border-shade px-4 py-2 text-sm transition-colors hover:border-ink">
                {s.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container-x space-y-20 py-14 md:space-y-28 md:py-20">
        {category.subcategories.map((s) => (
          <section key={s.slug} id={s.slug} className="scroll-mt-36 md:scroll-mt-44" aria-labelledby={`h-${s.slug}`}>
            <Reveal className="mb-8 flex items-baseline justify-between gap-4 border-b border-shade/70 pb-4 md:mb-10">
              <h2 id={`h-${s.slug}`} className="text-2xl font-light md:text-4xl">{s.name}</h2>
              <span className="text-sm text-muted">{s.products.length > 1 ? `${s.products.length} פריטים` : s.products.length === 1 ? "פריט אחד" : ""}</span>
            </Reveal>
            {s.products.length ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
                {s.products.map((p, i) => (
                  <Reveal key={p.slug} delay={(i % 4) * 80}>
                    <ProductCard product={p} categorySlug={category.slug} />
                  </Reveal>
                ))}
              </div>
            ) : (
              <p className="bg-surface/50 px-6 py-10 text-center text-muted">פריטים חדשים יעלו בקרוב.</p>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
