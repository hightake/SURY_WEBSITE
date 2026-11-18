import type { LegalPage } from "../models/content";
import { site } from "../services/contentState";
import { fillTokens } from "../services/settingsService";
import { TextPage } from "./TextPage";

/** Renders an admin-edited text page: "- " lines become bullets, {phone}/{email} are filled in. */
export function LegalText({ page }: { page: LegalPage }) {
  return (
    <TextPage title={page.title} updated={page.updated || undefined}>
      {page.blocks.map((b, i) => (
        <section key={i}>
          {b.heading && <h2>{b.heading}</h2>}
          <Paragraphs text={fillTokens(b.text, site.settings)} />
        </section>
      ))}
    </TextPage>
  );
}

function Paragraphs({ text }: { text: string }) {
  // group consecutive "- " lines into one list
  const groups: (string | string[])[] = [];
  for (const line of text.split("\n").map((l) => l.trim()).filter(Boolean)) {
    if (line.startsWith("- ")) {
      const last = groups[groups.length - 1];
      if (Array.isArray(last)) last.push(line.slice(2));
      else groups.push([line.slice(2)]);
    } else groups.push(line);
  }
  return (
    <>
      {groups.map((g, i) =>
        Array.isArray(g) ? (
          <ul key={i}>{g.map((li, k) => <li key={k}>{li}</li>)}</ul>
        ) : (
          <p key={i}>{g}</p>
        ),
      )}
    </>
  );
}
