import type { LegalPage } from "../models/content";
import { RichTextView } from "./RichTextView";
import { TextPage } from "./TextPage";

/** A privacy / accessibility page written in the admin. */
export function LegalText({ page }: { page: LegalPage }) {
  return (
    <TextPage title={page.title} updated={page.updated || undefined}>
      <RichTextView text={page.body} />
    </TextPage>
  );
}
