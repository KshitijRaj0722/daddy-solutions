import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Brief = {
  name?: string;
  email?: string;
  projectType?: string;
  budget?: string;
  message?: string;
  company_website?: string; // honeypot
};

/**
 * In-memory throttle. Good enough for a marketing form on a single instance —
 * swap for Redis/Upstash when this runs in more than one region.
 */
const hits = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);

  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const isEmail =(value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "That's a lot of briefs in one minute. Give it sixty seconds." },
      { status: 429 },
    );
  }

  let body: Brief;
  try {
    body = (await request.json()) as Brief;
  } catch {
    return NextResponse.json({ ok: false, error: "We couldn't read that submission." }, { status: 400 });
  }

  // Bots fill hidden fields; people don't.
  if (body.company_website) {
    return NextResponse.json({ ok: true });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: "Add a name we can reply to." }, { status: 422 });
  }
  if (!isEmail(email)) {
    return NextResponse.json({ ok: false, error: "That email address looks off. Check it and resend." }, { status: 422 });
  }
  if (message.length < 12) {
    return NextResponse.json(
      { ok: false, error: "Give us a couple more lines about the project so the reply is useful." },
      { status: 422 },
    );
  }

  const brief = {
    receivedAt: new Date().toISOString(),
    name,
    email,
    projectType: body.projectType?.trim() || "Unspecified",
    budget: body.budget?.trim() || "Unspecified",
    message,
    source: ip,
  };

  const apiKey = process.env.RESEND_API_KEY;
  const inbox = process.env.CONTACT_INBOX;

  if (!apiKey || !inbox) {
    // Local dev without credentials: keep the form working by logging the brief.
    console.info("[contact] RESEND_API_KEY / CONTACT_INBOX not set — logging only", brief);
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { ok: false, error: "We couldn't send that right now. Please email us directly." },
        { status: 500 },
      );
    }
    return NextResponse.json({ ok: true });
  }

  const rows: [string, string][] = [
    ["Name", brief.name],
    ["Email", brief.email],
    ["Needs", brief.projectType],
    ["Budget", brief.budget],
    ["Received", brief.receivedAt],
  ];

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || "Daddy Solutions <onboarding@resend.dev>",
        to: [inbox],
        reply_to: brief.email,
        subject: `New brief from ${brief.name} — ${brief.projectType}`,
        text: [
          ...rows.map(([label, value]) => `${label}: ${value}`),
          "",
          brief.message,
        ].join("\n"),
        html:
          `<table>${rows
            .map(([label, value]) => `<tr><td><b>${label}</b></td><td>${escapeHtml(value)}</td></tr>`)
            .join("")}</table>` + `<p style="white-space:pre-wrap">${escapeHtml(brief.message)}</p>`,
      }),
    });

    if (!res.ok) {
      console.error("[contact] Resend rejected the brief", res.status, await res.text());
      throw new Error("resend failed");
    }
  } catch {
    return NextResponse.json(
      { ok: false, error: "We couldn't send that right now. Please email us directly." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
