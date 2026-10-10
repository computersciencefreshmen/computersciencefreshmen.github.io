# Bilingual blog

## Goal

Extend the existing personal profile with a place for authored reflections. The
first post is Henry's Cuarteto Casals concert essay, supplied as a Chinese screenshot
and two original photographs. The ordinary entry remains English; Chinese is
available through the existing URL language preference and article controls.

## Architecture and decisions

- `src/data/blog.ts` owns typed English/Chinese content, stable slugs, publication
  and concert dates, image descriptions, captions, and source links.
- `src/components/Blog.tsx` renders the collection, individual articles, and the
  homepage's latest post. Content is published with the static build, avoiding
  translation latency and runtime API credentials.
- `#/blog` and `#/blog/death-and-the-maiden` use the existing hash-navigation
  model, so direct article links work on GitHub Pages without a server rewrite.
  Browser history, the active navigation entry, focus, and page metadata follow
  the current route. Unknown slugs offer a return to the collection.
- Existing site chrome retains all eight languages. Essays are English/Chinese;
  other interface languages show English prose explicitly marked `lang="en"`.
- The blog continues the profile's light/dark color system and quiet typography.
  Original photographs lead the story, with a narrow reading column for prose.
  Native links/buttons and descriptive image text keep it keyboard-accessible.
- A database or CMS adds operational complexity for the current publishing
  volume. Typed content is the simplest maintainable fit; a future CMS can feed
  the same article model when independent authoring becomes necessary.

## Editorial handling

Preserve the Chinese voice and translate its meaning faithfully. Correct the
apparent `Danza delicious Molinero` transcription to `Danza del molinero`, checked
against Manuel de Falla's official catalogue. The HKU MUSE season announcement
confirms the concert date of 9 October 2026. Publish the essay on 10 October 2026.
Use the supplied original photos directly.

## Verification and release

Run lint, integration tests, and a production build. Verify direct links,
English/Chinese switching, fallback article language, missing-post recovery,
mobile/desktop layouts, image loading, and light/dark themes in a browser.
Regenerate the self-hosted Chinese font subsets. Publish through the existing
main-branch GitHub Pages workflow and verify the deployed article.
