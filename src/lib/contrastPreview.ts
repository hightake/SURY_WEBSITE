/*
 * TEMPORARY – colour-contrast preview for the owner (remove after choosing).
 * Open any page with ?contrast=1 to get a small switcher: today / A / B / C.
 */
const OPTIONS: Record<string, { label: string; eyebrow: string; numbers: string } | null> = {
  now: null,
  A: { label: "A · זהב־חום", eyebrow: "#7a5a1c", numbers: "#7a5a1c" },
  B: { label: "B · ברונזה", eyebrow: "#6b4c14", numbers: "#6b4c14" },
  C: { label: "C · בורדו", eyebrow: "#6e1218", numbers: "#7a5a1c" },
};

export function initContrastPreview() {
  const q = new URLSearchParams(location.search);
  let on = q.has("contrast");
  try {
    if (on) sessionStorage.setItem("contrast-preview", "1");
    else on = sessionStorage.getItem("contrast-preview") === "1";
  } catch {
    /* storage blocked – works for this page only */
  }
  if (!on) return;

  const style = document.createElement("style");
  document.head.appendChild(style);
  const apply = (key: string) => {
    const o = OPTIONS[key];
    style.textContent = o
      ? `.eyebrow:not(.\\!text-accent):not(.text-accent),.kicker{color:${o.eyebrow}!important}
         #worlds .latin.text-accent{color:${o.numbers}!important}
         .banner-hero .eyebrow{color:#f3dca8!important}`
      : "";
    bar.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.k === key)));
    try { sessionStorage.setItem("contrast-key", key); } catch { /* ignore */ }
  };

  const bar = document.createElement("div");
  bar.setAttribute("dir", "rtl");
  bar.style.cssText =
    "position:fixed;z-index:9999;bottom:16px;left:50%;transform:translateX(-50%);display:flex;gap:6px;padding:8px 10px;border-radius:999px;background:#1a1614;box-shadow:0 10px 30px rgba(0,0,0,.35);font:500 14px Heebo,sans-serif";
  const css = document.createElement("style");
  css.textContent =
    ".cp-b{border:0;border-radius:999px;padding:8px 14px;background:transparent;color:#f4ebe0;cursor:pointer;font:inherit}.cp-b[aria-pressed=true]{background:#c9a04a;color:#1a1614}";
  document.head.appendChild(css);
  for (const [k, o] of Object.entries(OPTIONS)) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "cp-b";
    b.dataset.k = k;
    b.textContent = o ? o.label : "היום";
    b.onclick = () => apply(k);
    bar.appendChild(b);
  }
  document.body.appendChild(bar);
  let start = "A";
  try { start = sessionStorage.getItem("contrast-key") || "A"; } catch { /* ignore */ }
  apply(start);
}
