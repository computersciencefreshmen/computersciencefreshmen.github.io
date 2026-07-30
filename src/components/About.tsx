import { copy } from "../data/portfolio";
import type { Locale } from "../types";
import { Reveal } from "./Reveal";

interface AboutProps {
  locale: Locale;
}

export function About({ locale }: AboutProps) {
  const content = copy[locale];

  return (
    <section id="about" className="section section--about" aria-labelledby="about-title">
      <div className="about-layout">
        <Reveal className="about-intro">
          <p className="section-kicker">{content.aboutKicker}</p>
          <h2 id="about-title">{content.aboutTitle}</h2>
          <p className="about-intro__lead">{content.aboutLead}</p>
          <p className="about-intro__body">{content.aboutBody}</p>
        </Reveal>

        <div className="principles">
          {content.principles.map((principle, index) => (
            <Reveal
              key={principle.number}
              delay={index * 80}
              className="principle"
            >
              <span>{principle.number}</span>
              <div>
                <h3>{principle.title}</h3>
                <p>{principle.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <Reveal className="toolkit">
        <p>{content.toolkitLabel}</p>
        <ul>
          {content.toolkit.map((tool) => (
            <li key={tool}>{tool}</li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
