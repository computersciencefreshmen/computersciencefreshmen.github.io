import { copy, projects } from "../data/portfolio";
import type { Locale } from "../types";
import { ArrowUpRight } from "./Icons";
import { Reveal } from "./Reveal";

interface ProjectGridProps {
  locale: Locale;
}

function ProjectVisual({
  title,
  number,
}: {
  title: string;
  number: string;
}) {
  return (
    <div className="project-visual" aria-hidden="true">
      <div className="project-visual__chrome">
        <span />
        <span />
        <span />
        <small>{number} / FIELD STUDY</small>
      </div>
      <div className="project-visual__canvas">
        <span className="project-visual__glyph">{title.charAt(0)}</span>
        <span className="project-visual__line project-visual__line--one" />
        <span className="project-visual__line project-visual__line--two" />
        <span className="project-visual__line project-visual__line--three" />
        <span className="project-visual__disc" />
        <strong>{title}</strong>
      </div>
    </div>
  );
}

export function ProjectGrid({ locale }: ProjectGridProps) {
  const content = copy[locale];

  return (
    <section id="work" className="section section--work" aria-labelledby="work-title">
      <Reveal className="section-heading">
        <div>
          <p className="section-kicker">{content.workKicker}</p>
          <h2 id="work-title">{content.workTitle}</h2>
        </div>
        <p>{content.workIntro}</p>
      </Reveal>

      <div className="project-grid">
        {projects.map((project, index) => (
          <Reveal
            key={project.id}
            delay={(index % 2) * 90}
            className={`project-card project-card--${project.tone}`}
          >
            <article>
              <ProjectVisual title={project.title} number={project.number} />
              <div className="project-card__content">
                <div className="project-card__meta">
                  <span>{project.number}</span>
                  <span>{project.eyebrow[locale]}</span>
                </div>
                <h3>{project.title}</h3>
                <p className="project-card__description">
                  {project.description[locale]}
                </p>

                <div className="project-card__impact">
                  <span>{content.outcome}</span>
                  <p>{project.impact[locale]}</p>
                </div>

                <ul className="tag-list" aria-label="Technologies">
                  {project.technologies.map((technology) => (
                    <li key={technology}>{technology}</li>
                  ))}
                </ul>

                <div className="project-card__links">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {content.viewLive}
                      <ArrowUpRight />
                    </a>
                  )}
                  <a
                    href={project.repositoryUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {content.viewCode}
                    <ArrowUpRight />
                  </a>
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
