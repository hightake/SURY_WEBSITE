import { useEffect } from "react";

/**
 * Home page: one wheel/trackpad gesture moves a whole section, so each section
 * fills the screen. Sections taller than the screen scroll normally until
 * their edge, then the next gesture moves on. Touch screens scroll natively.
 */
export function useSectionPaging() {
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    document.documentElement.classList.add("home-snap");
    let lockUntil = 0;

    const headerH = () => document.querySelector("header")?.getBoundingClientRect().height ?? 0;
    const sections = () => [...document.querySelectorAll<HTMLElement>("main > section"), document.querySelector<HTMLElement>("footer")].filter(Boolean) as HTMLElement[];

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return; // zoom / horizontal scrollers
      const now = performance.now();
      if (now < lockUntil) return e.preventDefault();
      const H = headerH();
      const view = window.innerHeight - H;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const secs = sections();
      const tops = secs.map((s) => Math.min(max, Math.round(s.getBoundingClientRect().top + y - H)));
      let i = 0;
      tops.forEach((t, k) => {
        if (t <= y + 2) i = k;
      });
      const curTop = tops[i];
      const curBottom = curTop + secs[i].offsetHeight; // in scroll coordinates (top of view = y)
      let target: number | null = null;

      if (e.deltaY > 0) {
        if (curBottom - (y + view) > 4) return; // still inside a tall section
        if (i + 1 < tops.length) target = tops[i + 1];
      } else {
        if (y - curTop > 4) return; // inside a tall section, scroll up natively
        if (i > 0) {
          const prevTop = tops[i - 1];
          const prevH = secs[i - 1].offsetHeight;
          target = prevH > view + 4 ? prevTop + prevH - view : prevTop; // a tall section is entered from its bottom
        }
      }
      if (target === null || Math.abs(target - y) < 2) return;
      e.preventDefault();
      lockUntil = now + 900;
      window.scrollTo({ top: target, behavior: "smooth" });
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      document.documentElement.classList.remove("home-snap");
    };
  }, []);
}
