import type { Store } from "./content";

// Hebrew day letters used in the store hours → JS weekday (0 = Sunday)
const DAY: Record<string, number> = { "א": 0, "ב": 1, "ג": 2, "ד": 3, "ה": 4, "ו": 5, "ש": 6 };

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

/** Is the store open right now (Israel time)? Returns null if the hours can't be read. */
export function openStatus(store: Store, now = new Date()): { open: boolean; until?: string } | null {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Jerusalem", weekday: "short", hour: "2-digit", minute: "2-digit", hour12: false }).formatToParts(now);
  const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(parts.find((p) => p.type === "weekday")?.value ?? "");
  const mins = Number(parts.find((p) => p.type === "hour")?.value) * 60 + Number(parts.find((p) => p.type === "minute")?.value);
  if (wd < 0 || Number.isNaN(mins)) return null;
  for (const [days, range] of store.hours) {
    if (!daysOf(days).includes(wd)) continue;
    const [a, b] = range.split(/[–-]/);
    if (mins >= toMin(a) && mins < toMin(b)) return { open: true, until: b.trim() };
  }
  return { open: false };
}
