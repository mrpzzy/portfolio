import Image from "next/image";
import { about, profile } from "@/lib/content";
import { Reveal } from "./Reveal";
import { Words } from "./Words";

export default function About() {
  return (
    <section
      id="about"
      className="scroll-mt-20 border-t border-hairline bg-paper-2 px-5 py-24 sm:px-8 sm:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:gap-16">
        {/* Portrait */}
        <Reveal className="lg:sticky lg:top-24 lg:self-start">
          <figure className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-hairline bg-paper">
            <Image
              src="/profile.jpg"
              alt={`Portrait of ${profile.shortName}`}
              fill
              sizes="(min-width: 1024px) 400px, 100vw"
              className="object-cover"
            />
            <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-end border-t border-hairline bg-paper/90 px-4 py-3 backdrop-blur-sm">
              <span className="font-mono text-[0.7rem] text-faint">Davao City, PH</span>
            </figcaption>
          </figure>
        </Reveal>

        <div>
          <Reveal>
            <p className="font-mono text-xs uppercase tracking-wider text-faint">
              <span className="text-accent">06</span> &nbsp;About
            </p>
          </Reveal>
          <Words
            as="h2"
            className="mt-6 max-w-[16ch] font-display text-display font-light uppercase leading-[1.2] tracking-wide"
          >
            {about.lead}
          </Words>

          <div className="mt-8 space-y-5">
            {about.paras.map((p, i) => (
              <Reveal key={i} delay={Math.min(i * 0.06, 0.18)}>
                <p className="max-w-[58ch] text-base leading-relaxed text-muted sm:text-lg">
                  {p}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-10 rounded-xl border border-hairline bg-paper p-6">
              <p className="font-mono text-[0.7rem] uppercase tracking-wider text-faint">
                Education
              </p>
              <p className="mt-2 text-base font-medium text-ink">
                {about.education.degree}
              </p>
              <p className="mt-1 text-sm text-muted">{about.education.school}</p>
              <p className="mt-1 text-sm text-faint">{about.education.detail}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
