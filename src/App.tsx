import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Hero } from "./components/Hero";
import { Journey } from "./components/Journey";
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
        <ProjectGrid locale={locale} />
        <About locale={locale} />
        <Journey locale={locale} />
        <Contact locale={locale} />
      </main>
      <SiteFooter locale={locale} />
    </>
  );
}

export default App;
