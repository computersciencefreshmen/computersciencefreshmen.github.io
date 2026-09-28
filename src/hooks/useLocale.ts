import { useEffect, useState } from "react";
import type { Locale } from "../types";
import { locales, normalizeLocale } from "../i18n";

const STORAGE_KEY = "hanyu-portfolio-locale";

function getInitialLocale(): Locale {
  const requested = normalizeLocale(new URLSearchParams(window.location.search).get("lang"));
  if (requested) return requested;
  try {
    const storedLocale = normalizeLocale(window.localStorage.getItem(STORAGE_KEY));
    if (storedLocale) return storedLocale;
  } catch {
    // A blocked storage read should still allow the browser-language fallback.
  }

  return [...(window.navigator.languages ?? []), window.navigator.language]
    .map(normalizeLocale).find(Boolean) ?? "en";
}

export function useLocale() {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    const restoreLanguage = () => {
      const requested = normalizeLocale(new URLSearchParams(window.location.search).get("lang"));
      if (requested) setLocale(requested);
    };
    window.addEventListener("popstate", restoreLanguage);
    return () => window.removeEventListener("popstate", restoreLanguage);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locales.find(item => item.code === locale)!.tag;
    try {
      window.localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      // Switching language remains usable when preferences cannot be persisted.
    }
  }, [locale]);

  const changeLocale = (next: Locale) => {
    setLocale(next);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", next);
    window.history.replaceState(window.history.state, "", url);
  };

  return { locale, changeLocale };
}
