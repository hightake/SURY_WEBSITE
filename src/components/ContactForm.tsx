import { useState, type FormEvent } from "react";

/**
 * Contact form. Stage 1–2: no sending yet (a server function that emails the
 * message without storing it is added in the admin stage).
 */
export function ContactForm() {
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
      <div role="status" className="border border-shade bg-bg/60 p-8 text-center">
        <p className="text-xl font-light">תודה! קיבלנו את הפנייה.</p>
        <p className="mt-2 text-sm text-muted">(בתצוגה המקדימה הטופס עדיין לא שולח מייל – זה יחובר בשלב הבא.)</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm">
          שם מלא
          <input name="name" required autoComplete="name" className="field" />
        </label>
        <label className="grid gap-1.5 text-sm">
          טלפון
          <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" pattern="[0-9+\-\s]{9,15}" dir="ltr" className="field text-end" />
        </label>
      </div>
      <label className="grid gap-1.5 text-sm">
        הודעה
        <textarea name="message" required rows={4} className="field resize-y" />
      </label>
      <label className="flex items-start gap-3 text-sm text-muted">
        <input type="checkbox" name="consent" required className="mt-1 size-4 accent-[var(--color-primary)]" />
        <span>
          אני מסכימה שהפרטים ישמשו רק כדי לחזור אליי בנוגע לפנייה. הפרטים נשלחים במייל ואינם נשמרים באתר.
        </span>
      </label>
      <button type="submit" className="btn btn-primary mt-2 justify-self-start px-10">
        שליחה
      </button>
    </form>
  );
}
