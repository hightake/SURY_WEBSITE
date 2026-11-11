import { whatsappLink } from "../lib/content";
import { IconWhatsapp } from "./Icons";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink("שלום SURY, אשמח לפרטים")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="שיחה בוואטסאפ"
      className="fixed bottom-5 left-5 z-30 grid size-14 place-items-center rounded-full bg-primary text-bg shadow-[0_10px_25px_-8px_rgba(110,18,24,0.6)] transition-transform hover:scale-105 md:bottom-8 md:left-8"
    >
      <IconWhatsapp className="size-7" />
    </a>
  );
}
