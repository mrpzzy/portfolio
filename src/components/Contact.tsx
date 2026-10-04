"use client";

import { ArrowUpRight } from "lucide-react";
import { contact, profile } from "@/lib/content";
import { Reveal } from "./Reveal";
import { Words } from "./Words";
import { useContactModal } from "./ContactModal";

export default function Contact() {
  const year = 2026;
  const { open: openContact } = useContactModal();

  return (
    <footer
      id="contact"
      className="scroll-mt-20 bg-ink px-5 pt-24 pb-10 text-paper sm:px-8 sm:pt-32"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-wider text-paper/50">
            <span className="text-accent-bright">08</span> &nbsp;Contact
          </p>
        </Reveal>
        <Words
          as="h2"
          className="mt-6 max-w-[18ch] font-display text-display font-light uppercase leading-[1.15] tracking-wide"
        >
          {contact.big}
        </Words>
        <Reveal delay={0.1}>
          <p className="mt-6 max-w-[42ch] text-base leading-relaxed text-paper/70">
            {contact.sub}
          </p>
        </Reveal>

        <Reveal delay={0.08}>
          <button
            type="button"
            onClick={openContact}
            className="group mt-10 inline-flex max-w-full items-center gap-3 text-left font-display text-[clamp(1.6rem,5vw,3rem)] font-medium tracking-[-0.02em] text-paper transition-colors hover:text-accent-bright"
          >
            <span className="break-all">{profile.email}</span>
            <span
              aria-hidden
              className="flex shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            >
              <ArrowUpRight size={32} strokeWidth={1.5} />
            </span>
          </button>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-paper/15 bg-paper/10 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-ink p-6 transition-colors hover:bg-ink-2"
            >
              <p className="font-mono text-[0.7rem] uppercase tracking-wider text-paper/50">
                LinkedIn
              </p>
              <p className="mt-2 text-sm font-medium text-paper">
                /in/solutionswithjuls
              </p>
            </a>
            <a
              href={`https://wa.me/${profile.phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-ink p-6 transition-colors hover:bg-ink-2"
            >
              <p className="font-mono text-[0.7rem] uppercase tracking-wider text-paper/50">
                WhatsApp
              </p>
              <p className="mt-2 text-sm font-medium text-paper">{profile.phone}</p>
            </a>
            <a
              href={profile.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-ink p-6 transition-colors hover:bg-ink-2"
            >
              <p className="font-mono text-[0.7rem] uppercase tracking-wider text-paper/50">
                Telegram
              </p>
              <p className="mt-2 text-sm font-medium text-paper">{profile.telegram}</p>
            </a>
            <div className="bg-ink p-6">
              <p className="font-mono text-[0.7rem] uppercase tracking-wider text-paper/50">
                Based in
              </p>
              <p className="mt-2 text-sm font-medium text-paper">{profile.location}</p>
              <p className="mt-0.5 text-xs text-paper/50">{profile.remote}</p>
            </div>
          </div>
        </Reveal>

        <div className="mt-16 flex flex-col gap-3 border-t border-paper/15 pt-6 text-sm text-paper/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {profile.name}
          </p>
          <p className="font-mono text-xs">
            {profile.role} · Built with Next.js
          </p>
        </div>
      </div>
    </footer>
  );
}
