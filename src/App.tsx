import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { CvArchive } from "./components/CvArchive";
import { Experience } from "./components/Experience";
import { Hero } from "./components/Hero";
import { ProjectGrid } from "./components/ProjectGrid";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";
import { useLocale } from "./hooks/useLocale";

function App() {
  const { locale, toggleLocale } = useLocale();

  return (
    <>
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <SiteHeader locale={locale} onToggleLocale={toggleLocale} />
      <main id="main-content">
        <div id="top" />
        <Hero locale={locale} />
        <Experience locale={locale} />
        <ProjectGrid locale={locale} />
        <About locale={locale} />
        <CvArchive locale={locale} />
        <Contact locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}

export default App;
