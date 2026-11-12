import { site, telLink, whatsappLink } from "../../lib/content";
import { ContactForm } from "../ContactForm";
import { Reveal } from "../Reveal";

/* Block 7 – contact (also the Contact page): a short letter to fill in. */
export function ContactBlock({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const c = site.home.contact;
  const H = headingLevel;
  return (
    <section className="py-20 md:py-28" aria-labelledby="contact-title">
      <div className="container-x max-w-4xl">
        <Reveal>
          <p className="eyebrow mb-3">Contact</p>
          <H id="contact-title" className="text-lg text-muted">
            {c.title} · {c.text}
          </H>
          <span aria-hidden className="mb-10 mt-6 block h-px w-12 bg-accent" />
        </Reveal>
        <Reveal delay={120}>
          <ContactForm />
        </Reveal>
        <Reveal delay={200}>
          <p className="mt-14 border-t border-shade/80 pt-8 text-lg leading-relaxed md:text-xl">
            מעדיפה לדבר?{" "}
            <a href={whatsappLink("שלום SURY, אשמח לפרטים")} target="_blank" rel="noopener noreferrer" className="link-underline text-primary">
              כתבי לנו בוואטסאפ
            </a>{" "}
            או התקשרי{" "}
            <a href={telLink(site.settings.phone)} dir="ltr" className="link-underline text-primary">
              {site.settings.phone}
            </a>
            .
          </p>
        </Reveal>
      </div>
    </section>
  );
}
