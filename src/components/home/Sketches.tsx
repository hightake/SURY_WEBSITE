/*
 * Gold line illustrations of the SURY worlds, drawn as fashion sketches.
 * Every path uses pathLength=1 so CSS can "draw" it (see .sketch in styles.css).
 */
import type { CSSProperties } from "react";

export type SketchName = "hat" | "bandana" | "robe" | "scarf" | "tichel" | "branch";

const paths: Record<SketchName, { d: string; accent?: boolean }[]> = {
  // cloche hat with a hand-made flower
  hat: [
    { d: "M22 74 C18 46 34 24 57 24 C80 24 94 42 90 72" },
    { d: "M12 76 C30 66 78 64 100 74 C82 84 30 86 12 76 Z" },
    { d: "M24 70 C40 64 72 63 88 69" },
    { d: "M34 50 c-7 -9 5 -15 9 -6 c5 -9 16 -2 9 6 c9 2 4 13 -4 9 c-2 9 -13 6 -9 -2 c-9 2 -11 -9 -5 -7 Z", accent: true },
    { d: "M42 52 c1 -1 2 -1 3 0", accent: true },
    { d: "M50 58 C58 62 66 64 74 62" },
  ],
  // bandana tied on a head form, seen from behind
  bandana: [
    { d: "M30 62 C26 34 40 16 58 16 C76 16 90 34 86 62 C78 72 38 72 30 62 Z" },
    { d: "M58 68 m-5 0 a5 4 0 1 0 10 0 a5 4 0 1 0 -10 0" },
    { d: "M54 71 C47 86 41 100 34 116 C43 110 50 100 56 74" },
    { d: "M62 71 C69 86 75 100 82 116 C73 110 66 100 60 74" },
    { d: "M44 34 l2 2 M66 30 l2 2 M56 46 l2 2 M40 52 l2 2 M74 50 l2 2", accent: true },
  ],
  // long robe with a round collar
  robe: [
    { d: "M45 12 C49 17 63 17 67 12 L74 18 C72 28 72 38 74 44 L88 116 L24 116 L38 44 C40 38 40 28 38 18 Z" },
    { d: "M45 12 C48 22 54 24 56 24 C58 24 64 22 67 12" },
    { d: "M38 44 L74 44" },
    { d: "M38 18 L24 58 L31 60 L40 34" },
    { d: "M74 18 L88 58 L81 60 L72 34" },
    { d: "M56 26 L56 42", accent: true },
    { d: "M50 72 C48 92 46 104 44 116 M62 72 C64 92 66 104 68 116" },
  ],
  // square silk scarf, draped
  scarf: [
    { d: "M18 32 L60 12 L98 34 L58 108 Z" },
    { d: "M25 34 L60 18 L91 36 L58 99 Z" },
    { d: "M18 32 C40 52 70 48 98 34" },
    { d: "M40 60 C48 54 58 54 66 60 C58 66 48 66 40 60 Z", accent: true },
    { d: "M58 70 C56 80 57 90 58 100" },
  ],
  // BLANCHE white tichel with eyelet embroidery
  tichel: [
    { d: "M14 30 L100 30 L57 106 Z" },
    { d: "M22 35 L92 35 L57 96 Z" },
    { d: "M57 46 L67 60 L57 74 L47 60 Z", accent: true },
    { d: "M57 52 m-2 0 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 M57 66 m-2 0 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 M51 60 m-2 0 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0 M63 60 m-2 0 a2 2 0 1 0 4 0 a2 2 0 1 0 -4 0", accent: true },
  ],
  // flowering branch – the brand's decorative element
  branch: [
    { d: "M14 110 C34 86 50 62 60 40 C66 26 76 16 92 10" },
    { d: "M34 84 C26 80 22 72 24 64 C32 68 36 76 34 84 Z" },
    { d: "M46 66 C54 62 62 64 66 70 C58 74 50 72 46 66 Z" },
    { d: "M58 44 C52 38 52 30 56 24 C62 30 62 38 58 44 Z" },
    { d: "M80 18 c-4 -6 4 -10 6 -4 c4 -6 12 0 6 4 c6 2 2 10 -4 6 c-2 6 -10 4 -6 -2 c-6 0 -6 -6 -2 -4 Z", accent: true },
  ],
};

export function Sketch({ name, className = "", style, delay = 0 }: { name: SketchName; className?: string; style?: CSSProperties; delay?: number }) {
  return (
    <svg viewBox="0 0 112 124" className={`sketch ${className}`} style={{ ...style, ["--sd" as string]: `${delay}ms` }} aria-hidden="true">
      {paths[name].map((p, i) => (
        <path key={i} d={p.d} pathLength={1} className={p.accent ? "sketch-accent" : undefined} style={{ ["--si" as string]: i }} />
      ))}
    </svg>
  );
}

export const worldSketches: { name: SketchName; label: string; category: string }[] = [
  { name: "hat", label: "כובעי SURY", category: "hats" },
  { name: "bandana", label: "בנדנות", category: "bandanas" },
  { name: "robe", label: "CLOA", category: "cloa" },
  { name: "scarf", label: "מטפחות וצעיפים", category: "scarves" },
  { name: "tichel", label: "BLANCHE", category: "blanche" },
];
