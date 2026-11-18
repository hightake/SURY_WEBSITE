import { moveItem } from "../../lib/list";
import type { LegalPage } from "../../models/content";
import { newLegalBlock } from "../../services/settingsService";
import { useAdmin } from "../state/AdminStore";
import { Card, RowTools, Text } from "../ui/fields";

type Key = "privacy" | "accessibility";

export function LegalAdmin() {
  return (
    <div className="grid gap-8">
      <p className="text-sm text-muted">
        בטקסט: שורה שמתחילה ב-״- ״ הופכת לנקודה ברשימה. <span dir="ltr">{"{phone}"}</span> ו-<span dir="ltr">{"{email}"}</span> מוחלפים אוטומטית בטלפון ובמייל מ״פרטי קשר״.
      </p>
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
      {page.blocks.map((b, i) => (
        <div key={i} className="grid gap-3 rounded-lg border border-shade p-4">
          <Text label={`כותרת משנה ${i + 1} (לא חובה)`} value={b.heading} onChange={(v) => set((p) => void (p.blocks[i].heading = v))} />
          <Text label="טקסט" value={b.text} multiline onChange={(v) => set((p) => void (p.blocks[i].text = v))} />
          <RowTools
            onUp={i > 0 ? () => set((p) => moveItem(p.blocks, i, -1)) : undefined}
            onDown={i < page.blocks.length - 1 ? () => set((p) => moveItem(p.blocks, i, 1)) : undefined}
            onDelete={() => set((p) => void p.blocks.splice(i, 1))}
          />
        </div>
      ))}
      <button type="button" className="adm-btn justify-self-start" onClick={() => set((p) => void p.blocks.push(newLegalBlock()))}>+ הוספת פסקה</button>
    </Card>
  );
}
