import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { readFileSync } from "node:fs";
import { prerenderPages } from "./build/prerender.ts";

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

export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), preloadHeroImage(), prerenderPages(base)],
});
