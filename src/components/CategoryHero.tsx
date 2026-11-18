import { imgUrl, srcSet } from "../lib/media";
import type { Category } from "../models/content";

/*
 * Category page opening: the name stands in a lit plaster gate.
 * Desktop – the cover photo in its own framed arch beside it;
 * mobile – the photo in a lit arch inside the same gate.
 */
function useName(category: Category) {
  const [main, sub] = category.name.split(/\s+–\s+/);
  return { main, sub, latin: /^[A-Za-z]/.test(main), num: String(category.order).padStart(2, "0") };
}

export function CategoryHero({ category }: { category: Category }) {
  return <Gate category={category} />;
}

function Gate({ category }: { category: Category }) {
  const { main, sub, latin, num } = useName(category);
  const photo = (cls: string, sizes: string) => (
    <div className={cls}>
      <img src={imgUrl(category.cover.src)} srcSet={srcSet(category.cover)} sizes={sizes} alt={category.cover.alt} />
    </div>
  );
  return (
    <section className="niches-wall" aria-labelledby="cat-title">
      {/* mobile: the photo stands inside the lit gate; desktop: two separate gates side by side */}
      <div className="container-x grid items-center gap-10 py-10 md:grid-cols-[1.2fr_0.8fr] md:py-14 lg:gap-14">
        <div className="ch-gate ch-gate-wide is-lit animate-[fadeIn_1.2s_var(--ease-soft)_both]">
          <span className="ch-gate-beam" aria-hidden />
          <span className="niche-spot" aria-hidden />
          <div className="relative z-[2] flex flex-col items-center gap-8 px-6 pb-10 pt-24 text-center md:min-h-[30rem] md:justify-center md:px-12 md:pb-14 md:pt-28">
            <div>
              <p className="eyebrow">{num} · SURY</p>
              <h1 id="cat-title" className={`mt-4 text-5xl font-extralight leading-none md:text-7xl ${latin ? "latin tracking-[0.12em]" : ""}`}>{main}</h1>
              {sub && <p className="mt-4 text-xl font-light text-gold-deep md:text-2xl">{sub}</p>}
              <span aria-hidden className="gold-rule mx-auto mt-7" />
              {category.intro && <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-ink/75 md:text-lg">{category.intro}</p>}
            </div>
            {photo("ch-gate-photo mx-auto w-[78%] max-w-[330px] md:hidden", "78vw")}
          </div>
        </div>
        {/* desktop: the photo in its own framed arch */}
        <div className="relative mx-auto hidden w-full max-w-[340px] md:block animate-[fadeIn_1.4s_var(--ease-soft)_0.2s_both]">
          <div className="arch aspect-[3/4] bg-surface shadow-[0_0_0_1px_rgba(201,160,74,0.8),0_0_0_7px_#f3e9dd,0_0_0_8px_rgba(201,160,74,0.4),0_40px_60px_-35px_rgba(80,50,20,0.55)]">
            <img src={imgUrl(category.cover.src)} srcSet={srcSet(category.cover)} sizes="340px" alt={category.cover.alt} className="size-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
}
