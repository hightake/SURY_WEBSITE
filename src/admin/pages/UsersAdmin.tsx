import { useState } from "react";
import type { Role } from "../../lib/content";
import { Card } from "../fields";
import { useAdmin } from "../store";

const roleLabel: Record<Role, string> = { owner: "בעלת האתר", editor: "עורכת" };

export function UsersAdmin() {
  const { data, update, user } = useAdmin();
  const [email, setEmail] = useState("");
  const admins = data.admins ?? [];
  const owners = admins.filter((a) => a.role === "owner").length;
  if (user.role !== "owner") return <p className="text-muted">רק בעלת האתר יכולה לנהל הרשאות.</p>;

  const add = () => {
    const e = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) return alert("כתובת מייל לא תקינה");
    if (admins.some((a) => a.email === e)) return alert("הכתובת כבר ברשימה");
    update((d) => void (d.admins = [...(d.admins ?? []), { email: e, role: "editor" }]));
    setEmail("");
  };

  return (
    <div className="grid gap-6">
      <Card title="מי יכולה להיכנס לניהול" hint="הכניסה רק עם חשבון Google. מי שלא ברשימה – לא נכנסת, גם אם יש לה את הקישור.">
        <ul className="divide-y divide-shade">
          {admins.map((a, i) => (
            <li key={a.email} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <div>
                <p dir="ltr" className="text-start font-medium">{a.email}</p>
                <p className="text-xs text-muted">{roleLabel[a.role]}{a.email === user.email ? " · את" : ""}</p>
              </div>
              <div className="flex gap-2">
                <select value={a.role} onChange={(e) => {
                  const role = e.target.value as Role;
                  if (a.role === "owner" && role !== "owner" && owners === 1) return alert("חייבת להישאר לפחות בעלת אתר אחת");
                  update((d) => void (d.admins![i].role = role));
                }} className="adm-input !py-1.5 text-sm">
                  <option value="editor">עורכת</option>
                  <option value="owner">בעלת האתר</option>
                </select>
                <button type="button" className="adm-chip text-primary" disabled={a.role === "owner" && owners === 1} onClick={() => confirm(`להסיר את ${a.email}?`) && update((d) => void d.admins!.splice(i, 1))}>הסרה</button>
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
