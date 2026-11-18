import type { RichText } from "../models/content";
import { site } from "../services/contentState";
import { fillTokens } from "../services/settingsService";

/**
 * Shows admin-written text exactly as typed: line breaks, tabs and bullets are kept.
 * Blank lines separate paragraphs; a line starting with "# " becomes a sub-heading.
 */
export function RichTextView({ text, className = "" }: { text: RichText; className?: string }) {
  const blocks = fillTokens(text, site.settings).replace(/\r\n/g, "\n").split(/\n{2,}/);
  return (
    <div className={`rich-text ${className}`}>
      {blocks.map((block, i) => {
        const [first, ...rest] = block.split("\n");
        if (first.startsWith("# ")) {
          return (
            <section key={i}>
              <h2>{first.slice(2)}</h2>
              {rest.length > 0 && <p>{rest.join("\n")}</p>}
            </section>
          );
        }
        return <p key={i}>{block}</p>;
      })}
    </div>
  );
}
