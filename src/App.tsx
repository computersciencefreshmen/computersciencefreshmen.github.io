import { useEffect, useRef, useState } from "react";
import { Contact } from "./components/Contact";
import { CvArchive } from "./components/CvArchive";
import { Experience } from "./components/Experience";
import { Hero } from "./components/Hero";
import { ProjectGrid } from "./components/ProjectGrid";
import { Research } from "./components/Research";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader, type Page } from "./components/SiteHeader";
import { useLocale } from "./hooks/useLocale";
import { useTheme } from "./hooks/useTheme";

function readPage(): Page {
  const path = window.location.hash.replace(/^#\/?/, "");
  if (["work", "research", "experience", "cv", "contact"].includes(path)) return path as Page;
  if (["education", "journey"].includes(path)) return "cv";
  return "home";
}
const titles = {
  en: { home: "Software, Data & AI", work: "Projects", research: "Research", experience: "Experience", cv: "Curriculum Vitae", contact: "Contact" },
  zh: { home: "软件、数据与人工智能", work: "精选项目", research: "研究", experience: "工作经历", cv: "完整简历", contact: "联系我" },
};
function App() {
  const { locale, toggleLocale } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const [page, setPage] = useState<Page>(readPage);
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const navigate = () => {
      if (window.location.hash === "#main-content") return;
      setPage(readPage());
      window.scrollTo({ top: 0, behavior: "instant" });
      mainRef.current?.focus({ preventScroll: true });
    };
    window.addEventListener("hashchange", navigate);
    return () => window.removeEventListener("hashchange", navigate);
  }, []);
  useEffect(() => {
    document.title = `${locale === "zh" ? "杨涵宇" : "Hanyu Yang"} — ${titles[locale][page]}`;
  }, [page, locale]);
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
        {locale === "zh" ? "跳到主要内容" : "Skip to content"}
      </a>
      <SiteHeader locale={locale} onToggleLocale={toggleLocale} page={page} theme={theme} onToggleTheme={toggleTheme} />
      <main id="main-content" ref={mainRef} tabIndex={-1}>
        {page === "home" && <Hero locale={locale} />}
        {page === "work" && <ProjectGrid locale={locale} />}
        {page === "research" && <Research locale={locale} />}
        {page === "experience" && <Experience locale={locale} />}
        {page === "cv" && <CvArchive locale={locale} />}
        {page === "contact" && <Contact locale={locale} />}
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}
export default App;
