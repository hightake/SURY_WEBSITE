import { LegalText } from "../components/LegalText";
import { site } from "../services/contentState";
import { usePageTitle } from "../lib/usePageTitle";

export function Accessibility() {
  usePageTitle(site.pages.accessibility.title);
  return <LegalText page={site.pages.accessibility} />;
}
