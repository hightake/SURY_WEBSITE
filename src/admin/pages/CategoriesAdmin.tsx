import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { addSubcategory, moveSubcategory, removeSubcategory, renameSubcategory } from "../../services/catalogService";
import { Card, ImageField, RowTools, Text } from "../ui/fields";
import { useAdmin } from "../state/AdminStore";

export function CategoriesAdmin() {
  const { data, update } = useAdmin();
  return (
    <div className="grid gap-6">
      <p className="text-sm text-muted">חמשת העולמות קבועים. בכל עולם אפשר להוסיף, לשנות שם, לסדר ולמחוק תתי־קטגוריות. מוצרים מוסיפים בלשונית ״מוצרים״.</p>
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
          <SubcategoriesEditor catSlug={c.slug} />
        </Card>
      ))}
    </div>
  );
}

function SubcategoriesEditor({ catSlug }: { catSlug: string }) {
  const { data, update } = useAdmin();
  const [name, setName] = useState("");
  const c = data.categories.find((x) => x.slug === catSlug)!;
  const subs = [...c.subcategories].sort((a, b) => a.order - b.order);
  const add = () => {
    update((d) => addSubcategory(d, catSlug, name));
    setName("");
  };
  return (
    <div className="grid gap-3 rounded-lg border border-shade p-4">
      <p className="text-sm font-medium">תתי־קטגוריות ({subs.length})</p>
      <ul className="grid gap-2">
        {subs.map((s, i) => (
          <li key={s.slug} className="flex flex-wrap items-center gap-2">
            <input value={s.name} onChange={(e) => update((d) => renameSubcategory(d, catSlug, s.slug, e.target.value))} className="adm-input min-w-48 flex-1" aria-label={`שם תת־קטגוריה ${i + 1}`} />
            <Link to="/admin/products" className="whitespace-nowrap text-xs text-muted hover:text-ink">{s.products.length} מוצרים</Link>
            <RowTools
              onUp={i > 0 ? () => update((d) => moveSubcategory(d, catSlug, i, -1)) : undefined}
              onDown={i < subs.length - 1 ? () => update((d) => moveSubcategory(d, catSlug, i, 1)) : undefined}
              onDelete={() => update((d) => removeSubcategory(d, catSlug, s.slug))}
            />
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap gap-2 border-t border-shade pt-3">
        <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} placeholder="שם תת־קטגוריה חדשה" className="adm-input min-w-48 flex-1" />
        <button type="button" className="adm-btn" onClick={add}>+ הוספה</button>
      </div>
    </div>
  );
}
