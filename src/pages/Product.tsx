import { Link, useParams } from "@tanstack/react-router";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { IconWhatsapp } from "../components/Icons";
import { getProduct, site } from "../services/contentState";
import { imgSmUrl, imgUrl, srcSet } from "../lib/media";
import { telLink, whatsappLink } from "../lib/links";
import type { Category, Product as ProductT, Subcategory } from "../models/content";
import { usePageTitle } from "../lib/usePageTitle";
import { NotFound } from "./NotFound";

/*
 * Product page.
 * DEMO: three structural directions, picked with ?pp=a|b|c
 *   a – atmosphere: the page takes the product's own colour; the photo floats over a
 *       soft blur of itself, the name is set huge across it, details on a card below
 *   b – the label: a large photo beside a couture hang-tag (gold eyelet and cord)
 *       that carries the name, details and the WhatsApp button
 *   c – lookbook: tall photos side by side across the screen, the name runs vertically,
 *       and a slim bar with the name and WhatsApp stays at the bottom
 * Once one is chosen the other two are removed.
 */
type Variant = "a" | "b" | "c";
type Data = { category: Category; sub: Subcategory; product: ProductT };

function useVariant(): Variant {
  const [v, setV] = useState<Variant>("b");
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("pp");
    if (q === "a" || q === "c") setV(q);
  }, []);
  return v;
}

export function Product() {
  const { category: catSlug, product: productSlug } = useParams({ from: "/collection/$category/$product" });
  const found = getProduct(catSlug, productSlug);
  usePageTitle(found?.product.name);
  const v = useVariant();
  if (!found) return <NotFound />;
  if (v === "b") return <Label {...found} />;
  if (v === "c") return <Lookbook {...found} />;
  return <Atmosphere {...found} />;
}

/* ---------- shared ---------- */
const toneVars = (p: ProductT): CSSProperties =>
  ({ ["--t-soft" as string]: p.tone?.soft ?? "#efe4d6", ["--t-mid" as string]: p.tone?.mid ?? "#dcc8b0", ["--t-deep" as string]: p.tone?.deep ?? "#4e0c10" }) as CSSProperties;

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

function StoresList() {
  return (
    <ul className="space-y-2 text-[15px]">
      {site.stores.filter((s) => !s.wholesale).map((s) => (
        <li key={s.city} className="flex justify-between gap-4">
          <span className="font-medium">{s.city}</span>
          <span className="opacity-70">{s.address}</span>
        </li>
      ))}
    </ul>
  );
}

function Thumbs({ product, active, onPick, className = "" }: { product: ProductT; active: number; onPick: (i: number) => void; className?: string }) {
  if (product.images.length < 2) return null;
  return (
    <ul className={`flex gap-3 ${className}`} aria-label="תמונות המוצר">
      {product.images.map((im, i) => (
        <li key={im.src}>
          <button type="button" onClick={() => onPick(i)} aria-label={`תמונה ${i + 1}`} aria-current={i === active} className={`pd-thumb !w-16 ${i === active ? "is-active" : ""}`}>
            <img src={imgSmUrl(im.src)} alt="" />
          </button>
        </li>
      ))}
    </ul>
  );
}

/* ---------- a – atmosphere ---------- */
function Atmosphere({ category, sub, product }: Data) {
  const [active, setActive] = useState(0);
  const img = product.images[active] ?? product.images[0];
  return (
    <div className="pp-atmo" style={toneVars(product)}>
      <section className="relative overflow-hidden">
        <img aria-hidden src={imgSmUrl(img.src)} alt="" className="pp-atmo-blur" />
        <div className="container-x relative pb-10 pt-6 md:pt-8">
          <Crumbs category={category} sub={sub} className="text-[color:var(--t-deep)]" />
          <div className="relative mt-6 grid place-items-center md:mt-4">
            <img key={img.src} src={imgUrl(img.src)} srcSet={srcSet(img)} sizes="(min-width: 768px) 480px, 82vw" alt={img.alt} className="pp-atmo-photo animate-[fadeIn_0.7s_var(--ease-soft)_both]" />
            <h1 className="pp-atmo-title">{product.name}</h1>
          </div>
          <Thumbs product={product} active={active} onPick={setActive} className="mt-6 justify-center" />
        </div>
      </section>
      <section className="container-x relative -mt-2 pb-20">
        <div className="pp-atmo-card mx-auto grid max-w-4xl gap-8 md:grid-cols-[1.2fr_1fr] md:gap-12">
          <div>
            <Link to="/collection/$category" params={{ category: category.slug }} hash={sub.slug} className="kicker !text-[color:var(--t-deep)]">{category.shortName} · {sub.name}</Link>
            {product.description && <p className="mt-4 text-xl font-light leading-relaxed">{product.description}</p>}
            {product.details && <p className="mt-4 whitespace-pre-line leading-relaxed text-muted">{product.details}</p>}
            <div className="mt-7 border-t border-[color:var(--t-mid)] pt-5">
              <p className="mb-3 text-sm font-medium">איפה אפשר למדוד</p>
              <StoresList />
            </div>
          </div>
          <div className="flex flex-col justify-center md:border-s md:border-[color:var(--t-mid)] md:ps-10">
            <a href={waHref(product)} target="_blank" rel="noopener noreferrer" className="pp-atmo-cta">
              <IconWhatsapp />
              לפרטים והזמנה בוואטסאפ
            </a>
            <p className="mt-3 text-center text-sm text-muted">
              או בטלפון <a href={telLink(site.settings.phone)} dir="ltr" className="text-ink">{site.settings.phone}</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ---------- b – the label ---------- */
function Label({ category, sub, product }: Data) {
  const [active, setActive] = useState(0);
  const img = product.images[active] ?? product.images[0];
  return (
    <div className="pp-label-page niches-wall" style={toneVars(product)}>
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

/* ---------- c – lookbook ---------- */
function Lookbook({ category, sub, product }: Data) {
  const strip = useRef<HTMLDivElement>(null);
  return (
    <div className="pp-look" style={toneVars(product)}>
      <div className="container-x flex items-end justify-between gap-6 pb-6 pt-6 md:pt-8">
        <Crumbs category={category} sub={sub} className="text-muted" />
        <p className="kicker hidden md:block">{category.shortName} · {sub.name}</p>
      </div>
      <div className="pp-look-row">
        <h1 className="pp-look-title"><span>{product.name}</span></h1>
        <div ref={strip} className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto ps-5 md:ps-0">
          {product.images.map((im, i) => (
            <img key={im.src} src={imgUrl(im.src)} srcSet={srcSet(im)} sizes="(min-width: 768px) 34vw, 78vw" alt={im.alt} loading={i ? "lazy" : "eager"} className="pp-look-frame" />
          ))}
          {/* a colour panel taken from the photo, carrying the description */}
          <div className="pp-look-panel">
            <p className="kicker !text-[color:var(--t-soft)]">{sub.name}</p>
            {product.description && <p className="mt-4 text-2xl font-extralight leading-snug md:text-3xl">{product.description}</p>}
            <span aria-hidden className="mt-8 block h-px w-16 bg-accent" />
          </div>
          <span className="w-5 shrink-0 md:w-10" aria-hidden />
        </div>
      </div>
      <div className="container-x grid gap-10 pb-32 pt-12 md:grid-cols-3 md:gap-14 md:pb-36">
        <div className="md:col-span-2">
          <h2 className="text-3xl font-light md:hidden">{product.name}</h2>
          {product.details && <p className="mt-4 whitespace-pre-line leading-relaxed text-muted md:mt-0 md:text-lg">{product.details}</p>}
        </div>
        <div>
          <p className="mb-3 text-sm font-medium">איפה אפשר למדוד</p>
          <StoresList />
        </div>
      </div>
      {/* slim bar that stays at the bottom */}
      <div className="pp-look-bar">
        <div className="container-x flex items-center justify-between gap-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-base font-medium md:text-lg">{product.name}</p>
            <p className="hidden text-xs text-bg/70 md:block">{category.shortName} · {sub.name}</p>
          </div>
          <a href={waHref(product)} target="_blank" rel="noopener noreferrer" className="pp-look-cta">
            <IconWhatsapp />
            <span>לפרטים בוואטסאפ</span>
          </a>
        </div>
      </div>
    </div>
  );
}
