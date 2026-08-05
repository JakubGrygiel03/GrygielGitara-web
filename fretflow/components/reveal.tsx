"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export type RevealVariant =
  | "up"
  | "down"
  | "left"
  | "right"
  | "scale"
  | "blur"
  | "fade";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms */
  delay?: number;
  /** Motion flavor — keep subtle; mix across the page for variety */
  variant?: RevealVariant;
  /** once = animate only first time in view */
  once?: boolean;
};

/**
 * Scroll-triggered entrance. Respects prefers-reduced-motion.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
  once = true,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisible(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setVisible(false);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -5% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once]);

  return (
    <div
      ref={ref}
      className={cn(
        "reveal-base",
        `reveal-${variant}`,
        visible ? "is-in" : "is-out",
        className,
      )}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
