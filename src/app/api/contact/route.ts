import { NextRequest, NextResponse } from "next/server";
import { profile } from "@/data/portfolio";

type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
  company: string;
};

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimits = new Map<string, RateLimitEntry>();
const rateLimitWindow = 10 * 60 * 1000;
const rateLimitMaximum = 5;
const maximumRequestSize = 24_000;
const deliveryTimeout = 10_000;

export const runtime = "nodejs";

function jsonResponse(message: string, status = 200) {
  return NextResponse.json(
    { message },
    {
      status,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    },
  );
}

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function isRateLimited(identifier: string) {
  const now = Date.now();
  const current = rateLimits.get(identifier);

  if (rateLimits.size > 500) {
    for (const [key, entry] of rateLimits) {
      if (entry.resetAt <= now) rateLimits.delete(key);
    }
  }

  if (!current || current.resetAt <= now) {
    rateLimits.set(identifier, { count: 1, resetAt: now + rateLimitWindow });
    return false;
  }

  current.count += 1;
  return current.count > rateLimitMaximum;
}

function parsePayload(value: unknown): ContactPayload | null {
  if (!value || typeof value !== "object") return null;

  const input = value as Record<string, unknown>;
  const payload = {
    name: cleanString(input.name),
    email: cleanString(input.email),
    subject: cleanString(input.subject),
    message: cleanString(input.message),
    company: cleanString(input.company),
  };
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email);

  if (
    !payload.name || payload.name.length > 80
    || !validEmail || payload.email.length > 254
    || !payload.subject || payload.subject.length > 140
    || !payload.message || payload.message.length > 5000
  ) return null;

  return payload;
}

async function handleContactRequest(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && origin !== request.nextUrl.origin) {
    return jsonResponse("This request could not be verified.", 403);
  }

  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    return jsonResponse("Please submit the contact form and try again.", 415);
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > maximumRequestSize) {
    return jsonResponse("The submitted message is too large.", 413);
  }

  let input: unknown;
  try {
    input = await request.json();
  } catch {
    return jsonResponse("Please complete every field and try again.", 400);
  }

  const payload = parsePayload(input);
  if (!payload) {
    return jsonResponse("Please check each field and try again.", 400);
  }

  if (payload.company) {
    return jsonResponse("Thank you—your message has been sent.");
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return jsonResponse("Message delivery is temporarily unavailable. Please use the email link instead.", 503);
  }

  const identifier = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "local";
  if (isRateLimited(identifier)) {
    return jsonResponse("Too many messages were submitted. Please try again later.", 429);
  }

  const recipient = process.env.CONTACT_TO_EMAIL?.trim() || profile.email;
  const sender = process.env.CONTACT_FROM_EMAIL?.trim() || "Portfolio contact <onboarding@resend.dev>";
  const safeName = escapeHtml(payload.name);
  const safeEmail = escapeHtml(payload.email);
  const safeSubject = escapeHtml(payload.subject);
  const safeMessage = escapeHtml(payload.message).replaceAll("\n", "<br />");

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), deliveryTimeout);
  let response: Response;

  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": crypto.randomUUID(),
      },
      body: JSON.stringify({
        from: sender,
        to: [recipient],
        reply_to: payload.email,
        subject: `Portfolio enquiry: ${payload.subject}`,
        text: `Name: ${payload.name}\nEmail: ${payload.email}\nSubject: ${payload.subject}\n\n${payload.message}`,
        html: `
          <h2>New portfolio enquiry</h2>
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${safeEmail}</p>
          <p><strong>Subject:</strong> ${safeSubject}</p>
          <p><strong>Message:</strong></p>
          <p>${safeMessage}</p>
        `,
      }),
      cache: "no-store",
      signal: controller.signal,
    });
  } catch {
    return jsonResponse("The message service could not be reached. Please use the email link instead.", 503);
  } finally {
    clearTimeout(timeout);
  }

  if (!response.ok) {
    return jsonResponse("Your message could not be delivered. Please use the email link instead.", 502);
  }

  return jsonResponse("Thank you—your message has been sent.");
}

export async function POST(request: NextRequest) {
  try {
    return await handleContactRequest(request);
  } catch {
    return jsonResponse("Message delivery is temporarily unavailable. Please use the email link instead.", 503);
  }
}
