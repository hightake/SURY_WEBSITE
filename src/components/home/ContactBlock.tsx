import { site, telLink, whatsappLink } from "../../lib/content";
import { ContactForm } from "../ContactForm";
import { IconPhone, IconWhatsapp } from "../Icons";
import { Reveal } from "../Reveal";

export function ContactBlock({ headingLevel = "h2" }: { headingLevel?: "h1" | "h2" }) {
  const c = site.home.contact;
  const H = headingLevel;
  return (
    <section className="py-20 md:py-28" aria-labelledby="contact-title">
      <div className="container-x grid gap-12 md:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <Reveal>
          <p className="eyebrow mb-4">Contact</p>
          <H id="contact-title" className="text-3xl font-light md:text-5xl">{c.title}</H>
          <span aria-hidden className="mt-6 block h-px w-12 bg-accent" />
          <p className="mt-6 text-lg text-muted">{c.text}</p>
          <div className="mt-9 grid gap-3 sm:max-w-sm">
            <a href={whatsappLink("שלום SURY, אשמח לפרטים")} target="_blank" rel="noopener noreferrer" className="btn btn-primary justify-start">
              <IconWhatsapp />
              וואטסאפ <span dir="ltr" className="ms-auto">{site.settings.whatsappDisplay}</span>
            </a>
            <a href={telLink(site.settings.phone)} className="btn btn-outline justify-start">
              <IconPhone />
              טלפון <span dir="ltr" className="ms-auto">{site.settings.phone}</span>
            </a>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}
