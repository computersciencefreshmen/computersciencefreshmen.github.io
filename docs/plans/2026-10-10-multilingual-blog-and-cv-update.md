# Complete blog languages and refresh the public CV

## Purpose

Match the blog to every language already offered by the website: English, Chinese,
German, French, Italian, Russian, Spanish, and Ukrainian. Every post's prose and
supporting text must follow the selected language rather than falling back to
English. Incorporate confirmed public professional facts from the latest supplied CV.

## Design

- Require `Record<Locale, BlogContent>` for article translations; type checking
  catches missing languages before publication. Tests validate nonempty content,
  distinct translated paragraphs, direct language links, and localized previews.
- Keep each new translation in an explicit article-content JSON file, alongside
  the English/Chinese originals, preserving named works and the author's voice.
- Reuse `LanguageSelect` with a configurable accessible label for the article.
  Both selectors use the same locale list and global URL preference; changing
  either synchronizes the page, preserves the route, and survives reloads.
- Use the article locale for titles, descriptions, dates, captions, alt text,
  tags, and `lang` attributes. Ordinary links still default to English.
- Update only confirmed CV differences: Top 10% undergraduate rank (GPA88/100),
  current HKU postgraduate wording and Sept.2026-Aug.2027 study dates. Preserve
  the source PDF and existing public-contact handling. Regenerate the public
  PDF with an October2026 footer and multilingual website-sharing note.

## Verification

Check all article locales in component tests and browsers, including two synced
selectors, translated full paragraphs, preview text, captions, metadata, refresh,
keyboard interaction, and mobile/desktop layouts. Verify and visually inspect the
regenerated PDF, then publish via the main-branch Pages workflow and check live URLs.
