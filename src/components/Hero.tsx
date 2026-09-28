import { education, publicCvUrl } from "../data/cv";
import { copy, identity, projects } from "../data/portfolio";
import type { Locale } from "../types";
import { ArrowUpRight } from "./Icons";

export function Hero({ locale }: { locale: Locale }) {
  const zh = locale === "zh";
  return (
    <div className="home-page">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__copy">
          <p className="eyebrow">{zh ? "软件 · 数据 · 人工智能与社会" : "SOFTWARE · DATA · AI & SOCIETY"}</p>
          <h1 id="hero-title">{zh ? "杨涵宇" : "Hanyu Yang"}<span>{zh ? "Henry Yang" : "Henry"}</span></h1>
          <p className="hero__role">{zh ? "以工程实践，探索技术与人的关系。" : "Building thoughtfully. Learning across disciplines."}</p>
          <p className="hero__location"><span aria-hidden="true" />{identity.location[locale]}</p>
        </div>
        <figure className="hero__portrait">
          <img src="/profile.png" alt={copy[locale].portraitAlt} width="360" height="360" fetchPriority="high" />
          <figcaption>{zh ? "保持好奇，持续构建。" : "Stay curious. Keep building."}</figcaption>
        </figure>
      </section>
      <section className="home-about" aria-labelledby="home-about-title">
        <p className="eyebrow">{zh ? "一点自我介绍" : "A LITTLE ABOUT ME"}</p>
        <h2 id="home-about-title">{zh ? "在技术与真实世界之间。" : "At the intersection of technology & people."}</h2>
        <p>{copy[locale].heroBody}</p>
        <p>{zh ? "从汇丰的客户数据分析，到 AI 知识工具与跨文化产品，我关注如何让复杂的信息变得清晰，让系统真正服务于人。" : "From customer analytics at HSBC to AI knowledge tools and cross-cultural products, I’m interested in making complex information useful—and building systems that serve people."}</p>
        <a className="text-link" href="#/research">{zh ? "了解我的研究与兴趣" : "More about my research & interests"}<ArrowUpRight /></a>
      </section>
      <section className="home-work" aria-labelledby="home-work-title">
        <div className="section-heading">
          <div><p className="eyebrow">{zh ? "想法，成为作品" : "IDEAS INTO PRACTICE"}</p><h2 id="home-work-title">{zh ? "精选项目" : "Selected projects"}</h2></div>
          <a className="text-link" href="#/work">{zh ? "查看全部项目" : "View all projects"}<ArrowUpRight /></a>
        </div>
        <div className="featured-grid">
          {projects.slice(0, 3).map((project) => (
            <article className="featured-card" key={project.id}>
              <div className="featured-card__top"><span>{project.eyebrow[locale]}</span><span className="project-number">{project.number}</span></div>
              <h3>{project.title}</h3>
              <p>{project.description[locale]}</p>
              <a className="text-link" href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`${zh ? "访问项目" : "Visit project"}: ${project.title}`}>{zh ? "访问项目" : "Visit project"}<ArrowUpRight /></a>
            </article>
          ))}
        </div>
      </section>
      <section className="home-background" aria-labelledby="background-title">
        <div className="background-intro">
          <p className="eyebrow">{zh ? "学习与实践" : "LEARNING & PRACTICE"}</p>
          <h2 id="background-title">{zh ? "一路走来" : "A little background."}</h2>
          <p>{zh ? "软件工程提供方法，跨学科学习拓宽问题的边界。" : "An engineering foundation, shaped by questions that reach beyond engineering."}</p>
          <a className="text-link" href={publicCvUrl} download>{zh ? "下载公开版 CV" : "Download public CV"}<ArrowUpRight /></a>
        </div>
        <div className="background-timeline">
          {education.map((item) => (
            <article key={item.id}><span className="timeline-dot" aria-hidden="true" /><p className="item-date">{item.period}</p><h3>{item.degree[locale]}</h3><p>{item.institution[locale]}</p></article>
          ))}
          <article><span className="timeline-dot" aria-hidden="true" /><p className="item-date">MAR — JUL 2026</p><h3>{zh ? "CRM 数据分析实习生" : "CRM Data Analyst Intern"}</h3><p>{zh ? "汇丰银行 · 财富管理及个人银行业务" : "HSBC · Wealth and Personal Banking"}</p><a className="text-link" href="#/experience">{zh ? "查看工作经历" : "Explore my experience"}<ArrowUpRight /></a></article>
        </div>
      </section>
      <section className="home-contact" aria-labelledby="home-contact-title">
        <p className="eyebrow">{zh ? "从一次交流开始" : "LET’S CONNECT"}</p>
        <h2 id="home-contact-title">{zh ? "好的想法，始于对话。" : "Good things start with a conversation."}</h2>
        <p>{zh ? "欢迎交流软件、数据、AI，以及值得一起探索的问题。" : "Always happy to talk about software, data, AI, and questions worth exploring."}</p>
        <a className="button button--primary" href="#/contact">{zh ? "联系我" : "Get in touch"}<ArrowUpRight /></a>
      </section>
    </div>
  );
}
