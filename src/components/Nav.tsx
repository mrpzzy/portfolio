"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, type Variants } from "framer-motion";
import { useLenis } from "lenis/react";
import { X } from "lucide-react";
import { nav, profile } from "@/lib/content";

// Extra downward scroll past the section's scroll-mt-20 clearance, so content sits
// higher under the nav instead of leaving a gap. Raise to scroll further down.
const NAV_SCROLL_OFFSET = 104;

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lenis = useLenis();

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const track = document.getElementById("hero-track");
      const y = window.scrollY;
      const vh = window.innerHeight;
      if (track) {
        const span = Math.max(1, track.offsetHeight - vh);
        const inside = y < track.offsetTop + span;
        setSolid(!inside);
        setDark(false); // clouds stay bright now — keep the nav navy throughout
      } else {
        setSolid(y > vh * 0.2);
        setDark(false);
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Lock scroll while the mobile menu is open.
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      lenis?.stop();
    } else {
      document.body.style.overflow = "";
      lenis?.start();
    }
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [menuOpen, lenis]);

  const onDark = dark && !solid;
  const inkText = onDark ? "text-white" : "text-ink";

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    if (href === "#top") {
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    // Sections carry `scroll-mt-20` (80px) which Lenis honors as scroll-margin; that
    // alone leaves a gap below the 64px nav. A positive offset scrolls a bit further
    // down so the section's empty top edge tucks under the nav and content sits higher.
    if (lenis) lenis.scrollTo(href, { offset: NAV_SCROLL_OFFSET });
    else document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const linkContainer: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
  };
  const linkItem: Variants = {
    hidden: { opacity: 0, y: -12 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          solid ? "border-b border-hairline bg-paper/85 backdrop-blur-md" : "border-b border-transparent"
        }`}
      >
        <motion.nav
          variants={linkContainer}
          initial="hidden"
          animate="show"
          className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8"
        >
          {/* Wordmark */}
          <motion.a
            variants={linkItem}
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollTo("#top");
            }}
            className="group"
            aria-label={`${profile.name} — back to top`}
          >
            <span
              className={`text-xs font-semibold uppercase tracking-[0.18em] transition-colors sm:text-sm ${inkText}`}
            >
              {profile.name}
            </span>
          </motion.a>

          {/* Desktop links */}
          <div className="hidden items-center gap-8 md:flex">
            {nav.map((item) => (
              <motion.a
                key={item.href}
                variants={linkItem}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(item.href);
                }}
                className={`text-xs font-medium uppercase tracking-[0.15em] transition-opacity hover:opacity-70 ${inkText}`}
              >
                {item.label}
              </motion.a>
            ))}
            <motion.a
              variants={linkItem}
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-xs font-medium uppercase tracking-[0.15em] transition-opacity hover:opacity-70 ${inkText}`}
            >
              Resume
            </motion.a>
            <motion.button
              variants={linkItem}
              type="button"
              onClick={() => scrollTo("#contact")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium uppercase tracking-[0.15em] transition-colors ${
                onDark
                  ? "border-white/50 text-white hover:bg-white hover:text-ink"
                  : "border-ink/40 text-ink hover:border-ink hover:bg-ink hover:text-paper"
              }`}
            >
              Contact
            </motion.button>
          </div>

          {/* Mobile hamburger */}
          <motion.button
            variants={linkItem}
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className="flex flex-col items-end gap-[5px] md:hidden"
          >
            <span className={`h-[2px] w-6 transition-colors ${onDark ? "bg-white" : "bg-ink"}`} />
            <span className={`h-[2px] w-6 transition-colors ${onDark ? "bg-white" : "bg-ink"}`} />
            <span className={`h-[2px] w-4 transition-colors ${onDark ? "bg-white" : "bg-ink"}`} />
          </motion.button>
        </motion.nav>
      </header>

      {/* Scroll progress */}
      <motion.div
        className={`fixed inset-x-0 top-0 z-[60] h-[2px] origin-left ${onDark ? "bg-white" : "bg-ink"}`}
        style={{ scaleX: progress }}
        aria-hidden
      />

      {/* Mobile menu overlay */}
      <div
        className={`fixed inset-0 z-[100] bg-dark transition-all duration-500 md:hidden ${
          menuOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
      >
        <div
          className={`flex h-full flex-col transition-transform duration-500 ${
            menuOpen ? "translate-y-0" : "-translate-y-8"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.4,0,0.2,1)" }}
        >
          <div className="flex justify-end px-6 pt-8 sm:px-8 sm:pt-12">
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="grid h-10 w-10 place-items-center rounded-full border border-white/30 text-white transition-colors hover:border-white"
            >
              <X size={18} strokeWidth={1.75} />
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center px-8 sm:px-12">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo(item.href);
                }}
                className="py-3 text-2xl font-light uppercase tracking-wide text-white/60 transition-colors hover:text-white sm:text-3xl"
              >
                {item.label}
              </a>
            ))}
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3 text-2xl font-light uppercase tracking-wide text-white/60 transition-colors hover:text-white sm:text-3xl"
            >
              Resume
            </a>
            <button
              type="button"
              onClick={() => scrollTo("#contact")}
              className="py-3 text-left text-2xl font-light uppercase tracking-wide text-white transition-colors hover:text-white sm:text-3xl"
            >
              Contact
            </button>
          </nav>

          <div className="flex gap-8 px-8 pb-10 sm:px-12">
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="text-xs uppercase tracking-[0.2em] text-white/60 transition-colors hover:text-white"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
