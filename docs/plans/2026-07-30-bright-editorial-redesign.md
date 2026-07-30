# Bright editorial portfolio redesign

## Goal

Make the portfolio feel direct, bright, and professional while preserving its
full bilingual CV, project evidence, public PDF, privacy safeguards, and static
GitHub Pages deployment.

## Visual system

- White is the primary canvas.
- Pale sage and sky blue separate major sections without dark panels or grids.
- HSBC red is the only high-energy accent.
- Manrope carries headings and body text; DM Mono is reserved for metadata.
- Cards use thin borders and spacing instead of large shadows or decoration.

## HSBC experience

The supplied HSBC artwork is used as a real image asset rather than a CSS
approximation. Its large white margins are cropped at presentation time inside
a wide, white frame, leaving the source file untouched. The content hierarchy is
logo, role metadata, four-step operating flow, four contributions, tools, then
the public CV link.

## Architecture

React components continue to own structure and bilingual content. Styles load
centrally in this order:

1. `global.css` — original layout foundation.
2. `cv.css` — CV and HSBC component structure.
3. `bright.css` — active visual direction.
4. `accessibility.css` — contrast, focus, motion, and touch guarantees.

This keeps the redesign reversible and reduces the chance of content or
interaction regressions during a visual change.

## Acceptance criteria

- The HSBC image loads from `/hsbc-logo.png` and has one localized accessible
  name.
- English and Chinese content, CV download, external links, and privacy tests
  remain intact.
- No horizontal overflow at 390, 768, or 1440 pixels.
- A closed mobile menu is neither visible nor keyboard-focusable; Escape closes
  an open menu.
- Important text and controls maintain WCAG AA contrast and visible focus.
- Build output contains the logo, public CV, 404 page, and main page.
