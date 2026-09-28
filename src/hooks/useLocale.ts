import { useEffect, useState } from "react";
import type { Locale } from "../types";

const STORAGE_KEY = "hanyu-portfolio-locale";

function getInitialLocale(): Locale {
  try {
    const storedLocale = window.localStorage.getItem(STORAGE_KEY);
    if (storedLocale === "en" || storedLocale === "zh") return storedLocale;
  } catch {
    // A blocked storage read should still allow the browser-language fallback.
  }

  return window.navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

export function useLocale() {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // Switching language remains usable when preferences cannot be persisted.
    }
  }, [locale]);

  const toggleLocale = () => {
    setLocale((current) => (current === "en" ? "zh" : "en"));
  };

  return { locale, toggleLocale };
}
