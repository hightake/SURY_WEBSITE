import { useEffect } from "react";

/** The site's official address. Search engines should index this one only. */
export const SITE_URL = "https://sury.co.il";

/**
 * Tells search engines the official address of the page on display, so the
 * same page served from Lovable's address or the preview is not indexed twice.
 * Built from the path, not from the content, so it is right for every product,
 * including ones added in the admin today. Admin pages get none.
 */
export function useCanonical(pathname: string, isAdmin: boolean) {
  useEffect(() => {
    let tag = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (isAdmin) {
      tag?.remove();
      return;
    }
    const base = import.meta.env.BASE_URL.replace(/\/$/, "");
    let path = base && pathname.startsWith(base) ? pathname.slice(base.length) : pathname;
    path = path.replace(/\/+$/, "") || "/";
    if (!tag) {
      tag = document.createElement("link");
      tag.rel = "canonical";
      document.head.appendChild(tag);
    }
    tag.href = SITE_URL + (path === "/" ? "/" : path);
  }, [pathname, isAdmin]);
}
