
# M4 production launch report

Status: **SUCCESS WITH CONDITIONS** (live; film release pending its own pull request). Date: 2026-10-16 to 2026-10-17.

## Release

| Item | Value |
| --- | --- |
| Live URL | https://youssef.studio |
| Release candidate | `dc5cab6` (CI run 38981088367 green) |
| Pull request | 1, merged with a merge commit `4aa4abb` (2026-10-16 23:34 UTC) |
| Deployment | Actions run 38982172740, all jobs succeeded |
| Pages source | GitHub Actions (owner-set); custom domain `youssef.studio`, HTTPS served, `http` and `www` redirect with 301 |
| `main` protection | Ruleset `main protection` active: pull request, `verify` required, no force-push, no deletion; owner bypass |
| Rollback | Revert PR 1's merge commit by pull request, or dispatch "Deploy site" with ref `c882895`; `rollback/placeholder` exists |

## Live verification (real domain, 2026-10-17)

- `check-live` OK: all routes, trailing-slash redirect, real 404, robots, sitemap (6 URLs, no 404 page, no walkthrough), brand assets 200, `/work/aurelia/walkthrough/` 404, no docs or source paths served.
- Browser pass (`scripts/check-production-browser.mjs`, Chrome-family) on 7 routes at 390, 820 and 1440 px: expected statuses, no console errors (apart from the 404 page's own status), no failed requests, no horizontal overflow, no broken images, Instrument Serif loaded, absolute og and twitter image resolving, 10 distinct internal links resolve, reduced motion leaves no infinite animation, mobile menu opens. Hero selection: Shot 002 crop on desktop, Shot 003 crop on the phone home page.
- `scripts/rehearsal/check-rehearsal.mjs` against the live domain in Chrome-family and Firefox: viewer arrow keys move focus, racing chart (314 points, 13 ladder rows) renders. Its rehearsal-only assertions (noindex, rehearsal canonical path) correctly fail against a production site and are not defects.
- Lighthouse 12 (headless Chrome, simulated mobile throttling and desktop preset), 6 routes before the film: accessibility, best practices and SEO 100 everywhere; performance 100 on all but home mobile 88 (TBT 479 ms, a single run; CLS 0, LCP 1.5 s) and Aurelia mobile 97. Raw output: `C:\Dev\Website Portfolio\lh\lighthouse-prod-pre-film.txt` (outside the repository).
- Not tested: Safari, iOS, Android, screen readers, real social-platform unfurls.

## Film publication (follow-up)

See [AURELIA_PUBLICATION section 5](../AURELIA_PUBLICATION.md). Local checks: `CI=1 npm run verify` passes with the film enabled (70 files, reproducible); `check-film-real` confirms the poster loads, no third-party request happens before play, Enter on the play button creates the `youtube-nocookie.com` embed, and there is no overflow at 390, 820 and 1440 px.

## Conditions and limits

- The film text alternative covers the picture only; no captions or transcript were supplied.
- Pages source and Enforce HTTPS cannot be read without authentication; the working HTTPS site and successful Actions deployment are the evidence.
- ADRs 0002 to 0006 are still Proposed; recommendations in [M3_LAUNCH_READINESS](M3_LAUNCH_READINESS.md#8-adr-recommendations-no-status-was-changed).
