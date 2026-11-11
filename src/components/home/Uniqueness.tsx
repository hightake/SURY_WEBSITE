import { site } from "../../lib/content";
import { Reveal } from "../Reveal";

/** Block 4 – what makes SURY special. A deep-burgundy arch (the gate motif) rising from the cream page. */
export function Uniqueness() {
  const u = site.home.uniqueness;
  return (
    <section className="unique-section pt-6 md:pt-10" aria-labelledby="unique-title">
      <div className="unique-arch text-bg">
        <div className="container-x relative pb-20 pt-24 md:pb-28 md:pt-36">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center md:mb-20">
            <p className="eyebrow mb-4 text-accent">The SURY Standard</p>
            <h2 id="unique-title" className="text-3xl font-light md:text-5xl">
              {u.title}
            </h2>
            <span aria-hidden className="mx-auto mt-6 block h-px w-12 bg-accent" />
          </Reveal>
          <ol className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0">
            {u.items.map((item, i) => (
              <Reveal as="li" key={item.title} delay={i * 110} className="text-center lg:border-s lg:border-accent/25 lg:px-7 lg:first:border-s-0">
                <span className="latin text-4xl text-accent md:text-5xl">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-4 text-xl font-medium">{item.title}</h3>
                <p className="mx-auto mt-2 max-w-[16rem] leading-relaxed text-bg/80">{item.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
