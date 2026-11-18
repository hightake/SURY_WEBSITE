/*
 * Domain models – the shape of everything the site shows.
 * Pure types, no logic. Persisted as one document (SiteData) today;
 * maps 1:1 to tables when the database is connected.
 */
import type { AdminUser } from "./user";

/** src: a path under public/ or a data/https URL (uploads). sm: optional small version. */
export type Img = { src: string; w: number; h: number; alt: string; sm?: string };

export type Product = {
  slug: string;
  name: string;
  /** first image is the main one */
  images: Img[];
  description: string;
  details: string;
  order: number;
  visible: boolean;
  featured: boolean;
  /** optional, never displayed */
  price: number | null;
  /** colours taken from the main photo */
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
  hours: [days: string, time: string][];
  navQuery: string;
};

export type HeroBanner = { image: Img; caption: string; category?: string; link?: string };

/**
 * Formatted text from the admin editor, stored as HTML (paragraphs, headings,
 * bold/italic/underline, bullet and numbered lists). Sanitised before display.
 * {phone} and {email} are filled in with the contact details.
 */
export type RichText = string;

export type LegalPage = { title: string; updated: string; body: RichText };

export type Settings = {
  phone: string;
  whatsapp: string;
  whatsappDisplay: string;
  /** shown on the site */
  email: string;
  /** where the contact form is sent – never shown */
  contactInbox: string;
  social: { name: string; url: string }[];
};

export type SiteData = {
  admins?: AdminUser[];
  settings: Settings;
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
    story: { title: string; lead: string; image: Img; body: RichText };
    privacy: LegalPage;
    accessibility: LegalPage;
  };
  stores: Store[];
  categories: Category[];
};

export type FeaturedItem = { category: Category; sub: Subcategory; product: Product };

/** Contact form submission – sent by e-mail, never stored. */
export type ContactMessage = { name: string; phone: string; message: string; consent: true };
