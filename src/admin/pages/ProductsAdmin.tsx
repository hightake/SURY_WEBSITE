import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useMemo, useRef, useState } from "react";
import { imgSmUrl } from "../../lib/media";
import { addProduct, listProducts, updateProduct } from "../../services/catalogService";
import { useAdmin } from "../state/AdminStore";

export function ProductsAdmin() {
  const { data, update } = useAdmin();
  const search = useSearch({ strict: false }) as { featured?: boolean };
  const navigate = useNavigate();
  const [cat, setCat] = useState("");
  const [q, setQ] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(!!search.featured);
  const rows = useMemo(() => listProducts(data, { cat, q, featuredOnly }), [data, cat, q, featuredOnly]);

  const creating = useRef(false); // a quick double-click must create one product, not two
  const create = () => {
    if (creating.current) return;
    creating.current = true;
    let ref = { cat: "", slug: "" };
    update((d) => void (ref = addProduct(d, cat || d.categories[0].slug)));
    navigate({ to: "/admin/products/$cat/$slug", params: ref });
  };

  return (
    <div className="grid grid-cols-1 gap-5">
      <div className="adm-card grid min-w-0 items-end gap-3 md:grid-cols-[14rem_1fr_auto_auto]">
        <label className="grid min-w-0 gap-1 text-sm">
          עולם
          <select value={cat} onChange={(e) => setCat(e.target.value)} className="adm-input w-full min-w-0">
            <option value="">כל העולמות</option>
            {data.categories.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
          </select>
        </label>
        <label className="grid min-w-0 gap-1 text-sm">
          חיפוש
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="שם המוצר או מק״ט" className="adm-input w-full min-w-0" />
        </label>
        <label className="flex items-center gap-2 pb-2.5 text-sm md:whitespace-nowrap">
          <input type="checkbox" checked={featuredOnly} onChange={(e) => setFeaturedOnly(e.target.checked)} className="size-4 accent-[var(--color-primary)]" />
          הצג כאן רק את הקולקציה החדשה
        </label>
        <button type="button" className="adm-btn adm-btn-primary" onClick={create}>+ מוצר חדש</button>
      </div>

      <p className="text-sm text-muted">{rows.length} מוצרים</p>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {rows.map(({ c, s, p }) => {
          const ref = { cat: c.slug, slug: p.slug };
          return (
            <li key={c.slug + p.slug} className="adm-card flex gap-4 !p-3">
              <Link to="/admin/products/$cat/$slug" params={ref} className="adm-thumb w-20 shrink-0" style={{ aspectRatio: "4 / 5" }}>
                {p.images[0] ? <img src={imgSmUrl(p.images[0].src)} alt="" /> : <span className="text-xs text-muted">אין תמונה</span>}
              </Link>
              <div className="min-w-0 flex-1">
                <span className="adm-sku">מק״ט {p.slug}</span>
                <Link to="/admin/products/$cat/$slug" params={ref} className="mt-1 block truncate font-medium hover:text-primary">{p.name}</Link>
                <p className="truncate text-xs text-muted">{c.shortName} · {s.name}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {!p.visible && <span className="adm-badge !bg-shade !text-ink">מוסתר</span>}
                  {p.featured && <span className="adm-badge">בקולקציה החדשה</span>}
                  <span className="text-xs text-muted">{p.images.length} תמונות</span>
                </div>
                <button type="button" className="mt-2 text-xs text-primary underline-offset-2 hover:underline" onClick={() => update((d) => updateProduct(d, ref, (x) => void (x.featured = !x.featured)))}>
                  {p.featured ? "הוצאה מהקולקציה החדשה" : "הוספה לקולקציה החדשה"}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
