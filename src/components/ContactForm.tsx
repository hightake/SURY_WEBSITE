import { useState, type FormEvent } from "react";

/**
 * Contact form written as a short letter the visitor completes.
 * Stage 1–2: no sending yet (a server function that emails the message
 * without storing it is added in the admin stage).
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
      <div role="status" className="py-6">
        <p className="text-2xl font-light leading-relaxed md:text-4xl">תודה! קיבלנו את המכתב, ונחזור אלייך בהקדם.</p>
        <p className="mt-3 text-sm text-muted">(בתצוגה המקדימה הטופס עדיין לא שולח מייל – זה יחובר בשלב הבא.)</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="text-2xl font-light leading-[2.1] md:text-4xl md:leading-[2]">
        <p>שלום SURY,</p>
        <p>
          קוראים לי{" "}
          <input name="name" required autoComplete="name" aria-label="שם מלא" placeholder="השם שלך" className="letter-input w-[9ch] md:w-[10ch]" />
          ,
        </p>
        <p>
          ואשמח שתחזרו אליי לטלפון{" "}
          <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" pattern="[0-9+\-\s]{9,15}" aria-label="טלפון" placeholder="050-0000000" dir="ltr" className="letter-input w-[12.5ch] text-end" />
          .
        </p>
        <p>רציתי לשאול</p>
        <textarea name="message" required rows={1} aria-label="הודעה" placeholder="על כובע, מטפחת, מידה, הזמנה…" className="letter-input" />
      </div>
      <label className="mt-8 flex items-start gap-3 text-sm text-muted">
        <input type="checkbox" name="consent" required className="mt-1 size-4 accent-[var(--color-primary)]" />
        <span>אני מסכימה שהפרטים ישמשו רק כדי לחזור אליי בנוגע לפנייה. הפרטים נשלחים במייל ואינם נשמרים באתר.</span>
      </label>
      <button type="submit" className="btn btn-primary mt-8 px-12">
        שליחה
      </button>
    </form>
  );
}
