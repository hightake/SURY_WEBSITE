// All site content lives in one object (SiteData). It is loaded through the
// backend adapter (src/lib/backend) before the app renders, and the admin
// writes back through the same adapter. The exports below are live bindings:
// applyContent() refreshes them for every importer.
import data from "../content/site.json";

/** src: a path under public/ or a data/https URL (admin uploads). sm: optional small version. */
export type Img = { src: string; w: number; h: number; alt: string; sm?: string };

export type Product = {
  slug: string;
  name: string;
  images: Img[];
  description: string;
  details: string;
  order: number;
  visible: boolean;
  featured: boolean;
  price: number | null; // optional, never displayed
  /** colours taken from the main photo, for the page atmosphere */
  tone?: { soft: string; mid: string; deep: string };
};

export type Subcategory = { slug: string; name: string; order: number; products: Product[] };

export type Category = {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  intro: string;
  order: number;
  cover: Img;
  niche: Img;
  subcategories: Subcategory[];
};

export type Store = {
  city: string;
  /** small label above the name, e.g. "חנות סיטונאית" */
  label?: string;
  wholesale?: boolean;
  address: string;
  phone: string;
  hours: [string, string][];
  navQuery: string;
};

export type HeroBanner = { image: Img; caption: string; category?: string; link?: string };

export type Role = "owner" | "editor";
export type AdminUser = { email: string; role: Role };

export type SiteData = {
  admins?: AdminUser[];
  settings: { phone: string; whatsapp: string; whatsappDisplay: string; email: string; social: { name: string; url: string }[] };
  home: {
    hero: { eyebrow: string; titleBold: string; titleLight: string; text: string; cta: string; banners: HeroBanner[] };
    worlds: { title: string; text: string };
    newCollection: { title: string; text: string };
    uniqueness: { title: string; items: { title: string; text: string }[] };
    storyTeaser: { title: string; text: string; cta: string; image: Img };
    stores: { title: string; text: string };
    contact: { title: string; text: string };
  };
  pages: {
    story: { title: string; lead: string; image: Img; paragraphs: string[] };
    privacy: { title: string };
    accessibility: { title: string };
  };
  stores: Store[];
  categories: Category[];
};

// uploaded images register their small version here so imgSmUrl(src) can find it
const smallOf = new Map<string, string>();
export const registerSmall = (img: Img) => img.sm && smallOf.set(img.src, img.sm);

export const defaultContent = data as unknown as SiteData;

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export type FeaturedItem = { category: Category; sub: Subcategory; product: Product };

export let site: SiteData = defaultContent;
export let categories: Category[] = [];
export let featured: FeaturedItem[] = [];

/** Replace the content the site renders from. */
export function applyContent(next: SiteData) {
  site = next;
  const walk = (v: unknown): void => {
    if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === "object") {
      const o = v as Record<string, unknown>;
      if (typeof o.src === "string" && typeof o.sm === "string") registerSmall(o as unknown as Img);
      Object.values(o).forEach(walk);
    }
  };
  walk(next);
  categories = [...next.categories].sort(byOrder).map((c) => ({
    ...c,
    subcategories: [...c.subcategories].sort(byOrder).map((s) => ({
      ...s,
      products: s.products.filter((p) => p.visible).sort(byOrder),
    })),
  }));
  featured = categories.flatMap((category) =>
    category.subcategories.flatMap((sub) => sub.products.filter((p) => p.featured).map((product) => ({ category, sub, product }))),
  );
}
applyContent(defaultContent);

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);

export function getProduct(catSlug: string, productSlug: string) {
  const category = getCategory(catSlug);
  if (!category) return undefined;
  for (const sub of category.subcategories) {
    const product = sub.products.find((p) => p.slug === productSlug);
    if (product) return { category, sub, product };
  }
  return undefined;
}

/** Public URL of an image, respecting the deploy base path. */
const isAbsolute = (src: string) => /^(data:|blob:|https?:)/.test(src);
export const imgUrl = (src: string) => (isAbsolute(src) ? src : `${import.meta.env.BASE_URL}${src}`);
/** Small version: bundled images have a -sm.webp sibling; uploads carry their own (or reuse the full one). */
export const imgSmUrl = (src: string) => (isAbsolute(src) ? (smallOf.get(src) ?? src) : imgUrl(src.replace(/\.webp$/, "-sm.webp")));
export const srcSet = (img: Img) => (isAbsolute(img.src) ? `${imgUrl(img.src)} ${img.w}w` : `${imgSmUrl(img.src)} 700w, ${imgUrl(img.src)} ${img.w}w`);


export const whatsappLink = (text?: string) =>
  `https://wa.me/${site.settings.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const telLink = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const navLink = (query: string) => `https://waze.com/ul?q=${encodeURIComponent(query)}&navigate=yes`;
