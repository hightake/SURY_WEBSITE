import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { IconWhatsapp } from "../components/Icons";
import { getProduct, imgSmUrl, imgUrl, site, srcSet, whatsappLink, type Category, type Product as ProductT, type Subcategory } from "../lib/content";
import { usePageTitle } from "../lib/usePageTitle";
import { NotFound } from "./NotFound";

/*
 * Product page.
 * DEMO: three directions, picked with ?pp=a|b|c
 *   a – boutique display: the photo in a lit plaster niche, details on a framed card
 *   b – editorial: photos stacked full height, details pinned beside them
 *   c – centred showcase: name between gold hairlines, photo in a gold arch, details below
 * Once one is chosen the other two are removed.
 */
type Variant = "a" | "b" | "c";
type Data = { category: Category; sub: Subcategory; product: ProductT };

function useVariant(): Variant {
  const [v, setV] = useState<Variant>("a");
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("pp");
    if (q === "b" || q === "c") setV(q);
  }, []);
  return v;
}

export function Product() {
  const { category: catSlug, product: productSlug } = useParams({ from: "/collection/$category/$product" });
  const found = getProduct(catSlug, productSlug);
  usePageTitle(found?.product.name);
  const v = useVariant();
  if (!found) return <NotFound />;
  if (v === "b") return <Editorial {...found} />;
  if (v === "c") return <Showcase {...found} />;
  return <Boutique {...found} />;
}

/* ---------- shared bits ---------- */
function Crumbs({ category, sub, className = "" }: { category: Category; sub: Subcategory; className?: string }) {
  return (
    <nav aria-label="פירורי לחם" className={`text-sm text-muted ${className}`}>
      <ol className="flex flex-wrap items-center gap-2">
        <li><Link to="/" className="hover:text-ink">דף הבית</Link></li>
        <li aria-hidden className="text-accent">◆</li>
        <li><Link to="/collection/$category" params={{ category: category.slug }} className="hover:text-ink">{category.shortName}</Link></li>
        <li aria-hidden className="text-accent">◆</li>
        <li><Link to="/collection/$category" params={{ category: category.slug }} hash={sub.slug} className="hover:text-ink">{sub.name}</Link></li>
      </ol>
    </nav>
  );
}

function WhatsAppCta({ product, className = "" }: { product: ProductT; className?: string }) {
  return (
    <a href={whatsappLink(`שלום SURY, אשמח לפרטים על: ${product.name}`)} target="_blank" rel="noopener noreferrer" className={`btn btn-wide btn-primary ${className}`}>
      <IconWhatsapp />
      לפרטים בוואטסאפ
    </a>
  );
}

/** Where to try it on – the stores as small links */
function TryOn({ className = "" }: { className?: string }) {
  const stores = site.stores.filter((s) => !s.wholesale);
  return (
    <div className={className}>
      <p className="text-sm text-muted">בואי למדוד באחת החנויות:</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        {stores.map((s) => (
          <li key={s.city}>
            <Link to="/stores" className="inline-block rounded-full border border-accent/60 px-4 py-1.5 text-sm transition-colors hover:bg-accent/15">
              {s.city}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function useGallery(product: ProductT) {
  const [active, setActive] = useState(0);
  return { active, setActive, img: product.images[active] ?? product.images[0] };
}

/* ---------- a – boutique display ---------- */
function Boutique({ category, sub, product }: Data) {
  const { active, setActive, img } = useGallery(product);
  return (
    <div className="niches-wall">
      <div className="container-x py-8 md:py-12">
        <Crumbs category={category} sub={sub} className="mb-8" />
        <div className="grid items-start gap-10 md:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div className="md:sticky md:top-28">
            <div className="pp-niche is-lit">
              <span className="niche-spot" aria-hidden />
              <span className="pp-niche-beam" aria-hidden />
              <div className="pp-niche-photo">
                {img && <img key={img.src} src={imgUrl(img.src)} srcSet={srcSet(img)} sizes="(min-width: 768px) 50vw, 100vw" alt={img.alt} className="animate-[fadeIn_0.6s_var(--ease-soft)_both]" />}
              </div>
            </div>
            {product.images.length > 1 && (
              <ul className="mt-5 flex justify-center gap-3" aria-label="תמונות נוספות">
                {product.images.map((im, i) => (
                  <li key={im.src}>
                    <button type="button" onClick={() => setActive(i)} aria-label={`תמונה ${i + 1}`} aria-current={i === active} className={`pp-thumb ${i === active ? "is-active" : ""}`}>
                      <img src={imgSmUrl(im.src)} alt="" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="pp-card">
            <p className="kicker">{category.shortName} · {sub.name}</p>
            <h1 className="mt-3 text-4xl font-light leading-tight md:text-5xl">{product.name}</h1>
            <span aria-hidden className="gold-rule mt-6" />
            {product.description && <p className="mt-6 text-lg leading-relaxed">{product.description}</p>}
            {product.details && (
              <details className="pp-details mt-8" open>
                <summary>פרטים, חומר והוראות טיפול</summary>
                <p className="whitespace-pre-line pt-3 leading-relaxed text-muted">{product.details}</p>
              </details>
            )}
            <WhatsAppCta product={product} className="mt-8 w-full" />
            <TryOn className="mt-8 border-t border-accent/30 pt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- b – editorial ---------- */
function Editorial({ category, sub, product }: Data) {
  return (
    <div className="grid md:grid-cols-[1.15fr_0.85fr]">
      {/* photos – stacked, full height (left in RTL) */}
      <div className="order-2 md:order-2">
        {product.images.map((im, i) => (
          <img key={im.src} src={imgUrl(im.src)} srcSet={srcSet(im)} sizes="(min-width: 768px) 58vw, 100vw" alt={im.alt} loading={i ? "lazy" : "eager"} className="block max-h-[92svh] w-full bg-surface object-cover md:h-[calc(100svh-5rem)] md:max-h-none" />
        ))}
      </div>
      <div className="order-1 border-accent/40 md:order-1 md:border-s">
        <div className="px-5 py-10 md:sticky md:top-20 md:px-12 md:py-16 lg:px-16">
          <Crumbs category={category} sub={sub} />
          <p className="kicker mt-10">{sub.name}</p>
          <h1 className="mt-3 text-4xl font-extralight leading-[1.05] md:text-6xl">{product.name}</h1>
          <span aria-hidden className="mt-8 block h-px w-full bg-gradient-to-l from-accent to-transparent" />
          {product.description && <p className="mt-8 text-lg font-light leading-relaxed md:text-xl">{product.description}</p>}
          {product.details && (
            <dl className="mt-8 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-[15px]">
              <dt className="kicker">פרטים</dt>
              <dd className="whitespace-pre-line text-muted">{product.details}</dd>
              <dt className="kicker">עולם</dt>
              <dd><Link to="/collection/$category" params={{ category: category.slug }} className="link-underline">{category.name}</Link></dd>
            </dl>
          )}
          <WhatsAppCta product={product} className="mt-10 w-full" />
          <TryOn className="mt-8" />
          {product.images.length > 1 && <p className="mt-10 text-sm text-muted">↓ גללי לעוד {product.images.length - 1} תמונות</p>}
        </div>
      </div>
    </div>
  );
}

/* ---------- c – centred showcase ---------- */
function Showcase({ category, sub, product }: Data) {
  const { active, setActive, img } = useGallery(product);
  return (
    <div className="ch-monument">
      <div className="container-x py-10 text-center md:py-14">
        <Crumbs category={category} sub={sub} className="flex justify-center" />
        <p className="kicker mt-10">{category.shortName}</p>
        <div className="ch-hairlines mt-3">
          <h1 className="text-4xl font-extralight leading-tight md:text-6xl">{product.name}</h1>
        </div>
        <div className="relative mx-auto mt-12 w-full max-w-[520px]">
          <div aria-hidden className="cat-frame" />
          <div className="arch relative aspect-[4/5] bg-surface">
            {img && <img key={img.src} src={imgUrl(img.src)} srcSet={srcSet(img)} sizes="520px" alt={img.alt} className="size-full animate-[fadeIn_0.6s_var(--ease-soft)_both] object-cover" />}
          </div>
        </div>
        {product.images.length > 1 && (
          <ul className="mt-6 flex justify-center gap-3" aria-label="תמונות נוספות">
            {product.images.map((im, i) => (
              <li key={im.src}>
                <button type="button" onClick={() => setActive(i)} aria-label={`תמונה ${i + 1}`} aria-current={i === active} className={`pp-thumb ${i === active ? "is-active" : ""}`}>
                  <img src={imgSmUrl(im.src)} alt="" />
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mx-auto mt-12 grid max-w-4xl gap-10 text-start md:grid-cols-2">
          <div>
            {product.description && <p className="text-xl font-light leading-relaxed">{product.description}</p>}
            {product.details && <p className="mt-5 whitespace-pre-line leading-relaxed text-muted">{product.details}</p>}
          </div>
          <div className="md:border-s md:border-accent/40 md:ps-10">
            <WhatsAppCta product={product} className="w-full" />
            <TryOn className="mt-7" />
          </div>
        </div>
      </div>
    </div>
  );
}
