import DOMPurify from "dompurify";

/** Tags the rich text editor can produce – everything else is stripped before rendering. */
const ALLOWED = { ALLOWED_TAGS: ["p", "br", "h2", "h3", "strong", "b", "em", "i", "u", "ul", "ol", "li", "a"], ALLOWED_ATTR: ["href", "target", "rel"] };

export const sanitizeHtml = (html: string) => DOMPurify.sanitize(html, ALLOWED);

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Converts the earlier plain-text format ("# " headings, "•"/"- " bullets, blank-line paragraphs) to HTML. */
export function plainTextToHtml(text: string) {
  if (/^\s*</.test(text)) return text; // already HTML
  return text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => {
      const out: string[] = [];
      let list: string[] = [];
      const flush = () => {
        if (list.length) out.push(`<ul>${list.map((l) => `<li>${esc(l)}</li>`).join("")}</ul>`);
        list = [];
      };
      let para: string[] = [];
      const flushPara = () => {
        if (para.length) out.push(`<p>${para.map(esc).join("<br>")}</p>`);
        para = [];
      };
      for (const raw of block.split("\n")) {
        const line = raw.replace(/\t/g, "    ");
        if (/^#\s/.test(line)) {
          flushPara();
          flush();
          out.push(`<h2>${esc(line.slice(2))}</h2>`);
        } else if (/^\s*[•\-]\s/.test(line)) {
          flushPara();
          list.push(line.replace(/^\s*[•\-]\s/, ""));
        } else {
          flush();
          para.push(line);
        }
      }
      flushPara();
      flush();
      return out.join("");
    })
    .join("");
}

/** English-only labels (e.g. "Our Story") get lang="en", so screen readers pronounce them in English. */
export const langOf = (text?: string) => (text && /[A-Za-z]/.test(text) && !/[֐-׿]/.test(text) ? "en" : undefined);
