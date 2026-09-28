import { localize, formatPeriod, translate } from "../i18n";
import { education, publicCvUrl } from "../data/cv";
import { copy, identity, projects } from "../data/portfolio";
import type { Locale } from "../types";
import { ArrowUpRight } from "./Icons";

export function Hero({ locale }: { locale: Locale }) {
  return (
    <div className="home-page">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__copy">
          <p className="eyebrow">{localize({ en: "SOFTWARE · DATA · AI & SOCIETY", zh: "软件 · 数据 · 人工智能与社会" }, locale)}</p>
          <h1 id="hero-title">{localize({ en: "Hanyu Yang", zh: "杨涵宇" }, locale)}</h1>
          <p className="hero__role">{localize({ en: "Building thoughtfully. Learning across disciplines.", zh: "以工程实践，探索技术与人的关系。" }, locale)}</p>
          <p className="hero__location"><span aria-hidden="true" />{localize(identity.location, locale)}</p>
        </div>
        <figure className="hero__portrait">
          <img src="/profile.png" alt={localize(copy, locale).portraitAlt} width="360" height="360" fetchPriority="high" />
          <figcaption>{localize({ en: "Stay curious. Keep building.", zh: "保持好奇，持续构建。" }, locale)}</figcaption>
        </figure>
      </section>
      <section className="home-about" aria-labelledby="home-about-title">
        <p className="eyebrow">{localize({ en: "A LITTLE ABOUT ME", zh: "一点自我介绍" }, locale)}</p>
        <h2 id="home-about-title">{localize({ en: "At the intersection of technology & people.", zh: "在技术与真实世界之间。" }, locale)}</h2>
        <p>{localize(copy, locale).heroBody}</p>
        <p>{localize({ en: "From customer analytics at HSBC to AI knowledge tools and cross-cultural products, I’m interested in making complex information useful—and building systems that serve people.", zh: "从汇丰的客户数据分析，到 AI 知识工具与跨文化产品，我关注如何让复杂的信息变得清晰，让系统真正服务于人。" }, locale)}</p>
        <a className="text-link" href="#/research">{localize({ en: "More about my research & interests", zh: "了解我的研究与兴趣" }, locale)}<ArrowUpRight /></a>
      </section>
      <section className="home-work" aria-labelledby="home-work-title">
        <div className="section-heading">
          <div><p className="eyebrow">{localize({ en: "IDEAS INTO PRACTICE", zh: "想法，成为作品" }, locale)}</p><h2 id="home-work-title">{localize({ en: "Selected projects", zh: "精选项目" }, locale)}</h2></div>
          <a className="text-link" href="#/work">{localize({ en: "View all projects", zh: "查看全部项目" }, locale)}<ArrowUpRight /></a>
        </div>
        <div className="featured-grid">
          {projects.slice(0, 3).map((project) => (
            <article className="featured-card" key={project.id}>
              <div className="featured-card__top"><span>{localize(project.eyebrow, locale)}</span><span className="project-number">{project.number}</span></div>
              <h3>{project.title}</h3>
              <p>{localize(project.description, locale)}</p>
              <a className="text-link" href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`${localize({ en: "Visit project", zh: "访问项目" }, locale)}: ${project.title}`}>{localize({ en: "Visit project", zh: "访问项目" }, locale)}<ArrowUpRight /></a>
            </article>
          ))}
        </div>
      </section>
      <section className="home-background" aria-labelledby="background-title">
        <div className="background-intro">
          <p className="eyebrow">{localize({ en: "LEARNING & PRACTICE", zh: "学习与实践" }, locale)}</p>
          <h2 id="background-title">{localize({ en: "A little background.", zh: "一路走来" }, locale)}</h2>
          <p>{localize({ en: "An engineering foundation, shaped by questions that reach beyond engineering.", zh: "软件工程提供方法，跨学科学习拓宽问题的边界。" }, locale)}</p>
          <a className="text-link" href={publicCvUrl} download>{localize({ en: "Download public CV", zh: "下载公开版 CV" }, locale)} <small>({translate(locale, "PDF · English")})</small><ArrowUpRight /></a>
        </div>
        <div className="background-timeline">
          {education.map((item) => (
            <article key={item.id}><span className="timeline-dot" aria-hidden="true" /><p className="item-date">{formatPeriod(item.period, locale)}</p><h3>{localize(item.degree, locale)}</h3><p>{localize(item.institution, locale)}</p></article>
          ))}
          <article><span className="timeline-dot" aria-hidden="true" /><p className="item-date">{formatPeriod("Mar. 2026 - Jul. 2026", locale)}</p><h3>{localize({ en: "CRM Data Analyst Intern", zh: "CRM 数据分析实习生" }, locale)}</h3><p>{localize({ en: "HSBC · Wealth and Personal Banking", zh: "汇丰银行 · 财富管理及个人银行业务" }, locale)}</p><a className="text-link" href="#/experience">{localize({ en: "Explore my experience", zh: "查看工作经历" }, locale)}<ArrowUpRight /></a></article>
        </div>
      </section>
      <section className="home-contact" aria-labelledby="home-contact-title">
        <p className="eyebrow">{localize({ en: "LET’S CONNECT", zh: "从一次交流开始" }, locale)}</p>
        <h2 id="home-contact-title">{localize({ en: "Good things start with a conversation.", zh: "好的想法，始于对话。" }, locale)}</h2>
        <p>{localize({ en: "Always happy to talk about software, data, AI, and questions worth exploring.", zh: "欢迎交流软件、数据、AI，以及值得一起探索的问题。" }, locale)}</p>
        <a className="button button--primary" href="#/contact">{localize({ en: "Get in touch", zh: "联系我" }, locale)}<ArrowUpRight /></a>
      </section>
    </div>
  );
}
