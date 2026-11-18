import { setWhatsapp } from "../../services/settingsService";
import { useAdmin } from "../state/AdminStore";
import { Card, Text } from "../ui/fields";

export function SettingsAdmin() {
  const { data, update } = useAdmin();
  const s = data.settings;
  return (
    <div className="grid gap-6">
      <Card title="טופס ״צור קשר״" hint="לאן נשלחות הפניות מהטופס באתר. הכתובת הזו לא מוצגת לגולשות.">
        <Text label="מייל לקבלת פניות מהטופס" value={s.contactInbox} dir="ltr" placeholder="name@gmail.com" onChange={(v) => update((d) => void (d.settings.contactInbox = v.trim()))} hint="כל פנייה נשלחת לכאן במייל ולא נשמרת באתר" />
        <Text label="כותרת הסקשן" value={data.home.contact.title} onChange={(v) => update((d) => void (d.home.contact.title = v))} />
        <Text label="משפט מתחת לכותרת" value={data.home.contact.text} onChange={(v) => update((d) => void (d.home.contact.text = v))} />
      </Card>
      <Card title="פרטי קשר באתר" hint="מופיעים בראש האתר, בפוטר, בכפתורי הוואטסאפ ובעמודי הפרטיות והנגישות.">
        <div className="grid gap-5 md:grid-cols-2">
          <Text label="טלפון ראשי" value={s.phone} dir="ltr" onChange={(v) => update((d) => void (d.settings.phone = v))} />
          <Text label="מייל שמוצג באתר" value={s.email} dir="ltr" onChange={(v) => update((d) => void (d.settings.email = v.trim()))} />
          <Text label="וואטסאפ – כפי שמוצג" value={s.whatsappDisplay} dir="ltr" onChange={(v) => update((d) => void (d.settings.whatsappDisplay = v))} />
          <Text label="וואטסאפ – מספר לקישור" value={s.whatsapp} dir="ltr" onChange={(v) => update((d) => setWhatsapp(d.settings, v))} hint="אפשר להקליד 050… – יומר אוטומטית ל-972…" />
        </div>
      </Card>
    </div>
  );
}
