import { localize, formatPeriod } from "../i18n";
import { copy, journey } from "../data/portfolio";
import type { Locale } from "../types";
import { Reveal } from "./Reveal";

interface JourneyProps {
  locale: Locale;
}

export function Journey({ locale }: JourneyProps) {
  const content = localize(copy, locale);

  return (
    <section
      id="journey"
      className="section section--journey"
      aria-labelledby="journey-title"
    >
      <Reveal className="section-heading section-heading--light">
        <div>
          <p className="section-kicker">{content.journeyKicker}</p>
          <h2 id="journey-title">{content.journeyTitle}</h2>
        </div>
        <p>{content.journeyIntro}</p>
      </Reveal>

      <div className="timeline">
        {journey.map((item, index) => (
          <Reveal key={`${formatPeriod(item.period, locale)}-${item.title.en}`} delay={index * 80}>
            <article className="timeline-item">
              <p className="timeline-item__period">{formatPeriod(item.period, locale)}</p>
              <div className="timeline-item__title">
                <h3>{localize(item.title, locale)}</h3>
                <p>{localize(item.organization, locale)}</p>
              </div>
              <p className="timeline-item__description">
                {localize(item.description, locale)}
              </p>
              <span className="timeline-item__number" aria-hidden="true">
                0{index + 1}
              </span>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
