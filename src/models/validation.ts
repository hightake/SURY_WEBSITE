export const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
/** Israeli mobile in international form without "+", e.g. 972503970444 */
export const toWhatsappNumber = (v: string) => {
  const d = v.replace(/\D/g, "");
  return d.startsWith("0") ? `972${d.slice(1)}` : d;
};
export const isPhone = (v: string) => /^[0-9+\-\s]{9,15}$/.test(v.trim());
