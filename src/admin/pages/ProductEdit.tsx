import { Link, useNavigate, useParams } from "@tanstack/react-router";
import type { Product } from "../../lib/content";
import { Card, ImagesField, Select, Text, Toggle } from "../fields";
import { useAdmin } from "../store";

export function ProductEdit() {
  const { cat, slug } = useParams({ strict: false }) as { cat: string; slug: string };
  const { data, update } = useAdmin();
  const navigate = useNavigate();
  const c = data.categories.find((x) => x.slug === cat);
  const s = c?.subcategories.find((x) => x.products.some((p) => p.slug === slug));
  const p = s?.products.find((x) => x.slug === slug);
  if (!c || !s || !p) return <p className="text-muted">המוצר לא נמצא. <Link to="/admin/products" className="text-primary underline">לרשימת המוצרים</Link></p>;

  const edit = (fn: (p: Product) => void) =>
    update((d) => fn(d.categories.find((x) => x.slug === c.slug)!.subcategories.find((x) => x.slug === s.slug)!.products.find((x) => x.slug === p.slug)!));

  // move to another category / sub-category
  const moveTo = (catSlug: string, subSlug: string) => {
    update((d) => {
      const from = d.categories.find((x) => x.slug === c.slug)!.subcategories.find((x) => x.slug === s.slug)!;
      const i = from.products.findIndex((x) => x.slug === p.slug);
      const [item] = from.products.splice(i, 1);
      const to = d.categories.find((x) => x.slug === catSlug)!.subcategories.find((x) => x.slug === subSlug)!;
      item.order = to.products.length + 1;
      to.products.push(item);
    });
    if (catSlug !== c.slug) navigate({ to: "/admin/products/$cat/$slug", params: { cat: catSlug, slug: p.slug }, replace: true });
  };

  const target = data.categories.find((x) => x.slug === c.slug)!;
  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/admin/products" className="text-sm text-muted hover:text-ink">→ לכל המוצרים</Link>
        {p.visible && (
          <a href={`${import.meta.env.BASE_URL}collection/${c.slug}/${p.slug}`} target="_blank" rel="noopener noreferrer" className="adm-btn">צפייה באתר ↗</a>
        )}
      </div>

      <Card title="פרטי המוצר">
        <Text label="שם המוצר" value={p.name} onChange={(v) => edit((x) => void (x.name = v))} />
        <div className="grid gap-5 md:grid-cols-2">
          <Select label="עולם" value={c.slug} options={data.categories.map((x) => ({ value: x.slug, label: x.name }))} onChange={(v) => moveTo(v, data.categories.find((x) => x.slug === v)!.subcategories[0].slug)} />
          <Select label="תת־קטגוריה" value={s.slug} options={target.subcategories.map((x) => ({ value: x.slug, label: x.name }))} onChange={(v) => moveTo(c.slug, v)} />
        </div>
        <Text label="תיאור קצר" value={p.description} multiline onChange={(v) => edit((x) => void (x.description = v))} />
        <Text label="פרטים – חומר, הוראות טיפול וכו׳" value={p.details} multiline onChange={(v) => edit((x) => void (x.details = v))} />
      </Card>

      <Card>
        <ImagesField value={p.images} onChange={(imgs) => edit((x) => void (x.images = imgs))} />
      </Card>

      <Card title="תצוגה">
        <Toggle label="מוצג באתר" checked={p.visible} onChange={(v) => edit((x) => void (x.visible = v))} hint="מוצר מוסתר נשמר כאן אבל לא מופיע לגולשות" />
        <Toggle label="מוצג בקולקציה החדשה בדף הבית" checked={p.featured} onChange={(v) => edit((x) => void (x.featured = v))} />
        <div className="grid gap-5 md:grid-cols-2">
          <Text label="מחיר (לא מוצג באתר)" value={p.price == null ? "" : String(p.price)} dir="ltr" onChange={(v) => edit((x) => void (x.price = v.trim() === "" || isNaN(Number(v)) ? null : Number(v)))} hint="שמור להמשך, אם האתר יהפוך לחנות" />
          <div className="grid gap-1.5">
            <p className="text-sm font-medium">כתובת העמוד</p>
            <p dir="ltr" className="rounded-lg bg-surface/60 px-3 py-2.5 text-start text-sm text-muted">/collection/{c.slug}/{p.slug}</p>
          </div>
        </div>
      </Card>

      <button type="button" className="adm-btn justify-self-start text-primary" onClick={() => {
        if (!confirm(`למחוק את ״${p.name}״? לא ניתן לבטל.`)) return;
        update((d) => {
          const sub = d.categories.find((x) => x.slug === c.slug)!.subcategories.find((x) => x.slug === s.slug)!;
          sub.products = sub.products.filter((x) => x.slug !== p.slug);
        });
        navigate({ to: "/admin/products" });
      }}>
        מחיקת המוצר
      </button>
    </div>
  );
}
