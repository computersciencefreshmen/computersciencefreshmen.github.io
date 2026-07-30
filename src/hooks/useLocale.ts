import { useEffect, useState } from "react";
import type { Locale } from "../types";

const STORAGE_KEY = "hanyu-portfolio-locale";

function getInitialLocale(): Locale {
  const storedLocale = window.localStorage.getItem(STORAGE_KEY);

  if (storedLocale === "en" || storedLocale === "zh") {
    return storedLocale;
  }

  return window.navigator.language.toLowerCase().startsWith("zh") ? "zh" : "en";
}

export function useLocale() {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    document.documentElement.lang = locale === "zh" ? "zh-CN" : "en";
    window.localStorage.setItem(STORAGE_KEY, locale);
  }, [locale]);

  const toggleLocale = () => {
    setLocale((current) => (current === "en" ? "zh" : "en"));
  };

  return { locale, toggleLocale };
}
