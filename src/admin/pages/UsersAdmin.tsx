import { useState } from "react";
import type { Role } from "../../models/user";
import { addEditor, canRemove, removeUser, setRole } from "../../services/usersService";
import { useAdmin } from "../state/AdminStore";
import { Card } from "../ui/fields";

const roleLabel: Record<Role, string> = { owner: "בעלת האתר", editor: "עורכת" };

/* Owner only – the route guard (requireOwner) keeps editors out. */
export function UsersAdmin() {
  const { data, update, user } = useAdmin();
  const [email, setEmail] = useState("");
  const add = () => {
    update((d) => addEditor(d, email));
    setEmail("");
  };
  return (
    <div className="grid gap-6">
      <Card title="מי יכולה להיכנס לניהול" hint="הכניסה רק עם חשבון Google. מי שלא ברשימה – לא נכנסת, גם אם יש לה את הקישור.">
        <ul className="divide-y divide-shade">
          {(data.admins ?? []).map((a) => (
            <li key={a.email} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p dir="ltr" className="text-start font-medium">{a.email}</p>
                <p className="text-xs text-muted">{roleLabel[a.role]}{a.email === user.email ? " · את" : ""}</p>
              </div>
              <div className="flex gap-2">
                <select value={a.role} onChange={(e) => update((d) => setRole(d, a.email, e.target.value as Role))} className="adm-input !py-1.5 text-sm">
                  <option value="editor">עורכת</option>
                  <option value="owner">בעלת האתר</option>
                </select>
                <button type="button" className="adm-chip text-primary" disabled={!canRemove(data, a.email)} onClick={() => confirm(`להסיר את ${a.email}?`) && update((d) => removeUser(d, a.email))}>הסרה</button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
      <Card title="הוספת עורכת">
        <div className="flex flex-wrap gap-3">
          <input value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && add()} dir="ltr" placeholder="name@gmail.com" className="adm-input min-w-64 flex-1" />
          <button type="button" className="adm-btn adm-btn-primary" onClick={add}>הוספה</button>
        </div>
        <p className="text-xs text-muted">עורכת יכולה לשנות תוכן ומוצרים. רק בעלת האתר מנהלת את רשימת ההרשאות.</p>
      </Card>
    </div>
  );
}
