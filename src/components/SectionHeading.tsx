import { Reveal } from "./Reveal";

export function SectionHeading({ eyebrow, title, text, align = "center", id }: { eyebrow?: string; title: string; text?: string; align?: "center" | "start"; id?: string }) {
  return (
    <Reveal className={`mb-10 md:mb-14 ${align === "center" ? "text-center mx-auto" : ""} max-w-2xl`}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <h2 id={id} className="text-3xl md:text-5xl font-light tracking-tight">
        {title}
      </h2>
      {align === "center" && <span aria-hidden className="mx-auto mt-5 block h-px w-12 bg-accent" />}
      {text && <p className="mt-5 text-muted text-base md:text-lg">{text}</p>}
    </Reveal>
  );
}
