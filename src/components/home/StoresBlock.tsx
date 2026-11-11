import { site } from "../../lib/content";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";
import { StoreCard } from "../StoreCard";

export function StoresBlock() {
  return (
    <section className="bg-surface/60 py-20 md:py-28" aria-labelledby="stores-title">
      <div className="container-x">
        <SectionHeading id="stores-title" eyebrow="Our Stores" title={site.home.stores.title} text={site.home.stores.text} />
        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {site.stores.map((store, i) => (
            <Reveal key={store.city} delay={i * 110}>
              <StoreCard store={store} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
