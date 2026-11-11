import { ContactBlock } from "../components/home/ContactBlock";
import { usePageTitle } from "../lib/usePageTitle";

export function Contact() {
  usePageTitle("צור קשר");
  return (
    <div className="bg-hero">
      <ContactBlock headingLevel="h1" />
    </div>
  );
}
