import type { ReactNode } from "react";

export function TextPage({ title, updated, children }: { title: string; updated?: string; children: ReactNode }) {
  return (
    <div className="container-x max-w-3xl py-14 md:py-20">
      <h1 className="text-4xl font-light md:text-5xl">{title}</h1>
      {updated && <p className="mt-3 text-sm text-muted">עודכן: {updated}</p>}
      <span aria-hidden className="mt-6 block h-px w-12 bg-accent" />
      <div className="mt-10 space-y-6 leading-relaxed text-ink/90 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-medium [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:ps-6 [&_a]:text-primary [&_a]:underline">
        {children}
      </div>
    </div>
  );
}
