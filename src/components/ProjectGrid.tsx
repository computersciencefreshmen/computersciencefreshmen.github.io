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
  const isChinese = locale === "zh";
  const liveLabel = isChinese ? "访问网站" : "Live site";
  const sourceLabel = isChinese ? "查看源码" : "Source code";
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const searchedProjects = projects.filter((project) =>
    [
      project.title,
      project.description.en,
      project.description.zh,
      project.eyebrow.en,
      project.eyebrow.zh,
      ...project.technologies,
    ]
      .join(" ")
      .toLocaleLowerCase()
      .includes(normalizedQuery),
  );
  const matchesFilter = (project: (typeof projects)[number], value: ProjectFilter) =>
    value === "all" || (value === "products" ? Boolean(project.liveUrl) : !project.liveUrl);
  const visibleProjects = searchedProjects.filter((project) => matchesFilter(project, filter));
  const filters: Array<{ value: ProjectFilter; label: string }> = [
    { value: "all", label: isChinese ? "全部" : "All" },
    { value: "products", label: isChinese ? "产品" : "Products" },
    { value: "research", label: isChinese ? "研究" : "Research" },
  ];

  function clearFilters() {
    setQuery("");
    setFilter("all");
  }

  return (
    <section id="work" className="page-section project-page" aria-labelledby="work-title">
      <header className="page-heading">
        <p className="section-kicker">{isChinese ? "想法，成为现实。" : "Ideas, put into practice."}</p>
        <h1 id="work-title">{isChinese ? "精选项目" : "Projects"}</h1>
        <p>{isChinese
          ? "围绕真实问题构建的产品与实验，涵盖教育、AI、数据与跨文化交流。"
          : "Products and experiments shaped by real questions in education, AI, data, and cross-cultural exchange."}</p>
      </header>

      <div className="project-controls">
        <div className="project-search">
          <label htmlFor="project-search">{isChinese ? "搜索项目" : "Search projects"}</label>
          <input
            id="project-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={isChinese ? "项目名称、关键词或技术…" : "Name, keyword, or technology…"}
            aria-controls="project-results"
          />
        </div>
        <div className="project-filters" role="group" aria-label={isChinese ? "项目分类" : "Project category"}>
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
          {isChinese ? `${visibleProjects.length} 个项目` : `${visibleProjects.length} project${visibleProjects.length === 1 ? "" : "s"}`}
        </p>
        {(query || filter !== "all") && (
          <button type="button" className="text-button" onClick={clearFilters}>
            {isChinese ? "清除筛选" : "Clear filters"}
          </button>
        )}
      </div>

      <div id="project-results" className="project-grid">
        {visibleProjects.map((project) => (
          <article className="project-card" key={project.id}>
            <div className="project-card__meta">
              <span>{project.number}</span>
              <span>{project.eyebrow[locale]}</span>
            </div>
            <h2>{project.title}</h2>
            <p className="project-card__description">{project.description[locale]}</p>
            <ul className="tag-list" aria-label={isChinese ? "技术与领域" : "Technologies and areas"}>
              {project.technologies.map((technology) => <li key={technology}>{technology}</li>)}
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
            <h2>{isChinese ? "没有匹配的项目" : "No projects found"}</h2>
            <p>{isChinese ? "试试其他关键词，或清除筛选查看全部项目。" : "Try another keyword, or clear the filters to see all projects."}</p>
            <button type="button" className="button button--primary" onClick={clearFilters}>
              {isChinese ? "查看全部项目" : "Show all projects"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
