import { PageHero } from "../components/PageHero";
import { Reveal } from "../components/Reveal";
import { StoreCard } from "../components/StoreCard";
import { site } from "../lib/content";
import { usePageTitle } from "../lib/usePageTitle";

export function Stores() {
  usePageTitle("החנויות שלנו");
  return (
    <>
      <PageHero eyebrow="Our Stores" title="החנויות שלנו" text="בואי למדוד, להתייעץ ולמצוא את ההתאמה המדויקת." />
      <div className="container-x grid gap-5 py-14 md:grid-cols-3 md:gap-6 md:py-20">
        {site.stores.map((store, i) => (
          <Reveal key={store.city} delay={i * 110}>
            <StoreCard store={store} index={i} />
          </Reveal>
        ))}
      </div>
    </>
  );
}
