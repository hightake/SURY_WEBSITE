/*
 * Prerender: after the build, every public page gets its own HTML file with
 * its real title, description, sharing card (WhatsApp/Facebook) and main text.
 *
 * Why: the site is built in the browser. Google renders it late, AI search
 * engines and WhatsApp don't render it at all – to them every page is the same
 * empty shell. Visitors see no difference: the app starts and replaces the
 * prepared text with the live page, including what was edited in the admin.
 *
 * The data comes from src/content/site.json at build time, so search engines
 * and link previews show the content as of the last build.
 */
import type { Plugin } from "vite";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

type Img = { src: string; alt?: string };
type Product = { slug: string; name: string; description?: string; images?: Img[]; visible?: boolean };
type Category = { slug: string; name: string; intro?: string; cover?: Img; subcategories: { name: string; products: Product[] }[] };
type Store = { city: string; address: string; phone?: string; hours?: string[][] };

/** The address the site will live at – used for the sharing image. */
const SITE_URL = (process.env.SITE_URL || "https://sury.co.il").replace(/\/$/, "");
const BRAND = "SURY";

const esc = (s = "") => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const plain = (html = "") => html.replace(/<[^>]+>/g, " ").replace(/\{[a-z]+\}/g, "").replace(/\s+/g, " ").trim();
const clip = (s: string, n = 160) => (s.length <= n ? s : s.slice(0, n - 1).replace(/\s+\S*$/, "") + "…");
const isLocal = (src = "") => !!src && !/^(data:|blob:|https?:)/.test(src);

type Page = { path: string; title: string; description: string; image?: Img; body: string };

export function prerenderPages(base: string): Plugin {
  let outDir = "dist";
  return {
    name: "prerender-pages",
    apply: "build",
    configResolved(c) {
      outDir = c.build.outDir;
    },
    closeBundle() {
      const site = JSON.parse(readFileSync(new URL("../src/content/site.json", import.meta.url), "utf8"));
      const template = readFileSync(join(outDir, "index.html"), "utf8");
      const link = (path: string) => base + path.replace(/^\//, "");
      const img = (i?: Img) => (i && isLocal(i.src) ? `<img src="${esc(base + i.src)}" alt="${esc(i.alt)}" loading="lazy">` : "");
      const categories: Category[] = site.categories ?? [];
      const stores: Store[] = site.stores ?? [];
      const hero = site.home?.hero ?? {};
      const homeTitle = `${BRAND} – ${hero.titleBold ?? ""}, ${hero.titleLight ?? ""}`.replace(/,\s*$/, "");
      const homeDesc = template.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? "";

      const pages: Page[] = [];

      pages.push({
        path: "/",
        title: homeTitle,
        description: homeDesc,
        image: hero.banners?.[0]?.image,
        body:
          `<h1>${esc(hero.titleBold)} ${esc(hero.titleLight)}</h1><p>${esc(hero.text)}</p>` +
          `<ul>${categories.map((c) => `<li><a href="${link(`/collection/${c.slug}`)}">${esc(c.name)}</a> – ${esc(c.intro)}</li>`).join("")}</ul>`,
      });

      for (const c of categories) {
        pages.push({
          path: `/collection/${c.slug}`,
          title: `${c.name} | ${BRAND}`,
          description: clip(c.intro || `${c.name} מבית ${BRAND}.`),
          image: c.cover,
          body:
            `<h1>${esc(c.name)}</h1><p>${esc(c.intro)}</p>` +
            c.subcategories
              .map((s) => {
                const ps = s.products.filter((p) => p.visible !== false);
                return ps.length ? `<h2>${esc(s.name)}</h2><ul>${ps.map((p) => `<li><a href="${link(`/product/${p.slug}`)}">${esc(p.name)}</a></li>`).join("")}</ul>` : "";
              })
              .join(""),
        });
        for (const s of c.subcategories)
          for (const p of s.products.filter((p) => p.visible !== false))
            pages.push({
              path: `/product/${p.slug}`,
              title: `${p.name} | ${BRAND}`,
              description: clip(`${p.name} – ${p.description || s.name}`),
              image: p.images?.[0],
              body:
                `<h1>${esc(p.name)}</h1><p>${esc(p.description)}</p>${img(p.images?.[0])}` +
                `<p><a href="${link(`/collection/${c.slug}`)}">${esc(c.name)}</a> · ${esc(s.name)}</p>`,
            });
      }

      const story = site.pages?.story;
      if (story)
        pages.push({
          path: "/our-story",
          title: `${story.title} | ${BRAND}`,
          description: clip(plain(story.lead || story.body)),
          image: story.image,
          body: `<h1>${esc(story.title)}</h1><p>${esc(plain(story.lead))}</p><p>${esc(plain(story.body))}</p>`,
        });

      pages.push({
        path: "/stores",
        title: `החנויות שלנו | ${BRAND}`,
        description: clip(`חנויות ${BRAND}: ${stores.map((s) => s.address).join(" · ")}.`),
        body:
          `<h1>החנויות שלנו</h1><ul>` +
          stores.map((s) => `<li>${esc(s.city)} – ${esc(s.address)}${s.phone ? ` · ${esc(s.phone)}` : ""}${(s.hours ?? []).map((h) => ` · ${esc(h.join(" "))}`).join("")}</li>`).join("") +
          `</ul>`,
      });

      const st = site.settings ?? {};
      pages.push({
        path: "/contact",
        title: `צור קשר | ${BRAND}`,
        description: clip(`צרו קשר עם ${BRAND}: טלפון ${st.phone ?? ""}, וואטסאפ ${st.whatsappDisplay ?? ""}.`),
        body: `<h1>צור קשר</h1><p>טלפון: ${esc(st.phone)} · וואטסאפ: ${esc(st.whatsappDisplay)} · ${esc(st.email)}</p>`,
      });

      for (const key of ["privacy", "accessibility"] as const) {
        const pg = site.pages?.[key];
        if (pg)
          pages.push({
            path: `/${key}`,
            title: `${pg.title} | ${BRAND}`,
            description: clip(plain(pg.body)),
            body: `<h1>${esc(pg.title)}</h1><p>${esc(plain(pg.body))}</p>`,
          });
      }

      for (const pg of pages) {
        const image = pg.image && isLocal(pg.image.src) ? `${SITE_URL}/${pg.image.src}` : "";
        const head = [
          `<meta property="og:type" content="website" />`,
          `<meta property="og:site_name" content="${BRAND}" />`,
          `<meta property="og:locale" content="he_IL" />`,
          `<meta property="og:title" content="${esc(pg.title)}" />`,
          `<meta property="og:description" content="${esc(pg.description)}" />`,
          image && `<meta property="og:image" content="${esc(image)}" />`,
          image && pg.image?.alt && `<meta property="og:image:alt" content="${esc(pg.image.alt)}" />`,
          `<meta name="twitter:card" content="${image ? "summary_large_image" : "summary"}" />`,
        ]
          .filter(Boolean)
          .join("\n    ");
        const html = template
          .replace(/<title>[^<]*<\/title>/, `<title>${esc(pg.title)}</title>`)
          .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${esc(pg.description)}" />\n    ${head}`)
          .replace(`<div id="root"></div>`, `<div id="root"><div class="prerender">${pg.body}</div></div>`);
        const file = pg.path === "/" ? join(outDir, "index.html") : join(outDir, pg.path, "index.html");
        mkdirSync(dirname(file), { recursive: true });
        writeFileSync(file, html);
      }
      this.info?.(`prerendered ${pages.length} pages`);
    },
  };
}
