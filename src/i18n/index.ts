import type { Locale } from "../types";
import source from "./source.json";
import de from "./locales/de.json";
import fr from "./locales/fr.json";
import it from "./locales/it.json";
import ru from "./locales/ru.json";
import es from "./locales/es.json";
import uk from "./locales/uk.json";

export const locales = [
  { code: "en", name: "English", tag: "en" },
  { code: "zh", name: "简体中文", tag: "zh-CN" },
  { code: "de", name: "Deutsch", tag: "de" },
  { code: "fr", name: "Français", tag: "fr" },
  { code: "it", name: "Italiano", tag: "it" },
  { code: "ru", name: "Русский", tag: "ru" },
  { code: "es", name: "Español", tag: "es" },
  { code: "uk", name: "Українська", tag: "uk" },
] as const;

export const dictionaries: Record<Exclude<Locale, "en">, Record<string, string>> = { zh: source, de, fr, it, ru, es, uk };

export function normalizeLocale(value: string | null | undefined): Locale | undefined {
  const base = value?.trim().toLowerCase().replaceAll("_", "-").split("-")[0];
  if (base === "ua") return "uk";
  return locales.find(({ code }) => code === base)?.code;
}

export function translate(locale: Locale, message: string): string {
  return locale === "en" ? message : dictionaries[locale][message] ?? message;
}

// Existing profile records retain their English/Chinese source pair. UI and
// long-form content share one catalog, so repeated labels cannot drift apart.
type Translated<T> = T extends string ? string : T extends readonly (infer U)[] ? Translated<U>[] : T extends object ? { [K in keyof T]: Translated<T[K]> } : T;
export function localize<T>(value: { en: T; zh: unknown }, locale: Locale): Translated<T> {
  if (locale === "zh") return value.zh as Translated<T>;
  function walk(item: unknown): unknown {
    if (typeof item === "string") return translate(locale, item);
    if (Array.isArray(item)) return item.map(walk);
    if (item && typeof item === "object") return Object.fromEntries(Object.entries(item).map(([key, child]) => [key, walk(child)]));
    return item;
  }
  return walk(value.en) as Translated<T>;
}

export function formatPeriod(period: string, locale: Locale): string {
  const months: Record<string, number> = { Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5, Jul: 6, Aug: 7, Sept: 8, Oct: 9, Nov: 10, Dec: 11 };
  const formatter = new Intl.DateTimeFormat(locales.find(item => item.code === locale)?.tag, { year: "numeric", month: "short", timeZone: "UTC" });
  return period.replace(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sept|Oct|Nov|Dec)\.? (\d{4})/g, (_, month: string, year: string) => formatter.format(new Date(Date.UTC(Number(year), months[month], 1))))
    .replace("Expected", translate(locale, "Expected"));
}

export function projectCount(count: number, locale: Locale): string {
  if (locale === "en") return `${count} project${count === 1 ? "" : "s"}`;
  if (locale === "zh") return `${count} 个项目`;
  // A label followed by a number avoids incorrect Slavic plural forms.
  return `${translate(locale, "Projects found")}: ${new Intl.NumberFormat(locale).format(count)}`;
}
