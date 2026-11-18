/*
 * Upgrades content saved in an older shape, so earlier saves keep working.
 * Runs on every load (cheap and idempotent).
 */
import type { SiteData } from "../models/content";
import { plainTextToHtml } from "../lib/html";
import { seedAdmins, seedContent } from "./seed";

type Legacy = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

const blocksToBody = (blocks: { heading: string; text: string }[]) =>
  blocks.map((b) => (b.heading ? `# ${b.heading}\n` : "") + b.text.replace(/^- /gm, "• ")).join("\n\n");

export function migrate(input: SiteData): SiteData {
  const d = structuredClone(input) as Legacy;
  d.admins = d.admins?.length ? d.admins : seedAdmins;
  d.settings = { ...seedContent.settings, ...d.settings };
  d.pages = { ...seedContent.pages, ...d.pages };

  // story: paragraphs[] → body
  if (Array.isArray(d.pages.story?.paragraphs)) {
    d.pages.story.body = d.pages.story.paragraphs.join("\n\n");
    delete d.pages.story.paragraphs;
  }
  // legal pages: blocks[] → body (and the very first shape without either)
  for (const k of ["privacy", "accessibility"] as const) {
    const pg = d.pages[k];
    if (Array.isArray(pg?.blocks)) {
      pg.body = blocksToBody(pg.blocks);
      delete pg.blocks;
    }
    if (typeof pg?.body !== "string") d.pages[k] = seedContent.pages[k];
  }

  // rich text: plain text (earlier format) → HTML
  d.pages.story.body = plainTextToHtml(d.pages.story.body ?? "");
  for (const k of ["privacy", "accessibility"] as const) d.pages[k].body = plainTextToHtml(d.pages[k].body);

  // product links: every product gets a running number (1001, 1002…) – one link format for all
  let next = nextNumber(d as SiteData);
  for (const c of d.categories) for (const s of c.subcategories) for (const p of s.products) if (!/^\d+$/.test(p.slug)) p.slug = String(next++);

  return d as SiteData;
}

/** Product numbers start at 1001 and only go up. */
export function nextNumber(d: SiteData) {
  let max = 1000;
  for (const c of d.categories) for (const s of c.subcategories) for (const p of s.products) if (/^\d+$/.test(p.slug)) max = Math.max(max, Number(p.slug));
  return max + 1;
}
