import { Link } from "@tanstack/react-router";
import { categories, site, telLink, whatsappLink } from "../lib/content";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="bg-ink text-bg/80">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.3fr_1fr_1fr_1fr] md:py-20">
        <div>
          <Logo className="h-12 text-bg" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed">
            <strong className="font-medium text-bg">מותג אחד</strong> אינסוף אפשרויות.
          </p>
        </div>
        <FooterCol title="הקולקציות">
          {categories.map((c) => (
            <li key={c.slug}>
              <Link to="/collection/$category" params={{ category: c.slug }} className="hover:text-bg">
                {c.name}
              </Link>
            </li>
          ))}
        </FooterCol>
        <FooterCol title="SURY">
          <li><Link to="/our-story" className="hover:text-bg">הסיפור שלנו</Link></li>
          <li><Link to="/stores" className="hover:text-bg">החנויות שלנו</Link></li>
          <li><Link to="/contact" className="hover:text-bg">צור קשר</Link></li>
        </FooterCol>
        <FooterCol title="דברו איתנו">
          <li><a href={telLink(site.settings.phone)} className="hover:text-bg" dir="ltr">{site.settings.phone}</a></li>
          <li><a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="hover:text-bg">וואטסאפ <span dir="ltr">{site.settings.whatsappDisplay}</span></a></li>
          <li><a href={`mailto:${site.settings.email}`} className="break-all hover:text-bg">{site.settings.email}</a></li>
          <li><Link to="/contact" className="text-accent hover:text-bg">השאירו לנו הודעה ←</Link></li>
        </FooterCol>
      </div>
      <div className="border-t border-bg/10">
        <div className="container-x flex flex-col gap-3 pb-28 pt-6 text-xs text-bg/60 md:flex-row md:items-center md:justify-between md:pb-28">
          <p>© {new Date().getFullYear()} SURY Headwear &amp; accessories</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-bg">מדיניות פרטיות</Link>
            <Link to="/accessibility" className="hover:text-bg">הצהרת נגישות</Link>
          </div>
          {/* site credit – HIGHTAKE wordmark (to be replaced by the logo file) */}
          <a href="mailto:hightake10@gmail.com" dir="ltr" aria-label="developed by HIGHTAKE – hightake10@gmail.com" className="group inline-flex items-center gap-2 text-bg/60 transition-colors hover:text-bg">
            <span>developed by</span>
            <span className="font-sans text-sm font-black tracking-wide text-bg">
              <span className="font-light text-[#FE5E5E]">{"{ "}</span>
              HIGHTAKE
              <span className="font-light text-[#FE5E5E]">{" }"}</span>
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="eyebrow mb-5 text-bg/50">{title}</h2>
      <ul className="space-y-3 text-sm">{children}</ul>
    </div>
  );
}
