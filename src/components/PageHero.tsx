import type { ReactNode } from "react";
import { imgUrl, srcSet, type Img } from "../lib/content";

/** Split hero used by inner pages: text on one side, arch-framed image on the other. */
export function PageHero({ eyebrow, title, text, image, children }: { eyebrow?: string; title: string; text?: string; image?: Img; children?: ReactNode }) {
  return (
    <section className="bg-hero">
      <div className={`container-x grid items-center gap-10 py-12 md:py-16 ${image ? "md:grid-cols-[1fr_0.8fr] lg:gap-20" : ""}`}>
        <div className="max-w-xl">
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          <h1 className="text-4xl font-light tracking-tight md:text-6xl">{title}</h1>
          <span aria-hidden className="mt-6 block h-px w-12 bg-accent" />
          {text && <p className="mt-6 text-lg leading-relaxed text-muted">{text}</p>}
          {children}
        </div>
        {image && (
          <div className="arch mx-auto aspect-[4/5] w-full max-w-sm bg-surface md:max-w-md">
            <img src={imgUrl(image.src)} srcSet={srcSet(image)} sizes="(min-width: 768px) 40vw, 90vw" alt={image.alt} className="size-full object-cover" />
          </div>
        )}
      </div>
    </section>
  );
}
