import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/** Gentle fade-up when the element enters the viewport (once). */
export function Reveal({ as: Tag = "div", className = "", delay = 0, children }: { as?: ElementType; className?: string; delay?: number; children: ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const visible = useInView(ref);
  return (
    <Tag ref={ref} className={`reveal ${visible ? "is-visible" : ""} ${className}`} style={delay ? { transitionDelay: `${delay}ms` } : undefined}>
      {children}
    </Tag>
  );
}

export function useInView(ref: React.RefObject<Element | null>, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) return setInView(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return inView;
}
