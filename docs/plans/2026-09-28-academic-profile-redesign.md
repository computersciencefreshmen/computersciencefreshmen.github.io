# Academic profile redesign — 2026-09-28

## Goal

Use https://www.yhposolihp.com/ as the visual and structural reference while
preserving Hanyu Yang's own professional record, brand, bilingual content, public
CV, and existing deployment. Prioritize a fast, complete iteration.

## Design decisions

1. Reuse the existing React/TypeScript/Vite architecture rather than migrating.
   This keeps the established GitHub Pages deployment and quality gate intact.
2. Replace the long homepage with six hash-routed views. The homepage introduces
   the person; Projects, Research, Experience, CV, and Contact support deeper
   reading. Hash routing avoids extra dependencies and static-host 404 rewrites;
   its trade-off is that pages share the root document's search metadata.
3. Follow the reference's circular portrait, restrained white/black palette,
   ample space, bottom floating navigation, and theme toggle. Retain local fonts,
   the existing HY mark, and all original personal imagery.
4. Keep the public content data as the source of truth. Research publication and
   metrics are carried over unchanged. Project filters classify existing live
   products separately from the research repository.
5. Replace the four-layer CSS cascade with one active stylesheet. Shared color
   variables control both themes; mobile gets a sticky header and expandable menu.
6. Maintain keyboard focus on navigation, Escape menu dismissal, single page H1,
   native links/history, reduced motion, clear empty states, and stored preferences.

## Validation

Component tests verify all profile categories, routes/history, bilingual search,
filters, theme/locale persistence, mobile menu behavior, and contact privacy.
Production browser QA covers all pages at desktop and mobile widths, both locales,
light/dark themes, horizontal overflow, local portrait loading, PDF availability,
and console/runtime errors. Deployment is verified against the pushed commit.
