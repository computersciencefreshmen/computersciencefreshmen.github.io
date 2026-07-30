import { copy, identity, links } from "../data/portfolio";
import type { Locale } from "../types";
import { ArrowUpRight } from "./Icons";
import { Reveal } from "./Reveal";

interface ContactProps {
  locale: Locale;
}

export function Contact({ locale }: ContactProps) {
  const content = copy[locale];

  return (
    <section
      id="contact"
      className="section section--contact"
      aria-labelledby="contact-title"
    >
      <Reveal>
        <p className="section-kicker">{content.contactKicker}</p>
        <h2 id="contact-title">{content.contactTitle}</h2>
        <p className="contact__body">{content.contactBody}</p>
      </Reveal>

      <Reveal delay={100} className="contact__links">
        <a
          className="contact-link contact-link--primary"
          href={links.linkedin}
          target="_blank"
          rel="noreferrer"
        >
          <span>
            <small>LinkedIn</small>
            {content.contactCta}
          </span>
          <ArrowUpRight size={28} />
        </a>
        <a
          className="contact-link"
          href={links.github}
          target="_blank"
          rel="noreferrer"
        >
          <span>
            <small>GitHub</small>
            {content.githubCta}
          </span>
          <ArrowUpRight size={28} />
        </a>
      </Reveal>

      <Reveal delay={160} className="contact__coordinates">
        <span>31° N / 121° E → 23° N / 113° E</span>
        <span>{identity.location[locale]}</span>
      </Reveal>
    </section>
  );
}
