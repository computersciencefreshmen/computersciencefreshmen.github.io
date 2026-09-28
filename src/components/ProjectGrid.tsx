import { localize, translate, locales, projectCount } from "../i18n";
import { useState } from "react";
import { projects } from "../data/portfolio";
import type { Locale } from "../types";
import { ArrowUpRight } from "./Icons";

interface ProjectGridProps {
  locale: Locale;
}

type ProjectFilter = "all" | "products" | "research";

export function ProjectGrid({ locale }: ProjectGridProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ProjectFilter>("all");
  const liveLabel = localize({ en: "Live site", zh: "访问网站" }, locale);
  const sourceLabel = localize({ en: "Source code", zh: "查看源码" }, locale);
  const normalizedQuery = query.trim().normalize("NFKD").replace(/\p{M}/gu, "").toLocaleLowerCase(locale);
  const searchedProjects = projects.filter((project) =>
    [
      project.title,
      ...locales.map(({ code }) => localize(project.description, code)),
      ...locales.map(({ code }) => localize(project.eyebrow, code)),
      project.description.en,
      project.description.zh,
      project.eyebrow.en,
      project.eyebrow.zh,
      ...project.technologies,
      ...locales.flatMap(({ code }) => project.technologies.map(technology => translate(code, technology))),
    ]
      .join(" ")
      .normalize("NFKD").replace(/\p{M}/gu, "").toLocaleLowerCase(locale)
      .includes(normalizedQuery),
  );
  const matchesFilter = (project: (typeof projects)[number], value: ProjectFilter) =>
    value === "all" || (value === "products" ? Boolean(project.liveUrl) : !project.liveUrl);
  const visibleProjects = searchedProjects.filter((project) => matchesFilter(project, filter));
  const filters: Array<{ value: ProjectFilter; label: string }> = [
    { value: "all", label: localize({ en: "All", zh: "全部" }, locale) },
    { value: "products", label: localize({ en: "Products", zh: "产品" }, locale) },
    { value: "research", label: localize({ en: "Research", zh: "研究" }, locale) },
  ];

  function clearFilters() {
    setQuery("");
    setFilter("all");
  }

  return (
    <section id="work" className="page-section project-page" aria-labelledby="work-title">
      <header className="page-heading">
        <p className="section-kicker">{localize({ en: "Ideas, put into practice.", zh: "想法，成为现实。" }, locale)}</p>
        <h1 id="work-title">{localize({ en: "Projects", zh: "精选项目" }, locale)}</h1>
        <p>{localize({ en: "Products and experiments shaped by real questions in education, AI, data, and cross-cultural exchange.", zh: "围绕真实问题构建的产品与实验，涵盖教育、AI、数据与跨文化交流。" }, locale)}</p>
      </header>

      <div className="project-controls">
        <div className="project-search">
          <label htmlFor="project-search">{localize({ en: "Search projects", zh: "搜索项目" }, locale)}</label>
          <input
            id="project-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={localize({ en: "Name, keyword, or technology…", zh: "项目名称、关键词或技术…" }, locale)}
            aria-controls="project-results"
          />
        </div>
        <div className="project-filters" role="group" aria-label={localize({ en: "Project category", zh: "项目分类" }, locale)}>
          {filters.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              aria-controls="project-results"
              onClick={() => setFilter(value)}
            >
              {label} <span>{searchedProjects.filter((project) => matchesFilter(project, value)).length}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="project-results-meta">
        <p role="status" aria-live="polite">
          {projectCount(visibleProjects.length, locale)}
        </p>
        {(query || filter !== "all") && (
          <button type="button" className="text-button" onClick={clearFilters}>
            {localize({ en: "Clear filters", zh: "清除筛选" }, locale)}
          </button>
        )}
      </div>

      <div id="project-results" className="project-grid">
        {visibleProjects.map((project) => (
          <article className="project-card" key={project.id}>
            <div className="project-card__meta">
              <span>{project.number}</span>
              <span>{localize(project.eyebrow, locale)}</span>
            </div>
            <h2>{project.title}</h2>
            <p className="project-card__description">{localize(project.description, locale)}</p>
            <ul className="tag-list" aria-label={localize({ en: "Technologies and areas", zh: "技术与领域" }, locale)}>
              {project.technologies.map((technology) => <li key={translate(locale, technology)}>{translate(locale, technology)}</li>)}
            </ul>
            <div className="project-card__links">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`${liveLabel}: ${project.title}`}>
                  {liveLabel}<ArrowUpRight />
                </a>
              )}
              <a href={project.repositoryUrl} target="_blank" rel="noreferrer" aria-label={`${sourceLabel}: ${project.title}`}>
                {sourceLabel}<ArrowUpRight />
              </a>
            </div>
          </article>
        ))}
        {visibleProjects.length === 0 && (
          <div className="project-empty">
            <h2>{localize({ en: "No projects found", zh: "没有匹配的项目" }, locale)}</h2>
            <p>{localize({ en: "Try another keyword, or clear the filters to see all projects.", zh: "试试其他关键词，或清除筛选查看全部项目。" }, locale)}</p>
            <button type="button" className="button button--primary" onClick={clearFilters}>
              {localize({ en: "Show all projects", zh: "查看全部项目" }, locale)}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
