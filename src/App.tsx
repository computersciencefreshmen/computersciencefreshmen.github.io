import { localize } from "./i18n";
import { useEffect, useRef, useState } from "react";
import { Contact } from "./components/Contact";
import { Blog } from "./components/Blog";
import { CvArchive } from "./components/CvArchive";
import { Experience } from "./components/Experience";
import { Hero } from "./components/Hero";
import { ProjectGrid } from "./components/ProjectGrid";
import { Research } from "./components/Research";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader, type Page } from "./components/SiteHeader";
import { useLocale } from "./hooks/useLocale";
import { useTheme } from "./hooks/useTheme";
import { copy } from "./data/portfolio";
import { getBlogPost } from "./data/blog";

interface Route { page: Page; postSlug?: string }

function readRoute(): Route {
  const path = window.location.hash.replace(/^#\/?/, "");
  if (path === "blog" || path === "blog/") return { page: "blog" };
  if (path.startsWith("blog/")) return { page: "blog", postSlug: path.slice(5) };
  if (["work", "research", "experience", "cv", "contact"].includes(path)) return { page: path as Page };
  if (["education", "journey"].includes(path)) return { page: "cv" };
  return { page: "home" };
}
const titles = {
  en: { home: "Software, Data & AI", work: "Projects", research: "Research", experience: "Experience", cv: "Curriculum Vitae", blog: "Blog", contact: "Contact" },
  zh: { home: "软件、数据与人工智能", work: "精选项目", research: "研究", experience: "工作经历", cv: "完整简历", blog: "博客", contact: "联系我" },
};
function App() {
  const { locale, changeLocale } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const [route, setRoute] = useState<Route>(readRoute);
  const { page, postSlug } = route;
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const navigate = () => {
      if (window.location.hash === "#main-content") return;
      setRoute(readRoute());
      window.scrollTo({ top: 0, behavior: "instant" });
      mainRef.current?.focus({ preventScroll: true });
    };
    window.addEventListener("hashchange", navigate);
    return () => window.removeEventListener("hashchange", navigate);
  }, []);
  useEffect(() => {
    const article = page === "blog" ? getBlogPost(postSlug)?.content[locale] : undefined;
    document.title = `${localize({ en: "Hanyu Yang", zh: "杨涵宇" }, locale)} — ${article?.title ?? localize(titles, locale)[page]}`;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = article?.excerpt ?? (page === "blog" ? localize({ en: "Personal reflections on music, culture, and the moments in between.", zh: "记录音乐、文化，以及生活中的片刻感受。" }, locale) : localize(copy, locale).heroBody);
  }, [page, postSlug, locale]);
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          mainRef.current?.focus({ preventScroll: true });
          mainRef.current?.scrollIntoView?.({ block: "start" });
        }}
      >
        {localize({ en: "Skip to content", zh: "跳到主要内容" }, locale)}
      </a>
      <SiteHeader locale={locale} onChangeLocale={changeLocale} page={page} theme={theme} onToggleTheme={toggleTheme} />
      <main id="main-content" ref={mainRef} tabIndex={-1}>
        {page === "home" && <Hero locale={locale} />}
        {page === "work" && <ProjectGrid locale={locale} />}
        {page === "research" && <Research locale={locale} />}
        {page === "experience" && <Experience locale={locale} />}
        {page === "cv" && <CvArchive locale={locale} />}
        {page === "blog" && <Blog locale={locale} slug={postSlug} onChangeLocale={changeLocale} />}
        {page === "contact" && <Contact locale={locale} />}
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
export default App;
