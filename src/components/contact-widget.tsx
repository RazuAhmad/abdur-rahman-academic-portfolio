"use client";

import type { FormEvent } from "react";
import { useEffect, useRef, useState } from "react";
import { Close, Mail, MessageCircle, Send } from "@/components/icons";

type SubmissionState = "idle" | "sending" | "success" | "error";

type ContactWidgetProps = {
  email: string;
};

const greetingStorageKey = "portfolio-chat-greeted";
const requestTimeout = 12_000;

function wasGreetingShown() {
  try {
    return window.sessionStorage.getItem(greetingStorageKey) === "true";
  } catch {
    return false;
  }
}

function rememberGreeting() {
  try {
    window.sessionStorage.setItem(greetingStorageKey, "true");
  } catch {
    // Storage can be unavailable in private or restricted browser contexts.
  }
}

async function closeAudioContext(context: AudioContext) {
  try {
    await context.close();
  } catch {
    // Audio cleanup should never affect the contact experience.
  }
}

async function playNotificationChime() {
  const AudioContextConstructor = window.AudioContext
    ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextConstructor) return false;

  let context: AudioContext | null = null;
  try {
    context = new AudioContextConstructor();
    if (context.state === "suspended") await context.resume();
    if (context.state !== "running") {
      await closeAudioContext(context);
      return false;
    }

    const gain = context.createGain();
    const firstTone = context.createOscillator();
    const secondTone = context.createOscillator();
    const now = context.currentTime;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.08, now + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.42);
    firstTone.frequency.setValueAtTime(660, now);
    secondTone.frequency.setValueAtTime(880, now + 0.12);
    firstTone.type = "sine";
    secondTone.type = "sine";
    firstTone.connect(gain);
    secondTone.connect(gain);
    gain.connect(context.destination);
    firstTone.start(now);
    firstTone.stop(now + 0.2);
    secondTone.start(now + 0.12);
    secondTone.stop(now + 0.42);
    const activeContext = context;
    window.setTimeout(() => void closeAudioContext(activeContext), 550);
    return true;
  } catch {
    if (context) await closeAudioContext(context);
    return false;
  }
}

async function readResponseMessage(response: Response) {
  if (!response.headers.get("content-type")?.includes("application/json")) return "";

  try {
    const result: unknown = await response.json();
    if (!result || typeof result !== "object") return "";
    const message = (result as Record<string, unknown>).message;
    return typeof message === "string" ? message : "";
  } catch {
    return "";
  }
}

export function ContactWidget({ email }: ContactWidgetProps) {
  const [promptVisible, setPromptVisible] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const requestControllerRef = useRef<AbortController>(null);

  useEffect(() => {
    if (wasGreetingShown()) return;

    const playAfterInteraction = () => {
      window.removeEventListener("pointerdown", playAfterInteraction);
      window.removeEventListener("keydown", playAfterInteraction);
      void playNotificationChime();
    };
    const timeout = window.setTimeout(() => {
      rememberGreeting();
      setPromptVisible(true);
      void playNotificationChime().then((played) => {
        if (played) return;
        window.addEventListener("pointerdown", playAfterInteraction, { once: true });
        window.addEventListener("keydown", playAfterInteraction, { once: true });
      });
    }, 2200);

    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("pointerdown", playAfterInteraction);
      window.removeEventListener("keydown", playAfterInteraction);
    };
  }, []);

  useEffect(() => () => requestControllerRef.current?.abort(), []);

  useEffect(() => {
    if (!formOpen) return;

    window.requestAnimationFrame(() => nameRef.current?.focus());
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      requestControllerRef.current?.abort();
      requestControllerRef.current = null;
      setFormOpen(false);
      setSubmissionState("idle");
      setStatusMessage("");
      triggerRef.current?.focus();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [formOpen]);

  const openForm = () => {
    setPromptVisible(false);
    setFormOpen(true);
    setSubmissionState("idle");
    setStatusMessage("");
  };

  const closeForm = () => {
    requestControllerRef.current?.abort();
    requestControllerRef.current = null;
    setFormOpen(false);
    setSubmissionState("idle");
    setStatusMessage("");
    triggerRef.current?.focus();
  };

  const dismissPrompt = () => {
    setPromptVisible(false);
    rememberGreeting();
    triggerRef.current?.focus();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submissionState === "sending") return;

    setSubmissionState("sending");
    setStatusMessage("Sending your message…");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
      company: String(formData.get("company") ?? ""),
    };

    const controller = new AbortController();
    let didTimeOut = false;
    requestControllerRef.current?.abort();
    requestControllerRef.current = controller;
    const timeout = window.setTimeout(() => {
      didTimeOut = true;
      controller.abort();
    }, requestTimeout);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store",
        signal: controller.signal,
      });
      const responseMessage = await readResponseMessage(response);

      if (!response.ok) {
        setSubmissionState("error");
        setStatusMessage(responseMessage || "Message delivery is unavailable. Please use the email link below.");
        return;
      }

      form.reset();
      setSubmissionState("success");
      setStatusMessage(responseMessage || "Thank you—your message has been sent.");
    } catch {
      if (controller.signal.aborted && !didTimeOut) return;
      setSubmissionState("error");
      setStatusMessage(
        didTimeOut
          ? "The request took too long. Please try again or use the email link below."
          : "The message service could not be reached. Please use the email link below.",
      );
    } finally {
      window.clearTimeout(timeout);
      if (requestControllerRef.current === controller) requestControllerRef.current = null;
    }
  };

  return (
    <aside className="contact-widget" aria-label="Quick contact">
      {promptVisible && !formOpen ? (
        <div className="contact-widget__prompt" role="status">
          <button className="contact-widget__prompt-action" type="button" onClick={openForm}>
            <strong>Feel free to DM me now</strong>
            <span>I&apos;d be glad to hear from you.</span>
          </button>
          <button className="contact-widget__prompt-close" type="button" onClick={dismissPrompt} aria-label="Dismiss contact invitation">
            <Close />
          </button>
        </div>
      ) : null}

      {formOpen ? (
        <section className="contact-widget__panel" role="dialog" aria-modal="false" aria-labelledby="quick-contact-title">
          <div className="contact-widget__panel-head">
            <div>
              <span>Direct message</span>
              <h2 id="quick-contact-title">Start a conversation</h2>
            </div>
            <button type="button" onClick={closeForm} aria-label="Close contact form"><Close /></button>
          </div>

          <form onSubmit={handleSubmit} aria-busy={submissionState === "sending"}>
            <label>
              <span>Name</span>
              <input ref={nameRef} name="name" type="text" autoComplete="name" maxLength={80} required />
            </label>
            <label>
              <span>Email</span>
              <input name="email" type="email" autoComplete="email" maxLength={254} required />
            </label>
            <label>
              <span>Subject</span>
              <input name="subject" type="text" maxLength={140} required />
            </label>
            <label>
              <span>Message</span>
              <textarea name="message" rows={5} maxLength={5000} required />
            </label>
            <label className="contact-widget__honeypot" aria-hidden="true">
              Company
              <input name="company" type="text" tabIndex={-1} autoComplete="off" />
            </label>

            <div className="contact-widget__form-foot">
              <button className="contact-widget__send" type="submit" disabled={submissionState === "sending"}>
                {submissionState === "sending" ? "Sending…" : "Send message"}<Send />
              </button>
              <a href={`mailto:${email}`} target="_blank" rel="noreferrer"><Mail /> Open email app</a>
            </div>
            <p
              className={`contact-widget__status contact-widget__status--${submissionState}`}
              role={submissionState === "error" ? "alert" : "status"}
              aria-live={submissionState === "error" ? "assertive" : "polite"}
            >
              {statusMessage}
            </p>
          </form>
        </section>
      ) : null}

      <button
        ref={triggerRef}
        className="contact-widget__trigger"
        type="button"
        aria-label={formOpen ? "Close contact form" : "Open contact form"}
        aria-expanded={formOpen}
        onClick={() => formOpen ? closeForm() : openForm()}
      >
        {formOpen ? <Close /> : <MessageCircle />}
        {promptVisible ? <span className="contact-widget__notification" aria-hidden="true" /> : null}
      </button>
    </aside>
  );
}
