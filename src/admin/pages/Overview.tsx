import { Link } from "@tanstack/react-router";
import { backend } from "../../lib/backend";
import { useAdmin } from "../store";

export function Overview() {
  const { data, user, reload } = useAdmin();
  const products = data.categories.flatMap((c) => c.subcategories.flatMap((s) => s.products));
  const tiles = [
    { to: "/admin/products", n: products.length, label: "מוצרים" },
    { to: "/admin/products", n: products.filter((p) => p.featured).length, label: "בקולקציה החדשה" },
    { to: "/admin/products", n: products.filter((p) => !p.visible).length, label: "מוסתרים" },
    { to: "/admin/stores", n: data.stores.length, label: "חנויות" },
  ];
  return (
    <div className="grid gap-6">
      <p className="text-lg">שלום{user.role === "owner" ? "" : ","} <span dir="ltr">{user.email}</span></p>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {tiles.map((t) => (
          <Link key={t.label} to={t.to} className="adm-card block text-center hover:border-accent">
            <p className="text-3xl font-light text-primary">{t.n}</p>
            <p className="mt-1 text-sm text-muted">{t.label}</p>
          </Link>
        ))}
      </div>
      <div className="adm-card grid gap-2 text-sm leading-relaxed">
        <p className="font-medium">איך זה עובד</p>
        <p>הלשוניות מסודרות לפי עמודי האתר. כל שינוי נשמר לבד אחרי רגע, ומופיע באתר מיד – לא צריך ללחוץ ״שמירה״.</p>
        <p>מוצר חדש: ״מוצרים״ ← ״מוצר חדש״, בוחרים עולם ותת־קטגוריה, מעלים תמונות (הראשונה היא הראשית) ומסמנים ״מוצג באתר״.</p>
      </div>
      {backend.kind === "mock" && backend.reset && (
        <div className="adm-card text-sm">
          <p className="font-medium">תצוגה מקדימה</p>
          <p className="mt-1 text-muted">כרגע השינויים נשמרים רק בדפדפן הזה. אחרי החיבור ל-Lovable Cloud הם יישמרו בשרת ויופיעו לכולם.</p>
          <button type="button" className="adm-btn mt-3" onClick={async () => {
            if (!confirm("להחזיר את כל התוכן למצב ההתחלתי של הדמו?")) return;
            await backend.reset!();
            await reload();
          }}>איפוס התוכן להדמיה</button>
        </div>
      )}
    </div>
  );
}
