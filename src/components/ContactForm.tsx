import { useState, type FormEvent } from "react";

/**
 * Contact form. Stage 1–2: no sending yet (a server function that emails the
 * message without storing it is added in the admin stage).
 */
type Look = "box" | "line" | "line-dark";

export function ContactForm({ look = "box" }: { look?: Look }) {
  const field = look === "box" ? "field" : look === "line" ? "field-line" : "field-line field-line-dark";
  const dark = look === "line-dark";
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }
    setSent(true);
  };

  if (sent) {
    return (
      <div role="status" className={`border p-8 text-center ${dark ? "border-bg/30" : "border-shade bg-bg/60"}`}>
        <p className="text-xl font-light">תודה! קיבלנו את הפנייה.</p>
        <p className={`mt-2 text-sm ${dark ? "text-bg/70" : "text-muted"}`}>(בתצוגה המקדימה הטופס עדיין לא שולח מייל – זה יחובר בשלב הבא.)</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm">
          שם מלא
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className="grid gap-1.5 text-sm">
          טלפון
          <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" pattern="[0-9+\-\s]{9,15}" dir="ltr" className={`${field} text-end`} />
        </label>
      </div>
      <label className="grid gap-1.5 text-sm">
        הודעה
        <textarea name="message" required rows={4} className={`${field} resize-y`} />
      </label>
      <label className={`flex items-start gap-3 text-sm ${dark ? "text-bg/75" : "text-muted"}`}>
        <input type="checkbox" name="consent" required className="mt-1 size-4 accent-[var(--color-primary)]" />
        <span>
          אני מסכימה שהפרטים ישמשו רק כדי לחזור אליי בנוגע לפנייה. הפרטים נשלחים במייל ואינם נשמרים באתר.
        </span>
      </label>
      <button type="submit" className={`btn mt-2 justify-self-start px-10 ${dark ? "bg-bg text-primary-dark hover:bg-surface" : "btn-primary"}`}>
        שליחה
      </button>
    </form>
  );
}
