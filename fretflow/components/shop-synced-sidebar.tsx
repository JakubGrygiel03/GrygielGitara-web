"use client";

import { type ReactNode, useEffect, useRef } from "react";

const HEADER_PX = 84;

/**
 * Left column stays in view; as the long description scrolls, this pane
 * eases through its own content (cover → form) in proportion to page progress.
 */
export function ShopSyncedSidebar({ children }: { children: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const inner = innerRef.current;
    if (!frame || !inner) return;

    const grid = frame.parentElement;
    if (!grid) return;

    const desktop = window.matchMedia("(min-width: 1024px)");

    const update = () => {
      if (!desktop.matches) {
        inner.style.transform = "";
        return;
      }

      const viewH = window.innerHeight - HEADER_PX;
      const extraLeft = Math.max(0, inner.scrollHeight - viewH);
      const extraGrid = Math.max(1, grid.scrollHeight - viewH);
      const scrolled = HEADER_PX - grid.getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0, scrolled / extraGrid));

      inner.style.transform = `translateY(${-progress * extraLeft}px)`;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    desktop.addEventListener("change", update);

    const resize = new ResizeObserver(update);
    resize.observe(inner);
    resize.observe(grid);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      desktop.removeEventListener("change", update);
      resize.disconnect();
    };
  }, []);

  return (
    <div
      ref={frameRef}
      className="lg:sticky lg:top-[5.25rem] lg:max-h-[calc(100dvh-5.75rem)] lg:self-start lg:overflow-hidden"
    >
      <div ref={innerRef} className="space-y-4 lg:will-change-transform">
        {children}
      </div>
    </div>
  );
}
