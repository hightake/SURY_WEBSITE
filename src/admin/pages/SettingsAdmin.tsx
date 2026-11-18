import { Card, Text } from "../fields";
import { useAdmin } from "../store";

export function SettingsAdmin() {
  const { data, update } = useAdmin();
  const s = data.settings;
  return (
    <Card title="פרטי קשר" hint="מופיעים בראש האתר, בפוטר, בכפתורי הוואטסאפ ובעמוד יצירת קשר.">
      <div className="grid gap-5 md:grid-cols-2">
        <Text label="טלפון ראשי" value={s.phone} dir="ltr" onChange={(v) => update((d) => void (d.settings.phone = v))} />
        <Text label="מייל לקבלת פניות מהטופס" value={s.email} dir="ltr" onChange={(v) => update((d) => void (d.settings.email = v))} />
        <Text label="וואטסאפ – כפי שמוצג" value={s.whatsappDisplay} dir="ltr" onChange={(v) => update((d) => void (d.settings.whatsappDisplay = v))} />
        <Text label="וואטסאפ – מספר בינלאומי" value={s.whatsapp} dir="ltr" onChange={(v) => update((d) => void (d.settings.whatsapp = v.replace(/\D/g, "")))} hint="בלי 0 בהתחלה ועם 972, למשל 972503970444" />
      </div>
    </Card>
  );
}
