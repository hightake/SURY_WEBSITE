import { Link } from "@tanstack/react-router";
import { imgSmUrl } from "../lib/media";
import type { Product } from "../models/content";

export function ProductCard({ product, label }: { product: Product; label?: string }) {
  const img = product.images[0];
  return (
    <Link to="/product/$sku" params={{ sku: product.slug }} className="group block">
      <div className="relative aspect-[4/5] overflow-hidden bg-surface">
        {img && (
          <img
            src={imgSmUrl(img.src)}
            alt={img.alt}
            loading="lazy"
            decoding="async"
            className="size-full object-cover transition-transform duration-[1.2s] ease-[var(--ease-soft)] group-hover:scale-[1.04]"
          />
        )}
      </div>
      <div className="pt-4">
        {label && <p className="mb-1 text-xs tracking-wide text-muted">{label}</p>}
        <h3 className="text-[15px] font-normal leading-snug md:text-base">{product.name}</h3>
      </div>
    </Link>
  );
}
