"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { ChevronUp } from "lucide-react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * BackToTop — a floating chevron that appears once the user is past the first screen,
 * so from anywhere (even the bottom) they can glide straight back to the hero.
 * Transparent with mix-blend-difference so the mark stays visible over both the light
 * sections and the dark navy Contact footer. Lifts on hover; Lenis-smooth return.
 */
export default function BackToTop() {
  const lenis = useLenis();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.2 });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={toTop}
          aria-label="Back to top"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          whileHover={{ y: -5, scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center text-white mix-blend-difference sm:bottom-8 sm:right-8"
        >
          <ChevronUp size={30} strokeWidth={2} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
