import { Link } from "@tanstack/react-router";
import { imgUrl, site, srcSet } from "../../lib/content";
import { IconArrow } from "../Icons";
import { Reveal } from "../Reveal";

export function StoryTeaser() {
  const s = site.home.storyTeaser;
  return (
    <section className="py-20 md:py-28" aria-labelledby="story-title">
      <div className="container-x grid items-center gap-12 md:grid-cols-2 lg:gap-24">
        <Reveal>
          <div className="arch mx-auto aspect-[4/5] max-w-md bg-surface">
            <img src={imgUrl(s.image.src)} srcSet={srcSet(s.image)} sizes="(min-width: 768px) 40vw, 90vw" alt={s.image.alt} loading="lazy" className="size-full object-cover" />
          </div>
        </Reveal>
        <Reveal delay={150}>
          <p className="eyebrow mb-4">Our Story</p>
          <h2 id="story-title" className="text-3xl font-light md:text-5xl">{s.title}</h2>
          <span aria-hidden className="mt-6 block h-px w-12 bg-accent" />
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted">{s.text}</p>
          <Link to="/our-story" className="btn btn-outline mt-9">
            {s.cta}
            <IconArrow />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
