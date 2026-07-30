import {
  achievements,
  cvProjects,
  education,
  publication,
  publicCvUrl,
  research,
  skills,
  xinAnExperience,
  type CvEntry,
} from "../data/cv";
import type { Locale } from "../types";
import { ArrowUpRight } from "./Icons";
import { Reveal } from "./Reveal";

interface CvArchiveProps {
  locale: Locale;
}

const archiveCopy = {
  en: {
    kicker: "CV / Complete record",
    title: "The work behind the profile.",
    intro:
      "A complete view of my education, earlier industry experience, research, engineering projects, awards, technical toolkit, and publication.",
    download: "Download public CV",
    privacy: "Contact details removed for public sharing",
    education: "Education",
    educationIndex: "01 / Formation",
    experience: "Additional experience",
    experienceIndex: "02 / Industry",
    research: "Research",
    researchIndex: "03 / Inquiry",
    projects: "Engineering projects",
    projectsIndex: "04 / Practice",
    skills: "Technical toolkit",
    skillsIndex: "05 / Capability",
    achievements: "Awards & recognition",
    achievementsIndex: "06 / Recognition",
    publication: "Publication",
    publicationIndex: "07 / Record",
    responsibilities: "Selected responsibilities",
  },
  zh: {
    kicker: "CV / 完整档案",
    title: "个人主页背后的完整经历。",
    intro:
      "系统展示我的教育背景、其他行业实践、科研经历、工程项目、奖项、技术能力与论文发表。",
    download: "下载公开版 CV",
    privacy: "公开分享版本已移除私人联系方式",
    education: "教育背景",
    educationIndex: "01 / 学术基础",
    experience: "其他实习经历",
    experienceIndex: "02 / 行业实践",
    research: "科研经历",
    researchIndex: "03 / 问题探索",
    projects: "工程项目",
    projectsIndex: "04 / 技术实践",
    skills: "技术能力",
    skillsIndex: "05 / 能力结构",
    achievements: "奖项与荣誉",
    achievementsIndex: "06 / 成果认可",
    publication: "论文发表",
    publicationIndex: "07 / 学术记录",
    responsibilities: "主要工作",
  },
} as const;

function EntryCard({
  entry,
  locale,
  label,
  compact = false,
}: {
  entry: CvEntry;
  locale: Locale;
  label: string;
  compact?: boolean;
}) {
  return (
    <article className={`archive-entry ${compact ? "archive-entry--compact" : ""}`}>
      <div className="archive-entry__topline">
        <p>{entry.period}</p>
        <span>{entry.location[locale]}</span>
      </div>
      <h4>{entry.title[locale]}</h4>
      <p className="archive-entry__organization">{entry.organization[locale]}</p>
      <p className="archive-entry__label">{label}</p>
      <ul className="archive-entry__bullets">
        {entry.bullets.map((bullet) => (
          <li key={bullet.en}>{bullet[locale]}</li>
        ))}
      </ul>
      {entry.technologies && (
        <ul className="archive-entry__tags" aria-label="Technologies">
          {entry.technologies.map((technology) => (
            <li key={technology}>{technology}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

export function CvArchive({ locale }: CvArchiveProps) {
  const content = archiveCopy[locale];

  return (
    <section
      id="cv"
      className="section section--cv"
      aria-labelledby="cv-title"
    >
      <Reveal className="cv-heading">
        <div>
          <p className="section-kicker">{content.kicker}</p>
          <h2 id="cv-title">{content.title}</h2>
        </div>
        <div className="cv-heading__aside">
          <p>{content.intro}</p>
          <a href={publicCvUrl} download>
            <span>
              <strong>{content.download}</strong>
              <small>{content.privacy}</small>
            </span>
            <ArrowUpRight />
          </a>
        </div>
      </Reveal>

      <section className="archive-block" aria-labelledby="education-title">
        <div className="archive-block__heading">
          <p>{content.educationIndex}</p>
          <h3 id="education-title">{content.education}</h3>
        </div>
        <div className="education-grid">
          {education.map((item, index) => (
            <Reveal key={item.id} delay={index * 80}>
              <article className="education-card">
                <div className="education-card__meta">
                  <p>{item.period}</p>
                  <span>{item.location[locale]}</span>
                </div>
                <p className="education-card__institution">
                  {item.institution[locale]}
                </p>
                <h4>{item.degree[locale]}</h4>
                <ul>
                  {item.details.map((detail) => (
                    <li key={detail.en}>{detail[locale]}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="archive-block" aria-labelledby="additional-experience-title">
        <div className="archive-block__heading">
          <p>{content.experienceIndex}</p>
          <h3 id="additional-experience-title">{content.experience}</h3>
        </div>
        <Reveal>
          <EntryCard
            entry={xinAnExperience}
            locale={locale}
            label={content.responsibilities}
          />
        </Reveal>
      </section>

      <section className="archive-block" aria-labelledby="research-title">
        <div className="archive-block__heading">
          <p>{content.researchIndex}</p>
          <h3 id="research-title">{content.research}</h3>
        </div>
        <div className="archive-entry-grid archive-entry-grid--three">
          {research.map((entry, index) => (
            <Reveal key={entry.id} delay={index * 70}>
              <EntryCard
                entry={entry}
                locale={locale}
                label={content.responsibilities}
                compact
              />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="archive-block" aria-labelledby="engineering-projects-title">
        <div className="archive-block__heading">
          <p>{content.projectsIndex}</p>
          <h3 id="engineering-projects-title">{content.projects}</h3>
        </div>
        <div className="archive-entry-grid">
          {cvProjects.map((entry, index) => (
            <Reveal key={entry.id} delay={(index % 2) * 70}>
              <EntryCard
                entry={entry}
                locale={locale}
                label={content.responsibilities}
              />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="archive-block" aria-labelledby="skills-title">
        <div className="archive-block__heading">
          <p>{content.skillsIndex}</p>
          <h3 id="skills-title">{content.skills}</h3>
        </div>
        <div className="skills-grid">
          {skills.map((group, index) => (
            <Reveal key={group.label.en} delay={index * 70}>
              <article className="skill-card">
                <p>{String(index + 1).padStart(2, "0")}</p>
                <h4>{group.label[locale]}</h4>
                <ul>
                  {group.values.map((skill) => (
                    <li key={skill}>{skill}</li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="archive-block" aria-labelledby="achievements-title">
        <div className="archive-block__heading">
          <p>{content.achievementsIndex}</p>
          <h3 id="achievements-title">{content.achievements}</h3>
        </div>
        <ol className="achievement-list">
          {achievements.map((achievement, index) => (
            <li key={achievement.en}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{achievement[locale]}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="archive-block archive-block--publication" aria-labelledby="publication-title">
        <div className="archive-block__heading">
          <p>{content.publicationIndex}</p>
          <h3 id="publication-title">{content.publication}</h3>
        </div>
        <blockquote>{publication[locale]}</blockquote>
      </section>
    </section>
  );
}
