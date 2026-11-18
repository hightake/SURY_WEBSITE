import { sanitizeHtml } from "../lib/html";
import type { RichText } from "../models/content";
import { site } from "../services/contentState";
import { fillTokens } from "../services/settingsService";

/** Shows text written in the admin editor (sanitised HTML), with {phone}/{email} filled in. */
export function RichTextView({ text, className = "" }: { text: RichText; className?: string }) {
  return <div className={`rich-text ${className}`} dangerouslySetInnerHTML={{ __html: sanitizeHtml(fillTokens(text, site.settings)) }} />;
}
