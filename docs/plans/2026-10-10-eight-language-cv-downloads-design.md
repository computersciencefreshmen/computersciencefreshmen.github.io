# Eight-language public CV downloads

## Goal and scope

Extend the site's eight-language experience to PDF downloads. The ordinary entry
point and canonical English PDF URL remain English. An explicit language choice
updates every current PDF link immediately. Preserve the user's current website
icon after reviewing three preview alternatives.

## Data flow

`src/data/cv.ts` records and the existing translation catalogs feed a strict Node
exporter. PDF-specific presentation copy is a small eight-language JSON record.
The exporter verifies section counts, bullet counts, numeric facts and full prose
coverage before producing locale-specific JSON. Python ReportLab consumes that
data and writes eight PDFs with embedded Unicode fonts and language metadata.
The static Pages artifact includes every file; no browser-side AI call is needed.

The React UI uses a `Record<Locale, string>` URL map with the same locale state as
the site selector. Link labels identify their actual PDF language. English retains
`/Hanyu_Yang_CV_Public.pdf`; the other editions use `/cv/..._{locale}.pdf`.

## Decisions

Reuse existing translations and structured records to reduce content drift.
Generate files before publishing to make download latency independent of AI or a
backend. Embed font subsets for portable Chinese/Cyrillic text and reasonable file
size. Keep headings with their first entries and use automatic pagination because
translated paragraphs differ in length.

The original source resume is unchanged. Public editions keep the existing public
content boundary. Icon alternatives remain local previews; deployed assets retain
the current design per the user's explicit preference.

## Verification and publication

Component tests cover all eight direct URLs, selector changes and default English.
The PDF verifier matches every sentence to exported data, checks numerical facts,
font embedding, language tags, professional links and printable bounds. Every
rendered page receives visual review. Browser QA performs real downloads in each
language on mobile/desktop and compares downloaded bytes to the local outputs.
GitHub Actions checks the source export and the presence of all eight PDF assets
before deploying. Repeat download checks against the live deployment.
