"use client";

import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, Mail } from "@/components/icons";

type EmailComposeChooserProps = {
  email: string;
  name: string;
};

export function EmailComposeChooser({ email, name }: EmailComposeChooserProps) {
  const [isOpen, setIsOpen] = useState(false);
  const chooserRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstOptionRef = useRef<HTMLAnchorElement>(null);

  const encodedEmail = encodeURIComponent(email);
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedEmail}`;
  const outlookUrl = `https://outlook.office.com/mail/deeplink/compose?to=${encodedEmail}`;

  const closeAndRestoreFocus = useCallback(() => {
    setIsOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    firstOptionRef.current?.focus();

    const handlePointerDown = (event: PointerEvent) => {
      if (!chooserRef.current?.contains(event.target as Node)) closeAndRestoreFocus();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      closeAndRestoreFocus();
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeAndRestoreFocus, isOpen]);

  const handleMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;

    event.preventDefault();
    const options = Array.from(menuRef.current?.querySelectorAll<HTMLAnchorElement>('[role="menuitem"]') ?? []);
    const currentIndex = options.indexOf(document.activeElement as HTMLAnchorElement);
    let nextIndex = currentIndex;

    if (event.key === "ArrowDown") nextIndex = (currentIndex + 1) % options.length;
    if (event.key === "ArrowUp") nextIndex = (currentIndex - 1 + options.length) % options.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = options.length - 1;

    options[nextIndex]?.focus();
  };

  return (
    <div className="email-compose" ref={chooserRef}>
      <button
        ref={triggerRef}
        className="contact__channel"
        type="button"
        aria-label={`Choose how to email ${name}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls="email-compose-menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        <span className="contact__channel-icon"><Mail /></span>
        <span className="contact__channel-copy"><strong>Email</strong><small>Choose an email service</small></span>
        <ArrowUpRight />
      </button>

      {isOpen ? (
        <div
          ref={menuRef}
          className="email-compose__menu"
          id="email-compose-menu"
          role="menu"
          aria-label="Choose an email service"
          onKeyDown={handleMenuKeyDown}
        >
          <a ref={firstOptionRef} href={gmailUrl} target="_blank" rel="noreferrer" role="menuitem" onClick={closeAndRestoreFocus}>
            <span><strong>Gmail</strong><small>Compose in Gmail</small></span>
            <ArrowUpRight />
          </a>
          <a href={outlookUrl} target="_blank" rel="noreferrer" role="menuitem" onClick={closeAndRestoreFocus}>
            <span><strong>Outlook</strong><small>Compose in Outlook Web</small></span>
            <ArrowUpRight />
          </a>
          <a href={`mailto:${email}`} role="menuitem" onClick={closeAndRestoreFocus}>
            <span><strong>Default Mail App</strong><small>Use your device setting</small></span>
            <ArrowUpRight />
          </a>
        </div>
      ) : null}
    </div>
  );
}
