/*
 * Gold line sketches of the SURY worlds, traced from real product photos
 * (outline from the photo, inner lines drawn over it). Data: content/sketches.json.
 * Every path uses pathLength=1 so CSS can "draw" it (see .sketch in styles.css).
 */
import data from "../../content/sketches.json";

export type SketchName = "hat" | "bandana" | "robe" | "scarf" | "tichel";
type SketchData = { viewBox: string; paths: { d: string; accent?: boolean }[] };
const sketches = data as Record<SketchName, SketchData>;

export function Sketch({ name, className = "" }: { name: SketchName; className?: string }) {
  const s = sketches[name];
  return (
    <svg viewBox={s.viewBox} className={`sketch ${className}`} aria-hidden="true">
      {s.paths.map((p, i) => (
        <path key={i} d={p.d} pathLength={1} className={p.accent ? "sketch-accent" : undefined} style={{ ["--si" as string]: i }} />
      ))}
    </svg>
  );
}

export const worldSketches: { name: SketchName; label: string; category: string }[] = [
  { name: "hat", label: "כובעי SURY", category: "hats" },
  { name: "bandana", label: "בנדנות", category: "bandanas" },
  { name: "robe", label: "CLOA – אופנת בית", category: "cloa" },
  { name: "scarf", label: "מטפחות וצעיפים", category: "scarves" },
  { name: "tichel", label: "BLANCHE – חגיגיות לבנה", category: "blanche" },
];
