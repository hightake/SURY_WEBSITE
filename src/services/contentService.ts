/* Loading and saving the whole content document. */
import { backend } from "../data";
import { seedContent } from "../data/seed";
import type { SiteData } from "../models/content";
import { applyContent } from "./contentState";

/** Load content for the site; falls back to the bundled copy if the backend is unreachable. */
export async function bootContent() {
  try {
    applyContent(await backend.loadContent());
  } catch {
    applyContent(seedContent);
  }
}

export const loadContent = () => backend.loadContent();

/** Save and publish: the site re-renders from the saved version. */
export async function publishContent(data: SiteData) {
  await backend.saveContent(data);
  applyContent(data);
}
