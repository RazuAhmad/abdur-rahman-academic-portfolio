"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "@/components/icons";

type Theme = "light" | "dark";

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function currentTheme(): Theme {
  const applied = document.documentElement.dataset.theme;
  return applied === "dark" || applied === "light" ? applied : systemTheme();
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;

  let themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"][data-dynamic-theme]');
  if (!themeColor) {
    themeColor = document.createElement("meta");
    themeColor.name = "theme-color";
    themeColor.dataset.dynamicTheme = "true";
    document.head.appendChild(themeColor);
  }
  themeColor.content = theme === "dark" ? "#06101d" : "#f6f8fa";
  window.dispatchEvent(new CustomEvent<Theme>("portfolio-theme-change", { detail: theme }));
}

function subscribeTheme(notify: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const handleThemeChange = () => notify();
  const handleSystemChange = () => {
    if (window.localStorage.getItem("portfolio-theme")) return;
    applyTheme(systemTheme());
  };

  window.addEventListener("portfolio-theme-change", handleThemeChange);
  media.addEventListener("change", handleSystemChange);
  return () => {
    window.removeEventListener("portfolio-theme-change", handleThemeChange);
    media.removeEventListener("change", handleSystemChange);
  };
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  const theme = useSyncExternalStore(subscribeTheme, currentTheme, () => "light");

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    window.localStorage.setItem("portfolio-theme", next);
    applyTheme(next);
  };

  const nextLabel = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      className={`theme-toggle ${className}`.trim()}
      type="button"
      onClick={toggle}
      aria-label={nextLabel}
      title={nextLabel}
      suppressHydrationWarning
    >
      <span className="theme-toggle__icon" aria-hidden="true" suppressHydrationWarning>
        {theme === "dark" ? <Sun /> : <Moon />}
      </span>
      <span className="theme-toggle__text" suppressHydrationWarning>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
