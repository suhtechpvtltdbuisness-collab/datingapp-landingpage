"use client";
import { useEffect, useRef, useState } from "react";

/** IntersectionObserver-backed reveal. Fires once when the element enters the viewport. */
export function useScrollReveal<T extends Element = HTMLDivElement>(
  options: IntersectionObserverInit = { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        io.disconnect();
      }
    }, options);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return { ref, visible };
}
