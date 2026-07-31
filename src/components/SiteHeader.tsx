import { useEffect, useRef, useState } from "react";
import { identity } from "../data/portfolio";
import type { Locale } from "../types";
import { BrandMark } from "./BrandMark";
import { CloseIcon, MenuIcon } from "./Icons";

interface SiteHeaderProps {
  locale: Locale;
  onToggleLocale: () => void;
}

const navigation = {
  en: {
    experience: "Experience",
    work: "Selected work",
    cv: "Full CV",
    contact: "Contact",
    languageLabel: "切换到中文",
    navigationLabel: "Primary navigation",
    openMenu: "Open navigation",
    closeMenu: "Close navigation",
  },
  zh: {
    experience: "重点经历",
    work: "精选项目",
    cv: "完整 CV",
    contact: "联系我",
    languageLabel: "Switch to English",
    navigationLabel: "主要导航",
    openMenu: "打开导航",
    closeMenu: "关闭导航",
  },
} as const;

export function SiteHeader({ locale, onToggleLocale }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const content = navigation[locale];
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

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
      <a className="wordmark" href="#top" aria-label={`${identity.name} — home`}>
        <BrandMark className="wordmark__symbol" />
        <span className="wordmark__name">Hanyu Yang</span>
      </a>

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

      <nav
        id="primary-navigation"
        className={`site-nav ${menuOpen ? "is-open" : ""}`}
        aria-label={content.navigationLabel}
      >
        <a href="#experience" onClick={closeMenu}>
          {content.experience}
        </a>
        <a href="#work" onClick={closeMenu}>
          {content.work}
        </a>
        <a href="#cv" onClick={closeMenu}>
          {content.cv}
        </a>
        <a href="#contact" onClick={closeMenu}>
          {content.contact}
        </a>
      </nav>

      <button
        className="language-toggle"
        type="button"
        onClick={() => {
          onToggleLocale();
          closeMenu();
        }}
        aria-label={content.languageLabel}
      >
        <span className={locale === "en" ? "is-active" : ""}>EN</span>
        <span aria-hidden="true">/</span>
        <span className={locale === "zh" ? "is-active" : ""}>中</span>
      </button>
    </header>
  );
}
