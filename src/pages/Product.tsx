import { Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { IconWhatsapp } from "../components/Icons";
import { getProduct, imgSmUrl, imgUrl, srcSet, whatsappLink } from "../lib/content";
import { usePageTitle } from "../lib/usePageTitle";
import { NotFound } from "./NotFound";

export function Product() {
  const { category: catSlug, product: productSlug } = useParams({ from: "/collection/$category/$product" });
  const found = getProduct(catSlug, productSlug);
  usePageTitle(found?.product.name);
  const [active, setActive] = useState(0);
  if (!found) return <NotFound />;
  const { category, sub, product } = found;
  const img = product.images[active] ?? product.images[0];

  return (
    <div className="container-x py-8 md:py-14">
      <nav aria-label="פירורי לחם" className="mb-8 text-sm text-muted">
        <ol className="flex flex-wrap items-center gap-2">
          <li><Link to="/" className="hover:text-ink">דף הבית</Link></li>
          <li aria-hidden>/</li>
          <li><Link to="/collection/$category" params={{ category: category.slug }} className="hover:text-ink">{category.name}</Link></li>
          <li aria-hidden>/</li>
          <li><Link to="/collection/$category" params={{ category: category.slug }} hash={sub.slug} className="hover:text-ink">{sub.name}</Link></li>
        </ol>
      </nav>

      <div className="grid gap-10 md:grid-cols-[1.15fr_1fr] lg:gap-20">
        {/* Gallery */}
        <div className="md:sticky md:top-28 md:self-start">
          <div className="bg-surface">
            {img && (
              <img
                key={img.src}
                src={imgUrl(img.src)}
                srcSet={srcSet(img)}
                sizes="(min-width: 768px) 55vw, 100vw"
                alt={img.alt}
                className="mx-auto max-h-[78svh] w-full animate-[fadeIn_0.6s_var(--ease-soft)_both] object-contain"
              />
            )}
          </div>
          {product.images.length > 1 && (
            <ul className="mt-3 flex gap-3" aria-label="תמונות נוספות">
              {product.images.map((im, i) => (
                <li key={im.src}>
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`תמונה ${i + 1}`}
                    aria-current={i === active}
                    className={`block size-20 overflow-hidden bg-surface ring-offset-2 ring-offset-bg transition md:size-24 ${i === active ? "ring-1 ring-ink" : "opacity-70 hover:opacity-100"}`}
                  >
                    <img src={imgSmUrl(im.src)} alt="" className="size-full object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Details */}
        <div className="md:pt-6">
          <p className="eyebrow">{category.shortName} · {sub.name}</p>
          <h1 className="mt-4 text-3xl font-light leading-tight md:text-5xl">{product.name}</h1>
          <span aria-hidden className="mt-6 block h-px w-12 bg-accent" />
          {product.description && <p className="mt-6 text-lg leading-relaxed">{product.description}</p>}
          {product.details && (
            <div className="mt-8 border-t border-shade/70 pt-6">
              <h2 className="mb-2 text-sm font-medium">פרטים</h2>
              <p className="whitespace-pre-line leading-relaxed text-muted">{product.details}</p>
            </div>
          )}
          <a
            href={whatsappLink(`שלום SURY, אשמח לפרטים על: ${product.name}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary mt-10 w-full sm:w-auto sm:px-12"
          >
            <IconWhatsapp />
            לפרטים בוואטסאפ
          </a>
          <p className="mt-4 text-sm text-muted">אפשר גם לבוא למדוד באחת החנויות שלנו.</p>
          <Link to="/stores" className="link-underline mt-1 inline-block text-sm text-primary">לחנויות</Link>
        </div>
      </div>
    </div>
  );
}
