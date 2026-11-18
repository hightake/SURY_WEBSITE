import { Card, RowTools, Text, Toggle } from "../ui/fields";
import { moveItem } from "../../lib/list";
import { newStore } from "../../services/storesService";
import { useAdmin } from "../state/AdminStore";

export function StoresAdmin() {
  const { data, update } = useAdmin();
  return (
    <div className="grid gap-6">
      <p className="text-sm text-muted">החנויות מופיעות בדף הבית, בעמוד ״החנויות שלנו״ ובדפי המוצר – עורכים פעם אחת כאן.</p>
      {data.stores.map((st, i) => (
        <Card key={i} title={st.city || "חנות"} actions={
          <RowTools
            onUp={i > 0 ? () => update((d) => moveItem(d.stores, i, -1)) : undefined}
            onDown={i < data.stores.length - 1 ? () => update((d) => moveItem(d.stores, i, 1)) : undefined}
            onDelete={() => update((d) => void d.stores.splice(i, 1))}
          />
        }>
          <div className="grid gap-5 md:grid-cols-2">
            <Text label="שם (עיר)" value={st.city} onChange={(v) => update((d) => void (d.stores[i].city = v))} />
            <Text label="שורה קטנה מעל השם" value={st.label ?? ""} placeholder="SURY" onChange={(v) => update((d) => void (d.stores[i].label = v || undefined))} />
            <Text label="כתובת" value={st.address} onChange={(v) => update((d) => void (d.stores[i].address = v))} />
            <Text label="טלפון" value={st.phone} dir="ltr" onChange={(v) => update((d) => void (d.stores[i].phone = v))} />
            <Text label="חיפוש לניווט (Waze)" value={st.navQuery} onChange={(v) => update((d) => void (d.stores[i].navQuery = v))} hint="מה שמקלידים בוויז כדי להגיע לחנות" />
            <Toggle label="חנות סיטונאית" checked={!!st.wholesale} onChange={(v) => update((d) => void (d.stores[i].wholesale = v || undefined))} hint="לא מוצגת ב״איפה אפשר למדוד״ בדף המוצר" />
          </div>
          <div className="grid gap-2">
            <p className="text-sm font-medium">שעות פתיחה</p>
            <div className="flex gap-2 text-xs text-muted">
              <span className="w-36">ימים</span>
              <span className="w-40">שעות</span>
            </div>
            {st.hours.map(([days, time], hi) => (
              <div key={hi} className="flex flex-wrap items-center gap-2">
                <input value={days} placeholder="למשל: א׳–ה׳" onChange={(e) => update((d) => void (d.stores[i].hours[hi][0] = e.target.value))} className="adm-input !w-36" aria-label="ימים" />
                <input value={time} placeholder="10:00–20:00" dir="ltr" onChange={(e) => update((d) => void (d.stores[i].hours[hi][1] = e.target.value))} className="adm-input !w-40" aria-label="שעות" />
                <button type="button" className="adm-chip text-primary" onClick={() => update((d) => void d.stores[i].hours.splice(hi, 1))}>הסרה</button>
              </div>
            ))}
            <button type="button" className="adm-chip justify-self-start" onClick={() => update((d) => void d.stores[i].hours.push(["", ""]))}>+ שורת שעות</button>
            <p className="text-xs text-muted">כל שורה = ימים + שעות. למשל: ״א׳–ה׳״ ו-״10:00–20:00״, ״ו׳״ ו-״10:00–13:00״. ביום סגור כותבים ״סגור״.</p>
          </div>
        </Card>
      ))}
      <button type="button" className="adm-btn justify-self-start" onClick={() => update((d) => void d.stores.push(newStore(d)))}>+ הוספת חנות</button>
    </div>
  );
}
