import { copy, links } from "../data/portfolio";
import type { Locale } from "../types";
import { BrandMark } from "./BrandMark";

interface SiteFooterProps {
  locale: Locale;
}

export function SiteFooter({ locale }: SiteFooterProps) {
  const content = copy[locale];

  return (
    <footer className="site-footer">
      <p>
        <BrandMark className="site-footer__brand-mark" />
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
