# M1a architecture evaluation

Date: 2026-10-15. Author: Claude Code (acting lead engineer). Status: **evidence for owner review**; it does not accept any ADR. Related: Q07, Q08, Q14, QA-02, QA-05, QA-06, QA-07, ADR 0002, ADR 0003, ADR 0006.

## Method and limits

Three throwaway prototypes rendered **identical fixtures**: home (3 cards), `/work/` (6 cards), `/work/aurelia/` (headings, placeholder media, one interactive toggle button) and a 404. Each had a shared `<nav>`, a shared stylesheet, per-route title, description and canonical, and the same toggle behaviour. They were built from scratch in a scratch directory outside the repository (they are not committed), so this report is the record; the numbers are reproducible only by rebuilding equivalent fixtures.

Measurements used a local static server that mimics Pages routing (directory index, 301 to a trailing slash, real 404 status serving `404.html`) and headless Chrome via `puppeteer-core`. **Not measured:** Lighthouse/LCP under YS Mobile v1 throttling (the fixtures have no representative content), real Pages response headers, compression or range behaviour, or authoring time with real content. Tool versions: Eleventy 3.1.6, Astro 7.3.8, Vite 8.3.4 with `@vitejs/plugin-react` 6.1.2, React/React DOM 19.3.1, Node 24.19.0, npm 11.17.0.

## Results

| Criterion | Eleventy (Nunjucks + 8-line JS) | Astro (static, `format: directory`) | React + Vite + build-time prerender |
| --- | --- | --- | --- |
| Route HTML emitted for `/`, `/work/`, `/work/aurelia/`, 404 | Yes | Yes | Yes (custom `prerender.mjs`, ~10 lines) |
| Meaningful h1/title/description/canonical in delivered HTML | Yes | Yes | Yes |
| Real 404 status, 301 to trailing slash on the Pages-like server | Yes | Yes | Yes |
| Script bytes on the interactive page (gzip) | 142 B | 0 B external (inline handler) | 68,253 B (React + ReactDOM client) |
| Total gzip HTML for 4 pages | 1,617 B | 1,704 B | 1,755 B |
| Hydration / console errors | none (only a missing favicon 404) | none (same) | none; no hydration mismatch reported |
| Toggle works after load | Yes | Yes | Yes (after hydration) |
| Extra build steps beyond the framework | none | none | custom SSR build plus prerender script that must be maintained |
| Component reuse | Templates and includes, no typed props | `.astro` components with typed props, scoped CSS | Full React components |
| Islands / lazy interactive code | Manual | Built in (`client:visible`, any framework) | Manual code-splitting |
| 3D (Three.js) path | Manual script include | Island loaded only where used | Whole route hydrates React before the canvas |
| Cross-document view transitions | Plain CSS | Plain CSS (used) | Plain CSS |

React's 68 KB gzip floor uses roughly 45% of the proposed 150 KB initial-JS budget (QA-07) on a trivial page, before any animation or 3D library.

## Interpretation

- All three can satisfy delivered-HTML, direct-route, 404 and metadata requirements, so route generation does not discriminate. Eleventy and Astro do it with no custom code; React needed a bespoke prerender step I wrote and that the project would own.
- The decisive differences are shipped JavaScript and the interactivity model. Astro ships none by default and loads interactive code per island, which suits mostly-editorial case studies with a few rich components.
- Eleventy is the smallest, but offers no component model or typed content, so repeated case-study sections drift unless disciplined. Its authoring cost on a real case study was not measured.
- React/Vite remains viable but pays a fixed JS cost on every route for interactivity that most routes do not need.

## Recommendation (provisional, owner-review required)

Adopt **Astro with static output** as the provisional implementation stack, keeping Eleventy as the documented fallback. Interactive Three.js work, if Q10 justifies it, should be an Astro island loaded with `client:visible` and a dynamic import (vanilla Three.js, or React plus R3F inside the island only), so non-3D routes carry no 3D or React cost. This recommendation rests on the fixture evidence above and the proposed budgets; real-content measurements (M1b) can change it. ADR 0002 stays **Proposed**.

## What the implementation then verified

Astro also passed type checking (`astro check`, 0 errors), a built-output check, and a browser check (axe WCAG 2.x A/AA and best-practice rules on 7 routes at 390 and 1440 px, reflow from 320 to 1440 px, reduced motion, JavaScript disabled, refresh on every route). The checks were mutation-tested: injecting a missing alt, a low-contrast paragraph and an over-wide element made them fail as expected. See [HANDOFF](../HANDOFF.md) for the current results and gaps.
