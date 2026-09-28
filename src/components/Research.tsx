import { localize, formatPeriod, translate } from "../i18n";
import { publication, research } from "../data/cv";
import type { Locale } from "../types";

interface ResearchProps {
  locale: Locale;
}

export function Research({ locale }: ResearchProps) {
  const areas = localize({ en: ["Natural language processing", "Multimodal learning", "Computer vision"], zh: ["自然语言处理", "多模态学习", "计算机视觉"] }, locale);

  return (
    <section id="research" className="page-section research-page" aria-labelledby="research-title">
      <header className="page-heading">
        <p className="section-kicker">{localize({ en: "Questions first. Experiments follow.", zh: "从问题出发，以实验求解。" }, locale)}</p>
        <h1 id="research-title">{localize({ en: "Research", zh: "研究" }, locale)}</h1>
        <p>{localize({ en: "Exploring language, images, and attention through applied machine learning for information understanding and visual recognition.", zh: "探索语言、图像与注意力机制，研究机器学习在信息理解和视觉识别中的应用。" }, locale)}</p>
        <ul className="tag-list research-areas" aria-label={localize({ en: "Research areas", zh: "研究方向" }, locale)}>
          {areas.map((area) => <li key={area}>{area}</li>)}
        </ul>
      </header>

      <div className="research-list">
        {research.map((entry) => (
          <article className="research-entry" key={entry.id}>
            <div className="research-entry__meta">
              <span>{formatPeriod(entry.period, locale)}</span>
              <span>{localize(entry.location, locale)}</span>
            </div>
            <div className="research-entry__content">
              <h2>{localize(entry.title, locale)}</h2>
              <p className="research-entry__organization">{localize(entry.organization, locale)}</p>
              <ul className="research-entry__bullets">
                {entry.bullets.map((bullet) => <li key={bullet.en}>{localize(bullet, locale)}</li>)}
              </ul>
              {entry.technologies && (
                <ul className="tag-list" aria-label={localize({ en: "Methods and technologies", zh: "研究方法与技术" }, locale)}>
                  {entry.technologies.map((technology) => <li key={translate(locale, technology)}>{translate(locale, technology)}</li>)}
                </ul>
              )}
            </div>
          </article>
        ))}
      </div>

      <section className="publication-section" aria-labelledby="publication-title">
        <div className="section-heading">
          <h2 id="publication-title">{localize({ en: "Publication", zh: "发表论文" }, locale)}</h2>
          <span>01</span>
        </div>
        <article className="publication-entry">
          <p className="publication-entry__year">2024</p>
          <p>{localize(publication, locale)}</p>
        </article>
      </section>
    </section>
  );
}
