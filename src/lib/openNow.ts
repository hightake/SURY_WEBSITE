import type { Store } from "./content";

// Hebrew day letters used in the store hours → JS weekday (0 = Sunday)
const DAY: Record<string, number> = { "א": 0, "ב": 1, "ג": 2, "ד": 3, "ה": 4, "ו": 5, "ש": 6 };
const DAY_NAME = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];

function daysOf(label: string): number[] {
  const letters = label.replace(/[׳'"]/g, "").split(/[–-]/).map((s) => s.trim());
  const from = DAY[letters[0]];
  const to = DAY[letters[1] ?? letters[0]];
  if (from === undefined || to === undefined) return [];
  const out = [];
  for (let d = from; d <= to; d++) out.push(d);
  return out;
}

const toMin = (t: string) => {
  const [h, m] = t.trim().split(":").map(Number);
  return h * 60 + (m || 0);
};

export type OpenStatus = { open: true; until: string; next?: undefined } | { open: false; next?: string; until?: undefined };

/** Ranges [startMin, endMin, endLabel, startLabel] the store keeps on a weekday. */
function rangesOn(store: Store, wd: number) {
  return store.hours
    .filter(([days]) => daysOf(days).includes(wd))
    .map(([, range]) => {
      const [a, b] = range.split(/[–-]/).map((x) => x.trim());
      return { start: toMin(a), end: toMin(b), startLabel: a, endLabel: b };
    })
    .sort((x, y) => x.start - y.start);
}

/** Is the store open right now (Israel time)? Returns null if the hours can't be read. */
export function openStatus(store: Store, now = new Date()): OpenStatus | null {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jerusalem", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(now);
  const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.find((p) => p.type === "weekday")?.value ?? "");
  const mins = (Number(parts.find((p) => p.type === "hour")?.value) % 24) * 60 + Number(parts.find((p) => p.type === "minute")?.value);
  if (wd < 0 || Number.isNaN(mins)) return null;

  const today = rangesOn(store, wd);
  const current = today.find((r) => mins >= r.start && mins < r.end);
  if (current) return { open: true, until: current.endLabel };

  // next opening: later today, or the next day that has hours
  const later = today.find((r) => r.start > mins);
  if (later) return { open: false, next: `היום ב-${later.startLabel}` };
  for (let k = 1; k <= 7; k++) {
    const d = (wd + k) % 7;
    const first = rangesOn(store, d)[0];
    if (first) return { open: false, next: `${k === 1 ? "מחר" : `ביום ${DAY_NAME[d]}`} ב-${first.startLabel}` };
  }
  return { open: false };
}
