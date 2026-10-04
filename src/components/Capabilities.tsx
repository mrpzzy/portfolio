import { capabilities, certifications } from "@/lib/content";
import { Reveal, Stagger, RevealItem } from "./Reveal";
import { Words } from "./Words";

export default function Capabilities() {
  return (
    <section
      id="capabilities"
      className="scroll-mt-20 border-t border-hairline px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-wider text-faint">
            <span className="text-accent">05</span> &nbsp;Technical capabilities
          </p>
        </Reveal>
        <Words
          as="h2"
          className="mt-6 max-w-[22ch] font-display text-display font-light uppercase leading-[1.15] tracking-wide"
        >
          Grouped around what they&#39;re for.
        </Words>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[48ch] text-base text-muted">
            Not a wall of logos. Just the tools I reach for, organised by the kind of
            work they do.
          </p>
        </Reveal>

        <Stagger className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-2">
          {capabilities.map((cap) => (
            <RevealItem key={cap.group}>
              <div className="h-full bg-paper p-7 sm:p-8">
                <h3 className="font-display text-title font-light uppercase tracking-wide text-ink">
                  {cap.group}
                </h3>
                <p className="mt-2 text-sm text-faint">{cap.note}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {cap.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-md border border-hairline bg-paper-2 px-2.5 py-1 font-mono text-[0.72rem] text-muted"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </Stagger>

        <Reveal delay={0.05}>
          <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-hairline bg-paper-2/60 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <p className="font-mono text-[0.7rem] uppercase tracking-wider text-faint">
                Certified · {certifications.issuer} · {certifications.year}
              </p>
              <p className="mt-2 text-base font-medium text-ink">
                {certifications.items.join(" · ")}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
