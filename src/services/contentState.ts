/*
 * Read model for the public site: the current content plus derived views
 * (sorted categories, visible products, featured items). Live bindings –
 * applyContent() refreshes them for every importer.
 */
import type { Category, FeaturedItem, Img, SiteData } from "../models/content";
import { seedContent } from "../data/seed";
import { registerSmall } from "../lib/media";

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export let site: SiteData = seedContent;
export let categories: Category[] = [];
export let featured: FeaturedItem[] = [];

export function applyContent(next: SiteData) {
  site = next;
  forEachImage(next, registerSmall);
  categories = [...next.categories].sort(byOrder).map((c) => ({
    ...c,
    subcategories: [...c.subcategories].sort(byOrder).map((s) => ({ ...s, products: s.products.filter((p) => p.visible).sort(byOrder) })),
  }));
  featured = categories.flatMap((category) =>
    category.subcategories.flatMap((sub) => sub.products.filter((p) => p.featured).map((product) => ({ category, sub, product }))),
  );
}
applyContent(seedContent);

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

/** Find a product by its SKU (unique across the site), with its current category and sub-category. */
export function getProduct(sku: string) {
  for (const category of categories)
    for (const sub of category.subcategories) {
      const product = sub.products.find((p) => p.slug === sku);
      if (product) return { category, sub, product };
    }
  return undefined;
}

function forEachImage(v: unknown, fn: (img: Img) => void): void {
  if (Array.isArray(v)) v.forEach((x) => forEachImage(x, fn));
  else if (v && typeof v === "object") {
    const o = v as Record<string, unknown>;
    if (typeof o.src === "string" && typeof o.w === "number") fn(o as unknown as Img);
    Object.values(o).forEach((x) => forEachImage(x, fn));
  }
}
