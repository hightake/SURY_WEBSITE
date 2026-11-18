import { useState, type FormEvent } from "react";
import { ContactError, sendContact } from "../services/contactService";
import { isPreviewBackend } from "../services/environment";

/**
 * Contact form written as a short letter the visitor completes.
 * Sending goes through contactService → backend (e-mailed to the inbox set in the admin, never stored).
 */
export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const f = new FormData(form);
    setBusy(true);
    setError("");
    try {
      await sendContact({ name: String(f.get("name")), phone: String(f.get("phone")), message: String(f.get("message")), consent: f.get("consent") === "on" });
      setSent(true);
    } catch (err) {
      setError(err instanceof ContactError ? err.message : "השליחה נכשלה. אפשר לנסות שוב או לכתוב לנו בוואטסאפ.");
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <div role="status" className="py-6">
        <p className="text-2xl font-light leading-relaxed md:text-4xl">תודה! קיבלנו את המכתב, ונחזור אלייך בהקדם.</p>
        {isPreviewBackend && <p className="mt-3 text-sm text-muted">(בתצוגה המקדימה הטופס עדיין לא שולח מייל – זה יחובר עם Lovable Cloud.)</p>}
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
      {error && <p role="alert" className="mt-6 text-primary">{error}</p>}
      <button type="submit" disabled={busy} className="btn btn-primary mt-8 px-12 disabled:opacity-60">
        {busy ? "שולחת…" : "שליחה"}
      </button>
    </form>
  );
}
