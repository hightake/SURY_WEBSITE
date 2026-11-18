/*
 * Catalogue controller: every change to categories and products.
 * Pure functions that mutate a draft SiteData (the admin store clones it first).
 */
import { nextNumber } from "../data/migrations";
import type { Product, SiteData, Subcategory } from "../models/content";
import { moveItem } from "../lib/list";

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

export class CatalogError extends Error {}

/**
 * New products start hidden, so a half-filled product never shows on the site.
 * The page link is a running number (1001, 1002…) – it never changes, even if the name does.
 */
export function addProduct(d: SiteData, cat: string, sub?: string): ProductRef {
  const category = d.categories.find((c) => c.slug === cat) ?? d.categories[0];
  const target = (sub && category.subcategories.find((s) => s.slug === sub)) || category.subcategories[0];
  if (!target) throw new CatalogError("בעולם הזה עוד אין תתי־קטגוריות – הוסיפי אחת בלשונית ״קטגוריות״");
  const slug = String(nextNumber(d));
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

// ---------- sub-categories ----------

/** Link-safe id for a new sub-category; never changes afterwards. */
const subSlug = (cat: { subcategories: Subcategory[] }) => {
  let n = cat.subcategories.length + 1;
  while (cat.subcategories.some((s) => s.slug === `sub-${n}`)) n++;
  return `sub-${n}`;
};

export function addSubcategory(d: SiteData, cat: string, name: string) {
  const c = d.categories.find((x) => x.slug === cat);
  const clean = name.trim();
  if (!c) return;
  if (!clean) throw new CatalogError("נא לכתוב שם לתת־הקטגוריה");
  if (c.subcategories.some((s) => s.name === clean)) throw new CatalogError("כבר יש תת־קטגוריה בשם הזה");
  c.subcategories.push({ slug: subSlug(c), name: clean, order: c.subcategories.length + 1, products: [] });
}

export function renameSubcategory(d: SiteData, cat: string, sub: string, name: string) {
  const s = findSub(d, cat, sub);
  if (s) s.name = name;
}

export function moveSubcategory(d: SiteData, cat: string, i: number, dir: -1 | 1) {
  const c = d.categories.find((x) => x.slug === cat);
  if (!c) return;
  const subs = [...c.subcategories].sort((a, b) => a.order - b.order);
  moveItem(subs, i, dir);
  subs.forEach((s, k) => (s.order = k + 1));
  c.subcategories = subs;
}

/** A sub-category with products can't be removed – move or delete them first. */
export function removeSubcategory(d: SiteData, cat: string, sub: string) {
  const c = d.categories.find((x) => x.slug === cat);
  const s = c?.subcategories.find((x) => x.slug === sub);
  if (!c || !s) return;
  if (s.products.length) throw new CatalogError(`ב״${s.name}״ יש ${s.products.length} מוצרים – העבירי אותם לתת־קטגוריה אחרת או מחקי אותם קודם`);
  c.subcategories = c.subcategories.filter((x) => x !== s);
  c.subcategories.forEach((x, k) => (x.order = k + 1));
}
