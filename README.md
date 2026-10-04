# Julius Baltazar Ayuno — Portfolio

A cinematic, scroll-driven personal portfolio. Next.js (App Router) · Tailwind CSS v4 · Framer Motion · Lenis · WebCodecs/mp4box scroll-tied video.

**Design:** navy monochrome (`#1D3045`) · Helvetica Neue ME · uppercase tracked display type. The hero is a scroll-scrubbed aerial fly-through: scrolling plays the video frame-by-frame (decoded via WebCodecs into a frame bank, with a native video-seek fallback). The nav flips navy→white as the footage darkens, then goes solid over the content below.

## Run it

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## How it's organised

- **`src/lib/content.ts`** — all copy lives here. Edit this file to change any text, project, metric, or list. Nothing is hard-coded in the components except the hero headline (so its accent word can be styled).
- **`src/components/`** — one file per section: `Hero`, `WhatIDo`, `Work`, `Experience`, `HowIThink`, `Capabilities`, `About`, `Direction`, `Contact`, plus `Nav`, `Reveal` (scroll animations), `SmoothScroll` (Lenis + reduced-motion).
- **`src/app/globals.css`** — the design system: OKLCH color tokens, fonts, fluid type scale. Change the accent in one line (`--color-accent`).
- **`src/app/layout.tsx`** — fonts and page metadata (title, description, social preview).

## Add your portrait later

Open `src/components/About.tsx`. The `<figure>` is a deliberate placeholder (monogram + caption). Drop a photo in `/public` and replace the inner block with:

```tsx
import Image from "next/image";
// inside the <figure>:
<Image src="/portrait.jpg" alt="Julius Ayuno" fill className="object-cover" />
```

## The scroll-tied video

- Lives in `src/hooks/useVideoScrub.ts` and `src/components/Hero.tsx`. The hero is a `300vh` scroll track with a sticky viewport; scroll position maps to video time.
- Smooth path: fetches the MP4, decodes frames with WebCodecs into a frame bank (LRU of `ImageBitmap`s), draws the nearest frame to a canvas with scroll-lerp. The video host sends `Access-Control-Allow-Origin: *`, so this works.
- Fallback: if WebCodecs/CORS/decoding is unavailable, it seeks the `<video>` element directly. A 60s watchdog reverts to the fallback if the bank never builds.
- To change the hero length, edit `h-[300vh]` in `Hero.tsx`.

## Design notes

- **Motion respects `prefers-reduced-motion`** — the frame bank is skipped, smooth scroll and transforms turn off; content stays fully readable.
- **Mobile-first**, verified from 320px up. No horizontal scroll. Nav collapses to a full-screen overlay.
- Everything on the page is drawn from the CV — no invented metrics or claims. The theme was applied without adding, removing, or changing any content.

## Deploy

Push to GitHub and import on [Vercel](https://vercel.com), or:

```bash
npx vercel        # preview
npx vercel --prod # production
```
