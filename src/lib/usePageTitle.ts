import { useEffect } from "react";

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} | SURY` : "SURY – מותג אחד, אינסוף אפשרויות";
  }, [title]);
}
