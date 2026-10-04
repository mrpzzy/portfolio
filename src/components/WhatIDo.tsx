import { whatIDo } from "@/lib/content";
import { Reveal, Stagger, RevealItem } from "./Reveal";
import { Words } from "./Words";

export default function WhatIDo() {
  return (
    <section
      id="what"
      className="scroll-mt-20 border-t border-hairline px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-wider text-faint">
            <span className="text-accent">01</span> &nbsp;What I actually do
          </p>
        </Reveal>
        <Words
          as="h2"
          className="mt-6 max-w-[24ch] font-display text-display-s font-light uppercase leading-[1.2] tracking-wide sm:text-display"
        >
          {whatIDo.statement}
        </Words>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[48ch] text-base text-muted">{whatIDo.lead}</p>
        </Reveal>

        <Stagger as="ul" className="mt-14 border-t border-hairline">
          {whatIDo.items.map((item, i) => (
            <RevealItem as="li" key={item.problem}>
              <div className="group grid gap-2 border-b border-hairline py-6 transition-colors hover:bg-paper-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] sm:gap-10 sm:px-2">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-xs text-faint tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-lg font-medium leading-snug text-ink">
                    {item.problem}
                  </h3>
                </div>
                <p className="text-base leading-relaxed text-muted sm:pt-0.5">
                  {item.detail}
                </p>
              </div>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
