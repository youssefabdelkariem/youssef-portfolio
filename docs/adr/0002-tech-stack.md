# ADR 0002: Stack and rendering comparison

Status: **Proposed**. Updated 2026-10-15. Owner: repository owner with technical reviewer. Related: FR-01a, FR-01b, FR-02, QA-02, QA-05, QA-06, QA-07, Q07; findings I-1, I-10.

## Context

The portfolio is content-led, requires direct case-study URLs and may benefit from selective interaction. Cinematic presentation does not establish a need for a client SPA. The current site remains plain HTML/CSS. **No framework is selected during M0.**

## Neutral proposal and alternatives

Run the same fixture routes/content in these three M1a arms, within the time box in [DEVELOPMENT_PLAN](../DEVELOPMENT_PLAN.md#m1a---technical-architecture-validation-proposed):

| Arm | Benefit | Tradeoff to measure |
| --- | --- | --- |
| Eleventy/static HTML + small JS | Direct output, modest runtime and easy static delivery | Template/content maintenance versus plain-HTML duplication |
| Astro static output + selective islands | Generated page HTML and isolated interaction | Hydration payload, framework conventions and contributor effort |
| React + Vite + build-time route prerendering | Reusable interactive components | Explicit rendering/hydration pipeline, total bytes and maintenance |

For the React arm, a candidate is a build-only route enumerator using React DOM static `prerenderToNodeStream` to capture complete `route/index.html` files, with compatible client hydration only for interactive regions. Vite's SSR/SSG guidance provides build-time prerendering concepts, but Vite alone does not generate route HTML. Record the actual method and hydration correctness before accepting this arm; a pure `renderToStaticMarkup` output is not hydratable. This describes a candidate, not code to create in M0.

Compare compressed transferred bytes/JS, route HTML/metadata, keyboard/reduced-motion behavior, build complexity and timed steps to add a case study. Use identical fixtures and the reference performance profile. Do not presume Astro or React wins. Reject a bare SPA for the proposed delivered-HTML/direct-route criteria, not for its brand name.

## Consequences and gate

TypeScript may improve content contracts, but is a separate choice supported by the selected toolchain. Tailwind, GSAP, Three.js/R3F are later optional enhancements, not required spike dependencies. Cross-document transitions can enhance ordinary page navigation without requiring a SPA.

M1a records versions, commands, output and comparison evidence; owner/reviewer then approve an option or request more evidence. A chosen build tool still needs ADR 0006's separate publishing gate. Revisit if content scale or a validated interaction changes the tradeoff.

Sources: [Eleventy](https://www.11ty.dev/docs/), [Astro islands](https://docs.astro.build/en/concepts/islands/), [Vite SSR/prerendering](https://vite.dev/guide/ssr.html), [React prerenderToNodeStream](https://react.dev/reference/react-dom/static/prerenderToNodeStream), [React static markup limitation](https://react.dev/reference/react-dom/server/renderToStaticMarkup). Checked 2026-10-15.
