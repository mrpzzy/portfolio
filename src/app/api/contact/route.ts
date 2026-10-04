import { Resend } from "resend";
import { profile } from "@/lib/content";

/**
 * POST /api/contact — sends the contact-form message to Julius via Resend.
 * The email always goes TO the site owner (profile.email) FROM Resend's shared
 * onboarding address, with the visitor set as reply-to so a reply reaches them
 * directly. Needs RESEND_API_KEY in the environment (Vercel + .env.local).
 */
export async function POST(request: Request) {
  let data: unknown;
  try {
    data = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const body = data as Record<string, unknown>;
  const name = String(body?.name ?? "").trim();
  const email = String(body?.email ?? "").trim();
  const message = String(body?.message ?? "").trim();

  if (!name || !email || !message) {
    return Response.json(
      { error: "Please fill in every field." },
      { status: 400 },
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json(
      { error: "That email doesn't look right." },
      { status: 400 },
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Email isn't configured yet. Try emailing directly." },
      { status: 500 },
    );
  }

  const resend = new Resend(apiKey);
  try {
    const { error } = await resend.emails.send({
      from: "Portfolio <onboarding@resend.dev>",
      to: profile.email,
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text: `From: ${name} <${email}>\n\n${message}`,
    });
    if (error) {
      return Response.json(
        { error: "Couldn't send right now. Try again in a moment." },
        { status: 502 },
      );
    }
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "Couldn't send right now. Try again in a moment." },
      { status: 502 },
    );
  }
}
