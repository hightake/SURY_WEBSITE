import { imgUrl, site } from "../../lib/content";
import { IconChevron } from "../Icons";

export function Hero() {
  const h = site.home.hero;
  return (
    <section className="relative overflow-hidden bg-hero" aria-labelledby="hero-title">
      {/* warm spotlight */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_60%_at_30%_30%,rgba(255,240,215,0.9),transparent_70%)]" />
      <div className="container-x relative grid min-h-[calc(100svh-4rem)] items-center gap-8 pb-10 pt-6 md:min-h-[calc(100svh-5rem)] md:grid-cols-[1fr_1fr] md:gap-12 md:py-10">
        <div className="order-2 text-center md:order-1 md:text-start">
          <p className="eyebrow animate-[fadeUp_1s_var(--ease-soft)_both]">{h.eyebrow}</p>
          <h1 id="hero-title" className="mt-5 text-[2.6rem] leading-[1.05] tracking-tight sm:text-6xl lg:text-[5.5rem] animate-[fadeUp_1s_var(--ease-soft)_0.15s_both]">
            <span className="block font-extrabold">{h.titleBold}</span>
            <span className="block font-extralight">{h.titleLight}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-lg text-muted md:mx-0 animate-[fadeUp_1s_var(--ease-soft)_0.3s_both]">{h.text}</p>
          <div className="mt-9 animate-[fadeUp_1s_var(--ease-soft)_0.45s_both]">
            <a href="#worlds" className="btn btn-primary px-10">
              {h.cta}
              <IconChevron />
            </a>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <div className="relative mx-auto w-[78%] max-w-[480px] animate-[fadeIn_1.6s_var(--ease-soft)_both] md:w-full">
            {/* gold hairline arch behind the photo */}
            <div aria-hidden className="absolute -inset-3 rounded-t-full border border-accent/60 md:-inset-5" />
            {/* the hero product stands lit in a plaster niche, like the brand worlds */}
            <div className="is-lit">
              <div className="niche hero-niche shadow-[0_40px_60px_-40px_rgba(80,50,20,0.45)]">
                <span className="niche-beam" aria-hidden />
                <span className="niche-spot" aria-hidden />
                <span className="niche-pedestal" aria-hidden />
                <span className="niche-stand-base" aria-hidden />
                <span className="niche-stand-pole" aria-hidden style={{ ["--pole" as string]: "24%" }} />
                <span className="niche-item" style={{ ["--ib" as string]: "35%", ["--ih" as string]: "36%", ["--iw" as string]: "76%" }}>
                  <img src={imgUrl(h.image.src)} alt={h.image.alt} fetchPriority="high" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
