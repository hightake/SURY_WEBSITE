import { backend } from "../data";

/** True while the site runs on the browser stand-in (before Lovable Cloud). */
export const isPreviewBackend = backend.kind === "mock";

/** Restore the starting content (stand-in only). */
export async function resetDemoContent() {
  await backend.reset?.();
}
