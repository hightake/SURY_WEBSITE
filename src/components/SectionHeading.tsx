import { Reveal } from "./Reveal";
import { langOf } from "../lib/html";

export function SectionHeading({ eyebrow, title, text, align = "center", id, as: H = "h2" }: { eyebrow?: string; title: string; text?: string; align?: "center" | "start"; id?: string; as?: "h1" | "h2" }) {
  return (
    <Reveal className={`mb-10 md:mb-14 ${align === "center" ? "text-center mx-auto" : ""} max-w-2xl`}>
      {eyebrow && <p className="eyebrow mb-3" lang={langOf(eyebrow)}>{eyebrow}</p>}
      <H id={id} className="text-3xl md:text-5xl font-light tracking-tight">
        {title}
      </H>
      {align === "center" && <span aria-hidden className="gold-rule mx-auto mt-5" />}
      {text && <p className="mt-5 text-muted text-base md:text-lg">{text}</p>}
    </Reveal>
  );
}
