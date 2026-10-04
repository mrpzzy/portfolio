import { direction } from "@/lib/content";
import { Reveal, Stagger, RevealItem } from "./Reveal";
import { Words } from "./Words";

export default function Direction() {
  return (
    <section
      id="direction"
      className="scroll-mt-20 border-t border-hairline px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-wider text-faint">
            <span className="text-accent">07</span> &nbsp;Where I&apos;m headed
          </p>
        </Reveal>
        <Words
          as="h2"
          highlight="still hungry to learn."
          className="mt-6 max-w-[18ch] font-display text-display font-light uppercase leading-[1.2] tracking-wide"
        >
          {direction.statement}
        </Words>

        <Stagger
          as="ul"
          className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-4"
        >
          {direction.openTo.map((item, i) => (
            <RevealItem as="li" key={item}>
              <div className="h-full bg-paper p-6">
                <span className="font-mono text-xs text-accent tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-4 text-base font-medium leading-snug text-ink">
                  {item}
                </p>
              </div>
            </RevealItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
