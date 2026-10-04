"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import { caseStudies, type CaseStudy } from "@/lib/content";
import { Reveal } from "./Reveal";
import { Words } from "./Words";

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((s) => (
        <li
          key={s}
          className="rounded-md border border-hairline bg-paper px-2 py-1 font-mono text-[0.7rem] text-muted"
        >
          {s}
        </li>
      ))}
    </ul>
  );
}

function DetailBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[0.7rem] uppercase tracking-wider text-faint">
        {label}
      </p>
      <div className="mt-2 text-[0.95rem] leading-relaxed text-muted">{children}</div>
    </div>
  );
}

function CaseCard({ study, index }: { study: CaseStudy; index: number }) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <div className="overflow-hidden rounded-2xl border border-hairline bg-paper-2/60 transition-colors hover:border-hairline-strong">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="block w-full px-6 py-7 text-left sm:px-8 sm:py-8"
      >
        <div className="flex items-center justify-between gap-4">
          <span className="font-mono text-xs text-faint tabular-nums">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {study.status && (
              <span className="rounded-full border border-hairline bg-paper px-2.5 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-muted">
                {study.status}
              </span>
            )}
            <span className="font-mono text-[0.7rem] uppercase tracking-wider text-accent">
              {study.tag}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h3 className="font-display text-display-s font-light uppercase leading-tight tracking-wide">
              {study.name}
            </h3>
            {study.full && (
              <p className="mt-1.5 text-sm tracking-wide text-faint">
                {study.full}
              </p>
            )}
            <p className="mt-3 text-base leading-relaxed text-muted">
              {study.summary}
            </p>
          </div>
          {study.metric && (
            <div className="shrink-0 sm:text-right">
              <p className="font-display text-4xl font-medium leading-none text-accent">
                {study.metric.value}
              </p>
              <p className="mt-2 text-xs text-faint">{study.metric.label}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <Chips items={study.stack.slice(0, 6)} />
          <span className="flex items-center gap-1.5 whitespace-nowrap text-xs font-medium uppercase tracking-[0.15em] text-ink">
            {open ? "Close" : "Read the story"}
            <motion.span
              aria-hidden
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex"
            >
              <ChevronDown size={16} strokeWidth={1.75} />
            </motion.span>
          </span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            animate={reduce ? { opacity: 1 } : { height: "auto", opacity: 1 }}
            exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="grid gap-8 border-t border-hairline px-6 py-8 sm:grid-cols-2 sm:px-8">
              <DetailBlock label="The problem">
                <p>{study.problem}</p>
              </DetailBlock>
              <DetailBlock label="What I built">
                <ul className="space-y-2">
                  {study.built.map((b) => (
                    <li key={b} className="flex gap-2.5">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </DetailBlock>
              <DetailBlock label="What made it interesting">
                <p>{study.interesting}</p>
              </DetailBlock>
              <DetailBlock label="My contribution">
                <p>{study.contribution}</p>
              </DetailBlock>

              <div className="sm:col-span-2">
                <DetailBlock label="Full stack">
                  <Chips items={study.stack} />
                </DetailBlock>
              </div>

              {study.live && (
                <div className="sm:col-span-2">
                  <a
                    href={study.live.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-paper transition-opacity hover:opacity-70"
                  >
                    Visit {study.live.label}
                    <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden />
                  </a>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Work() {
  return (
    <section
      id="work"
      className="scroll-mt-20 border-t border-hairline px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-wider text-faint">
            <span className="text-accent">02</span> &nbsp;Selected work
          </p>
        </Reveal>
        <Words
          as="h2"
          className="mt-6 max-w-[22ch] font-display text-display font-light uppercase leading-[1.15] tracking-wide"
        >
          A few systems, from the surface down.
        </Words>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[48ch] text-base text-muted">
            Each one starts as a quick summary. Open any card for the problem, what I
            built, and where the depth is.
          </p>
        </Reveal>

        <div className="mt-14 space-y-5">
          {caseStudies.map((study, i) => (
            <Reveal key={study.id} delay={Math.min(i * 0.05, 0.15)}>
              <CaseCard study={study} index={i} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
