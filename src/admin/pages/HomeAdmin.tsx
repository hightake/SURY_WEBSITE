import { Link } from "@tanstack/react-router";
import { Card, ImageField, RowTools, Select, Text } from "../ui/fields";
import { moveItem } from "../../lib/list";
import { useAdmin } from "../state/AdminStore";

export function HomeAdmin() {
  const { data, update } = useAdmin();
  const h = data.home;
  const catOptions = [{ value: "", label: "— החנויות שלנו —" }, ...data.categories.map((c) => ({ value: c.slug, label: c.name }))];
  return (
    <div className="grid gap-6">
      <Card title="פתיחה – תמונות מתחלפות" hint="התמונות נכנסות אחת על השנייה בראש דף הבית. כל תמונה מובילה לעולם שנבחר לה.">
        {h.hero.banners.map((b, i) => (
          <div key={i} className="grid gap-4 rounded-lg border border-shade p-4 md:grid-cols-[1fr_1fr]">
            <ImageField label={`תמונה ${i + 1}`} value={b.image} aspect="16 / 9" onChange={(img) => update((d) => void (d.home.hero.banners[i].image = img))} />
            <div className="grid content-start gap-4">
              <Text label="כיתוב קטן על התמונה" value={b.caption} onChange={(v) => update((d) => void (d.home.hero.banners[i].caption = v))} />
              <Select label="לחיצה מובילה אל" value={b.category ?? ""} options={catOptions} onChange={(v) => update((d) => void (d.home.hero.banners[i].category = v || undefined))} />
              <RowTools
                onUp={i > 0 ? () => update((d) => moveItem(d.home.hero.banners, i, -1)) : undefined}
                onDown={i < h.hero.banners.length - 1 ? () => update((d) => moveItem(d.home.hero.banners, i, 1)) : undefined}
                onDelete={h.hero.banners.length > 1 ? () => update((d) => void d.home.hero.banners.splice(i, 1)) : undefined}
              />
            </div>
          </div>
        ))}
        <button type="button" className="adm-btn justify-self-start" onClick={() => update((d) => void d.home.hero.banners.push({ ...d.home.hero.banners[0], caption: "תמונה חדשה" }))}>
          + הוספת תמונה לפתיחה
        </button>
      </Card>

      <Card title="פתיחה – טקסטים">
        <div className="grid gap-5 md:grid-cols-2">
          <Text label="כותרת – חלק מודגש" value={h.hero.titleBold} onChange={(v) => update((d) => void (d.home.hero.titleBold = v))} />
          <Text label="כותרת – חלק דק" value={h.hero.titleLight} onChange={(v) => update((d) => void (d.home.hero.titleLight = v))} />
        </div>
        <Text label="משפט מתחת לכותרת" value={h.hero.text} multiline onChange={(v) => update((d) => void (d.home.hero.text = v))} />
        <div className="grid gap-5 md:grid-cols-2">
          <Text label="טקסט הכפתור" value={h.hero.cta} onChange={(v) => update((d) => void (d.home.hero.cta = v))} />
          <Text label="שורה קטנה מעל הכותרת" value={h.hero.eyebrow} dir="ltr" onChange={(v) => update((d) => void (d.home.hero.eyebrow = v))} />
        </div>
      </Card>

      <Card title="עולמות המותג" hint="תמונות הגומחות והשמות נערכים בלשונית ״קטגוריות״.">
        <div className="grid gap-5 md:grid-cols-2">
          <Text label="כותרת" value={h.worlds.title} onChange={(v) => update((d) => void (d.home.worlds.title = v))} />
          <Text label="משפט" value={h.worlds.text} onChange={(v) => update((d) => void (d.home.worlds.text = v))} />
        </div>
      </Card>

      <Card title="הקולקציה החדשה" hint="הפריטים עצמם נבחרים במוצרים – מסמנים ״מוצג בקולקציה החדשה״.">
        <div className="grid gap-5 md:grid-cols-2">
          <Text label="כותרת" value={h.newCollection.title} onChange={(v) => update((d) => void (d.home.newCollection.title = v))} />
          <Text label="משפט" value={h.newCollection.text} onChange={(v) => update((d) => void (d.home.newCollection.text = v))} />
        </div>
        <Link to="/admin/products" search={{ featured: true }} className="adm-btn justify-self-start">לבחירת הפריטים בקולקציה ←</Link>
      </Card>

      <Card title="SURY, זה משהו מיוחד">
        <Text label="כותרת" value={h.uniqueness.title} onChange={(v) => update((d) => void (d.home.uniqueness.title = v))} />
        {h.uniqueness.items.map((it, i) => (
          <div key={i} className="grid gap-3 rounded-lg border border-shade p-4 md:grid-cols-[1fr_2fr_auto] md:items-end">
            <Text label={`ערך ${i + 1}`} value={it.title} onChange={(v) => update((d) => void (d.home.uniqueness.items[i].title = v))} />
            <Text label="הסבר" value={it.text} onChange={(v) => update((d) => void (d.home.uniqueness.items[i].text = v))} />
            <RowTools
              onUp={i > 0 ? () => update((d) => moveItem(d.home.uniqueness.items, i, -1)) : undefined}
              onDown={i < h.uniqueness.items.length - 1 ? () => update((d) => moveItem(d.home.uniqueness.items, i, 1)) : undefined}
              onDelete={() => update((d) => void d.home.uniqueness.items.splice(i, 1))}
            />
          </div>
        ))}
        <button type="button" className="adm-btn justify-self-start" onClick={() => update((d) => void d.home.uniqueness.items.push({ title: "ערך חדש", text: "" }))}>+ הוספת ערך</button>
      </Card>

      <Card title="הסיפור שלנו – בדף הבית" hint="העמוד המלא נערך בלשונית ״הסיפור שלנו״.">
        <div className="grid gap-5 md:grid-cols-[1fr_1.4fr]">
          <ImageField label="תמונה" value={h.storyTeaser.image} onChange={(img) => update((d) => void (d.home.storyTeaser.image = img))} />
          <div className="grid content-start gap-5">
            <Text label="כותרת" value={h.storyTeaser.title} onChange={(v) => update((d) => void (d.home.storyTeaser.title = v))} />
            <Text label="פסקה" value={h.storyTeaser.text} multiline onChange={(v) => update((d) => void (d.home.storyTeaser.text = v))} />
            <Text label="טקסט הכפתור" value={h.storyTeaser.cta} onChange={(v) => update((d) => void (d.home.storyTeaser.cta = v))} />
          </div>
        </div>
      </Card>

      <Card title="חנויות" hint="פרטי החנויות עצמם נערכים בלשונית ״חנויות״, וטקסטי יצירת הקשר ב״פרטי קשר וטופס״.">
        <Text label="משפט מתחת לכותרת" value={h.stores.text} onChange={(v) => update((d) => void (d.home.stores.text = v))} />
      </Card>
    </div>
  );
}
