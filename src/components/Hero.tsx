"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type Variants,
} from "framer-motion";
import { useLenis } from "lenis/react";
import { ArrowRight } from "lucide-react";
import { hero, profile } from "@/lib/content";
import { Words } from "./Words";
import { useVideoScrub } from "@/hooks/useVideoScrub";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const trackRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const { videoRef, canvasRef, canvasLive } = useVideoScrub(
    trackRef,
    contentRef,
  );
  const reduce = useReducedMotion();
  const lenis = useLenis();

  // Ghost the clouds toward the cloud tone as the scrub ends — soft blend into the cat.
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const cloudGhost = useTransform(scrollYProgress, [0.72, 1], [0, 0.85]);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };
  const item: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
  };

  const toWork = (e: React.MouseEvent) => {
    e.preventDefault();
    if (lenis) lenis.scrollTo("#work", { offset: -72 });
    else document.querySelector("#work")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero-track" ref={trackRef} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-dark">
        {/* Scroll-driven fly-through — never auto-played */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          preload="auto"
          aria-hidden
        />
        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300"
          style={{ opacity: canvasLive ? 1 : 0 }}
          aria-hidden
        />

        {/* Clouds ghost to the pale cloud tone near the end — soft blend into the cat */}
        <motion.div
          aria-hidden
          style={{ opacity: cloudGhost }}
          className="pointer-events-none absolute inset-0 bg-cloud"
        />

        {/* Hero content — our copy, left-aligned; opacity driven by the scrub loop */}
        <div
          ref={contentRef}
          className="absolute inset-0 flex flex-col justify-center px-6 pt-20 pb-10 sm:px-8 md:px-20 lg:px-32"
          style={{ opacity: 1, pointerEvents: "auto" }}
        >
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="w-full max-w-5xl"
          >
            <motion.p
              variants={item}
              className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium uppercase tracking-[0.2em] text-ink/70"
            >
              <span className="text-ink">{hero.eyebrow}</span>
              <span className="text-ink/30" aria-hidden>
                /
              </span>
              <span>{profile.location}</span>
              <span className="text-ink/30" aria-hidden>
                /
              </span>
              <span>Remote</span>
            </motion.p>

            <Words
              as="h1"
              trigger="mount"
              delay={0.3}
              step={0.06}
              highlight="working systems."
              className="mt-5 max-w-[16ch] font-display text-hero font-light uppercase leading-[1.05] tracking-tight text-ink"
            >
              I turn business problems into working systems.
            </Words>

            <motion.p
              variants={item}
              className="mt-5 max-w-[44ch] text-sm leading-relaxed text-ink/80 sm:text-base"
            >
              {hero.sub}
            </motion.p>

            <motion.div
              variants={item}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <a
                href="#work"
                onClick={toWork}
                className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.15em] text-paper transition-opacity hover:opacity-70"
              >
                See the work
                <ArrowRight size={15} strokeWidth={1.75} />
              </a>
              <a
                href={`mailto:${profile.email}`}
                className="rounded-full border border-ink/40 px-6 py-3 text-xs font-medium uppercase tracking-[0.15em] text-ink transition-colors hover:border-ink"
              >
                Email me
              </a>
            </motion.div>

            <motion.div
              variants={item}
              className="mt-8 grid max-w-xl gap-px overflow-hidden rounded-lg border border-ink/15 bg-ink/15 sm:grid-cols-2"
            >
              <div className="bg-paper/70 p-4 backdrop-blur-sm">
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted">
                  Now
                </p>
                <p className="mt-1 text-sm font-medium text-ink">
                  Independent · building client systems
                </p>
              </div>
              <div className="bg-paper/70 p-4 backdrop-blur-sm">
                <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted">
                  Previously
                </p>
                <p className="mt-1 text-sm font-medium text-ink">
                  Lead Automator · Aruna Talent (US)
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
