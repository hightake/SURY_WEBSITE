import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import type { Product } from "../../models/content";
import { deleteProduct, findProduct, moveProduct, setPrice, updateProduct, type ProductRef } from "../../services/catalogService";
import { useAdmin } from "../state/AdminStore";
import { Card, ImagesField, Select, Text, Toggle } from "../ui/fields";

export function ProductEdit() {
  const ref = useParams({ strict: false }) as ProductRef;
  const { data, update } = useAdmin();
  const navigate = useNavigate();
  const found = findProduct(data, ref);
  if (!found) return <p className="text-muted">המוצר לא נמצא. <Link to="/admin/products" className="text-primary underline">לרשימת המוצרים</Link></p>;
  const { category: c, sub: s, product: p } = found;

  const edit = (fn: (p: Product) => void) => update((d) => updateProduct(d, ref, fn));
  const moveTo = (cat: string, sub: string) => {
    let next = ref;
    update((d) => void (next = moveProduct(d, ref, cat, sub)));
    if (next.cat !== ref.cat) navigate({ to: "/admin/products/$cat/$slug", params: next, replace: true });
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/admin/products" className="text-sm text-muted hover:text-ink">→ לכל המוצרים</Link>
        {p.visible && <a href={`${import.meta.env.BASE_URL}collection/${c.slug}/${p.slug}`} target="_blank" rel="noopener noreferrer" className="adm-btn">צפייה באתר ↗</a>}
      </div>

      <Card title="פרטי המוצר">
        <Text label="שם המוצר" value={p.name} onChange={(v) => edit((x) => void (x.name = v))} />
        <div className="grid gap-5 md:grid-cols-2">
          <Select label="עולם" value={c.slug} options={data.categories.map((x) => ({ value: x.slug, label: x.name }))} onChange={(v) => moveTo(v, data.categories.find((x) => x.slug === v)!.subcategories[0].slug)} />
          <Select label="תת־קטגוריה" value={s.slug} options={c.subcategories.map((x) => ({ value: x.slug, label: x.name }))} onChange={(v) => moveTo(c.slug, v)} />
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
          <Text label="מחיר (לא מוצג באתר)" value={p.price == null ? "" : String(p.price)} dir="ltr" onChange={(v) => edit((x) => setPrice(x, v))} hint="שמור להמשך, אם האתר יהפוך לחנות" />
          <div className="md:col-span-2">
            <ProductLink catSlug={c.slug} slug={p.slug} />
          </div>
        </div>
      </Card>

      <button type="button" className="adm-btn justify-self-start text-primary" onClick={() => {
        if (!confirm(`למחוק את ״${p.name}״? לא ניתן לבטל.`)) return;
        update((d) => deleteProduct(d, ref));
        navigate({ to: "/admin/products" });
      }}>
        מחיקת המוצר
      </button>
    </div>
  );
}

/** The product's public link: a fixed number, so it keeps working when the name changes. */
function ProductLink({ catSlug, slug }: { catSlug: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const url = `${location.origin}${import.meta.env.BASE_URL}collection/${catSlug}/${slug}`;
  return (
    <div className="grid gap-1.5">
      <p className="text-sm font-medium">קישור לעמוד המוצר{/^\d+$/.test(slug) ? ` · מק״ט ${slug}` : ""}</p>
      <div className="flex items-center gap-1 rounded-lg border border-[#dccbb5] bg-surface/50 p-1 ps-3">
        <p dir="ltr" className="min-w-0 flex-1 truncate text-start text-sm text-muted" title={url}>{url}</p>
        <button type="button" className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${copied ? "bg-[#3f7d4e] text-white" : "bg-primary text-white hover:bg-primary-dark"}`} onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } catch {
            prompt("העתיקי את הקישור:", url);
          }
        }}>{copied ? "הועתק ✓" : "העתקת קישור"}</button>
      </div>
      <p className="text-xs text-muted">מספר קבוע שנקבע אוטומטית – לא משתנה גם אם משנים את שם המוצר, כך שקישורים שנשלחו ממשיכים לעבוד.</p>
    </div>
  );
}
