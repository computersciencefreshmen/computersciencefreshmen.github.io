# Hanyu Yang Personal Portfolio — Design Brief

## Product goal

Move Hanyu Yang’s personal presence from a hosted Wix page to a fast, maintainable,
openly inspectable portfolio at `computersciencefreshmen.github.io`. The site should
help a recruiter, teacher, collaborator, or fellow builder understand three things in
under a minute: who Hanyu is, what he has built, and why his approach is distinctive.

## Narrative

The unifying story is: **building trustworthy, deployable systems from messy
real-world information**. The selected projects make that claim concrete through
verified admissions data, production prompt operations, cross-role education
workflows, audited receipt data, and leakage-aware NLP methodology.

The site is not a pixel clone of Wix. It preserves the personal-story intent while
reframing it as a distinctive “digital research dossier”: editorial typography,
field-note labels, numbered studies, fine grids, a dark ink/warm paper palette, and
signal green for action and progress.

## Architecture

- React components own presentation and interaction.
- Typed data in `src/data/portfolio.ts` is the single content source.
- A locale hook provides English/Chinese switching without a backend.
- CSS handles the visual system, responsive layout, and reduced-motion behavior.
- Vite builds immutable hashed assets into `dist/`.
- GitHub Actions tests and builds with read-only permissions, then a separate
  least-privilege job deploys the artifact to GitHub Pages.

This is intentionally a static single-page site. Section anchors avoid client-side
route refresh failures on GitHub Pages. A self-contained `404.html` handles genuinely
unknown paths.

## Quality bar

- Keyboard-accessible navigation, visible focus, semantic landmarks, meaningful alt
  text, language metadata, and reduced-motion support.
- Responsive verification at mobile, tablet, laptop, and wide desktop sizes.
- Automated lint, component tests, strict TypeScript compilation, and production build.
- Canonical metadata, sitemap, robots policy, web manifest, favicon, and social card.
- No secret environment variables, tracking scripts, contact database, or server
  dependency in version one.
