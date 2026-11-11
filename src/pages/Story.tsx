import { Link } from "@tanstack/react-router";
import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { categories, site } from "../lib/content";
import { usePageTitle } from "../lib/usePageTitle";

export function Story() {
  const s = site.pages.story;
  usePageTitle(s.title);
  return (
    <>
      <PageHero eyebrow="Our Story" title={s.title} text={s.lead} image={s.image} />
      <div className="container-x max-w-3xl py-16 md:py-24">
        {s.paragraphs.map((p, i) => (
          <Reveal key={i} as="p" className={`mb-7 leading-loose ${i === 0 ? "text-2xl font-light md:text-3xl leading-relaxed" : "text-lg text-muted"}`}>
            {p}
          </Reveal>
        ))}
      </div>
      <section className="niches-wall py-16 md:py-20" aria-label="העולמות של SURY">
        <ul className="container-x grid grid-cols-2 gap-6 text-center md:grid-cols-5">
          {categories.map((c, i) => (
            <li key={c.slug}>
              <Link to="/collection/$category" params={{ category: c.slug }} className="group block">
                <span className="latin text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                <span className="mt-1 block text-lg group-hover:text-primary">{c.shortName}</span>
                <span className="block text-sm text-muted">{c.tagline}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
