import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { imgSmUrl } from "../../lib/content";
import { useAdmin } from "../store";

export function ProductsAdmin() {
  const { data, update } = useAdmin();
  const search = useSearch({ strict: false }) as { featured?: boolean };
  const navigate = useNavigate();
  const [cat, setCat] = useState("");
  const [q, setQ] = useState("");
  const [onlyFeatured, setOnlyFeatured] = useState(!!search.featured);

  const rows = useMemo(
    () =>
      data.categories.flatMap((c) =>
        c.subcategories.flatMap((s) => s.products.map((p) => ({ c, s, p }))),
      ).filter(({ c, p }) => (!cat || c.slug === cat) && (!q || p.name.includes(q)) && (!onlyFeatured || p.featured)),
    [data, cat, q, onlyFeatured],
  );

  const addProduct = () => {
    const c = data.categories.find((x) => x.slug === cat) ?? data.categories[0];
    const s = c.subcategories[0];
    const slug = `p-${Date.now().toString(36)}`;
    update((d) => {
      const sub = d.categories.find((x) => x.slug === c.slug)!.subcategories.find((x) => x.slug === s.slug)!;
      sub.products.push({ slug, name: "מוצר חדש", images: [], description: "", details: "", order: sub.products.length + 1, visible: false, featured: false, price: null });
    });
    navigate({ to: "/admin/products/$cat/$slug", params: { cat: c.slug, slug } });
  };

  return (
    <div className="grid gap-5">
      <div className="adm-card grid items-end gap-3 md:grid-cols-[14rem_1fr_auto_auto]">
        <label className="grid gap-1 text-sm">
          עולם
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="adm-input">
            <option value="">כל העולמות</option>
            {data.categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          חיפוש
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="שם המוצר" className="adm-input" />
        </label>
        <label className="flex items-center gap-2 whitespace-nowrap pb-2.5 text-sm">
          <input type="checkbox" checked={onlyFeatured} onChange={(e) => setOnlyFeatured(e.target.checked)} className="size-4 accent-[var(--color-primary)]" />
          רק בקולקציה החדשה
        </label>
        <button type="button" className="adm-btn adm-btn-primary" onClick={addProduct}>+ מוצר חדש</button>
      </div>

      <p className="text-sm text-muted">{rows.length} מוצרים</p>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map(({ c, s, p }) => (
          <li key={c.slug + p.slug} className="adm-card flex gap-4 !p-3">
            <Link to="/admin/products/$cat/$slug" params={{ cat: c.slug, slug: p.slug }} className="adm-thumb w-20 shrink-0" style={{ aspectRatio: "4 / 5" }}>
              {p.images[0] ? <img src={imgSmUrl(p.images[0].src)} alt="" /> : <span className="text-xs text-muted">אין תמונה</span>}
            </Link>
            <div className="min-w-0 flex-1">
              <Link to="/admin/products/$cat/$slug" params={{ cat: c.slug, slug: p.slug }} className="block truncate font-medium hover:text-primary">{p.name}</Link>
              <p className="truncate text-xs text-muted">{c.shortName} · {s.name}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {!p.visible && <span className="adm-badge !bg-shade !text-ink">מוסתר</span>}
                {p.featured && <span className="adm-badge">בקולקציה החדשה</span>}
                <span className="text-xs text-muted">{p.images.length} תמונות</span>
              </div>
              <button type="button" className="mt-2 text-xs text-primary underline-offset-2 hover:underline" onClick={() => update((d) => {
                const pr = d.categories.find((x) => x.slug === c.slug)!.subcategories.find((x) => x.slug === s.slug)!.products.find((x) => x.slug === p.slug)!;
                pr.featured = !pr.featured;
              })}>
                {p.featured ? "הוצאה מהקולקציה החדשה" : "הוספה לקולקציה החדשה"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
