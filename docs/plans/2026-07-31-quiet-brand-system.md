# Quiet Editorial Brand System

## Goal

Move the portfolio away from an HSBC-red personal identity and toward a calm,
low-saturation editorial system inspired by the generous whitespace and pale
highlight blocks in the reference Wix site.

The site should still make the HSBC experience immediately recognizable, but
the employer brand and the personal brand must remain visually distinct.

## Visual architecture

The page uses an 80 / 15 / 5 color ratio:

- 80% warm paper and white reading surfaces
- 15% muted lilac, sage, fog blue, sand, and rose section fields
- 5% dark ink for navigation, buttons, and hierarchy

There are no decorative color gradients, glass effects, glows, or saturated
personal-brand colors. Flat pale fields and typography carry the composition.

## Color roles

- Ink: `#262a28`
- Ink soft: `#414943`
- Muted text: `#59615c`
- Accent: `#536159`
- Accent strong: `#3f5048`
- Warm paper: `#f5f4f0`
- White surface: `#faf9f6`
- Sage: `#d8ded6`
- Fog blue: `#dee5e7`
- Lilac: `#e4e1e8`

Every foreground/background pairing used for normal text passes WCAG 2.2 AA.
The lowest measured combination is muted text on sage at 4.66:1.

## Personal mark

`public/hy-mark-v2.svg` is the master HY mark. It uses only filled vector
geometry—no font, thin stroke, or raster detail—so its minimum elements remain
two physical pixels at 16px favicon size.

`BrandMark.tsx` is the single runtime component used by the header and footer.
The versioned master also drives favicon, Apple Touch, PWA, maskable, and social
assets. Versioned filenames avoid the stale green/red favicon cache visible in
earlier browser screenshots.

## HSBC boundary

HSBC red is reserved for the official HSBC logo image. Personal navigation,
headings, section labels, project UI, CV links, contact links, and the HY mark
use the muted personal palette instead.

## Validation

- ESLint, Vitest, TypeScript, and Vite production build
- SVG source contains paths and no text element
- PNG dimensions checked for favicon, Apple Touch, PWA, maskable, and Open Graph
- Browser QA at 1440px, 768px, and 390px
- English/Chinese switching, mobile menu, external links, CV PDF, image loading,
  console errors, page errors, and horizontal overflow
