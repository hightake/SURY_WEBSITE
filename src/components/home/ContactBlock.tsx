import { useEffect, useState } from "react";
import { site, telLink, whatsappLink } from "../../lib/content";
import { ContactForm } from "../ContactForm";
import { IconMail, IconPhone, IconWhatsapp } from "../Icons";
import { Reveal } from "../Reveal";

/*
 * Block 7 – contact (also the Contact page).
 * DEMO: three directions, picked with ?ct=a|b|c
 *   a – stationery: the form as an arched card with a burgundy seal
 *   b – burgundy: dark section, underline fields, quick actions
 *   c – choose how to talk: WhatsApp with ready topics / phone / message
 * Once one is chosen the other two are removed.
 */
type Variant = "a" | "b" | "c";
type H = "h1" | "h2";

function useVariant(): Variant {
  const [v, setV] = useState<Variant>("a");
  useEffect(() => {
    const q = new URLSearchParams(window.location.search).get("ct");
    if (q === "b" || q === "c") setV(q);
  }, []);
  return v;
}

const WA_HELLO = "שלום SURY, אשמח לפרטים";

export function ContactBlock({ headingLevel = "h2" }: { headingLevel?: H }) {
  const v = useVariant();
  if (v === "b") return <Burgundy H={headingLevel} />;
  if (v === "c") return <Choose H={headingLevel} />;
  return <Stationery H={headingLevel} />;
}

function Heading({ H, dark = false, center = false }: { H: H; dark?: boolean; center?: boolean }) {
  const c = site.home.contact;
  return (
    <>
      <p className={`eyebrow mb-4 ${dark ? "text-accent" : ""}`}>Contact</p>
      <H id="contact-title" className="text-4xl font-light md:text-6xl">{c.title}</H>
      <span aria-hidden className={`mt-6 block h-px w-12 bg-accent ${center ? "mx-auto" : ""}`} />
      <p className={`mt-6 text-lg ${dark ? "text-bg/75" : "text-muted"}`}>{c.text}</p>
    </>
  );
}

/* ---------- a – stationery ---------- */
function Stationery({ H }: { H: H }) {
  return (
    <section className="niches-wall py-20 md:py-28" aria-labelledby="contact-title">
      <div className="container-x grid items-center gap-14 md:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <Reveal>
          <Heading H={H} />
          <div className="mt-10 grid gap-4 sm:max-w-sm">
            {[
              { href: whatsappLink(WA_HELLO), icon: <IconWhatsapp className="size-5" />, label: "וואטסאפ", value: site.settings.whatsappDisplay, ext: true },
              { href: telLink(site.settings.phone), icon: <IconPhone className="size-5" />, label: "טלפון", value: site.settings.phone },
              { href: `mailto:${site.settings.email}`, icon: <IconMail className="size-5" />, label: "מייל", value: site.settings.email },
            ].map((x) => (
              <a key={x.label} href={x.href} {...(x.ext ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="group flex items-center gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-full border border-accent/60 text-primary transition-colors group-hover:bg-primary group-hover:text-bg">{x.icon}</span>
                <span>
                  <span className="block text-xs tracking-wide text-muted">{x.label}</span>
                  <span dir="ltr" className="block break-all text-lg group-hover:text-primary">{x.value}</span>
                </span>
              </a>
            ))}
          </div>
        </Reveal>
        <Reveal delay={150}>
          <div className="contact-card px-6 pb-10 pt-24 sm:px-10 md:px-14 md:pt-28">
            <span className="contact-seal" aria-hidden>S</span>
            <p className="mb-8 text-center text-xl font-light md:text-2xl">כתבי לנו, ונחזור אלייך בהקדם</p>
            <ContactForm look="line" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- b – burgundy ---------- */
function Burgundy({ H }: { H: H }) {
  return (
    <section className="contact-dark relative overflow-hidden bg-[linear-gradient(180deg,#520c11,#3f080c)] py-20 text-bg md:py-28" aria-labelledby="contact-title">
      <p aria-hidden className="latin pointer-events-none absolute -bottom-10 left-0 right-0 select-none text-center text-[30vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(201,160,74,0.18)] md:text-[20vw]">
        SURY
      </p>
      <div className="container-x relative grid gap-14 md:grid-cols-[0.9fr_1.1fr] lg:gap-24">
        <Reveal>
          <Heading H={H} dark />
          <div className="mt-10 flex flex-wrap gap-3">
            <a href={whatsappLink(WA_HELLO)} target="_blank" rel="noopener noreferrer" className="btn bg-bg px-8 text-primary-dark hover:bg-surface">
              <IconWhatsapp />
              וואטסאפ
            </a>
            <a href={telLink(site.settings.phone)} className="btn border border-bg/50 px-8 text-bg hover:bg-bg/10">
              <IconPhone />
              <span dir="ltr">{site.settings.phone}</span>
            </a>
          </div>
        </Reveal>
        <Reveal delay={150}>
          <ContactForm look="line-dark" />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------- c – choose how to talk ---------- */
const TOPICS = ["שאלה על מידה והתאמה", "האם הדגם זמין בחנות?", "הזמנה מיוחדת", "מתנה / מארז"];

function Choose({ H }: { H: H }) {
  const [showForm, setShowForm] = useState(false);
  return (
    <section className="py-20 md:py-28" aria-labelledby="contact-title">
      <div className="container-x">
        <Reveal className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <Heading H={H} center />
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3 md:gap-6">
          {/* WhatsApp – the main way, with ready-made topics */}
          <Reveal className="md:row-span-2">
            <div className="flex h-full flex-col rounded-t-[999px] rounded-b-lg bg-primary px-7 pb-8 pt-20 text-center text-bg md:pt-24">
              <IconWhatsapp className="mx-auto size-9" />
              <h3 className="mt-4 text-2xl font-light">וואטסאפ</h3>
              <p className="mt-2 text-sm text-bg/75">הכי מהיר. בחרי נושא ונפתח לך הודעה מוכנה:</p>
              <ul className="mt-6 grid gap-2">
                {TOPICS.map((t) => (
                  <li key={t}>
                    <a href={whatsappLink(`שלום SURY, ${t}`)} target="_blank" rel="noopener noreferrer" className="block rounded-full border border-bg/30 px-4 py-2.5 text-sm transition-colors hover:bg-bg hover:text-primary">
                      {t}
                    </a>
                  </li>
                ))}
              </ul>
              <a href={whatsappLink(WA_HELLO)} target="_blank" rel="noopener noreferrer" dir="ltr" className="mt-auto pt-6 text-sm text-bg/80 underline-offset-4 hover:underline">
                {site.settings.whatsappDisplay}
              </a>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <a href={telLink(site.settings.phone)} className="group flex h-full flex-col items-center justify-center rounded-t-[999px] rounded-b-lg border border-accent/50 bg-bg px-7 pb-8 pt-16 text-center transition-colors hover:bg-surface/60">
              <IconPhone className="size-8 text-primary" />
              <h3 className="mt-4 text-2xl font-light">טלפון</h3>
              <p dir="ltr" className="mt-2 text-lg group-hover:text-primary">{site.settings.phone}</p>
              <p className="mt-1 text-sm text-muted">בשעות פתיחת החנויות</p>
            </a>
          </Reveal>
          <Reveal delay={200}>
            <button type="button" onClick={() => setShowForm((s) => !s)} aria-expanded={showForm} className="group flex h-full w-full flex-col items-center justify-center rounded-t-[999px] rounded-b-lg border border-accent/50 bg-bg px-7 pb-8 pt-16 text-center transition-colors hover:bg-surface/60">
              <IconMail className="size-8 text-primary" />
              <h3 className="mt-4 text-2xl font-light">השאירי הודעה</h3>
              <p className="mt-2 text-sm text-muted">ונחזור אלייך</p>
              <span className="link-underline mt-3 text-sm text-primary">{showForm ? "סגירה" : "לטופס"}</span>
            </button>
          </Reveal>
          <div className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-soft)] md:col-span-2 ${showForm ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
            <div className="overflow-hidden">
              <div className="rounded-lg border border-accent/40 bg-bg/70 p-6 md:p-8">{showForm && <ContactForm look="line" />}</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
