import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "node:fs";

// BASE_PATH is set only for the GitHub Pages preview (served under /SURY_WEBSITE/).
const base = process.env.BASE_PATH || "/";

/*
 * The opening photo is the page's largest element. The browser would only find
 * it after the app's script runs, so the first banner is preloaded from the HTML.
 */
function preloadHeroImage(): Plugin {
  return {
    name: "preload-hero-image",
    transformIndexHtml() {
      const site = JSON.parse(readFileSync(new URL("./src/content/site.json", import.meta.url), "utf8"));
      const img = site.home?.hero?.banners?.[0]?.image;
      if (!img?.src || /^(data:|blob:|https?:)/.test(img.src)) return [];
      const full = base + img.src;
      const small = full.replace(/\.webp$/, "-sm.webp");
      return [{ tag: "link", injectTo: "head", attrs: { rel: "preload", as: "image", href: full, imagesrcset: `${small} 700w, ${full} ${img.w}w`, imagesizes: "100vw", fetchpriority: "high" } }];
    },
  };
}

/*
 * One sharing card for the whole site (WhatsApp, Facebook…). Pages are built in
 * the browser from content managed in the admin, so the card is deliberately
 * general – it never shows a product that was renamed or removed.
 * SITE_URL is the address the site is served from; link previews need an absolute image URL.
 */
function sharingCard(): Plugin {
  const siteUrl = (process.env.SITE_URL || "https://sury.co.il").replace(/\/$/, "");
  return {
    name: "sharing-card",
    transformIndexHtml(html) {
      const title = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "SURY";
      const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";
      const meta = (property: string, content: string) => ({ tag: "meta", injectTo: "head" as const, attrs: { property, content } });
      return [
        meta("og:type", "website"),
        meta("og:site_name", "SURY"),
        meta("og:locale", "he_IL"),
        meta("og:url", siteUrl + "/"),
        meta("og:title", title),
        meta("og:description", description),
        meta("og:image", siteUrl + "/og-image.jpg"),
        meta("og:image:width", "1200"),
        meta("og:image:height", "630"),
        meta("og:image:alt", "SURY – כובעים, בנדנות, מטפחות ואופנת בית"),
        { tag: "meta", injectTo: "head", attrs: { name: "twitter:card", content: "summary_large_image" } },
      ];
    },
  };
}

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), preloadHeroImage(), sharingCard()],
});
