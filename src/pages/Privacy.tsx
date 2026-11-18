import { LegalText } from "../components/LegalText";
import { site } from "../services/contentState";
import { usePageTitle } from "../lib/usePageTitle";

export function Privacy() {
  usePageTitle(site.pages.privacy.title);
  return <LegalText page={site.pages.privacy} />;
}
