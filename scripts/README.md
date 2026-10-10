# Browser QA

The production quality gate is `npm run check`. Run the browser pass after building:

```bash
python -m pip install -r requirements-qa.txt
python -m playwright install chromium
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
```

In a second terminal:

```bash
python scripts/multilingual_qa.py
python scripts/blog_qa.py
python scripts/cv_download_qa.py
```

`multilingual_qa.py` checks all eight routes, including blog index and article, in eight languages at 320, 390, 768,
and 1440px, validates Inter font loading, theme and language persistence,
navigation and Escape behavior, page overflow, browser errors, and the public PDF.
Screenshots and JSON results are saved to ignored `artifacts/multilingual-qa/`.
`blog_qa.py` verifies all eight full article translations, captions, metadata,
synchronized site/article language selectors, reloads, keyboard and theme behavior,
and checks that the downloadable CV matches the verified local PDF byte for byte.
Use `--widths 390 1440` for a smaller targeted pass.
Pass `--url https://computersciencefreshmen.github.io` to check the live deployment.
`cv_download_qa.py` exercises all eight PDF editions on the homepage, CV page and
experience page at 390/1440px. It performs real downloads, compares their bytes
with the verified public PDFs, checks immediate language changes, and confirms
default English even with an old saved preference.
`visual_qa.py` is the older bilingual interaction check; component tests cover its
project search and filter scenarios with the new language selector.

`capture_review.py`, `debug_reveal.py`, and `cv_visual_qa.py` are historical single-page
review helpers; use `visual_qa.py` for the current navigation and layout.

## Regenerating the eight public PDFs

Use Node 24 plus Python with `reportlab`, `pypdf`, `pdfplumber` and its page-rendering
dependencies. The Codex bundled Python includes these packages.

```bash
node scripts/export_public_cv.mjs
python scripts/generate_multilingual_cv.py --skip-export
python scripts/verify_multilingual_cv.py
npm run build
python scripts/cv_download_qa.py
```

The exporter validates all languages before writing any JSON. It reuses the
website records and translations, checks section/bullet counts and numerical
facts, and rejects missing prose rather than silently falling back to English.
Its output is ignored under `artifacts/public-cv-data/`.
PDF-only profile, headings, sharing note and publication-title translations live
in `src/data/public-cv-copy.json`; update the profile when status changes.

The renderer generates the original English URL plus seven files under `public/cv/`.
It embeds Latin/Cyrillic and Chinese font subsets; never commit system font files.
On Windows it uses Arial and Microsoft YaHei by default. On other systems, provide
TrueType fonts with the needed Unicode coverage using `--font-regular`,
`--font-bold`, `--font-italic`, `--font-cjk` and `--font-cjk-bold`.
The renderer checks glyph coverage before authoring each document.

The verifier checks every exported sentence, metric, section, public hyperlink,
language tag and embedded font; renders every page to
`artifacts/multilingual-cv-render/` for visual review. Review all final rendered
pages before committing generated PDFs. Generation is local; Pages deploys the
verified files and checks all eight destinations exist.

For a single edition, use `generate_multilingual_cv.py --locale de`.
`generate_public_cv.py` and `verify_public_cv.py` remain compatible entry points
for the English edition, backed by the same localized implementation.
