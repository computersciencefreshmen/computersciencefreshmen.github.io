import { localize } from "../i18n";
import { identity, links } from "../data/portfolio";
import type { Locale } from "../types";
import { BrandMark } from "./BrandMark";
import { ArrowUpRight } from "./Icons";

export function SiteFooter({ locale }: { locale: Locale }) {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-identity"><a className="footer-wordmark" href="#/"><BrandMark />Hanyu Yang</a><p>{localize({ en: "Software, data, and the human side of things.", zh: "软件、数据与人的故事。" }, locale)}</p><p>{localize(identity.location, locale)}</p></div>
        <div><h2>{localize({ en: "Explore", zh: "探索" }, locale)}</h2><div className="footer-navigation"><a href="#/work">{localize({ en: "Projects", zh: "项目" }, locale)}</a><a href="#/research">{localize({ en: "Research", zh: "研究" }, locale)}</a><a href="#/experience">{localize({ en: "Experience", zh: "经历" }, locale)}</a><a href="#/cv">{localize({ en: "Curriculum vitae", zh: "简历" }, locale)}</a></div></div>
        <div><h2>{localize({ en: "Elsewhere", zh: "保持联系" }, locale)}</h2><div className="site-footer__links">{Object.entries(links).map(([key, href]) => <a key={key} href={href} target="_blank" rel="noreferrer">{{ github: "GitHub", linkedin: "LinkedIn", instagram: "Instagram" }[key]}<ArrowUpRight size={14} /></a>)}</div></div>
      </div>
      <div className="footer-bottom"><p>© {new Date().getFullYear()} Hanyu Yang</p><p>{localize({ en: "Stay curious. Build with care.", zh: "保持好奇。认真构建。" }, locale)}</p><a href="#/">{localize({ en: "Back to home", zh: "回到首页" }, locale)}<span aria-hidden="true">↑</span></a></div>
    </footer>
  );
}
