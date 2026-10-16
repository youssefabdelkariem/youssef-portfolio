# M3 final branding, content, Aurelia expansion and launch readiness

Date: 2026-10-16. Prepared by Claude Code on `feat/m3-launch-readiness` (local, not pushed), based on `chore/m2-pages-actions` at `a9c4b65`, which already contains the Aurelia, Engineering, IBM AI Racing and M2 work. Nothing was merged, deployed or pushed; production settings, DNS and the original Aurelia files were not touched. Related: FR-01b, FR-01c, FR-05, QA-01 to QA-09, QA-12, QA-14, OPS-01, OPS-02.

## Verdict: READY WITH CONDITIONS

The site, tests and deployment machinery are ready for a first release candidate. Release is conditional on the essential blockers in section 9: owner approvals, branding assets, verified production settings and protection, the Pages source transition test, and a separate explicit release authorisation. The finished commercial and the walkthrough are intentionally not part of the first release; both can be added later without redesign (section 4).

## 1. Baseline and integration

| Item | Result |
| --- | --- |
| Branch hashes verified | `feat/m1b-engineering-racing` `072ee22`, `chore/m2-pages-actions` `a9c4b65`, `rollback/placeholder` `c882895`, `feat/m1b-aurelia-portfolio` `e7ac8cf`; local equals origin; `main` `c882895` |
| Integration baseline | `chore/m2-pages-actions` contains both earlier feature branches and the tested deployment pipeline, so M3 branches from it; no merge into `main`, no rebase of pushed branches |
| Worktree | `worktrees/m3-launch`, clean at creation, `npm ci` done |
| ADRs | 0002 to 0006 remain Proposed (section 8) |

## 2. Content policy and audit

**University exclusion.** The only public mention was the racing page's "Context" row naming the university. It was removed; no case study mentions or implies a university, institution or assignment. `check-dist` now fails on `EUI`, "Egypt University", "university" and "informatics" on any public page (mutation-tested: an injected "Studied at EUI" fails the build). The provenance remains in internal documentation only. The racing case study still describes the project through its technical objective, method, evidence and results.

| Page | Audit result | Change |
| --- | --- | --- |
| Home | Hierarchy and spacing hold; no planned or empty blocks; the third discipline line claimed "engineering projects, presented with evidence" for work that is only partly shown | Reworded: "Mechatronics and CAD foundations, and a documented autonomous-racing project" |
| VFX Portfolio | Aurelia only, with a linked contents list; no empty groups | None |
| Aurelia | Approved hero, renders, passes viewer and facts preserved; no film or walkthrough text while dormant | Optional dormant "Watch the film" and "Explore the process" actions (section 4); passes data moved to a shared module |
| Engineering | One featured completed project, evidence-based copy | None |
| IBM AI Racing | Contained the university reference | Removed the row; page checks extended |
| About | Listed Mechatronics and CAD under "Areas of work", which reads as completed work | Renamed the group "Engineering: areas of study and skill", the heading "Disciplines"; no biography or contact method invented |
| 404 | Real 404, `noindex`, no canonical | None |

Cross-cutting: no planned, reserved, pending, provisional or "coming soon" text (enforced by `check-dist`); no unapproved role or credit claims; no contact page or link (absent until the owner approves one); both external links re-checked on 2026-10-16 (200); internal links and anchors resolve; no unsupported performance claims.

## 3. Verification

`CI=1 npm run verify` passes (docs, typecheck 0 errors, build, built output, artifact allowlist, resolver tests, browser and axe on 6 routes, Aurelia, racing, publication gates, film component, keyboard audit, reproducibility). New checks: `test:publication`, `test:film`, `test:resolve` stays. `npm run build:preview` output of the draft walkthrough also passes the browser and axe check (preview only).

| Area | Result |
| --- | --- |
| axe (WCAG 2.0 to 2.2 A/AA and best practice) at 390 and 1440 px | 0 violations on the 6 public routes, on the draft walkthrough preview, and on the Aurelia page with each film fixture |
| Keyboard sweep | Skip link first, visible focus, targets at least 24 px, menu operable and closable with Escape (unchanged and passing) |
| Reflow | No horizontal scroll from 320 px, including the film component |
| Reduced motion, no JavaScript | Pass; the film's play button stays hidden and the watch link visible without JavaScript |
| Lighthouse mobile, production build, gzip server, 2 runs per route | Performance 100 on every route (one 99 on the home page), accessibility, best practices and SEO 100; no regression from the earlier 30-run baseline |
| Edge 155 | Full suite and the sub-path rehearsal check |
| Firefox 158 | Rehearsal check on 6 routes at 390 and 1440 px (loads, no console errors, hero crop, viewer by keyboard, racing visuals) |
| Not tested | Safari, iOS, Android, screen readers, forced colours: no such environment was available. Manual checklist in [M25_REHEARSAL](M25_REHEARSAL.md#8-browser-and-accessibility-retest) |

## 4. Aurelia: film and walkthrough

**Film integration (dormant).** `FilmPlayer.astro` plus `src/data/aurelia-film.json` (`{ "film": null }`). Poster-first: a lazy local poster, a play button created only with JavaScript, and the player created on click (a `<video>` with captions, or a privacy-enhanced YouTube or Vimeo iframe), so no third-party request happens before play and the film never preloads. Without JavaScript the external watch link plays it. Metadata: VideoObject JSON-LD, accessible names, a text description, an optional transcript link, responsive aspect ratio. The configuration is validated at build time (title, description, accessibility note, duration, upload date, size, poster derivative, playback, external URL and owner approval are all required; an incomplete film fails the build). While null, nothing about a film is emitted (even its CSS is inline in the component, so it leaves no trace). Recommendation: self-host a 1080p MP4 with VTT captions and keep the YouTube or Vimeo page as the external link, or use the embed kind above roughly 60 MB; details in [AURELIA_PUBLICATION](../AURELIA_PUBLICATION.md).

**Walkthrough (internal draft).** Route `/work/aurelia/walkthrough/`, 13 sections as proposed, in `src/data/walkthrough.json`. Seven sections are written from facts already verified for the public case study (scene organisation, materials, lighting, rendering, passes, compositing, colour and delivery), each point carrying its source. Six need the owner: overview and objective, planning and shot design, camera and cinematography (only object names and frame counts are verified), After Effects and Premiere Pro finishing (nothing verified, so nothing is claimed), challenges, and results. Media needs are listed per section (diagrams, a before and after comparison, planning visual). Reuses the render-pass viewer.

**Publication gate.** The route exists only when `walkthrough-publication.json` has `published: true` with approver and date, or in a local `build:preview`. The sitemap, navigation and the Aurelia page's "Explore the process" action follow the same flag.

**Proof the draft is excluded from production builds** (all in `verify`):

- `check-publication`: with publication off, `dist/` has no walkthrough route, file, sitemap entry or text, no film markup, player, embed host, VideoObject or film files; the preview build exists, is `noindex`, lists internal needs and is linked from nowhere. Mutation tests: a walkthrough folder injected into `dist/` fails `check-artifact` and `check-publication`; switching the flag on without approval or with unfinished sections fails.
- `check-artifact` rejects walkthrough paths and film files in the publish artifact; `check-live` expects the walkthrough URL to return 404 on production (production returned 404 today).

**Publication checklist** (blockers computed by the script): complete the six `needs-owner` sections with confirmed content, produce the needed media derivatives, approve the final text, switch the flag, add the film first if available. Full procedure: [AURELIA_PUBLICATION](../AURELIA_PUBLICATION.md).

## 5. Branding comparison (local previews, nothing committed)

Previews: `C:\Dev\Website Portfolio\previews\m3-branding\` (`comparison.png`, `og-A.png`, `og-B.png`, `og-C.png`, `favicon-*.svg`); regenerate with `node scripts/branding/make-previews.mjs`. Theme colour stays `#0b0a09`.

| Direction | Idea | Strengths | Risks |
| --- | --- | --- | --- |
| **A. Brass Y and period** | Geometric Y with the wordmark's brass period as a bone dot | Matches the existing wordmark, calm, legible at 16 px, brand-consistent across CGI and Engineering, no new colour | Least distinctive on its own |
| B. Aperture | Lens ring with cardinal ticks | Ties camera and instrument | Reads as a targeting reticle at small sizes; busier |
| C. Frame and axis | 2.39:1 frame crossed by an axis with one signal node | Most graphic; cinema plus engineering | Uses the vermilion engineering accent in the main brand mark; less restrained |

**Recommendation: A**, with the existing letter-spaced wordmark kept (its tracking could widen slightly at small sizes), a 1200 by 630 social card (warm black, headline in Instrument Serif with the second sentence in italic brass, small wordmark, the Y mark at right), a 180 px touch icon and 192 and 512 px PNG icons. The final assets still need the owner's approval; the site emits `og-image.png`, `icon-192.png` and `apple-touch-icon.png` tags only when those approved files exist in `public/`.

## 6. Production settings assessment (read-only, public data, 2026-10-16)

| Item | Finding |
| --- | --- |
| Publishing | Branch-based: workflows are `pages-build-deployment` (dynamic) and `CI`; the only production deployment is `main` at `c882895` |
| Protection | `main`: `protected: false`; rulesets list empty |
| Environment | `github-pages` exists with custom deployment branch policies; allowed branches unverified |
| Domain and HTTPS | `https://youssef.studio` 200 over GitHub Pages, `http` 301 to HTTPS; `www` redirects; "Enforce HTTPS" and domain verification not readable without authentication |
| Unauthenticated limits | Actions permissions, allowed actions, secrets and the exact Pages source need the owner (instructions in [M25_REHEARSAL, section 2](M25_REHEARSAL.md#2-github-production-configuration)) |

The M2.5 rehearsal proved the Actions deployment, the artifact allowlist and two repeatable rollbacks, and the manual dispatch run deployed the requested commit; the owner confirmed the final jobs were green. **Cutover plan** (the full ordered procedure is in the [runbook](../DEPLOYMENT_RUNBOOK.md)): protect `main`, restrict the environment to `main`, push `rollback/placeholder` (done), test the Pages source transition once in a second scratch repository, switch the source to GitHub Actions, merge the reviewed pull request, verify with `check-live`. **Never merge Astro source into production while the Pages source is still a branch**: a merge would publish the repository root.

## 7. Roles

Claude Code: implementation. Codex: independent technical review, using the handoff, the publication gates and the rehearsal evidence. Owner: final publication and release authority, and the only approver of ADRs, branding assets, the film and the walkthrough.

## 8. ADR recommendations (no status was changed)

| ADR | Evidence now | Recommendation |
| --- | --- | --- |
| 0002 stack | A complete Astro site, 14 automated checks, a reproducible build, a green GitHub-hosted CI run | Ready to accept |
| 0003 routing | Direct routes, trailing-slash redirect, real 404, metadata checks, `check-live`, and observed Pages behaviour in the rehearsal | Ready to accept once the slugs (`/work/aurelia/`, `/engineering/ibm-ai-racing/`, a future `/work/aurelia/walkthrough/`) are approved |
| 0004 media | AVIF q94 with JPEG fallback on approved stills, WebP rejected on evidence, mobile hero 26 to 65 KB, poster-first film component, self-hosting recommendation | Accept for stills and the film architecture; confirm the hosting choice when the film exists |
| 0005 collaboration | Process followed in practice; roles in section 7 | Accept once the owner confirms the roles and Codex as independent reviewer |
| 0006 build and deployment | Rehearsed on GitHub; revert rollback twice; `ref` rollback validated; allowlist, reproducibility and publication gates | Accept after the source-transition test and verified settings; production deployment still needs a separate authorisation |

## 9. Launch approval checklist

**Essential blockers**

1. Owner approval of: racing role wording, rights to the racing video cover artwork (or its removal), the racing rule-compliance question, Aurelia technical claims, About wording, code and asset licences (Q15), and the decision to launch without a contact method.
2. Approved branding assets (favicon, icons, social card) or a decision to launch without them.
3. Verified Pages source, "Enforce HTTPS", Actions permissions and the `github-pages` environment, and a ruleset on `main`.
4. The Pages source transition test and the owner's decision on downtime.
5. ADRs 0002 to 0006 resolved by the owner.
6. A separate explicit release authorisation naming the commit.

**Recommended checks**: Safari, iOS Safari, Android Chrome and a screen reader pass; the dispatch rollback click re-run after the workflow fix with a green smoke job; Lighthouse on the live URL; fixing HTTPS on the unrelated `yousseff.me` user-site domain.

**Optional**: page-specific social cards; a launch language statement (QA-16); sitemap submission after launch; adding the finished film and the walkthrough later through the documented workflow.
