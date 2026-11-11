import { navLink, telLink, type Store } from "../lib/content";
import { IconClock, IconPhone, IconPin } from "./Icons";

export function StoreCard({ store, index }: { store: Store; index: number }) {
  return (
    <article className="flex h-full flex-col border border-shade/80 bg-bg/60 p-7 md:p-9">
      <p className="latin text-sm text-accent">{String(index + 1).padStart(2, "0")}</p>
      <h3 className="mt-2 text-2xl font-light md:text-3xl">{store.city}</h3>
      <span aria-hidden className="my-6 block h-px w-10 bg-accent" />
      <ul className="flex-1 space-y-4 text-[15px]">
        <li className="flex gap-3">
          <IconPin className="mt-0.5 size-5 shrink-0 text-muted" />
          {store.address}
        </li>
        <li className="flex gap-3">
          <IconClock className="mt-0.5 size-5 shrink-0 text-muted" />
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            {store.hours.map(([days, time]) => (
              <div key={days} className="contents">
                <dt className="text-muted">{days}</dt>
                <dd dir="ltr" className="text-end md:text-start">{time}</dd>
              </div>
            ))}
          </dl>
        </li>
        <li className="flex gap-3">
          <IconPhone className="mt-0.5 size-5 shrink-0 text-muted" />
          <a href={telLink(store.phone)} dir="ltr">{store.phone}</a>
        </li>
      </ul>
      <div className="mt-8 flex flex-wrap gap-3">
        <a href={navLink(store.navQuery)} target="_blank" rel="noopener noreferrer" className="btn btn-primary flex-1">
          ניווט לחנות
        </a>
        <a href={telLink(store.phone)} className="btn btn-outline flex-1">
          חיוג
        </a>
      </div>
    </article>
  );
}
