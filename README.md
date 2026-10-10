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
- `src/App.tsx` selects Home, Projects, Research, Experience, CV, Blog, or Contact.
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
- Language selection is kept in the URL; the theme is stored in the browser. No backend, analytics, or contact
  database is required.

The homepage is a short introduction. Detail pages retain the complete research
record, HSBC case study, engineering projects, awards, and downloadable public CV.
Projects can be searched in all eight languages and filtered by product or research.
Search ignores diacritics. Native language names make the selector usable regardless
of the current language. The ordinary entry point always opens in English,
regardless of saved preferences or browser language. Explicit `?lang=` links
retain their requested language, including on refresh and history navigation.
A language change preserves the current hash route.
Ukrainian uses the standard `uk` code, with `ua` accepted as an input alias.
For example, `/?lang=de#/research` opens German research content.
Dates use `Intl.DateTimeFormat`; every PDF link follows the selected language and
identifies the actual edition. The default English URL remains compatible with
existing links.

## Multilingual public CVs

The eight downloadable CVs share the same education, experience, research,
projects, skills and awards as the website. `publicCvUrls` in `src/data/cv.ts`
selects the English PDF at its original URL and the seven localized editions under
`public/cv/`. Homepage downloads, the CV archive and the experience page all use
this mapping, so a language change updates every PDF destination.

`scripts/export_public_cv.mjs` reads the TypeScript records and existing translation
catalogs, enforcing complete translations and unchanged numerical facts before
exporting JSON. `src/data/public-cv-copy.json` holds the small amount of PDF-specific
presentation copy: profile, headings, sharing note and translated publication titles.
Update that copy when the current profile/status changes. Technical identifiers
and official names keep their established spelling.

`scripts/generate_multilingual_cv.py` renders all eight editions with embedded
font subsets, localized dates and PDF language metadata. English and Chinese are
not separate hand-maintained resume sources. Generated PDFs are committed, so
deployment needs no translation service or system fonts. See `scripts/README.md`
for regeneration and verification commands.

## Blog publishing

`#/blog` lists personal essays, newest first. `#/blog/between-tides-and-twilight`
opens the October 11 city essay; `#/blog/death-and-the-maiden` opens the concert
essay. The homepage promotes the latest article, and the footer links to the blog. Articles are
authored in Chinese with reviewed translations in all eight site languages,
published in the same static build. The usual entry opens in English;
`/?lang=de#/blog/death-and-the-maiden` opens German. The article and site language
selectors share the same eight-language list, stay synchronized, and retain the
route on changes and refreshes. Titles, excerpts, prose, captions, alternative text,
tags, and page metadata all follow the selected language.

To publish another essay, add a `BlogPost` to `src/data/blog.ts`, with a unique
slug, content for all eight locales, ISO dates, and images under `public/blog/`. Keep
posts newest first for the homepage preview. Add descriptive alternative text
and captions in every language, regenerate Chinese fonts, then run `npm run check`.
The shared image records contain paths and dimensions; each locale supplies the
matching gallery captions and alternative text. A single gallery renderer supports
concert programmes and city photographs. Multiple photographs use two columns on
desktop and one on mobile, preserving their complete composition. Event dates and
external sources are optional and belong only to the relevant essay.
Long-form translations can live under `src/data/blog-locales/<slug>/`; the font
subset generator reads those JSON files as well as inline source copy.
`Record<Locale, BlogContent>` and tests enforce complete article translations.
Pushing the validated changes to `main` publishes through the existing workflow.
Articles need no runtime translation API or backend. Hash URLs provide browser
deep links; social crawlers may still use the site's static root metadata.

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
