"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ElementType } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Words — reveals a line of text word-by-word as it scrolls into view.
 * Each word fades + lifts in sequence so the sentence assembles itself.
 * `highlight` colours a contiguous phrase in the accent colour.
 * Under reduced motion it becomes a quick, static fade with no movement.
 */
export function Words({
  children,
  highlight,
  className,
  as = "span",
  step = 0.045,
  delay = 0,
  y = 16,
  trigger = "inView",
}: {
  children: string;
  highlight?: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  step?: number;
  delay?: number;
  y?: number;
  trigger?: "inView" | "mount";
}) {
  const reduce = useReducedMotion();
  const Tag = motion[as] as ElementType;

  const str = children;
  const tokens = str.split(/(\s+)/); // keep whitespace tokens so spacing survives
  // Character offset where each token starts (no mutation during render).
  const offsets = tokens.map((_, i) =>
    tokens.slice(0, i).reduce((sum, t) => sum + t.length, 0),
  );

  let hiStart = -1;
  let hiEnd = -1;
  if (highlight) {
    const i = str.indexOf(highlight);
    if (i >= 0) {
      hiStart = i;
      hiEnd = i + highlight.length;
    }
  }

  const container: Variants = {
    hidden: {
      transition: { staggerChildren: reduce ? 0 : step / 2, staggerDirection: -1 },
    },
    show: {
      transition: {
        staggerChildren: reduce ? 0 : step,
        delayChildren: delay,
      },
    },
  };

  const word: Variants = {
    hidden: reduce
      ? { opacity: 0, transition: { duration: 0.15 } }
      : { opacity: 0, y, transition: { duration: 0.4, ease: EASE } },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduce ? 0.12 : 0.5, ease: EASE },
    },
  };

  const triggerProps =
    trigger === "mount"
      ? { initial: "hidden" as const, animate: "show" as const }
      : {
          initial: "hidden" as const,
          whileInView: "show" as const,
          viewport: { once: false, margin: "-12% 0px -12% 0px" },
        };

  return (
    <Tag className={className} variants={container} {...triggerProps}>
      {tokens.map((tok, i) => {
        if (/^\s+$/.test(tok)) {
          return <span key={i}> </span>;
        }

        const start = offsets[i];
        const accent =
          highlight !== undefined && start >= hiStart && start < hiEnd;

        return (
          <motion.span
            key={i}
            variants={word}
            className={accent ? "inline-block text-accent" : "inline-block"}
          >
            {tok}
          </motion.span>
        );
      })}
    </Tag>
  );
}
