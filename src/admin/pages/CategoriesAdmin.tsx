import { Card, ImageField, Text } from "../fields";
import { useAdmin } from "../store";

export function CategoriesAdmin() {
  const { data, update } = useAdmin();
  return (
    <div className="grid gap-6">
      <p className="text-sm text-muted">מבנה הקטגוריות קבוע. כאן משנים שמות, משפטים ותמונות. מוצרים מוסיפים בלשונית ״מוצרים״.</p>
      {data.categories.map((c, ci) => (
        <Card key={c.slug} title={c.name}>
          <div className="grid gap-5 md:grid-cols-2">
            <Text label="שם מלא" value={c.name} onChange={(v) => update((d) => void (d.categories[ci].name = v))} />
            <Text label="שם קצר (בגומחות ובתפריט)" value={c.shortName} onChange={(v) => update((d) => void (d.categories[ci].shortName = v))} />
            <Text label="שורה קצרה מתחת לשם" value={c.tagline} onChange={(v) => update((d) => void (d.categories[ci].tagline = v))} />
            <Text label="משפט פתיחה בעמוד הקטגוריה" value={c.intro} onChange={(v) => update((d) => void (d.categories[ci].intro = v))} />
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            <ImageField label="תמונת שער (בראש עמוד הקטגוריה)" value={c.cover} onChange={(img) => update((d) => void (d.categories[ci].cover = img))} />
            <ImageField label="תמונת גומחה (בדף הבית)" value={c.niche} aspect="1 / 1" onChange={(img) => update((d) => void (d.categories[ci].niche = img))} hint="מוצר מבודד על רקע שקוף (PNG). הוא נעמד על המעמד בגומחה." />
          </div>
          <details className="rounded-lg border border-shade p-4">
            <summary className="cursor-pointer text-sm font-medium">שמות תתי־הקטגוריות ({c.subcategories.length})</summary>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {c.subcategories.map((s, si) => (
                <Text key={s.slug} label={`תת־קטגוריה ${si + 1}`} value={s.name} onChange={(v) => update((d) => void (d.categories[ci].subcategories[si].name = v))} />
              ))}
            </div>
          </details>
        </Card>
      ))}
    </div>
  );
}
