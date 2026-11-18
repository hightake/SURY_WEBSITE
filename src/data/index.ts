import { mockBackend } from "./mock";
import type { Backend } from "./types";

/** The one place that decides which data adapter the app uses. */
export const backend: Backend = mockBackend;
export { NotAllowedError, type Backend } from "./types";
