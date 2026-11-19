import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { IconWhatsapp } from "../components/Icons";
import { getProduct, site } from "../services/contentState";
import { imgSmUrl, imgUrl, srcSet } from "../lib/media";
import { telLink, whatsappLink } from "../lib/links";
import type { Category, Product as ProductT, Subcategory } from "../models/content";
import { usePageTitle } from "../lib/usePageTitle";
import { NotFound } from "./NotFound";

/*
 * Product page: the photo stands in a lit plaster gate, the details hang beside it
 * on a couture hang-tag (name, details, stores to try it on, WhatsApp).
 */
type Data = { category: Category; sub: Subcategory; product: ProductT };

export function Product() {
  const { sku } = useParams({ from: "/product/$sku" });
  const found = getProduct(sku);
  usePageTitle(found?.product.name);
  if (!found) return <NotFound />;
  return <Label {...found} />;
}

/* ---------- shared ---------- */
function Crumbs({ category, sub, className = "" }: { category: Category; sub: Subcategory; className?: string }) {
  return (
    <nav aria-label="פירורי לחם" className={`text-sm ${className}`}>
      <ol className="flex flex-wrap items-center gap-2">
        <li><Link to="/" className="opacity-70 hover:opacity-100">דף הבית</Link></li>
        <li aria-hidden className="opacity-50">›</li>
        <li><Link to="/collection/$category" params={{ category: category.slug }} className="opacity-70 hover:opacity-100">{category.shortName}</Link></li>
        <li aria-hidden className="opacity-50">›</li>
        <li><Link to="/collection/$category" params={{ category: category.slug }} hash={sub.slug} className="opacity-70 hover:opacity-100">{sub.name}</Link></li>
      </ol>
    </nav>
  );
}

const waHref = (p: ProductT) => whatsappLink(`שלום SURY, אשמח לפרטים על: ${p.name}`);

/* ---------- the label ---------- */
function Label({ category, sub, product }: Data) {
  const [active, setActive] = useState(0);
  const img = product.images[active] ?? product.images[0];
  return (
    <div className="pp-label-page niches-wall">
      <div className="container-x pb-20 pt-6 md:pt-8">
        <Crumbs category={category} sub={sub} className="text-muted" />
        <div className="mt-6 grid items-start gap-10 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-14">
          <div className="md:sticky md:top-28 md:flex md:items-center md:gap-5">
            {/* the photo stands in a lit plaster gate, like the brand worlds */}
            <div className="pp-label-gate is-lit md:min-w-0 md:flex-1">
              <span className="niche-spot" aria-hidden />
              <span className="pp-label-beam" aria-hidden />
              <div className="pp-label-photo">
                {product.images.length > 1 && (
                  <>
                    <button type="button" className="pp-arrow right-3" aria-label="התמונה הקודמת" onClick={() => setActive((active - 1 + product.images.length) % product.images.length)}>›</button>
                    <button type="button" className="pp-arrow left-3" aria-label="התמונה הבאה" onClick={() => setActive((active + 1) % product.images.length)}>‹</button>
                  </>
                )}
                <img key={img.src} src={imgUrl(img.src)} srcSet={srcSet(img)} sizes="(min-width: 768px) 50vw, 100vw" alt={img.alt} className="animate-[fadeIn_0.7s_var(--ease-soft)_both]" />
              </div>
            </div>
            {product.images.length > 1 && (
              <div className="mt-6 md:order-last md:mt-0 md:shrink-0">
                <ul className="flex justify-center gap-4 md:flex-col md:gap-3" aria-label="תמונות המוצר">
                  {product.images.map((im, i) => (
                    <li key={im.src}>
                      <button type="button" onClick={() => setActive(i)} aria-label={`תמונה ${i + 1}`} aria-current={i === active} className={`pp-angle ${i === active ? "is-active" : ""}`}>
                        <img src={imgSmUrl(im.src)} alt="" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {/* the hang-tag */}
          <div className="relative pt-10 md:pt-14">
            <span className="pp-hook" aria-hidden />
            <svg className="pp-cord" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
              <path d="M2 2 C45 22 32 42 9 60" />
            </svg>
            <article className="pp-tag">
              <span className="pp-tag-eyelet" aria-hidden />
              <p className="latin text-center text-sm tracking-[0.3em] text-gold-deep">SURY</p>
              <p className="mt-1 text-center text-xs text-muted">{category.shortName}</p>
              <span aria-hidden className="gold-rule mx-auto my-5" />
              <p className="kicker text-center">{sub.name}</p>
              <h1 className="mt-2 text-center text-3xl font-light leading-tight md:text-4xl">{product.name}</h1>
              {product.description && <p className="mt-5 text-center leading-relaxed">{product.description}</p>}
              <dl className="pp-tag-specs mt-7">
                {product.details && (
                  <>
                    <dt>פרטים</dt>
                    <dd className="whitespace-pre-line">{product.details}</dd>
                  </>
                )}
                <dt>עולם</dt>
                <dd><Link to="/collection/$category" params={{ category: category.slug }} className="link-underline text-ink">{category.name}</Link></dd>
                <dt>למדידה</dt>
                <dd>{site.stores.filter((s) => !s.wholesale).map((s) => s.city).join(" · ")}</dd>
              </dl>
              <a href={waHref(product)} target="_blank" rel="noopener noreferrer" className="btn btn-wide btn-primary mt-8 w-full whitespace-nowrap px-4 text-[15px] sm:text-base">
                <IconWhatsapp className="size-5 shrink-0" />
                <span className="sm:hidden">לפרטים בוואטסאפ</span>
                <span className="hidden sm:inline">לפרטים והזמנה בוואטסאפ</span>
              </a>
              <p className="mt-3 text-center text-sm text-muted">
                או בטלפון <a href={telLink(site.settings.phone)} dir="ltr" className="text-ink">{site.settings.phone}</a>
              </p>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
