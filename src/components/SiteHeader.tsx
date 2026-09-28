import { localize, locales, translate } from "../i18n";
import { useEffect, useRef, useState } from "react";
import { identity } from "../data/portfolio";
import type { Theme } from "../hooks/useTheme";
import type { Locale } from "../types";
import { BrandMark } from "./BrandMark";
import { CloseIcon, MenuIcon } from "./Icons";

export type Page = "home" | "work" | "research" | "experience" | "cv" | "contact";

interface SiteHeaderProps {
  locale: Locale;
  onChangeLocale: (locale: Locale) => void;
  page: Page;
  theme: Theme;
  onToggleTheme: () => void;
}

const pages: Page[] = ["home", "work", "research", "experience", "cv", "contact"];

const navigation = {
  en: {
    home: "Home",
    work: "Selected work",
    research: "Research",
    experience: "Experience",
    cv: "Full CV",
    contact: "Contact",
    navigationLabel: "Primary navigation",
    openMenu: "Open navigation",
    closeMenu: "Close navigation",
    darkTheme: "Switch to dark theme",
    lightTheme: "Switch to light theme",
  },
  zh: {
    home: "首页",
    work: "精选项目",
    research: "研究",
    experience: "重点经历",
    cv: "完整 CV",
    contact: "联系我",
    navigationLabel: "主要导航",
    openMenu: "打开导航",
    closeMenu: "关闭导航",
    darkTheme: "切换到深色主题",
    lightTheme: "切换到浅色主题",
  },
} as const;

function ThemeIcon({ theme }: { theme: Theme }) {
  return (
    <svg
      aria-hidden="true"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {theme === "dark" ? (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M2 12h2m16 0h2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </>
      ) : (
        <path d="M20.7 13.1A8.8 8.8 0 0 1 10.9 3.3a8.8 8.8 0 1 0 9.8 9.8Z" />
      )}
    </svg>
  );
}

export function SiteHeader({
  locale,
  onChangeLocale,
  page,
  theme,
  onToggleTheme,
}: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const content = localize(navigation, locale);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <a
        className="wordmark"
        href="#/"
        aria-label={`${identity.name} — ${content.home.toLocaleLowerCase(locale)}`}
        onClick={closeMenu}
      >
        <BrandMark className="wordmark__symbol" />
        <span className="wordmark__name">Hanyu Yang</span>
      </a>

      <div className="header-controls">
        <button
          className="theme-toggle"
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === "dark" ? content.lightTheme : content.darkTheme}
          title={theme === "dark" ? content.lightTheme : content.darkTheme}
        >
          <ThemeIcon theme={theme} />
        </button>
        <select
          className="language-select"
          value={locale}
          onChange={(event) => {
            onChangeLocale(event.target.value as Locale);
            closeMenu();
          }}
          aria-label={translate(locale, "Choose language")}
        >
          {locales.map(({ code, name, tag }) => <option key={code} value={code} lang={tag}>{name}</option>)}
        </select>
        <button
          className="menu-button"
          ref={menuButtonRef}
          type="button"
          aria-label={menuOpen ? content.closeMenu : content.openMenu}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <nav
        id="primary-navigation"
        className={`site-nav ${menuOpen ? "is-open" : ""}`.trim()}
        aria-label={content.navigationLabel}
      >
        {pages.map((destination) => (
          <a
            key={destination}
            href={destination === "home" ? "#/" : `#/${destination}`}
            aria-current={page === destination ? "page" : undefined}
            onClick={closeMenu}
          >
            {content[destination]}
          </a>
        ))}
      </nav>
    </header>
  );
}
