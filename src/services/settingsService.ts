import type { LegalPage, Settings } from "../models/content";
import { toWhatsappNumber } from "../models/validation";

export function setWhatsapp(s: Settings, raw: string) {
  s.whatsapp = toWhatsappNumber(raw);
}

/** Replace {phone} / {email} in admin-edited text pages. */
export function fillTokens(text: string, s: Settings) {
  return text.replaceAll("{phone}", s.phone).replaceAll("{email}", s.email);
}

export const newLegalBlock = (): LegalPage["blocks"][number] => ({ heading: "", text: "" });
