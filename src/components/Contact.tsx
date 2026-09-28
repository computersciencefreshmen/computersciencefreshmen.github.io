import { localize } from "../i18n";
import { copy, identity, links } from "../data/portfolio";
import type { Locale } from "../types";
import { ArrowUpRight } from "./Icons";

export function Contact({ locale }: { locale: Locale }) {
  return (
    <section id="contact" className="page-section contact-page" aria-labelledby="contact-title">
      <div className="page-heading"><p className="eyebrow">{localize({ en: "AN OPEN INVITATION", zh: "开始交流" }, locale)}</p><h1 id="contact-title">{localize({ en: "Get in touch.", zh: "联系我" }, locale)}</h1><p>{localize(copy, locale).contactBody}</p></div>
      <div className="contact-layout">
        <div><h2>{localize({ en: "Let’s exchange ideas.", zh: "让想法相遇。" }, locale)}</h2><p>{localize({ en: "Building software, studying data, thinking about AI and society, or seeing things across cultures—I’d love to hear what you’re working on.", zh: "软件构建、数据研究、AI 与社会，以及跨文化的观察——欢迎分享你正在思考的问题。" }, locale)}</p><p className="contact-location">{localize(identity.location, locale)}</p></div>
        <div className="contact__links">{[
          { name: "LinkedIn", href: links.linkedin, text: localize({ en: "For conversations & collaborations", zh: "工作与合作交流" }, locale) },
          { name: "GitHub", href: links.github, text: localize({ en: "Follow my projects & code", zh: "开源项目与代码" }, locale) },
          { name: "Instagram", href: links.instagram, text: localize({ en: "A few things beyond the screen", zh: "生活中的一些片段" }, locale) },
        ].map((item) => <a className="contact-link" key={item.name} href={item.href} target="_blank" rel="noreferrer"><span><strong>{item.name}</strong><small>{item.text}</small></span><ArrowUpRight /></a>)}</div>
      </div>
    </section>
  );
}
