import { copy, identity, links } from "../data/portfolio";
import type { Locale } from "../types";
import { ArrowDown, ArrowUpRight } from "./Icons";
import { Reveal } from "./Reveal";

interface HeroProps {
  locale: Locale;
}

export function Hero({ locale }: HeroProps) {
  const content = copy[locale];

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero__atmosphere" aria-hidden="true">
        <span className="hero__orb hero__orb--one" />
        <span className="hero__orb hero__orb--two" />
      </div>

      <div className="hero__copy">
        <Reveal>
          <div className="availability">
            <span className="availability__dot" aria-hidden="true" />
            {content.availability}
          </div>
        </Reveal>

        <Reveal delay={80}>
          <p className="eyebrow">{content.heroKicker}</p>
        </Reveal>

        <Reveal delay={140}>
          <h1 id="hero-title">
            {content.heroTitleLead}{" "}
            <em>{content.heroTitleAccent}</em>{" "}
            {content.heroTitleTail}
          </h1>
        </Reveal>

        <Reveal delay={210}>
          <p className="hero__body">{content.heroBody}</p>
        </Reveal>

        <Reveal delay={270} className="hero__actions">
          <a className="button button--primary" href="#work">
            {content.exploreWork}
            <ArrowDown />
          </a>
          <a
            className="button button--ghost"
            href={links.linkedin}
            target="_blank"
            rel="noreferrer"
          >
            {content.connect}
            <ArrowUpRight />
          </a>
        </Reveal>
      </div>

      <Reveal delay={180} className="hero__portrait-wrap">
        <figure className="portrait-card">
          <div className="portrait-card__index" aria-hidden="true">
            PLATE / 001
          </div>
          <div className="portrait-card__image">
            <span className="portrait-card__initials" aria-hidden="true">
              HY
            </span>
            <img
              src="/profile.png"
              alt={content.portraitAlt}
              width="720"
              height="720"
              fetchPriority="high"
            />
            <span className="portrait-card__scanline" aria-hidden="true" />
          </div>
          <figcaption>
            <div>
              <strong>{content.portraitCaption}</strong>
              <span>{identity.location[locale]}</span>
            </div>
            <span className="portrait-card__mark" aria-hidden="true">
              ↗
            </span>
          </figcaption>
        </figure>
        <div className="hero__plate-label" aria-hidden="true">
          <span>{content.plateLabel}</span>
          <span>
            {content.signalOne} · {content.signalTwo} · {content.signalThree}
          </span>
        </div>
      </Reveal>

      <Reveal delay={340} className="hero__proof">
        <p>{content.proofLabel}</p>
        <div className="proof-grid">
          {content.proof.map(([value, label]) => (
            <div className="proof-item" key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
