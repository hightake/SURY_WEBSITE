// All site content comes from one JSON file. In stage 3 this module is the
// only place that changes: the same getters will read from the database.
import data from "../content/site.json";

export type Img = { src: string; w: number; h: number; alt: string };

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
  address: string;
  phone: string;
  hours: [string, string][];
  navQuery: string;
};

type SiteData = {
  settings: { phone: string; whatsapp: string; whatsappDisplay: string; email: string; social: { name: string; url: string }[] };
  home: {
    hero: { eyebrow: string; titleBold: string; titleLight: string; text: string; cta: string; image: Img };
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

export const site = data as unknown as SiteData;

const byOrder = <T extends { order: number }>(a: T, b: T) => a.order - b.order;

export const categories = [...site.categories].sort(byOrder).map((c) => ({
  ...c,
  subcategories: [...c.subcategories].sort(byOrder).map((s) => ({
    ...s,
    products: s.products.filter((p) => p.visible).sort(byOrder),
  })),
}));

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

export type FeaturedItem = { category: Category; sub: Subcategory; product: Product };

export const featured: FeaturedItem[] = categories.flatMap((category) =>
  category.subcategories.flatMap((sub) =>
    sub.products.filter((p) => p.featured).map((product) => ({ category, sub, product })),
  ),
);

/** Public URL of an image, respecting the deploy base path. */
export const imgUrl = (src: string) => `${import.meta.env.BASE_URL}${src}`;
export const imgSmUrl = (src: string) => imgUrl(src.replace(/\.webp$/, "-sm.webp"));
export const srcSet = (img: Img) => `${imgSmUrl(img.src)} 700w, ${imgUrl(img.src)} ${img.w}w`;

export const whatsappLink = (text?: string) =>
  `https://wa.me/${site.settings.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

export const telLink = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;

export const navLink = (query: string) => `https://waze.com/ul?q=${encodeURIComponent(query)}&navigate=yes`;
