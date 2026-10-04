import { howIThink } from "@/lib/content";
import { Reveal, Stagger, RevealItem } from "./Reveal";
import { Words } from "./Words";

export default function HowIThink() {
  return (
    <section
      id="approach"
      className="scroll-mt-20 bg-ink px-5 py-24 text-paper sm:px-8 sm:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        {/* Sticky intent column */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-wider text-paper/50">
              <span className="text-accent-bright">04</span> &nbsp;How I think
            </p>
          </Reveal>
          <Words
            as="h2"
            className="mt-6 max-w-[18ch] font-display text-display font-light uppercase leading-[1.2] tracking-wide"
          >
            {howIThink.statement}
          </Words>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-[40ch] text-base leading-relaxed text-paper/70">
              The tools change constantly. The way I move through a problem doesn&apos;t.
              Roughly, it goes like this.
            </p>
          </Reveal>
        </div>

        {/* Steps */}
        <Stagger as="ol" className="space-y-px" step={0.07}>
          {howIThink.steps.map((step) => (
            <RevealItem as="li" key={step.k}>
              <div className="border-t border-paper/15 py-6">
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-sm text-accent-bright tabular-nums">
                    {step.k}
                  </span>
                  <div>
                    <h3 className="text-lg font-medium text-paper">{step.title}</h3>
                    <p className="mt-2 max-w-[52ch] text-[0.95rem] leading-relaxed text-paper/65">
                      {step.detail}
                    </p>
                  </div>
                </div>
              </div>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
