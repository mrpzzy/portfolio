"use client";

import { useEffect } from "react";
import { useLenis } from "lenis/react";

/**
 * CinematicSnap — strict, directed auto-advance through a chain of "stops" (payoffs):
 *   top → cat beat 1 → beat 2 → beat 3 → sections 01…08 (#what … #contact)
 * The gaps between stops are "dead-zones" (clouds, a half-faded line, or mid-section)
 * you can't usefully rest in — so when you scroll into a gap, we glide you to the stop
 * on the side you're heading toward, landing cleanly every time (never mid-fade).
 * Scroll FAST and it jumps several stops at once (velocity → jump count); scroll gently
 * and it advances one at a time. Smooth scroll (not a jump), user-driven only — Nav
 * links and reduced-motion are untouched.
 */

// Hero copy fades out over track-progress 0.2 → 0.32 (see useVideoScrub). Fire just past.
const HERO_TEXT_GONE = 0.34;
// Each banter beat's fully-centered point (cat scroll-progress) — see CatInterlude BEATS.
const CAT_BEATS = [0.3, 0.59, 0.875];
// Content sections 01…08, in document order (see page.tsx). First is the cat→work payoff.
const SECTION_IDS = [
  "what",
  "work",
  "experience",
  "approach",
  "capabilities",
  "about",
  "direction",
  "contact",
];
const NAV_OFFSET = 72; // land sections just below the fixed nav (matches Hero's scrollTo)

const PACE_HERO = 1.3; // base — feel the clouds glide, but keep it active (hero ↔ cat)
const PACE_NEXT = 0.5; // brisker base — the cat has already been seen (cat ↔ work)
const REVERSE = 0.4; // scroll-back is quicker — no cinematic payoff to savour going up
const MIN_DUR = 0.9;
const MAX_DUR = 3.5;

// Speed-adaptive glide: scale the base duration by how fast the user was scrolling.
const VREF = 30; // reference velocity (px) ≈ "normal" scroll → factor 1
const VEL_MIN = 0.4; // fast flick → as quick as 0.4× the base duration
const VEL_MAX = 1.6; // gentle nudge → as slow as 1.6× the base duration

// Fast-scroll multi-jump: how many stops a single gesture skips, scaled by velocity.
const VJUMP = 55; // velocity (px) per extra stop skipped
const MAX_JUMP = 4; // cap on stops skipped in one gesture
const FAST_V = 45; // velocity (px) above which a flick snaps even mid-section

// Content sections (01…08) stay READABLE: unlike the strict cat beats, a gentle scroll
// only snaps near a section's edge (within this band × viewport) — the middle is free.
// A fast flick (≥ FAST_V) overrides this and jumps from anywhere.
const SECTION_BAND = 0.5;

const INPUT_WINDOW = 400; // ms — only auto-advance if the user scrolled this recently
const EDGE = 0.1; // buffer (× viewport) around each payoff so landings don't re-trigger

// Ease-OUT (starts at full speed, decelerates): continues the user's scroll momentum
// instead of braking to a standstill first, so the hand-off doesn't hitch.
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export default function CinematicSnap() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return; // reduced motion → native scroll, no auto-advance

    const hero = document.getElementById("hero-track");
    const cat = document.getElementById("cat");
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (!hero || !cat || sections.length === 0) return;

    const absTop = (el: HTMLElement) =>
      el.getBoundingClientRect().top + window.scrollY;

    // Scroll positions (px), recomputed per event (resize-safe): the ordered chain of
    // stops [top, beat1-3, section 01…08] plus where the hero copy has faded out.
    const marks = () => {
      const vh = window.innerHeight;
      const heroSpan = hero.offsetHeight - vh;
      const catSpan = cat.offsetHeight - vh;
      const catTop = absTop(cat);
      return {
        heroTextGone: absTop(hero) + HERO_TEXT_GONE * heroSpan,
        stops: [
          0,
          ...CAT_BEATS.map((f) => catTop + f * catSpan),
          ...sections.map((el) => Math.max(0, absTop(el) - NAV_OFFSET)),
        ],
      };
    };

    // Clouds segment (top ↔ beat 1) keeps the slow cinematic pace; the rest are brisk.
    const paceFor = (gap: number, up: boolean) =>
      (gap === 0 ? PACE_HERO : PACE_NEXT) * (up ? REVERSE : 1);

    // Only auto-advance on genuine user scrolling — never hijack a Nav scrollTo.
    let lastInput = -Infinity;
    const markInput = () => {
      lastInput = performance.now();
    };
    window.addEventListener("wheel", markInput, { passive: true });
    window.addEventListener("touchmove", markInput, { passive: true });
    window.addEventListener("keydown", markInput);

    let auto = false;

    const glideTo = (toY: number, pace: number) => {
      const dist = Math.abs(toY - window.scrollY) / window.innerHeight;
      const v = Math.abs(lenis.velocity);
      const velFactor = Math.min(VEL_MAX, Math.max(VEL_MIN, VREF / Math.max(v, 1)));
      const duration = Math.min(MAX_DUR, Math.max(MIN_DUR, dist * pace * velFactor));
      auto = true;
      let settled = false;
      const done = () => {
        settled = true;
        auto = false;
      };
      lenis.scrollTo(toY, {
        duration,
        lock: true,
        easing: easeOutCubic,
        onComplete: done,
      });
      // Safety: never get stuck "auto" if onComplete is missed.
      window.setTimeout(() => {
        if (!settled) done();
      }, duration * 1000 + 300);
    };

    const onScroll = () => {
      if (auto) return;
      if (performance.now() - lastInput > INPUT_WINDOW) return; // user-driven only

      const dir = lenis.direction;
      if (dir !== 1 && dir !== -1) return;

      const vh = window.innerHeight;
      const y = window.scrollY;
      const { heroTextGone, stops } = marks();
      const b = vh * EDGE; // keep landings out of the trigger zones
      const v = Math.abs(lenis.velocity);
      const fast = v >= FAST_V;

      // The faster the scroll, the more stops a single gesture skips ahead.
      const jump = Math.min(MAX_JUMP, Math.max(1, Math.round(v / VJUMP)));

      // Gaps up to the cat exit are "strict" dead-zones (clouds, banter, exit) — any
      // scroll in them pulls you through. Beyond that are the content sections, which
      // must stay readable: only snap near an edge (or on a fast flick), middle is free.
      const CAT_GAPS = 1 + CAT_BEATS.length;
      const band = vh * SECTION_BAND;

      for (let i = 0; i < stops.length - 1; i++) {
        const lo = i === 0 ? heroTextGone : stops[i] + b;
        const hi = stops[i + 1] - b;
        if (y <= lo || y >= hi) continue;

        const strict = i < CAT_GAPS;
        const nearEdge = dir === 1 ? y > hi - band : y < lo + band;
        if (!strict && !fast && !nearEdge) break; // mid-section: free reading

        const to =
          dir === 1
            ? Math.min(stops.length - 1, i + jump)
            : Math.max(0, i + 1 - jump);
        glideTo(stops[to], paceFor(i, dir === -1));
        break;
      }
    };

    const unsubscribe = lenis.on("scroll", onScroll);

    return () => {
      unsubscribe();
      window.removeEventListener("wheel", markInput);
      window.removeEventListener("touchmove", markInput);
      window.removeEventListener("keydown", markInput);
    };
  }, [lenis]);

  return null;
}
