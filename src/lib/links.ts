import { site } from "../services/contentState";

export const whatsappLink = (text?: string) => `https://wa.me/${site.settings.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
export const telLink = (phone: string) => `tel:${phone.replace(/[^\d+]/g, "")}`;
export const navLink = (query: string) => `https://waze.com/ul?q=${encodeURIComponent(query)}&navigate=yes`;
