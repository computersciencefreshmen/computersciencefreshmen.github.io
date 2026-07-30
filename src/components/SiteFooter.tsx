import { copy, links } from "../data/portfolio";
import type { Locale } from "../types";

interface SiteFooterProps {
  locale: Locale;
}

export function SiteFooter({ locale }: SiteFooterProps) {
  const content = copy[locale];

  return (
    <footer className="site-footer">
      <p>
        <span className="site-footer__mark">HY</span>
        {content.footerNote}
      </p>
      <div className="site-footer__links">
        <a href={links.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href={links.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href={links.instagram} target="_blank" rel="noreferrer">
          Instagram
        </a>
      </div>
      <p>
        © {new Date().getFullYear()} {content.copyright}
      </p>
    </footer>
  );
}
