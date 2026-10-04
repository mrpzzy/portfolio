"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { ArrowUpRight, Check, X } from "lucide-react";
import { profile } from "@/lib/content";

const EASE = [0.16, 1, 0.3, 1] as const;

type Ctx = { open: () => void };
const ContactCtx = createContext<Ctx | null>(null);

/** Open the contact overlay from anywhere under the provider (Nav, Contact, …). */
export function useContactModal() {
  const ctx = useContext(ContactCtx);
  if (!ctx) throw new Error("useContactModal must be used within ContactModalProvider");
  return ctx;
}

type Status = "idle" | "sending" | "sent" | "error";

export function ContactModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  return (
    <ContactCtx.Provider value={{ open }}>
      {children}
      <ContactModal isOpen={isOpen} onClose={close} />
    </ContactCtx.Provider>
  );
}

function ContactModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const lenis = useLenis();
  const nameRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  // Lock background scroll while open (same approach as the mobile menu).
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    nameRef.current?.focus();
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
    };
  }, [isOpen, lenis]);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Reset to a clean form a beat after it closes.
  useEffect(() => {
    if (isOpen) return;
    const t = window.setTimeout(() => {
      setStatus("idle");
      setError("");
      setForm({ name: "", email: "", message: "" });
    }, 300);
    return () => window.clearTimeout(t);
  }, [isOpen]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error ?? "Something went wrong.");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const field =
    "mt-2 w-full rounded-lg border border-hairline bg-paper-2 px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-ink";
  const label =
    "font-mono text-[0.7rem] uppercase tracking-wider text-faint";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Contact Julius"
        >
          <div className="absolute inset-0 bg-dark/60 backdrop-blur-sm" />

          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-hairline bg-paper p-7 shadow-2xl sm:p-9"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full text-muted transition-colors hover:bg-paper-2 hover:text-ink"
            >
              <X size={18} strokeWidth={1.75} />
            </button>

            {status === "sent" ? (
              <div className="flex flex-col items-center py-8 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-ink text-paper">
                  <Check size={24} strokeWidth={2} />
                </span>
                <h2 className="mt-6 font-display text-2xl font-light uppercase tracking-wide text-ink">
                  Message sent
                </h2>
                <p className="mt-3 max-w-[32ch] text-sm leading-relaxed text-muted">
                  Thanks for reaching out. I read everything and I&apos;ll get back
                  to you soon.
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-7 rounded-full border border-ink/40 px-6 py-2.5 text-xs font-medium uppercase tracking-[0.15em] text-ink transition-colors hover:border-ink"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-display text-3xl font-light uppercase tracking-wide text-ink">
                  Let&apos;s talk
                </h2>
                <p className="mt-2 max-w-[38ch] text-sm leading-relaxed text-muted">
                  Say hi, ask anything, or just connect. I read everything.
                </p>

                <form onSubmit={submit} className="mt-7 space-y-5">
                  <div>
                    <label htmlFor="cm-name" className={label}>
                      Name
                    </label>
                    <input
                      id="cm-name"
                      ref={nameRef}
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, name: e.target.value }))
                      }
                      className={field}
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="cm-email" className={label}>
                      Email
                    </label>
                    <input
                      id="cm-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      className={field}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="cm-message" className={label}>
                      Message
                    </label>
                    <textarea
                      id="cm-message"
                      required
                      rows={4}
                      value={form.message}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, message: e.target.value }))
                      }
                      className={`${field} resize-none`}
                      placeholder="What's on your mind?"
                    />
                  </div>

                  {status === "error" && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}

                  <div className="flex flex-wrap items-center gap-x-5 gap-y-3 pt-1">
                    <button
                      type="submit"
                      disabled={status === "sending"}
                      className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-xs font-medium uppercase tracking-[0.15em] text-paper transition-opacity hover:opacity-70 disabled:opacity-50"
                    >
                      {status === "sending" ? "Sending…" : "Send message"}
                      <ArrowUpRight size={15} strokeWidth={1.75} aria-hidden />
                    </button>
                    <a
                      href={`mailto:${profile.email}`}
                      className="text-xs text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
                    >
                      or email directly
                    </a>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
