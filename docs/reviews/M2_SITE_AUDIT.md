# M2 site-wide audit

Date: 2026-10-16. Audited by Claude Code on `feat/m1b-engineering-racing` after commit `af822e1`. Build: Astro 7.3.8 static output, 6 public routes plus 404. Requirements: FR-01 to FR-06, QA-01 to QA-09, QA-11, QA-14, QA-18, OPS-01, OPS-02. Nothing was merged or deployed; production was probed read-only.

## Baseline

| Item | Result |
| --- | --- |
| Branch and commit audited | `feat/m1b-engineering-racing` at `af822e1`, clean tree, all seven branches equal to origin |
| Workspace | `C:\Dev\Website Portfolio`, outside Google Drive and OneDrive; seven worktrees healthy; `git fsck` clean |
| Production | `youssef.studio` serves the one-page placeholder over HTTPS from GitHub Pages; `main` is `c882895`; no pull requests; Pages source and branch protection **unverified** (need owner authentication) |
| ADRs | 0001 Accepted; 0002 to 0006 **still Proposed**; none was accepted or changed in this audit |

## Findings and corrections

| # | Priority | Finding | Status |
| --- | --- | --- | --- |
| 1 | High | Racing page showed approval-status labels to visitors ("Pending owner approval", "Role wording provisional", "Evidence checked", "No placement or award claimed", "(provisional)" on the role row) and a footer line about verified work | Fixed. Labels removed. The role row now repeats only what the repository README states ("developed and maintained by @youssefabdelkariem with AI-assisted engineering tools"); the owner's provisional "independent developer" wording is kept in internal documentation only and is **not** public. Page-level disclaimers (no placement, award or endorsement claim; no compliance claim) stay in the Disclosures card |
| 2 | High | At 768 px the racing key-figure grid left an empty cell that showed the divider colour as a tan block | Fixed: 4 columns above 860 px, 2 below |
| 3 | Medium | Aurelia specification table scrolled sideways at 390 px with clipped text | Fixed: key-value tables no longer force a minimum width |
| 4 | Medium | Mobile menu could not be closed from the keyboard | Fixed: Escape closes it and returns focus to the Menu button; covered by `test:a11y` |
| 5 | Low | 404 page declared a canonical URL while `noindex` | Fixed; `check-dist` asserts it |
| 6 | Low | `media/aurelia/manifest.json` (master file names and hashes) was part of `dist` | Fixed on `chore/m2-pages-actions`: pruned from the artifact, and the artifact allowlist fails if it returns |
| 7 | Info | The three-link "Documented work" chips on About and the key-figure blocks are text-only; no decorative motion was added | No change |
| O1 | **Launch blocker** | No Open Graph or social-card image and no PNG or touch icon (QA-14); `twitter:card` is `summary` | Open, needs an owner-approved asset |
| O2 | Low | In the Aurelia render-pass viewer, keyboard focus outlines every tab label of the group rather than only the active one (CSS limitation of the radio pattern); it is visible and operable | Open, cosmetic |
| O3 | Info | The racing speed chart and lap ladder are static graphics with text and table alternatives; there is no interaction to test | By design |
| O4 | Medium | Screen-reader testing was not performed; Safari, iOS Safari and Android Chrome were not tested | Open (QA-10) |
| O5 | Medium | About lists "Mechatronics" and "CAD" as areas of work although no completed project for them is shown | Owner-stated scope; the owner should confirm the wording |
| O6 | Medium | Rights and approvals outstanding (video cover artwork, role wording, rule-compliance question, code and asset licences) | Open; tracked in `CONTENT_MANIFEST.md` section J and `M1B_ENGINEERING_RACING.md` |

## Visual and UX review

All six routes and the 404 page were captured at 1440, 768 and 390 px before and after the fixes (`previews/m2-audit/before` and `after`, local only). Hierarchy, spacing, image cropping (hero lens on desktop, whole phone on phones, 4:5 crop below 560 px), navigation and the mobile menu hold up. The home, VFX Portfolio, Engineering and About pages each end cleanly with no empty slots. The only layout defects found are findings 2 and 3. Reduced-motion and no-JavaScript rendering pass in `check-browser` and `check-racing` (no animation runs, nothing stays hidden).

## Content audit

- Public text holds no planned, reserved, coming-soon, pending, placeholder, provisional or not-approved wording; `check-dist` enforces it on every route.
- External links: two, both checked on 2026-10-16: `github.com/youssefabdelkariem/IBM-AI-Racing-League` (200, default branch still `8658c1b`, the commit the page cites) and `youtu.be/lp-c8A3NIJI` (200, title matches). Both open with `rel="noopener noreferrer"`. All internal links and anchors resolve (`check-dist`, `check-racing`).
- Technical claims: racing figures were traced to retained result files and the public repository ([M1B_ENGINEERING_RACING](M1B_ENGINEERING_RACING.md)); Aurelia facts come from the render metadata and project notes ([M1B_AURELIA_MEDIA](M1B_AURELIA_MEDIA.md)). No new claims were added in this audit.

## Accessibility (target WCAG 2.2 AA where applicable)

| Check | Result |
| --- | --- |
| axe (wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa, best-practice) at 390 and 1440 px on all 6 routes | 0 violations |
| Keyboard sweep (`npm run test:a11y`, new): every Tab stop on every route at 390 and 1440 px | Skip link first; each stop has a visible focus indicator, is on screen and is at least 24 by 24 px; 12 to 31 stops per route |
| Mobile menu | Opens with Enter, Tab stays inside, Escape closes and restores focus |
| Landmarks and headings | One `main`, one banner, one footer, uniquely named navigations, no skipped heading level, one `h1`, `lang="en"` on every route |
| Scrollable regions (tables, chart) | Focusable and named |
| Images | Every image has an `alt` attribute (decorative SVG hidden from assistive technology) |
| Reflow and zoom | No horizontal page scroll from 320 to 1440 px |
| Reduced motion and no JavaScript | Pass |
| Aurelia render-pass viewer | Operable by keyboard (`check-aurelia`), five stages |
| Not covered | Screen readers (NVDA, VoiceOver, TalkBack), 200% and 400% text-zoom visual review, forced-colours mode |

## Performance (production build, approved Aurelia imagery, gzip server)

Lighthouse 13.5, mobile preset with simulated throttling, Edge 155, fresh profile per run, runs interleaved, 5 runs per route, 30 runs. After the harness leak found earlier ([M1B_ENGINEERING_RACING](M1B_ENGINEERING_RACING.md#performance-investigation)) was fixed, no browser process remained after any run, and the repository check launcher stops any browser left on its temporary profile.

| Route | Performance | FCP | LCP | TBT | CLS | Transfer |
| --- | --- | --- | --- | --- | --- | --- |
| Home | 100 x 5 | 0.76 s | 1.58 s | 0 to 36 ms | 0 | 123 KB |
| VFX Portfolio | 100 x 5 | 0.75 s | 1.20 s | 0 | 0 | 52 KB |
| Aurelia case study | 100, 100, 99, 100, 100 | 0.76 s | 1.81 s | 0 to 72 ms | 0 | 191 KB |
| Engineering | 100 x 5 | 1.21 s | 1.36 s | 0 | 0.001 | 70 KB |
| IBM AI Racing | 100 x 5 | 1.21 s | 1.36 s | 0 to 33 ms | 0 | 78 KB |
| About | 100 x 5 | 0.75 s | 1.20 s | 0 to 15 ms | 0 | 35 KB |

One further run per route with all categories: accessibility, best practices and SEO were 100 on every public route. The 404 page returns a 404 status, so Lighthouse does not score it. No regression was found, so no performance change was made. Engineering and racing show a slightly later first paint than the other pages because they load a second stylesheet. Limits: lab data on a busy Windows host, not field data; Chrome-family only; the production CDN, headers and compression cannot be measured before deployment.

## Cross-browser

Edge 155 runs the whole suite. Firefox 158 smoke test (puppeteer WebDriver BiDi): the home, Aurelia and racing routes load at 390 and 1440 px with no horizontal overflow and no console errors, and the AVIF hero decodes. Safari, iOS Safari and Android Chrome are untested.

## ADR readiness (no status changed)

| ADR | Status | Evidence now available | Recommendation |
| --- | --- | --- | --- |
| 0002 stack and rendering | Proposed | Working Astro site, M1a three-arm comparison, full verification suite | Ready for owner acceptance |
| 0003 routing | Proposed | Direct routes, trailing-slash redirect, real 404 and metadata verified locally and by `check-live` design | Ready once the owner approves the slugs; production behaviour verified only after deployment |
| 0004 media | Proposed | AVIF q94 with JPEG fallback on approved assets, largest file 130 KB, WebP rejected on evidence, mobile hero 26 to 65 KB, fidelity checks in the media report | Ready for owner acceptance for stills; film delivery is undecided because no film is published |
| 0005 collaboration | Proposed | Process followed in practice | Blocked: no named reviewer or integrator (Q11) |
| 0006 build and deployment | Proposed | `chore/m2-pages-actions` with workflows, artifact allowlist and runbook, tested locally | Needs a rehearsal on a non-production repository and the owner's approval; see [DEPLOYMENT_RUNBOOK](../DEPLOYMENT_RUNBOOK.md) on that branch |

## Launch blockers

1. Owner approvals: role wording, video cover rights, content-licence decisions (Q15), rule-compliance question for the racing controller, launch language (Q05, QA-16).
2. Social-card image and icon set (QA-14).
3. Deployment architecture approved and rehearsed; Pages settings and branch protection verified; ADRs 0002 to 0006 resolved (Q13, Q14).
4. Screen-reader and Safari, iOS and Android checks.
5. A merge to `main` is a production event under the current publishing source (see the runbook before merging).
