import { useEffect } from "react";

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | SURY` : "SURY - כובעים, בנדנות ומטפחות ראש | מותג אחד, אינסוף אפשרויות";
  }, [title]);
}
