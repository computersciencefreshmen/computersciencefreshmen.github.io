import { copy, identity, links } from "../data/portfolio";
import type { Locale } from "../types";
import { ArrowUpRight } from "./Icons";

export function Contact({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return (
    <section id="contact" className="page-section contact-page" aria-labelledby="contact-title">
      <div className="page-heading"><p className="eyebrow">{zh ? "开始交流" : "AN OPEN INVITATION"}</p><h1 id="contact-title">{zh ? "联系我" : "Get in touch."}</h1><p>{copy[locale].contactBody}</p></div>
      <div className="contact-layout">
        <div><h2>{zh ? "让想法相遇。" : "Let’s exchange ideas."}</h2><p>{zh ? "软件构建、数据研究、AI 与社会，以及跨文化的观察——欢迎分享你正在思考的问题。" : "Building software, studying data, thinking about AI and society, or seeing things across cultures—I’d love to hear what you’re working on."}</p><p className="contact-location">{identity.location[locale]}</p></div>
        <div className="contact__links">{[
          { name: "LinkedIn", href: links.linkedin, text: zh ? "工作与合作交流" : "For conversations & collaborations" },
          { name: "GitHub", href: links.github, text: zh ? "开源项目与代码" : "Follow my projects & code" },
          { name: "Instagram", href: links.instagram, text: zh ? "生活中的一些片段" : "A few things beyond the screen" },
        ].map((item) => <a className="contact-link" key={item.name} href={item.href} target="_blank" rel="noreferrer"><span><strong>{item.name}</strong><small>{item.text}</small></span><ArrowUpRight /></a>)}</div>
      </div>
    </section>
  );
}
