import { mockBackend } from "./mock";
import type { Backend } from "./types";

/** The one place that decides which backend the site uses. */
export const backend: Backend = mockBackend;
export * from "./types";
