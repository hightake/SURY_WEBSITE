import { site } from "../../lib/content";
import { Reveal } from "../Reveal";

export function Uniqueness() {
  const u = site.home.uniqueness;
  return (
    <section className="bg-primary py-20 text-bg md:py-28" aria-labelledby="unique-title">
      <div className="container-x">
        <Reveal className="mb-12 text-center md:mb-16">
          <p className="eyebrow mb-3 text-bg/60">The SURY Standard</p>
          <h2 id="unique-title" className="text-3xl font-light md:text-5xl">{u.title}</h2>
          <span aria-hidden className="mx-auto mt-5 block h-px w-12 bg-accent" />
        </Reveal>
        <ol className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-0">
          {u.items.map((item, i) => (
            <Reveal as="li" key={item.title} delay={i * 110} className="lg:border-s lg:border-bg/15 lg:px-7 lg:first:border-s-0">
              <span className="latin text-4xl text-accent md:text-5xl">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-4 text-xl font-medium">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-bg/75">{item.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
