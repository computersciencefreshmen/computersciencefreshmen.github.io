import { useEffect, useState } from "react";
import type { Locale } from "../types";
import { locales, normalizeLocale } from "../i18n";

function getInitialLocale(): Locale {
  // The public entry point is always English, even for returning visitors.
  // Explicit language links still preserve the reader's chosen language.
  return normalizeLocale(new URLSearchParams(window.location.search).get("lang")) ?? "en";
}

export function useLocale() {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    const restoreLanguage = () => {
      setLocale(getInitialLocale());
    };
    window.addEventListener("popstate", restoreLanguage);
    return () => window.removeEventListener("popstate", restoreLanguage);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locales.find(item => item.code === locale)!.tag;
  }, [locale]);

  const changeLocale = (next: Locale) => {
    setLocale(next);
    const url = new URL(window.location.href);
    url.searchParams.set("lang", next);
    window.history.replaceState(window.history.state, "", url);
  };

  return { locale, changeLocale };
}
