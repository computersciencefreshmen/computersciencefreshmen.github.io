# Hanyu Yang — Personal Portfolio

A bilingual, editorial personal portfolio for Hanyu “Henry” Yang, published at
[computersciencefreshmen.github.io](https://computersciencefreshmen.github.io/).

## Why this site exists

This project replaces a hosted Wix presence with a portfolio whose design, source,
deployment, and domain are controlled by its owner. Its central story is:
**building trustworthy, deployable systems from messy real-world information**.

## Architecture

```text
Typed portfolio data
        ↓
React sections + locale state
        ↓
Vite static production build
        ↓
Tested Pages artifact
        ↓
GitHub Pages over HTTPS
```

- **React** keeps sections reusable and interaction state explicit.
- **TypeScript** makes content structure and project links verifiable at build time.
- **Vite** produces a fast static bundle suitable for GitHub Pages.
- **GitHub Actions** separates untrusted dependency/build work from the privileged
  deployment job.
- **No backend** is required; contact calls to action use established social channels.

## Local development

Requirements: Node.js 24 and npm 11.

```bash
npm ci
npm run dev
```

Quality gate:

```bash
npm run check
```

Production preview:

```bash
npm run build
npm run preview
```

## Editing content

Most copy, project metadata, journey entries, and external links live in
`src/data/portfolio.ts`. Visual tokens and responsive behavior live in
`src/styles/global.css`.

## Deployment

Every push to `main` runs linting, component tests, a strict TypeScript/Vite build,
artifact validation, and deployment through the official GitHub Pages workflow.
The Vite base path is `/` because this repository is the account-level user site.

## Privacy and licensing

The site contains only public professional information and does not use analytics,
cookies, trackers, or a contact-form database. Unless a file states otherwise, the
site’s content and visual design remain © Hanyu Yang; no general reuse license is
granted.
