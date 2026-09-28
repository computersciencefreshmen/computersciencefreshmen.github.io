import { identity, links } from "../data/portfolio";
import type { Locale } from "../types";
import { BrandMark } from "./BrandMark";
import { ArrowUpRight } from "./Icons";

export function SiteFooter({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div className="footer-identity"><a className="footer-wordmark" href="#/"><BrandMark />Hanyu Yang</a><p>{zh ? "软件、数据与人的故事。" : "Software, data, and the human side of things."}</p><p>{identity.location[locale]}</p></div>
        <div><h2>{zh ? "探索" : "Explore"}</h2><div className="footer-navigation"><a href="#/work">{zh ? "项目" : "Projects"}</a><a href="#/research">{zh ? "研究" : "Research"}</a><a href="#/experience">{zh ? "经历" : "Experience"}</a><a href="#/cv">{zh ? "简历" : "Curriculum vitae"}</a></div></div>
        <div><h2>{zh ? "保持联系" : "Elsewhere"}</h2><div className="site-footer__links">{Object.entries(links).map(([key, href]) => <a key={key} href={href} target="_blank" rel="noreferrer">{{ github: "GitHub", linkedin: "LinkedIn", instagram: "Instagram" }[key]}<ArrowUpRight size={14} /></a>)}</div></div>
      </div>
      <div className="footer-bottom"><p>© {new Date().getFullYear()} Hanyu Yang</p><p>{zh ? "保持好奇。认真构建。" : "Stay curious. Build with care."}</p><a href="#/">{zh ? "回到首页" : "Back to home"}<span aria-hidden="true">↑</span></a></div>
    </footer>
  );
}
