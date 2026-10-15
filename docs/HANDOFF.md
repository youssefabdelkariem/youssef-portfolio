# Handoff: site foundation, design exploration and homepage

Updated 2026-10-15 by Claude Code (acting lead engineer while Codex is unavailable). Authority: owner instruction recorded in [DEVELOPMENT_PLAN](DEVELOPMENT_PLAN.md#active-milestone). Nothing here is merged, deployed or an accepted decision.

## Status

| Item | Value |
| --- | --- |
| Current branch / worktree | `feat/m1b-homepage`, worktree `../website-portfolio-m1b-home`; based on `685dd41`; pushed to origin at `354cead` (owner-authorized, no force); later commits are docs-only, see `git log` |
| M1b exploration branch | `feat/m1b-design-exploration`, worktree `../website-portfolio-m1b`; pushed to origin at `685dd41` (owner-authorized 2026-10-15, no force) |
| M1a branch | `feat/m1a-site-foundation`, worktree `../website-portfolio-m1a`, pushed; unchanged by M1b |
| Base | M0 commit `80af31cd00c73e1f7bf737e15cae6bd731bcfde9` (`docs/m0-foundation`) |
| Implementation commit | `510e4a4` |
| Documentation commits | `58275a2` (evaluation, ADR note, handoff) and `7a8f18b` (cleanup); use `git log` for anything newer |
| Remote | pushed to `origin/feat/m1a-site-foundation` (not merged; no pull request opened) |
| Production | `main` still `c882895`; root `index.html` and `CNAME` unchanged; no workflow, Pages or DNS change |
| ADR statuses | 0001 Accepted; 0002-0006 Proposed (unchanged) |
| Stack | Astro 7.3.8 static output, TypeScript strict, plain CSS; Node >= 22.12 |

## M1b phase 3: homepage (2026-10-15), stopped for owner review

- **Scope done:** the homepage only, in the owner-selected hybrid identity. The VFX portfolio and Aurelia case study were not implemented; they inherit tokens, header and footer only. Decision record: [M1B_HOME_DECISION](reviews/M1B_HOME_DECISION.md).
- **Components:** new `Header`, `Footer`, `Plate` (media slot with placeholder and failure fallback), `TechPlate`; modified `BaseLayout`, `global.css` (hybrid tokens), new `editorial.css`, `data/site.ts`, new `data/home.ts`; page `src/pages/index.astro`. New dependencies: none.
- **Media slot:** set `homeMedia.hero` / `homeMedia.aurelia` in `src/data/home.ts` once an approved derivative exists (manifest M-01, M-02).
- **Commands:** `npm run verify` (default site); `npm run build:explore` then `npm run test:explore` and `npm run test:media` (explore fixtures, including the missing-image fixture); `node scripts/shoot-home.mjs` for screenshots.

| Check | Result |
| --- | --- |
| `npm run verify` | Passed: docs check (24 files), type check 0 errors, build 8 pages, built-output check (home entry 7.1 KB gzip, external JS 0 B), browser check on 7 routes |
| Browser check detail | axe WCAG 2.x A/AA, 2.2 AA and best-practice at 390 and 1440 px: 0 violations; no overflow at 320/390/768/1024/1440 px; reduced motion: nothing animates and nothing is hidden; JavaScript disabled: content visible; refresh stable; no console errors or external requests |
| `npm run test:media` | Passed on the explore fixture: a missing image falls back to the labelled placeholder with the plate height intact; a valid image hides the label. Mutation-tested (removing the fallback script makes it fail). Limit: with JavaScript disabled a failed image shows only the browser's alt text |
| `npm run test:explore` | Passed (both exploration pages and the index still pass) |
| Lighthouse 13.5 on `/`, local server | Mobile preset, three runs: accessibility, best-practices and SEO 100 each time; performance 93, 86 and 100 (median 93); LCP 0.9-1.0 s, CLS 0; total blocking time varied 0-560 ms between runs on a page with no JavaScript bundle, so the dip looks like measurement noise but was not investigated. Desktop preset: all four categories 100. Transfer size is uncompressed and local, with placeholder content only |
| Not done | Firefox, Safari, real phones, screen reader, YS Mobile v1 protocol, tests with real media or fonts |

Screenshots: `docs/design/m1b/home-desktop-*.jpg`, `home-tablet-*.jpg`, `home-mobile-*.jpg`, `home-mobile-menu.jpg`.

### Owner decisions on record (2026-10-15, homepage review)

- Approved: the left-aligned `YOUSSEF.STUDIO` wordmark. Provisional: system fonts; the current call-to-action copy.
- Authorized: pushing `feat/m1b-homepage` and `feat/m1b-design-exploration` (done, no force). Not authorized: merging to `main`, deploying, or any Pages/DNS change.
- **The homepage visual design is not yet approved.** Next step is the owner's visual review of the screenshot set ([HOME_REVIEW](design/m1b/HOME_REVIEW.md)); the VFX portfolio and Aurelia case study have not been started.

### Controlled mobile Lighthouse, 3 runs plus a diagnostic (2026-10-15)

Production build of `/` (placeholder content), served locally; Lighthouse 13.5, mobile preset with simulated throttling (Moto G Power profile, 4x CPU, 150 ms RTT, 1.6 Mbps), headless Chrome, runs sequential with 8 s pauses. Not fully controlled: other Node processes were running on the machine, and Lighthouse's host benchmark index differed between runs.

| Run | Performance | FCP / LCP | TBT | CLS | Host benchmark |
| --- | --- | --- | --- | --- | --- |
| 1 | 92 | 0.90 s / 0.93 s | 360 ms | 0 | 1444 |
| 2 | 83 | 0.90 s / 1.02 s | 697 ms | 0.0004 | 3392 |
| 3 | 100 | 0.90 s / 0.90 s | 0 ms | 0 | 3562 |

Accessibility, best-practices and SEO scored 100 in all three. LCP is stable (0.90-1.02 s) and CLS is about 0. **Variance is in total blocking time (0-697 ms) and so in the performance score (83-100)**, on a page with no JavaScript bundle. Long tasks (60-416 ms) appeared during the first 2.3 s in runs 1 and 2 and almost none in run 3. Run 1 coincided with a slow host benchmark; run 2 did not, so host load alone does not explain it.

Diagnostic (same setup, `--force-prefers-reduced-motion`, 3 runs): performance 100, 100, 100; TBT 0 ms each; one 125-156 ms task per run; host benchmark 3540-3748 (stable). With only 3 runs per condition and a confounded host, this suggests but does not prove that the entrance animations cause the long tasks, most plausibly the animated `clip-path` on the large hero plate (it repaints on the main thread). **No change was made** (no redesign requested). If the owner approves the look, a candidate fix is to open the hero with an opacity or transform animation instead of `clip-path`, then re-measure. These are lab results on placeholder content, not field data, and LCP will change with a real hero image.

### Production build excludes exploration routes (verified 2026-10-15)

After `npm run build` on `feat/m1b-homepage`: no `dist/explore/` directory, no `explore` entry in `sitemap-0.xml`, and no built HTML file mentioning `explore`. The routes exist only under `npm run build:explore` (`dist-explore/`).

**Open items for the owner:** real hero still and Aurelia frame (M-01/M-02) and the rest of M-03 to M-08; fonts and wordmark letterforms (Q06); approval of the proposed supporting copy and call to action; a decision on whether to push this branch; ADR statuses unchanged. After homepage sign-off, phase 4 (VFX portfolio) and phase 5 (Aurelia) in [M1B_PLAN](M1B_PLAN.md) need explicit authorization.

## M1b phases 1-2 (2026-10-15): stopped at the design-selection gate

- **Authorized scope:** content inventory and two design explorations only. No homepage, `/work/` or Aurelia implementation was started.
- **Deliverables:** [CONTENT_MANIFEST](CONTENT_MANIFEST.md); [M1B_DESIGN_REVIEW](reviews/M1B_DESIGN_REVIEW.md) with screenshots in `docs/design/m1b/`; exploration pages `src/explore/` (`/explore/`, `/explore/a/`, `/explore/b/`).
- **Isolation:** the exploration routes are injected by `astro.config.mjs` only when `YS_EXPLORE=1`, via `npm run build:explore` into `dist-explore/` (git-ignored). The default build, sitemap and `npm run verify` never include them. Pages are `noindex`, carry a visible "design exploration" notice, and use placeholders only.
- **Commands:** `npm run build:explore`, `npm run preview:explore` (http://localhost:4322/explore/), `npm run test:explore`, `node scripts/shoot-explore.mjs`.
- **Verification:** `test:explore` passed three consecutive runs (axe 0 violations at 390/1440 px, no overflow 320-1440 px, reduced motion, no-JS, refresh, no external requests); default `npm run verify` passed. The browser check now waits for finite animations before contrast checks.
- **Content:** no asset was copied. The local Aurelia folder was listed by type, count and size only; contents were not read. 0 assets are verified; 12 items are missing ([CONTENT_MANIFEST](CONTENT_MANIFEST.md#d-missing-items-and-decisions-blocking-placeholder-replacement)).
- **Owner decisions recorded:** creative-first audience (Q01), Astro as provisional framework (ADR 0002 stays Proposed), typography-first `YOUSSEF.STUDIO` wordmark (partial Q06).
- **Next gate:** owner picks direction A, B, a hybrid or a revision, a typography route and hero copy, and supplies manifest items M-01 to M-08. Then phases 3-5 of [M1B_PLAN](M1B_PLAN.md) can start. Exploration pages and scripts should then be removed or archived, and the chosen tokens promoted into [DESIGN_SYSTEM](DESIGN_SYSTEM.md).

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

M1b is planned in [M1B_PLAN](M1B_PLAN.md) (not started): owner inputs, phases and a non-production preview workflow.

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
