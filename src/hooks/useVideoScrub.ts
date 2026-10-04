"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import type {
  DataStream as Mp4DataStream,
  MP4ArrayBuffer,
  MP4Info,
  MP4VideoTrack,
} from "mp4box";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260821_114821_a8ca298f-be2c-4613-a4dd-51b69e16bbde.mp4";

const LERP_TAU = 10;
const SNAP = 0.0015;
const CLIP_END = 0.5; // only scrub the first half of the clip (the bright clouds) — skip the dark tail
const WATCHDOG = 60000;
const MAX_W = 1280; // downscale target — lighter decode, faster scrub
const TARGET_FRAMES = 180; // cap the bank — faster build, less main-thread jank on first scroll
const PREFETCH_AHEAD = 24; // frames to warm in the scroll direction
const PREFETCH_BEHIND = 8;
const CACHE_PAD = 6; // keep a little beyond the prefetch window before evicting

interface BankFrame {
  ts: number; // microseconds
  blob: Blob;
}

interface SampleChunk {
  type: "key" | "delta";
  timestamp: number;
  duration: number;
  data: Uint8Array;
}

/**
 * useVideoScrub — ties a video's playback position to scroll progress through `trackRef`,
 * and fades `contentRef` out as the scroll advances. All per-frame work happens in the
 * rAF loop via direct DOM writes (no React re-renders), for a smooth scrub.
 *
 * Prefers a WebCodecs-decoded frame bank (resident bitmap cache + directional prefetch);
 * falls back to native video.currentTime seeking if WebCodecs/CORS/decoding is unavailable.
 */
export function useVideoScrub(
  trackRef: RefObject<HTMLElement | null>,
  contentRef: RefObject<HTMLDivElement | null>,
) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvasLive, setCanvasLive] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });

    const bank: BankFrame[] = [];
    const bitmaps = new Map<number, ImageBitmap>();
    const pending = new Set<number>();
    let current = 0;
    let target = 0;
    let dur = 0;
    let ready = false;
    let reverted = false;
    let painted = false;
    let seeking = false;
    let stopped = false;
    let raf = 0;
    let lastT = 0;
    let dir = 1;
    let lastNearest = -1;
    let lastDrawn = -1;
    let watchdogTimer: number | undefined;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const getProgress = () => {
      const track = trackRef.current;
      if (!track) return 0;
      const span = track.offsetHeight - window.innerHeight;
      if (span <= 0) return 0;
      const y = window.scrollY - track.offsetTop;
      return Math.min(1, Math.max(0, y / span));
    };

    // --- video element setup (never auto-played; position driven by scroll) ---
    video.src = VIDEO_URL;
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.load();

    const onMeta = () => {
      dur = video.duration || 0;
    };
    const onSeeked = () => {
      seeking = false;
    };
    video.addEventListener("loadedmetadata", onMeta);
    video.addEventListener("seeked", onSeeked);

    // --- frame bank helpers ---
    const nearestIndex = (tSec: number) => {
      if (bank.length === 0) return -1;
      const tUs = tSec * 1e6;
      let lo = 0;
      let hi = bank.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (bank[mid].ts < tUs) lo = mid + 1;
        else hi = mid;
      }
      if (
        lo > 0 &&
        Math.abs(bank[lo - 1].ts - tUs) <= Math.abs(bank[lo].ts - tUs)
      ) {
        return lo - 1;
      }
      return lo;
    };

    const ensure = (idx: number) => {
      if (idx < 0 || idx >= bank.length || bitmaps.has(idx) || pending.has(idx)) {
        return;
      }
      pending.add(idx);
      createImageBitmap(bank[idx].blob)
        .then((bmp) => {
          pending.delete(idx);
          if (!stopped) bitmaps.set(idx, bmp);
          else bmp.close();
        })
        .catch(() => pending.delete(idx));
    };

    const evict = (center: number) => {
      const lo = center - PREFETCH_BEHIND - CACHE_PAD;
      const hi = center + PREFETCH_AHEAD + CACHE_PAD;
      for (const k of bitmaps.keys()) {
        if (k < lo || k > hi) {
          bitmaps.get(k)?.close();
          bitmaps.delete(k);
        }
      }
    };

    const drawFromBank = () => {
      const i = nearestIndex(current);
      if (i < 0) return;

      if (lastNearest >= 0 && i !== lastNearest) dir = i > lastNearest ? 1 : -1;
      lastNearest = i;

      // Prefetch a window biased in the scroll direction.
      const from = dir >= 0 ? i - PREFETCH_BEHIND : i - PREFETCH_AHEAD;
      const to = dir >= 0 ? i + PREFETCH_AHEAD : i + PREFETCH_BEHIND;
      for (let j = from; j <= to; j++) ensure(j);
      evict(i);

      // Draw the exact frame, or the nearest already-decoded neighbour (never blank).
      let drawIdx = -1;
      if (bitmaps.has(i)) drawIdx = i;
      else {
        for (let r = 1; r <= 12; r++) {
          if (bitmaps.has(i - r)) {
            drawIdx = i - r;
            break;
          }
          if (bitmaps.has(i + r)) {
            drawIdx = i + r;
            break;
          }
        }
      }

      if (drawIdx >= 0 && drawIdx !== lastDrawn && ctx) {
        const bmp = bitmaps.get(drawIdx);
        if (bmp) {
          ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);
          lastDrawn = drawIdx;
          if (!painted) {
            painted = true;
            setCanvasLive(true);
          }
        }
      }
    };

    // --- per-frame loop: all scroll-driven work, no React re-renders ---
    const loop = (t: number) => {
      if (stopped) return;
      const dt = lastT ? Math.min(0.1, (t - lastT) / 1000) : 0;
      lastT = t;

      const p = getProgress();

      // Drive hero content opacity directly on the DOM.
      const content = contentRef.current;
      if (content) {
        const o = p < 0.2 ? 1 : Math.max(0, 1 - (p - 0.2) / 0.12);
        content.style.opacity = String(o);
        content.style.pointerEvents = o < 0.1 ? "none" : "auto";
      }

      if (dur > 0) {
        target = p * dur * CLIP_END;
        if (prefersReduced) {
          current = target;
        } else {
          current += (target - current) * (1 - Math.exp(-dt * LERP_TAU));
          if (Math.abs(target - current) < SNAP) current = target;
        }

        if (ready) {
          drawFromBank();
        } else if (!reverted) {
          if (!seeking && Math.abs(video.currentTime - current) > 0.01) {
            seeking = true;
            try {
              video.currentTime = current;
            } catch {
              seeking = false;
            }
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // --- frame bank build (after load) ---
    const revert = (reason: string) => {
      if (reverted) return;
      reverted = true;
      ready = false;
      setCanvasLive(false);
      console.info(`[video-scrub] using video-seek fallback (${reason})`);
    };

    const buildDescription = (
      mp4: ReturnType<typeof import("mp4box").createFile>,
      MP4Box: typeof import("mp4box").default,
      track: MP4VideoTrack,
    ): Uint8Array | undefined => {
      const entry = mp4.getTrackById(track.id)?.mdia?.minf?.stbl?.stsd
        ?.entries?.[0];
      const raw = entry?.avcC ?? entry?.hvcC ?? entry?.vpcC ?? entry?.av1C;
      if (!raw) return undefined;
      const box = raw as { write: (s: Mp4DataStream) => void };
      const DataStream = MP4Box.DataStream;
      const stream = new DataStream(undefined, 0, DataStream.BIG_ENDIAN);
      box.write(stream);
      return new Uint8Array(stream.buffer, 8); // strip 8-byte box header
    };

    const decodeAll = (
      samples: SampleChunk[],
      track: MP4VideoTrack,
      description: Uint8Array | undefined,
      hw: "prefer-hardware" | "prefer-software",
      step: number,
    ) =>
      new Promise<void>((resolve, reject) => {
        let produced = 0;
        let encoded = 0;
        let expected = 0;
        let outputsDone = false;
        let finished = false;

        const checkFinish = () => {
          if (finished || !outputsDone || encoded < expected) return;
          finished = true;
          resolve();
        };

        const decoder = new VideoDecoder({
          output: (frame) => {
            // Decode every frame (deltas need it) but only keep every `step`-th — caps the bank.
            const keep = produced % step === 0;
            produced++;
            if (!keep) {
              frame.close();
              encoded++;
              checkFinish();
              return;
            }
            const ts = frame.timestamp;
            const scale = Math.min(1, MAX_W / (frame.displayWidth || MAX_W));
            const off = document.createElement("canvas");
            off.width = Math.max(1, Math.round((frame.displayWidth || MAX_W) * scale));
            off.height = Math.max(
              1,
              Math.round((frame.displayHeight || off.width) * scale),
            );
            const octx = off.getContext("2d");
            if (octx) octx.drawImage(frame, 0, 0, off.width, off.height);
            frame.close();
            if (octx) {
              off.toBlob(
                (blob) => {
                  if (blob) bank.push({ ts, blob });
                  encoded++;
                  checkFinish();
                },
                "image/webp",
                0.85,
              );
            } else {
              encoded++;
              checkFinish();
            }
          },
          error: (e) => reject(e),
        });

        const config: VideoDecoderConfig = {
          codec: track.codec,
          codedWidth: track.video?.width,
          codedHeight: track.video?.height,
          hardwareAcceleration: hw,
        };
        if (description) config.description = description;

        try {
          decoder.configure(config);
          for (const s of samples) {
            decoder.decode(
              new EncodedVideoChunk({
                type: s.type,
                timestamp: s.timestamp,
                duration: s.duration,
                data: s.data,
              }),
            );
          }
          decoder
            .flush()
            .then(() => {
              expected = produced;
              outputsDone = true;
              checkFinish();
            })
            .catch(reject);
        } catch (e) {
          reject(e);
        }
      });

    const buildBank = async () => {
      if (prefersReduced) return;
      if (typeof window === "undefined" || !("VideoDecoder" in window)) {
        revert("no WebCodecs");
        return;
      }

      watchdogTimer = window.setTimeout(() => revert("watchdog timeout"), WATCHDOG);

      try {
        const mod = await import("mp4box");
        const MP4Box = mod.default ?? (mod as unknown as typeof mod.default);

        const res = await fetch(VIDEO_URL);
        if (!res.ok) throw new Error(`fetch ${res.status}`);
        const buf = (await res.arrayBuffer()) as MP4ArrayBuffer;
        buf.fileStart = 0;

        const mp4 = MP4Box.createFile();

        const { track, samples, description } = await new Promise<{
          track: MP4VideoTrack;
          samples: SampleChunk[];
          description: Uint8Array | undefined;
        }>((resolve, reject) => {
          const collected: SampleChunk[] = [];
          mp4.onError = (e: string) => reject(new Error(e));
          mp4.onReady = (info: MP4Info) => {
            const vt = info.videoTracks[0];
            if (!vt) return reject(new Error("no video track"));
            const desc = buildDescription(mp4, MP4Box, vt);
            mp4.onSamples = (_id, _user, list) => {
              for (const smp of list) {
                collected.push({
                  type: smp.is_sync ? "key" : "delta",
                  timestamp: (smp.cts * 1e6) / smp.timescale,
                  duration: (smp.duration * 1e6) / smp.timescale,
                  data: new Uint8Array(smp.data),
                });
              }
              if (collected.length >= vt.nb_samples) {
                resolve({ track: vt, samples: collected, description: desc });
              }
            };
            mp4.setExtractionOptions(vt.id, null, { nbSamples: Infinity });
            mp4.start();
          };
          mp4.appendBuffer(buf);
          mp4.flush();
        });

        const step = Math.max(1, Math.round(track.nb_samples / TARGET_FRAMES));
        try {
          await decodeAll(samples, track, description, "prefer-hardware", step);
        } catch {
          bank.length = 0;
          await decodeAll(samples, track, description, "prefer-software", step);
        }

        if (bank.length === 0) throw new Error("no frames decoded");
        bank.sort((a, b) => a.ts - b.ts);
        ready = true;
        if (watchdogTimer) window.clearTimeout(watchdogTimer);
        console.info(`[video-scrub] frame bank ready: ${bank.length} frames`);

        // Warm the opening frames so the canvas can take over immediately.
        for (let j = 0; j < Math.min(bank.length, PREFETCH_AHEAD); j++) ensure(j);
      } catch (e) {
        if (watchdogTimer) window.clearTimeout(watchdogTimer);
        revert(e instanceof Error ? e.message : "decode error");
      }
    };

    // Start building immediately (don't wait for window.load, which waits for the
    // full video download first and then double-downloads for the fetch).
    const startTimer = window.setTimeout(() => void buildBank(), 0);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      if (watchdogTimer) window.clearTimeout(watchdogTimer);
      window.clearTimeout(startTimer);
      video.removeEventListener("loadedmetadata", onMeta);
      video.removeEventListener("seeked", onSeeked);
      bitmaps.forEach((b) => b.close());
      bitmaps.clear();
      pending.clear();
      bank.length = 0;
    };
  }, [trackRef, contentRef]);

  return { videoRef, canvasRef, canvasLive };
}
