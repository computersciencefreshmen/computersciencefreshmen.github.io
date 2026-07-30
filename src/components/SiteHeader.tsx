import { useState } from "react";
import { copy, identity } from "../data/portfolio";
import type { Locale } from "../types";
import { CloseIcon, MenuIcon } from "./Icons";

interface SiteHeaderProps {
  locale: Locale;
  onToggleLocale: () => void;
}

export function SiteHeader({ locale, onToggleLocale }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const content = copy[locale];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <a className="wordmark" href="#top" aria-label={`${identity.name} — home`}>
        <span className="wordmark__monogram">HY</span>
        <span className="wordmark__name">
          Hanyu
          <br />
          Yang
        </span>
      </a>

      <button
        className="menu-button"
        type="button"
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMenuOpen((current) => !current)}
      >
        {menuOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      <nav
        id="primary-navigation"
        className={`site-nav ${menuOpen ? "is-open" : ""}`}
        aria-label="Primary navigation"
      >
        <a href="#work" onClick={closeMenu}>
          {content.nav.work}
        </a>
        <a href="#about" onClick={closeMenu}>
          {content.nav.about}
        </a>
        <a href="#journey" onClick={closeMenu}>
          {content.nav.journey}
        </a>
        <a href="#contact" onClick={closeMenu}>
          {content.nav.contact}
        </a>
      </nav>

      <button
        className="language-toggle"
        type="button"
        onClick={onToggleLocale}
        aria-label={content.languageLabel}
      >
        <span className={locale === "en" ? "is-active" : ""}>EN</span>
        <span aria-hidden="true">/</span>
        <span className={locale === "zh" ? "is-active" : ""}>中</span>
      </button>
    </header>
  );
}
