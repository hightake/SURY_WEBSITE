/*
 * Catalogue controller: every change to categories and products.
 * Pure functions that mutate a draft SiteData (the admin store clones it first).
 */
import type { Product, SiteData, Subcategory } from "../models/content";

export type ProductRef = { cat: string; slug: string };

export function findSub(d: SiteData, cat: string, sub: string): Subcategory | undefined {
  return d.categories.find((c) => c.slug === cat)?.subcategories.find((s) => s.slug === sub);
}

export function findProduct(d: SiteData, ref: ProductRef) {
  const category = d.categories.find((c) => c.slug === ref.cat);
  for (const sub of category?.subcategories ?? []) {
    const product = sub.products.find((p) => p.slug === ref.slug);
    if (product && category) return { category, sub, product };
  }
  return undefined;
}

export function listProducts(d: SiteData, filter: { cat?: string; q?: string; featuredOnly?: boolean } = {}) {
  return d.categories.flatMap((c) =>
    c.subcategories.flatMap((s) => s.products.map((p) => ({ c, s, p }))),
  ).filter(({ c, p }) => (!filter.cat || c.slug === filter.cat) && (!filter.q || p.name.includes(filter.q)) && (!filter.featuredOnly || p.featured));
}

/** New products start hidden, so a half-filled product never shows on the site. */
export function addProduct(d: SiteData, cat: string, sub?: string): ProductRef {
  const category = d.categories.find((c) => c.slug === cat) ?? d.categories[0];
  const target = (sub && category.subcategories.find((s) => s.slug === sub)) || category.subcategories[0];
  const slug = `p-${Date.now().toString(36)}`;
  target.products.push({ slug, name: "מוצר חדש", images: [], description: "", details: "", order: target.products.length + 1, visible: false, featured: false, price: null });
  return { cat: category.slug, slug };
}

export function updateProduct(d: SiteData, ref: ProductRef, fn: (p: Product) => void) {
  const found = findProduct(d, ref);
  if (found) fn(found.product);
}

export function moveProduct(d: SiteData, ref: ProductRef, toCat: string, toSub: string): ProductRef {
  const found = findProduct(d, ref);
  const to = findSub(d, toCat, toSub);
  if (!found || !to || found.sub === to) return ref;
  found.sub.products = found.sub.products.filter((p) => p !== found.product);
  found.product.order = to.products.length + 1;
  to.products.push(found.product);
  return { cat: toCat, slug: ref.slug };
}

export function deleteProduct(d: SiteData, ref: ProductRef) {
  const found = findProduct(d, ref);
  if (found) found.sub.products = found.sub.products.filter((p) => p !== found.product);
}

export function setPrice(p: Product, raw: string) {
  const n = Number(raw.replace(/[^\d.]/g, ""));
  p.price = raw.trim() === "" || Number.isNaN(n) ? null : n;
}

export function catalogStats(d: SiteData) {
  const all = d.categories.flatMap((c) => c.subcategories.flatMap((s) => s.products));
  return { total: all.length, featured: all.filter((p) => p.featured).length, hidden: all.filter((p) => !p.visible).length };
}
