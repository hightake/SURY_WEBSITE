import { navLink, site, telLink, type Store } from "../../lib/content";
import { IconPin } from "../Icons";
import { Reveal } from "../Reveal";
import { SectionHeading } from "../SectionHeading";

/*
 * Block 6 – our stores. Each store stands in a lit plaster gate.
 */
export function StoresBlock() {
  return <Gates />;
}

function Hours({ store, className = "" }: { store: Store; className?: string }) {
  return (
    <dl className={`grid grid-cols-[auto_auto] justify-start gap-x-4 gap-y-1 ${className}`}>
      {store.hours.map(([days, time]) => (
        <div key={days} className="contents">
          <dt className="text-muted">{days}</dt>
          <dd dir="ltr" className="text-end">{time}</dd>
        </div>
      ))}
    </dl>
  );
}

function Actions({ store, className = "" }: { store: Store; className?: string }) {
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      <a href={navLink(store.navQuery)} target="_blank" rel="noopener noreferrer" className="btn btn-primary flex-1 px-6">
        ניווט לחנות
      </a>
      <a href={telLink(store.phone)} className="btn btn-outline flex-1 px-6">
        חיוג
      </a>
    </div>
  );
}

function Gates() {
  return (
    <section className="niches-wall py-20 md:py-28" aria-labelledby="stores-title">
      <div className="container-x">
        <SectionHeading id="stores-title" eyebrow="Our Stores" title={site.home.stores.title} text={site.home.stores.text} />
        <div className="grid gap-8 md:grid-cols-3 md:gap-8">
          {site.stores.map((store, i) => (
            <Reveal key={store.city} delay={i * 120}>
              <StoreGate store={store} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function StoreGate({ store }: { store: Store }) {
  return (
              <article className="store-gate is-lit">
                <span className="store-gate-beam" aria-hidden />
                <span className="niche-spot" aria-hidden />
                <div className="relative z-[2] flex h-full flex-col items-center px-7 pb-8 pt-[28%] text-center md:px-8">
                  <p className="eyebrow text-[11px]">SURY</p>
                  <h3 className="mt-2 text-3xl font-light md:text-4xl">{store.city}</h3>
                  <span aria-hidden className="my-6 block h-px w-10 bg-accent" />
                  <p className="flex items-center gap-2 text-[15px]">
                    <IconPin className="size-4 text-muted" />
                    {store.address}
                  </p>
                  <Hours store={store} className="mt-4 text-[15px]" />
                  <a href={telLink(store.phone)} dir="ltr" className="mt-3 text-[15px] hover:text-primary">{store.phone}</a>
                  <Actions store={store} className="mt-auto w-full pt-8" />
                </div>
              </article>
  );
}
