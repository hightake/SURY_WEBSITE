import { imgUrl, srcSet, type Category } from "../lib/content";

/** Festive opening for a category page: lit plaster wall, large title, gold ornaments, the cover in a gold-framed arch. */
export function CategoryHero({ category }: { category: Category }) {
  const [main, sub] = category.name.split(/\s+–\s+/);
  const isLatin = /^[A-Za-z]/.test(main);
  return (
    <section className="cat-hero relative overflow-hidden" aria-labelledby="cat-title">
      <div className="container-x relative grid items-center gap-12 py-14 md:grid-cols-[1.1fr_0.9fr] md:py-20 lg:gap-20">
        <div className="text-center md:text-start">
          <p className="eyebrow animate-[fadeUp_0.9s_var(--ease-soft)_both]">
            {String(category.order).padStart(2, "0")} · {category.tagline}
          </p>
          <h1 id="cat-title" className="mt-5 animate-[fadeUp_1s_var(--ease-soft)_0.1s_both]">
            <span className={`cat-hero-title block ${isLatin ? "latin" : ""}`}>{main}</span>
            {sub && <span className="mt-3 block text-2xl font-light text-gold-deep md:text-4xl">{sub}</span>}
          </h1>
          <span aria-hidden className="gold-rule mx-auto mt-8 md:mx-0 animate-[fadeIn_1.2s_var(--ease-soft)_0.3s_both]" />
          {category.intro && <p className="mx-auto mt-7 max-w-lg text-lg leading-relaxed text-ink/80 md:mx-0 md:text-xl animate-[fadeUp_1s_var(--ease-soft)_0.35s_both]">{category.intro}</p>}
        </div>
        <div className="relative mx-auto w-[78%] max-w-[420px] animate-[fadeIn_1.4s_var(--ease-soft)_both] md:w-full">
          <div aria-hidden className="cat-hero-frame" />
          <div className="arch relative aspect-[4/5] bg-surface shadow-[0_40px_60px_-35px_rgba(80,50,20,0.55)]">
            <img src={imgUrl(category.cover.src)} srcSet={srcSet(category.cover)} sizes="(min-width: 768px) 40vw, 78vw" alt={category.cover.alt} className="size-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
