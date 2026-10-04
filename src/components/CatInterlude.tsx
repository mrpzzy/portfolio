"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";

/**
 * CatInterlude — a playful, fourth-wall personal beat between the hero and the work.
 * It opens on a cloud-matching tone and dissolves the cat image in (no hard seam from the hero),
 * then the cat zooms in → out → in while short lines of banter fade through in sequence.
 * Drop your Canva image at /public/cat.jpg (cloud placeholder until then).
 */

type Beat = {
  // opacity keyframes across section scroll progress: [inStart, inEnd, outStart, outEnd]
  window: [number, number, number, number];
  big: string;
  small: string;
  last?: string;
  caps?: boolean; // big line all-caps (default true); false → sentence case
};

const BEATS: Beat[] = [
  {
    window: [0.16, 0.26, 0.34, 0.43],
    big: "Hello there,",
    caps: false,
    small:
      "I hope you don’t mind that we slowed things down for a second.\nJuls loves cats, all types of cats.",
    last: "And that usually means he’s someone you can trust.",
  },
  {
    window: [0.46, 0.55, 0.63, 0.72],
    big: "Between us,",
    small:
      "I’ve got the best seat in the house, so I watch him work. He takes messy, tangled operations and turns them into systems that quietly just run.",
    last: "No drama. That’s rarer than you’d think.",
  },
  {
    window: [0.75, 0.83, 0.92, 1],
    big: "Anyway,\nScroll on.",
    small: "See ya!",
  },
];

function CatBeat({
  progress,
  beat,
  reduce,
}: {
  progress: MotionValue<number>;
  beat: Beat;
  reduce: boolean;
}) {
  const [a, b, c, d] = beat.window;
  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);
  const y = useTransform(progress, [a, b], reduce ? [0, 0] : [44, 0]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 flex flex-col justify-center px-6 sm:px-8 md:px-20 lg:px-32"
    >
      <p
        className={`whitespace-pre-line font-display text-[clamp(2.5rem,9vw,7rem)] font-light leading-[0.95] tracking-tight text-white ${
          beat.caps === false ? "" : "uppercase"
        }`}
      >
        {beat.big}
      </p>
      <p className="mt-5 max-w-[34ch] whitespace-pre-line text-base leading-relaxed tracking-wide text-white/80 sm:text-lg">
        {beat.small}
      </p>
      {beat.last && (
        <p className="mt-3 text-sm tracking-wide text-white/60">
          {beat.last}
        </p>
      )}
    </motion.div>
  );
}

export default function CatInterlude() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Dissolve the cat in from the cloud tone (removes the hard seam with the hero).
  const catOpacity = useTransform(scrollYProgress, [0, 0.15], [0, 1]);

  // Zoom choreography anchored on the cat's face:
  // beat 1 → in on the face · middle beat → out to the whole cat · beat 3 → in on the face.
  const scale = useTransform(
    scrollYProgress,
    [0, 0.3, 0.58, 0.85, 1],
    reduce ? [1.1, 1.1, 1.1, 1.1, 1.1] : [1.7, 1.65, 1.06, 1.65, 1.7],
  );

  return (
    <section id="cat" ref={ref} className="relative h-[280vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-cloud">
        {/* Cat image + scrim, dissolving in from the cloud tone */}
        <motion.div style={{ opacity: catOpacity }} className="absolute inset-0">
          {/* Cat image — add /public/cat.jpg (your Canva export). */}
          <motion.div
            aria-hidden
            style={{
              scale,
              transformOrigin: "70% 30%", // the cat's face — tweak if the crop is off
              backgroundImage: "url(/cat.jpg)",
            }}
            className="absolute inset-0 bg-cover bg-center"
          />
          {/* Soft scrim so the banter stays legible over the photo */}
          <div className="absolute inset-0 bg-gradient-to-r from-dark/80 via-dark/40 to-transparent" />
        </motion.div>

        {BEATS.map((beat) => (
          <CatBeat
            key={beat.big}
            progress={scrollYProgress}
            beat={beat}
            reduce={reduce}
          />
        ))}
      </div>
    </section>
  );
}
