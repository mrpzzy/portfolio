import { experience, internship } from "@/lib/content";
import { Reveal, Stagger, RevealItem } from "./Reveal";
import { Words } from "./Words";

export default function Experience() {
  return (
    <section
      id="experience"
      className="scroll-mt-20 border-t border-hairline bg-paper-2 px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-wider text-faint">
            <span className="text-accent">03</span> &nbsp;Experience
          </p>
        </Reveal>
        <Words
          as="h2"
          className="mt-6 max-w-[22ch] font-display text-display font-light uppercase leading-[1.15] tracking-wide"
        >
          The short version of a longer story.
        </Words>

        <ol className="mt-16 ml-1 border-l border-hairline-strong">
          {experience.map((job) => (
            <li key={job.role + job.period} className="relative pb-16 pl-8 last:pb-0 sm:pl-12">
              <span
                className={`absolute -left-[6.5px] top-1.5 h-3 w-3 rounded-full ring-4 ring-paper-2 ${
                  job.current ? "bg-accent" : "bg-hairline-strong"
                }`}
                aria-hidden
              />
              <Reveal>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-mono text-xs uppercase tracking-wider text-faint">
                    {job.period}
                  </span>
                  {job.current && (
                    <span className="rounded-full bg-accent-soft px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-accent-strong">
                      Now
                    </span>
                  )}
                </div>

                <h3 className="mt-3 font-display text-xl font-light uppercase tracking-wide text-ink sm:text-2xl">
                  {job.role}
                </h3>
                <p className="mt-1 text-sm text-ink">
                  {job.org}
                  {job.meta && (
                    <span className="text-faint"> · {job.meta}</span>
                  )}
                </p>

                <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-muted">
                  {job.summary}
                </p>
              </Reveal>

              <Stagger as="ul" className="mt-5 max-w-[62ch] space-y-3" step={0.06}>
                {job.points.map((p) => (
                  <RevealItem as="li" key={p} className="flex gap-3">
                    <span
                      className="mt-[0.6rem] h-1 w-1 shrink-0 rounded-full bg-accent"
                      aria-hidden
                    />
                    <span className="text-[0.95rem] leading-relaxed text-muted">
                      {p}
                    </span>
                  </RevealItem>
                ))}
              </Stagger>
            </li>
          ))}

          {/* Internship — a shorter note on the same rail */}
          <li className="relative pl-8 sm:pl-12">
            <span
              className="absolute -left-[6.5px] top-1.5 h-3 w-3 rounded-full bg-hairline-strong ring-4 ring-paper-2"
              aria-hidden
            />
            <Reveal>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-mono text-xs uppercase tracking-wider text-faint">
                  {internship.period}
                </span>
                <span className="rounded-full border border-hairline px-2 py-0.5 font-mono text-[0.65rem] uppercase tracking-wider text-faint">
                  Internship
                </span>
              </div>
              <h3 className="mt-3 font-display text-xl font-light uppercase tracking-wide text-ink">
                {internship.role}
              </h3>
              <p className="mt-1 text-sm text-ink">
                {internship.org}
                <span className="text-faint"> · {internship.meta}</span>
              </p>
              <p className="mt-4 max-w-[60ch] text-base leading-relaxed text-muted">
                {internship.summary}
              </p>
            </Reveal>
          </li>
        </ol>
      </div>
    </section>
  );
}
