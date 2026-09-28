import { publication, research } from "../data/cv";
import type { Locale } from "../types";

interface ResearchProps {
  locale: Locale;
}

export function Research({ locale }: ResearchProps) {
  const isChinese = locale === "zh";
  const areas = isChinese
    ? ["自然语言处理", "多模态学习", "计算机视觉"]
    : ["Natural language processing", "Multimodal learning", "Computer vision"];

  return (
    <section id="research" className="page-section research-page" aria-labelledby="research-title">
      <header className="page-heading">
        <p className="section-kicker">{isChinese ? "从问题出发，以实验求解。" : "Questions first. Experiments follow."}</p>
        <h1 id="research-title">{isChinese ? "研究" : "Research"}</h1>
        <p>{isChinese
          ? "探索语言、图像与注意力机制，研究机器学习在信息理解和视觉识别中的应用。"
          : "Exploring language, images, and attention through applied machine learning for information understanding and visual recognition."}</p>
        <ul className="tag-list research-areas" aria-label={isChinese ? "研究方向" : "Research areas"}>
          {areas.map((area) => <li key={area}>{area}</li>)}
        </ul>
      </header>

      <div className="research-list">
        {research.map((entry) => (
          <article className="research-entry" key={entry.id}>
            <div className="research-entry__meta">
              <span>{entry.period}</span>
              <span>{entry.location[locale]}</span>
            </div>
            <div className="research-entry__content">
              <h2>{entry.title[locale]}</h2>
              <p className="research-entry__organization">{entry.organization[locale]}</p>
              <ul className="research-entry__bullets">
                {entry.bullets.map((bullet) => <li key={bullet.en}>{bullet[locale]}</li>)}
              </ul>
              {entry.technologies && (
                <ul className="tag-list" aria-label={isChinese ? "研究方法与技术" : "Methods and technologies"}>
                  {entry.technologies.map((technology) => <li key={technology}>{technology}</li>)}
                </ul>
              )}
            </div>
          </article>
        ))}
      </div>

      <section className="publication-section" aria-labelledby="publication-title">
        <div className="section-heading">
          <h2 id="publication-title">{isChinese ? "发表论文" : "Publication"}</h2>
          <span>01</span>
        </div>
        <article className="publication-entry">
          <p className="publication-entry__year">2024</p>
          <p>{publication[locale]}</p>
        </article>
      </section>
    </section>
  );
}
