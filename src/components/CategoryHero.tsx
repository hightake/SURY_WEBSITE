import { useEffect, useState } from "react";
import { imgUrl, srcSet, type Category } from "../lib/content";

/*
 * Category page opening.
 * DEMO: three directions, picked with ?ch=a|b|c
 *   a – centred monument: the name between long gold hairlines, cover below in a wide arch
 *   b – inside the gate: the name stands in a lit plaster arch, like the brand niches
 *   c – magazine cover: large cover photo, the name overlapping its edge
 * Once one is chosen the other two are removed.
 */
type Variant = "a" | "b" | "c";

function useVariant(): Variant {
  const [v, setV] = useState<Variant>("a");
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("ch");
    if (q === "b" || q === "c") setV(q);
  }, []);
  return v;
}

function useName(category: Category) {
  const [main, sub] = category.name.split(/\s+–\s+/);
  return { main, sub, latin: /^[A-Za-z]/.test(main), num: String(category.order).padStart(2, "0") };
}

export function CategoryHero({ category }: { category: Category }) {
  const v = useVariant();
  if (v === "b") return <Gate category={category} />;
  if (v === "c") return <Cover category={category} />;
  return <Monument category={category} />;
}

/* ---------- a – centred monument ---------- */
function Monument({ category }: { category: Category }) {
  const { main, sub, latin, num } = useName(category);
  return (
    <section className="ch-monument" aria-labelledby="cat-title">
      <div className="container-x pb-14 pt-14 text-center md:pb-20 md:pt-20">
        <span className="ch-num animate-[fadeIn_1s_var(--ease-soft)_both]">{num}</span>
        <div className="ch-hairlines mt-7 animate-[fadeUp_1s_var(--ease-soft)_0.1s_both]">
          <h1 id="cat-title" className={`ch-monument-title ${latin ? "latin is-latin" : ""}`}>{main}</h1>
        </div>
        {sub && <p className="ch-spaced mt-5 animate-[fadeUp_1s_var(--ease-soft)_0.2s_both]">{sub}</p>}
        {category.intro && <p className="mx-auto mt-6 max-w-xl text-lg font-light leading-relaxed text-ink/75 animate-[fadeUp_1s_var(--ease-soft)_0.3s_both]">{category.intro}</p>}
        <div className="mx-auto mt-12 max-w-4xl animate-[fadeIn_1.4s_var(--ease-soft)_0.3s_both]">
          <div className="ch-band">
            <img src={imgUrl(category.cover.src)} srcSet={srcSet(category.cover)} sizes="(min-width: 900px) 900px, 100vw" alt={category.cover.alt} />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- b – inside the gate ---------- */
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
        {/* desktop: its own lit gate */}
        <div className="ch-gate ch-gate-solo is-lit hidden md:block animate-[fadeIn_1.4s_var(--ease-soft)_0.2s_both]">
          <span className="ch-gate-beam" aria-hidden />
          <span className="niche-spot" aria-hidden />
          {photo("ch-gate-photo relative z-[2] mx-[9%] mb-[9%] mt-[24%]", "340px")}
        </div>
      </div>
    </section>
  );
}

/* ---------- c – magazine cover ---------- */
function Cover({ category }: { category: Category }) {
  const { main, sub, latin, num } = useName(category);
  return (
    <section className="ch-cover relative overflow-hidden" aria-labelledby="cat-title">
      <div className="grid md:min-h-[78svh] md:grid-cols-2">
        {/* photo – left half in RTL */}
        <div className="relative order-1 h-[52svh] md:order-2 md:h-auto">
          <img src={imgUrl(category.cover.src)} srcSet={srcSet(category.cover)} sizes="(min-width: 768px) 50vw, 100vw" alt={category.cover.alt} className="absolute inset-0 size-full object-cover animate-[fadeIn_1.6s_var(--ease-soft)_both]" />
          <div aria-hidden className="absolute inset-y-0 right-0 w-px bg-accent" />
        </div>
        <div className="relative order-2 flex items-center md:order-1">
          <div className="w-full px-5 py-12 md:pe-0 md:ps-[max(2.5rem,calc((100vw-1320px)/2+2.5rem))]">
            <div className="flex items-start gap-5">
              <span className="ch-vertical hidden md:block">{num} — SURY</span>
              <div className="min-w-0 flex-1">
                <h1 id="cat-title" className={`ch-cover-title md:text-end animate-[fadeUp_1.1s_var(--ease-soft)_0.15s_both] ${latin ? "latin" : ""}`}>{main}</h1>
                {sub && <p className="mt-4 text-xl font-light italic text-gold-deep md:text-3xl">{sub}</p>}
                <span aria-hidden className="mt-8 block h-px w-24 bg-accent" />
                {category.intro && <p className="mt-7 max-w-md text-lg font-light leading-relaxed text-ink/80">{category.intro}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
