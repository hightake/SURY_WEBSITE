import { backend } from "../data";
import type { ContactMessage } from "../models/content";
import { isPhone } from "../models/validation";

export class ContactError extends Error {}

/** Validate and send a contact form message (e-mailed, never stored). */
export async function sendContact(raw: { name: string; phone: string; message: string; consent: boolean }) {
  const msg = { name: raw.name.trim(), phone: raw.phone.trim(), message: raw.message.trim(), consent: raw.consent };
  if (!msg.name || !msg.message) throw new ContactError("נא למלא שם והודעה");
  if (!isPhone(msg.phone)) throw new ContactError("מספר הטלפון לא תקין");
  if (!msg.consent) throw new ContactError("נא לאשר את השימוש בפרטים");
  await backend.sendContact(msg as ContactMessage);
}
