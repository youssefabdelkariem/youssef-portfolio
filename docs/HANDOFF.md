# Handoff: provisional site foundation

Updated 2026-10-15 by Claude Code (acting lead engineer while Codex is unavailable). Authority: owner instruction recorded in [DEVELOPMENT_PLAN](DEVELOPMENT_PLAN.md#active-milestone). Nothing here is merged, deployed or an accepted decision.

## Status

| Item | Value |
| --- | --- |
| Branch / worktree | `feat/m1a-site-foundation`, worktree `../website-portfolio-m1a` (sibling of the main checkout) |
| Base | M0 commit `80af31cd00c73e1f7bf737e15cae6bd731bcfde9` (`docs/m0-foundation`) |
| Implementation commit | `510e4a4` |
| Documentation commit | see `git log -3` on the branch; the newest commit is the handoff |
| Production | `main` still `c882895`; root `index.html` and `CNAME` unchanged; no workflow, Pages or DNS change |
| ADR statuses | 0001 Accepted; 0002-0006 Proposed (unchanged) |
| Stack | Astro 7.3.8 static output, TypeScript strict, plain CSS; Node >= 22.12 |

## Architecture and what exists

Rationale and measurements: [M1A_EVALUATION](reviews/M1A_EVALUATION.md); layout and routes: [SITE_ARCHITECTURE](SITE_ARCHITECTURE.md#provisional-implementation-feature-branch-2026-10-15).

- Routes (all static `index.html` + real `404.html`): `/`, `/work/`, `/work/aurelia/`, `/engineering/`, `/engineering/ibm-ai-racing/`, `/about/`, `/contact/`. Slugs are Proposed (Q08).
- Components: `BaseLayout`, `Media` (labelled placeholder or responsive image), `ProjectCard`, `SlotCard`, `CaseHero`, `Pending`. Data: `src/data/site.ts`, `src/data/projects.ts` (typed, with readiness `status`).
- Design: tokens from [DESIGN_SYSTEM](DESIGN_SYSTEM.md); system fonts with a serif display stack (no webfonts, Q06); CSS-only motion, reduced-motion safe; cross-document view transitions as enhancement.
- Content: every project fact beyond owner-stated scope is a visible placeholder. No credits, tools, metrics, results, contact address or repository link were invented.

## Local preview

```text
cd ../website-portfolio-m1a      # the worktree
npm ci
npm run dev                      # development
npm run build && npm run preview # production build served locally
```

## Verification actually run (2026-10-15)

| Check | Command | Result |
| --- | --- | --- |
| Docs links/anchors/IDs/ADR status | `npm run check:docs` | pass (18 files) |
| Type check | `npm run typecheck` (`astro check`) | 0 errors, 0 warnings, 0 hints (17 files) |
| Build | `npm run build` | 8 pages; sitemap generated |
| Built output | `npm run test:dist` | pass: unique titles, descriptions, canonicals, one h1, heading order, internal links/assets, sitemap, no external references; home entry transfer 4,481 B gzip; external JS 0 B |
| Browser | `npm run test:browser` | pass on 7 routes: direct load and refresh, 301 for missing slash, real 404 page, axe (WCAG 2.x A/AA, 2.2 AA, best-practice) at 390 and 1440 px, no horizontal overflow at 320/390/768/1024/1440 px, reduced motion, JavaScript disabled, skip link first Tab stop, no console errors or external requests |
| Lighthouse 13.5 (mobile preset, one run each, `/`, Aurelia, racing page) | one-off CLI, not in the repo | Performance, Accessibility, Best Practices, SEO all 100; LCP 0.9 s, CLS 0, TBT 0 ms |

Checks were mutation-tested (injected missing alt, low contrast, 2000 px element: they failed as expected). Gaps: the placeholder pages carry no real media, so the Lighthouse and budget numbers say nothing about final performance; Lighthouse's preset is not exactly YS Mobile v1; only Chrome was driven (Firefox, Safari, iOS and Android untested, QA-10); no screen-reader session; no checks against real Pages headers, compression or range requests; keyboard coverage is limited to the skip link and axe.

## Unresolved issues and limits

- **Not a decision:** owner must review ADR 0002 (Astro recommended), 0003 (routes), 0006 (pipeline/preview). Statuses are unchanged.
- **Q13 / Q11:** merge-to-publish exposure and `main` protection remain Unverified; no reviewer/integrator is named. Do not merge or deploy until the owner resolves them.
- **Publishing:** this branch has no deployment path. A build-based site needs the ADR 0006 pipeline decision (the Actions artifact flow; do not assume a `CNAME` file configures the domain). Adding `public/CNAME` or `.nojekyll` was deliberately not done.
- Content is all placeholder; hero is a CSS composition, not film. Favicon, wordmark, typography and copy ("Cinematic CGI. Precise engineering.") are provisional, awaiting Q01/Q06.
- Line endings: the Windows checkout converts LF/CRLF with warnings; commit content is LF.
- Git identity is not configured on this machine; commits used the existing author identity through environment variables, without changing git config.

## Next recommended tasks

1. Owner: review/decide ADR 0002, 0003, 0006; resolve Q11 and Q13.
2. Owner: choose the Aurelia stills/film derivatives and credits to publish (rights, role, tools) and the racing evidence/repository link; then fill `src/data` and replace `Media` placeholders (poster-first, explicit-play video, captions and audio description per QA-12).
3. Add real responsive images (Astro image pipeline or pre-generated derivatives) and re-measure with YS Mobile v1.
4. Add CI that runs `npm run verify` (M2) without deploy permissions; decide the preview mechanism (local, Actions artifact, or a separate host).
5. Optional, only if Q10 is justified: one Three.js island (`client:visible`, dynamic import) on a single route.

## Instructions for Codex to resume

1. `git fetch origin`, then inspect `git worktree list`, `git status` and `git log --oneline -5` on `feat/m1a-site-foundation`. Preserve any uncommitted work.
2. Read [AGENTS.md](../AGENTS.md), the [active milestone](DEVELOPMENT_PLAN.md#active-milestone), this file and [M1A_EVALUATION](reviews/M1A_EVALUATION.md). Record the base hash and your exclusive paths in the task or PR comment before editing.
3. Run `npm ci && npm run verify` first and compare with the table above. Report differences; do not assume it passes.
4. Treat ADRs 0002-0006 as Proposed. Do not merge, deploy, change Pages/DNS, or add workflows without owner authorization. Commit with an `Agent: Codex` body line and the real author.
5. Keep this file, DEVELOPMENT_PLAN and SITE_ARCHITECTURE in step with any change; add placeholders rather than invented content.
