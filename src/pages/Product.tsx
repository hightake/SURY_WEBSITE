import { Link, useParams } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { IconWhatsapp } from "../components/Icons";
import { getProduct, imgSmUrl, imgUrl, site, srcSet, telLink, whatsappLink } from "../lib/content";
import { usePageTitle } from "../lib/usePageTitle";
import { NotFound } from "./NotFound";

/* Product page – clean and product-first: a large gallery and a short details column. */
export function Product() {
  const { category: catSlug, product: productSlug } = useParams({ from: "/collection/$category/$product" });
  const found = getProduct(catSlug, productSlug);
  usePageTitle(found?.product.name);
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  if (!found) return <NotFound />;
  const { category, sub, product } = found;
  const images = product.images;
  const stores = site.stores.filter((s) => !s.wholesale);

  const show = (i: number) => {
    setActive(i);
    const el = track.current?.children[i] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  };
  // keep the active dot in sync when swiping on mobile
  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const i = Math.round(Math.abs(el.scrollLeft) / el.clientWidth);
    if (i !== active) setActive(i);
  };

  return (
    <div className="container-x pb-16 pt-6 md:pb-24 md:pt-10">
      <nav aria-label="פירורי לחם" className="mb-6 text-sm text-muted md:mb-8">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link to="/" className="hover:text-ink">דף הבית</Link></li>
          <li aria-hidden>›</li>
          <li><Link to="/collection/$category" params={{ category: category.slug }} className="hover:text-ink">{category.shortName}</Link></li>
          <li aria-hidden>›</li>
          <li><Link to="/collection/$category" params={{ category: category.slug }} hash={sub.slug} className="hover:text-ink">{sub.name}</Link></li>
        </ol>
      </nav>

      <div className="grid gap-8 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:gap-16">
        {/* Gallery */}
        <div className="flex gap-4 md:sticky md:top-28 md:self-start">
          {images.length > 1 && (
            <ul className="hidden w-20 shrink-0 flex-col gap-3 md:flex" aria-label="תמונות המוצר">
              {images.map((im, i) => (
                <li key={im.src}>
                  <button type="button" onClick={() => show(i)} aria-label={`תמונה ${i + 1}`} aria-current={i === active} className={`pd-thumb ${i === active ? "is-active" : ""}`}>
                    <img src={imgSmUrl(im.src)} alt="" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="min-w-0 flex-1">
            <div ref={track} onScroll={onScroll} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto bg-surface/60">
              {images.map((im, i) => (
                <img
                  key={im.src}
                  src={imgUrl(im.src)}
                  srcSet={srcSet(im)}
                  sizes="(min-width: 768px) 50vw, 100vw"
                  alt={im.alt}
                  loading={i ? "lazy" : "eager"}
                  className="aspect-[4/5] w-full shrink-0 snap-center object-cover"
                />
              ))}
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex justify-center gap-2 md:hidden" aria-hidden>
                {images.map((im, i) => (
                  <span key={im.src} className={`h-1.5 rounded-full transition-all ${i === active ? "w-6 bg-primary" : "w-1.5 bg-shade"}`} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="md:pt-2">
          <Link to="/collection/$category" params={{ category: category.slug }} hash={sub.slug} className="kicker hover:text-primary">
            {sub.name}
          </Link>
          <h1 className="mt-3 text-3xl font-light leading-tight md:text-[2.75rem]">{product.name}</h1>
          {product.description && <p className="mt-5 text-lg leading-relaxed text-ink/80">{product.description}</p>}

          <div className="mt-8 border-t border-shade pt-8">
            <a href={whatsappLink(`שלום SURY, אשמח לפרטים על: ${product.name}`)} target="_blank" rel="noopener noreferrer" className="pd-cta">
              <IconWhatsapp />
              לפרטים והזמנה בוואטסאפ
            </a>
            <p className="mt-3 text-center text-sm text-muted">
              או בטלפון{" "}
              <a href={telLink(site.settings.phone)} dir="ltr" className="text-ink hover:text-primary">{site.settings.phone}</a>
            </p>
          </div>

          <div className="mt-8 border-t border-shade">
            {product.details && (
              <details className="pd-acc" open>
                <summary>פרטי המוצר</summary>
                <p className="whitespace-pre-line pb-5 leading-relaxed text-muted">{product.details}</p>
              </details>
            )}
            <details className="pd-acc">
              <summary>איפה אפשר למדוד</summary>
              <ul className="space-y-3 pb-5 text-[15px]">
                {stores.map((s) => (
                  <li key={s.city} className="flex justify-between gap-4">
                    <span className="font-medium">{s.city}</span>
                    <span className="text-muted">{s.address}</span>
                  </li>
                ))}
                <li><Link to="/stores" className="link-underline text-sm text-primary">שעות פתיחה וניווט</Link></li>
              </ul>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
