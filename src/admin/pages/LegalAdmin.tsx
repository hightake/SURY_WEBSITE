import type { LegalPage } from "../../models/content";
import { useAdmin } from "../state/AdminStore";
import { RichTextEditor } from "../ui/RichTextEditor";
import { Card, Text } from "../ui/fields";

type Key = "privacy" | "accessibility";

export function LegalAdmin() {
  return (
    <div className="grid gap-8">
      <PageEditor k="privacy" label="מדיניות פרטיות" />
      <PageEditor k="accessibility" label="הצהרת נגישות" />
    </div>
  );
}

function PageEditor({ k, label }: { k: Key; label: string }) {
  const { data, update } = useAdmin();
  const page: LegalPage = data.pages[k];
  const set = (fn: (p: LegalPage) => void) => update((d) => fn(d.pages[k]));
  return (
    <Card title={label} actions={<a href={`${import.meta.env.BASE_URL}${k}`} target="_blank" rel="noopener noreferrer" className="adm-btn">צפייה ↗</a>}>
      <div className="grid gap-5 md:grid-cols-2">
        <Text label="כותרת העמוד" value={page.title} onChange={(v) => set((p) => void (p.title = v))} />
        <Text label="עודכן בתאריך" value={page.updated} placeholder="למשל 1.12.2026" onChange={(v) => set((p) => void (p.updated = v))} />
      </div>
      <RichTextEditor label="תוכן העמוד" value={page.body} onChange={(v) => set((p) => void (p.body = v))} hint="אפשר לכתוב {phone} או {email} – יוחלפו אוטומטית בטלפון ובמייל מ״פרטי קשר״." />
    </Card>
  );
}
