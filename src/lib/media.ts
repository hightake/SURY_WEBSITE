import type { Img } from "../models/content";

const isAbsolute = (src: string) => /^(data:|blob:|https?:)/.test(src);
// uploaded images carry their own small version; bundled ones have a -sm.webp sibling
const smallOf = new Map<string, string>();
export const registerSmall = (img: Img) => {
  if (img.sm) smallOf.set(img.src, img.sm);
};

export const imgUrl = (src: string) => (isAbsolute(src) ? src : `${import.meta.env.BASE_URL}${src}`);
export const imgSmUrl = (src: string) => (isAbsolute(src) ? (smallOf.get(src) ?? src) : imgUrl(src.replace(/\.webp$/, "-sm.webp")));
export const srcSet = (img: Img) => (isAbsolute(img.src) ? `${imgUrl(img.src)} ${img.w}w` : `${imgSmUrl(img.src)} 700w, ${imgUrl(img.src)} ${img.w}w`);
