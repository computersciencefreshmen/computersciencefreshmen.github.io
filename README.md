# Hanyu Yang — Personal Website

A multilingual personal website for Hanyu “Henry” Yang, published at
[computersciencefreshmen.github.io](https://computersciencefreshmen.github.io/).

## Purpose and design

The site connects software engineering, applied research, data, and international
experience. Its academic profile structure takes inspiration from
[yhposolihp.com](https://www.yhposolihp.com/): a circular portrait, generous white
space, quiet typography, floating desktop navigation, and light/dark themes.
All profile text, projects, research, and assets belong to this portfolio's existing
public record; the reference site's personal content is not reused.

## Architecture

```text
Typed portfolio and CV data + complete locale catalogs
        ↓
React pages + hash navigation + locale/theme preferences
        ↓
Vite static production build
        ↓
GitHub Actions checks → GitHub Pages
```

- `src/data/portfolio.ts` and `src/data/cv.ts` contain public profile content.
- `src/App.tsx` selects Home, Projects, Research, Experience, CV, or Contact.
- Hash routes (`#/work`, `#/research`, `#/experience`, `#/cv`, `#/contact`)
  work on GitHub Pages without a server rewrite. Older section links still resolve.
- `src/styles/academic.css` defines responsive
  layouts, shared light/dark colors, focus indicators, and reduced-motion rules.
- `src/styles/fonts.css` self-hosts Inter (Latin, extended Latin, and Cyrillic)
  and a Noto Sans SC subset. Typography and responsive spacing follow the
  measured reference site: 60px desktop hero, 16px body, neutral colors, floating
  desktop navigation, and a compact 80px mobile portrait.
- `src/i18n/source.json` is the English-keyed source catalog with Chinese values;
  `src/i18n/locales/` contains complete German, French, Italian, Russian, Spanish,
  and Ukrainian translations. Brand names, technologies, and the original
  publication citation keep their established spelling.
- Locale and theme are stored in the browser. No backend, analytics, or contact
  database is required.

The homepage is a short introduction. Detail pages retain the complete research
record, HSBC case study, engineering projects, awards, and downloadable public CV.
Projects can be searched in all eight languages and filtered by product or research.
Search ignores diacritics. Native language names make the selector usable regardless
of the current language. Precedence is `?lang=` → saved preference → first supported
browser language → English. A language change preserves the current hash route.
Ukrainian uses the standard `uk` code, with `ua` accepted as an input alias.
For example, `/?lang=de#/research` opens German research content.
Dates use `Intl.DateTimeFormat`; PDF links explicitly identify the English download.

When changing copy, update the source catalog and all six translation catalogs.
Tests enforce exact key coverage and coverage of all active CV/project records.
Run `python scripts/subset_fonts.py` after changing Chinese text; generated font
subsets are committed so CI does not need Python or a font service.

## Development and verification

Requires Node.js 24 and npm 11.

```bash
npm ci
npm run dev
npm run check
```

`npm run check` runs ESLint, component tests, and the TypeScript/Vite production
build. Tests cover route/history behavior, filters, language and theme persistence,
mobile navigation, complete CV data, and public-contact privacy.

```bash
npm run preview -- --host 127.0.0.1 --port 4173
python scripts/multilingual_qa.py
```

See `scripts/README.md` for optional browser QA prerequisites. Screenshots and QA
reports are saved to ignored `artifacts/` directories.

## Deployment

Every push to `main` runs the quality gate, validates public assets, and deploys the
built artifact through the official GitHub Pages workflow. The site is served at
the account root, so the Vite base path is `/`.

## Privacy and licensing

Only public professional information is included. The downloadable CV excludes
private contact details. Contact links use established social profiles. Unless a
file says otherwise, content and visual assets remain © Hanyu Yang.
