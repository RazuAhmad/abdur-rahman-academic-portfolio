"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Close, Menu } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { navigation, profile } from "@/data/portfolio";

export function Navigation() {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(() => () => undefined, () => true, () => false);
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const pathname = usePathname();
  const navHref = (href: string) => pathname === "/" ? href : `/${href}`;

  useEffect(() => {
    const updateProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    const observer = new ResizeObserver(updateProgress);
    observer.observe(document.body);

    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => firstLinkRef.current?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }

      if (event.key === "Tab" && panelRef.current) {
        const focusable = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
        );
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  const drawer = (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="mobile-menu-backdrop"
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeMenu();
          }}
        >
          <motion.div
            ref={panelRef}
            id="mobile-menu"
            className="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={reduceMotion ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mobile-menu__top">
              <span className="wordmark__mark">AR</span>
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => {
                  closeMenu();
                  triggerRef.current?.focus();
                }}
              >
                <Close />
              </button>
            </div>

            <div className="mobile-menu__links">
              {navigation.map((item, index) => (
                <a
                  ref={index === 0 ? firstLinkRef : undefined}
                  key={item.href}
                  href={navHref(item.href)}
                  onClick={closeMenu}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  {item.label}
                </a>
              ))}
            </div>

            <div className="mobile-menu__footer">
              <ThemeToggle className="theme-toggle--drawer" />
              <a className="mobile-menu__contact" href={`mailto:${profile.email}`} onClick={closeMenu}>
                {profile.email}
              </a>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <header className="site-header">
        <nav className="nav-shell" aria-label="Primary navigation">
          <a className="wordmark" href={pathname === "/" ? "#top" : "/"} aria-label={`${profile.name}, home`}>
            <span className="wordmark__mark">AR</span>
            <span className="wordmark__name">Md. Abdur Rahman</span>
          </a>

          <div className="nav-links">
            {navigation.map((item) => (
              <a key={item.href} href={navHref(item.href)}>{item.label}</a>
            ))}
          </div>

          <div className="nav-actions">
            <ThemeToggle />
            <a className="nav-contact" href={`mailto:${profile.email}`}>Connect</a>
          </div>

          <button
            ref={triggerRef}
            className="menu-trigger"
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen(true)}
          >
            <Menu />
          </button>
        </nav>

        <div className="scroll-progress" aria-hidden="true">
          <span style={{ transform: `scaleX(${progress / 100})` }} />
        </div>
      </header>

      {mounted ? createPortal(drawer, document.body) : null}
    </>
  );
}
