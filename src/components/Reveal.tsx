"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ElementType, ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;
// once:false → elements animate IN when scrolled into the central band and OUT when they leave,
// so the page "feeds" information per scroll instead of staying static once shown.
const VIEWPORT = { once: false, margin: "-12% 0px -12% 0px" } as const;

/**
 * Reveal — fades + lifts a block in when it enters view, and back out when it leaves.
 * Under reduced motion it becomes a quick static fade with no movement.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "span" | "li" | "section";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as ElementType;

  const variants: Variants = {
    hidden: reduce
      ? { opacity: 0, transition: { duration: 0.2 } }
      : { opacity: 0, y, transition: { duration: 0.45, ease: EASE } },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, delay, ease: EASE },
    },
  };

  return (
    <MotionTag
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </MotionTag>
  );
}

/**
 * Stagger — a container whose <RevealItem> children animate in sequence on enter and out on leave.
 */
export function Stagger({
  children,
  className,
  step = 0.08,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  step?: number;
  as?: "div" | "ul" | "ol" | "section";
}) {
  const MotionTag = motion[as] as ElementType;
  const container: Variants = {
    hidden: { transition: { staggerChildren: step / 2, staggerDirection: -1 } },
    show: { transition: { staggerChildren: step } },
  };

  return (
    <MotionTag
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
    >
      {children}
    </MotionTag>
  );
}

export function RevealItem({
  children,
  className,
  y = 24,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  as?: "div" | "li" | "span";
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] as ElementType;
  const item: Variants = {
    hidden: reduce
      ? { opacity: 0, transition: { duration: 0.2 } }
      : { opacity: 0, y, transition: { duration: 0.45, ease: EASE } },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: EASE },
    },
  };

  return (
    <MotionTag className={className} variants={item}>
      {children}
    </MotionTag>
  );
}
