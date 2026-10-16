# Handoff: site foundation, homepage and Aurelia portfolio

Updated 2026-10-15 by Claude Code (acting lead engineer while Codex is unavailable). Authority: owner instruction recorded in [DEVELOPMENT_PLAN](DEVELOPMENT_PLAN.md#active-milestone). Nothing here is merged, deployed or an accepted decision.

## Status

| Item | Value |
| --- | --- |
| Current branch / worktree | `feat/m1b-aurelia-portfolio`, worktree `worktrees/current-development`; based on `86799d0` (the pushed homepage refinement head); local only, not pushed |
| Refinement branch | `feat/m1b-homepage-refine`, pushed to origin at `86799d0` (owner-authorized 2026-10-15) |
| Homepage branch | `feat/m1b-homepage`, worktree `worktrees/m1b-homepage`; pushed to origin at `40939c6` |
| M1b exploration branch | `feat/m1b-design-exploration`, worktree `worktrees/m1b-design-exploration`; pushed to origin at `685dd41` (owner-authorized 2026-10-15, no force) |
| M1a branch | `feat/m1a-site-foundation`, worktree `worktrees/m1a-site-foundation`, pushed; unchanged by M1b |
| Base | M0 commit `80af31cd00c73e1f7bf737e15cae6bd731bcfde9` (`docs/m0-foundation`) |
| Implementation commit | `510e4a4` |
| Documentation commits | `58275a2` (evaluation, ADR note, handoff) and `7a8f18b` (cleanup); use `git log` for anything newer |
| Remote | pushed to `origin/feat/m1a-site-foundation` (not merged; no pull request opened) |
| Production | `main` still `c882895`; root `index.html` and `CNAME` unchanged; no workflow, Pages or DNS change |
| ADR statuses | 0001 Accepted; 0002-0006 Proposed (unchanged) |
| Stack | Astro 7.3.8 static output, TypeScript strict, plain CSS; Node >= 22.12 |

## M2.5 deployment rehearsal (2026-10-16)

- **Status:** CI verified on a GitHub-hosted runner (run 38923066056, success); **Pages deployment and rollback not rehearsed** (no scratch repository yet; private-repository Pages unverified). Read [M25_REHEARSAL](reviews/M25_REHEARSAL.md) first, then [DEPLOYMENT_RUNBOOK](DEPLOYMENT_RUNBOOK.md) and `scripts/rehearsal/README.md`.
- **Branches:** `chore/m2-pages-actions` and `rollback/placeholder` (`c882895`) were pushed on 2026-10-16 with the owner's approval, without force. The push started `CI` only; `main` and the Pages source are unchanged. `rollback/placeholder` is the emergency source branch in the runbook; do not select it in Pages settings without the owner.
- **Facts established from public data:** Pages is deployed from branch `main` by the dynamic workflow; `main` has no protection or rulesets; the user site `youssefabdelkariem.github.io` uses `yousseff.me`, so a project-site rehearsal would appear at `yousseff.me/<repo>/`; `www.youssef.studio` is a CNAME to the user site.
- **New:** `npm run test:repro`, optional `og-image.png`, `icon-192.png` and `apple-touch-icon.png` support in `BaseLayout` (tags appear only when the owner-approved file exists), shorter engineering descriptions, rehearsal kit, scratch repository at `C:\Dev\Website Portfolio\rehearsal\youssef-pages-rehearsal` (local only, synthetic media).
- **Next for Codex or the owner:** get the scratch repository approved and run it, send the run URLs, verify Pages and protection settings, supply launch assets, then refine the cutover and request production authorisation. Do not push `chore/m2-pages-actions` to `main`, change Pages settings, merge or deploy.

## M2 site audit and launch preparation (2026-10-16)

- **Report:** [M2_SITE_AUDIT](reviews/M2_SITE_AUDIT.md): findings, fixes, accessibility and performance evidence, ADR readiness, launch blockers.
- **Branches:** `feat/m1b-engineering-racing` carries the audit fixes (pushed). `chore/m2-pages-actions` (local until the owner approves a push; based on the feature branch) carries the proposed build-artifact deployment: `.github/workflows/ci.yml` and `pages.yml`, `scripts/check-artifact.mjs`, `scripts/check-live.mjs`, `scripts/prune-dist.mjs`, `public/CNAME` and `docs/DEPLOYMENT_RUNBOOK.md`. A local branch `rollback/placeholder` points at `c882895` (the live placeholder) for the emergency path in the runbook; it has not been pushed.
- **Not production:** nothing was merged, deployed, enabled or pushed to a protected branch. Production was probed with read-only requests. ADRs 0002 to 0006 remain Proposed; ADR 0006 gained an evidence note only.
- **Fixed:** approval labels removed from the public racing page (role row limited to the README wording; "independent developer" stays internal until approved), racing stat grid at tablet width, Aurelia spec table on phones, Escape closes the mobile menu, 404 canonical, manifest pruned from the artifact.
- **New checks:** `npm run test:a11y` (keyboard sweep, focus visibility, target size, landmarks, headings, menu) in `verify`; on the chore branch also `test:artifact` and `test:live`.
- **Evidence:** Lighthouse mobile, 30 runs on the production build with approved Aurelia images: 99 to 100 on every route, LCP 1.2 to 1.8 s, CLS 0 to 0.001, no leaked browser processes; accessibility, best practices and SEO 100. axe 0 violations. Firefox 158 smoke test passed. Safari, iOS, Android and screen readers untested.
- **Codex continuation:** read the audit report, then the runbook on the chore branch. Do not merge, change Pages settings or enable the workflows without the owner. Next useful work: the social-card image and icon set once supplied, a rehearsal repository for the workflow, and the cross-browser and screen-reader passes. Keep `check-dist` and `check-racing` rules intact.

## Engineering and IBM racing (2026-10-16)

- **Branch:** `feat/m1b-engineering-racing` in `worktrees/engineering-racing`, based on `e7ac8cf`. Pushed to `origin/feat/m1b-engineering-racing` at `79a57c3` on the owner's instruction (no force; no pull request; not merged or deployed); follow-up work is committed on top. Report: [M1B_ENGINEERING_RACING](reviews/M1B_ENGINEERING_RACING.md).
- **Built:** `/engineering/` and `/engineering/ibm-ai-racing/`. New check `npm run test:racing`, part of `npm run verify`. Follow-ups: provisional role wording, predictive-braking clarification, stored video cover that links to YouTube, and the performance investigation (see the report).
- **Verification (local, Edge 155):** `npm run verify` passes (docs, typecheck 0 errors, build 8 pages, built output, browser and axe on 7 routes at 5 widths, Aurelia, racing). `test:home` and `test:media` pass. Lighthouse on the final build with a gzip server: racing 99/100/100/100/100/74, LCP 1.36 s; engineering 100 in six runs; the single low run on each page coincided with a host load event. The earlier 89 to 95 scores were caused by orphaned browsers from my test harness, not by the site (details in the report).
- **Untested:** Firefox, Safari, iOS, Android, real screen readers. Outbound links were checked for reachability by hand, not in CI.
- **Codex:** resume on this branch, run `npm ci && npm run verify`, keep racing facts in `src/data/racing.ts` tied to the evidence table, and add nothing to the racing page that is not in a retained result file. Never present the video cover's drawn figures as data.

### Verified work only (2026-10-16)

Owner decision applied across the public site: only verified, completed projects are shown. Removed: the planned robotic arm, the reserved CAD slot and the engineering gallery; the empty project slots on the homepage and `/work/`; the Aurelia "playback not published yet" block; the placeholder technical plate on the homepage (now a real telemetry trace). `/engineering/` is a single-featured-project page; `/work/` shows Aurelia with a linked contents list. `check-dist` now fails on placeholder wording on any public page, and `check-racing` asserts one featured engineering project and working contents links. Remaining notices are for missing facts about finished work: About biography, Contact destination, Aurelia brief, role and credits. The unused components were deleted later the same day (next section).

### Verified-content cleanup (2026-10-16)

- **Removed notices:** About (biography and skills "pending"), Aurelia (brief, role, credits, the Credits section) and the homepage featured-project "Role and Credits pending". Nothing replaced them. Outstanding items are in [CONTENT_MANIFEST](CONTENT_MANIFEST.md#j-outstanding-facts-and-approvals-not-shown-publicly), section J.
- **About:** now only the owner's stated areas of work and links to the two documented projects.
- **Contact:** the page, nav item and homepage button were removed because no verified, owner-approved destination exists; no email, form or profile link was invented. Restore it (page, `nav` entry in `src/data/site.ts`, route lists in `check-dist` and `check-browser`) when the owner supplies one. The homepage closing band now links to the two projects and About.
- **Deleted after checking for imports:** `Media`, `ProjectCard`, `SlotCard`, `TechPlate`, `CaseHero`, `src/data/projects.ts`, and their unused CSS (`.card`, `.media`, `.tag`, `.meta`, `.grid`). `Pending.astro` is now unused as well and was kept; delete it if nothing needs it.
- **Fallback wording:** the image-failure label in `Plate` now reads "<name> · image unavailable" (it used to say "Placeholder … not approved"), so no placeholder wording exists in public HTML.
- **Guards:** `check-dist` also fails on "placeholder", "not approved", "pending confirmation", "biography pending", "credits pending" and "in preparation", and checks 7 routes (no `/contact/`).

### Workspace safety status (2026-10-16)

- **Active workspace:** `C:\Dev\Website Portfolio`, outside Google Drive and OneDrive. No Drive log mentions it and the folder carries no sync markers. OneDrive is not running; its folder is not an ancestor of `C:\Dev`.
- **Health:** seven worktrees listed, none prunable or locked, each on its expected branch and commit, all clean at last check (the engineering worktree carries only uncommitted follow-up edits), `git fsck` clean, remote unchanged.
- **Google Drive is running again** (started 2026-10-16 10:58, not by this agent) and the old copy at `Documents\Projects\website portfolio` is still inside its sync scope. The old copy remains intact. I did not stop, restart or reconfigure Drive and did not touch the old copy.
- **Before the old copy can be retired:** (1) approve the retirement; (2) branches: all seven are on origin at the same hashes as local (checked 2026-10-16); the pre-move bundle in `local-assets/backups` also holds every ref; (3) confirm nothing in the old copy is newer than `C:\Dev` (`git status` is clean in the old root and worktrees; untracked old `node_modules`, `dist` and `.astro` are disposable); (4) copy any files you keep outside Git, such as screenshots made in the old `previews` folder after 2026-10-16 (none were); (5) pause Drive, then delete or archive the old folder with Drive paused so deletions cannot sync elsewhere, and check Drive's web trash; (6) either exclude `Documents\Projects` from Drive's synced folders or leave Drive paused until then; (7) delete the `.tmp.driveupload` leftovers only after Drive is idle.

## Final Aurelia image approval (2026-10-15)

- **Approved by the owner:** homepage hero Shot 002 frame 1 (desktop) and Shot 003 frame 1 (phones, 560 px and below); featured plate Shot 002 frame 72; case-study hero Shot 002 frame 1; selected renders and all five render-pass stages unchanged; no pull-back render; no WebP. Record: [CONTENT_MANIFEST](CONTENT_MANIFEST.md) section H, [M1B_HERO_SELECTION](reviews/M1B_HERO_SELECTION.md).
- **Implemented:** new derivative set `hero-home-m` (Shot 003 frame 1, 4:5), `src/data/home.ts` uses it for the homepage phone crop (case study still uses `hero-m`), `scripts/check-aurelia.mjs` checks the hero source at 390, 560, 561 and 1440 px, the approved derivatives are tracked in Git, the browser launcher falls back to starting Edge directly when puppeteer's launch fails.
- **Labels:** Shot 001 and Shot 005 stills remain "render, display transform only". Shot 003 is called a final composite because its comp applies only the display transform.
- **Not claimed:** role, credits, brief, music, film. They read "pending confirmation".
- **Final Lighthouse 13.5 (Edge 155, local server, real media, mobile preset unless noted):** Home with the phone hero, 3 runs: performance 100, 100, 100, LCP 1.73 s, TBT 0 to 18 ms, CLS 0, 144 KB. Home desktop preset: 100, LCP 0.39 s. VFX Portfolio: 100, LCP 1.36 s. Aurelia case study: 99, LCP 1.96 s, TBT 92 ms, 225 KB. Accessibility, best practices and SEO 100 on every run. Lab figures, simulated throttling; one run each for desktop, Aurelia and VFX Portfolio.

### Workspace incident to know about (2026-10-15)

After the folders were consolidated, **Google Drive for desktop** re-created four duplicate copies of the old worktree folders next to the workspace (`website-portfolio-m1b*`). I verified they were identical to the real worktrees and deleted them; Drive then started deleting files in the real worktrees (tracked docs in `m1b-design-exploration` and `current-development`, plus `node_modules`, `dist` and `.astro`). I stopped the Drive client, restored every tracked file with `git restore`, and rebuilt `node_modules` with `npm ci`. Nothing committed was lost. Open points for the owner: the Drive client is stopped (restart it deliberately), and the workspace sits inside a Drive-synced Documents folder, so moves, renames and deletes there can be replayed by Drive. Safer: exclude this workspace from Drive sync, or keep it outside Documents. `worktrees/m1b-design-exploration` still needs `npm ci` if its dependencies are wanted. Never delete a duplicate-looking folder without checking whether a sync client mirrors it.

## Hero media selection (2026-10-15), stopped at the approval gate

- **Task:** compare three whole-device frames against the Shot 002 macro lens for the homepage hero, using final composites where available, and check read-only for newer composites of Shots 001 and 005.
- **Result:** [M1B_HERO_SELECTION](reviews/M1B_HERO_SELECTION.md). Keep the macro lens for desktop; propose Shot 003 frame 1 (fallback Shot 002 frame 72) as the phone crop; reject Shot 005 frame 160. No whole-device frame fits the 2.4 to 3.4:1 desktop hero box.
- **Newer composites:** Shot 003 and Shot 004 have finished comps (15 Oct); Shot 001 and Shot 005 have none, so their stills stay labelled "render, display transform only".
- **Nothing changed in the site.** Candidate derivatives and review images are in `local-assets/aurelia-web-derivatives/hero-candidates/` and `previews/aurelia/hero-candidates/` (not committed). The local `public/media` set is unchanged. Originals untouched.
- **To apply the owner's choice:** copy the chosen `hero-m-*` files from `local-assets/aurelia-web-derivatives/hero-candidates/<letter>/` over the ones in `public/media/aurelia/` (and add the new frame to `scripts/aurelia/derivatives.spec.json`), run `npm run verify`, update the manifest, and commit derivatives only after the owner approves the full set.

## Workspace organization (2026-10-15, moved 2026-10-16)

**Current location: `C:\\Dev\\Website Portfolio`**, same layout as below plus `worktrees/engineering-racing`. The old Documents path is retired.

All Youssef Studio development folders now live under one workspace root, the `website portfolio` folder (the main checkout of the repository, on `docs/m0-foundation`). Paths below are relative to that root; machine-specific absolute paths are deliberately not recorded here.

| Folder | Contents | Branch |
| --- | --- | --- |
| `.` (root) | Main checkout; the shared Git directory (`.git`) for every worktree | `docs/m0-foundation` |
| `worktrees/current-development` | **Active development worktree** (VFX portfolio, Aurelia case study, media pipeline). Open this one | `feat/m1b-aurelia-portfolio` |
| `worktrees/m1b-homepage-refine` | Homepage refinement, pushed | `feat/m1b-homepage-refine` |
| `worktrees/m1b-homepage` | Homepage implementation, pushed | `feat/m1b-homepage` |
| `worktrees/m1b-design-exploration` | Design directions A and B, pushed | `feat/m1b-design-exploration` |
| `worktrees/m1a-site-foundation` | Astro foundation and M1a evaluation, pushed | `feat/m1a-site-foundation` |
| `local-assets/aurelia-web-derivatives` | Local-only masters (16-bit PNG), derivative working files and notes. Never committed | n/a |
| `local-assets/backups` | A Git bundle of every branch taken before the reorganization, and the pre-move ref inventory | n/a |
| `previews/aurelia` | Review screenshots and the candidate contact sheet that show unapproved renders. Never committed | n/a |

Not inside the workspace, by design: the original Aurelia project folder (Blender, Nuke, EXR, composites) next to the workspace, and the render drive. They stay read-only.

Commands (run from the workspace root; replace the folder to switch branch context):

```text
git worktree list
cd worktrees/current-development
npm ci            # only if node_modules is missing
npm run verify
npm run build && npm run preview
```

Rules for people and agents:

- The `worktrees/`, `local-assets/` and `previews/` folders are excluded from the main checkout through the local-only `.git/info/exclude`, so the root stays clean. Never run `git clean -ffdx` (or any forced clean that removes ignored files) in the root: it can delete worktrees and local assets.
- Move or rename a worktree only with `git worktree move`, never with a file manager or `mv`. Add new ones with `git worktree add worktrees/<name> <branch>`.
- The root folder cannot be renamed or moved while an editor or terminal has it open; a repository move needs `git worktree repair` afterwards.
- The approved Aurelia derivatives are committed in `worktrees/current-development/public/media/aurelia/`. Only owner-approved sets may be added there.

Verification after the move (2026-10-15): all five worktrees and the main checkout report the same branches and commits as before, all 13 refs identical, `git fsck --full` reports no errors (only unreachable objects), file counts and `node_modules` unchanged in every worktree, `npm ci` and `npm run verify` pass in `worktrees/current-development`, and the built site previews locally. A bundle of all branches was taken first (`local-assets/backups`).

## Aurelia assets, typography, VFX portfolio and case study (2026-10-15), stopped for owner review

- **Owner authorization:** inspect the local Aurelia renders read-only, make derivatives in a working directory, adopt Instrument Serif after licence verification, build `/work/` and `/work/aurelia/`. Not authorized: merge, deploy, DNS, Pages, altering originals, committing the selected images.
- **Source protection:** originals untouched. A name, size and modified-time snapshot of 1,609 files (258.9 GiB, both drives) before and after shows 0 changed and 0 removed; 1 file was added by the owner's own Nuke session (`Compositing/shot 003/.nk`). Details in [M1B_AURELIA_MEDIA](reviews/M1B_AURELIA_MEDIA.md).
- **Media policy (updated 2026-10-15):** the owner-approved derivatives (40 files, 11 sets, 1.9 MB, largest 130 KB) are committed in `public/media/aurelia/` with `manifest.json`. Masters, EXRs, Blender and Nuke files and review screenshots that show unapproved renders never enter the repo. If a file is missing, pages fall back to labelled placeholders. To regenerate: `scripts/aurelia/make-derivatives.py` from masters, then `node scripts/aurelia/sync-media.mjs <dir>`.
- **Typography:** Instrument Serif (OFL 1.1, verified from the designers' repository and Google Fonts) self-hosted in `public/fonts/` with `OFL.txt`, for `h1` and `h2` only, with a metric-matched fallback ([M1B_FONT_EVALUATION](reviews/M1B_FONT_EVALUATION.md#decision-and-licence-verification-2026-10-15)).
- **Pages:** `/work/` (featured Aurelia, project cards, CGI and Compositing groups, honest slots) and `/work/aurelia/` (hero, introduction, film slot that says playback is unpublished, four selected renders, lighting and materials, a five-stage render-pass viewer with a static table, rendering and compositing workflow, technical details and shot table, credits placeholder). The homepage hero and featured plate now use the real derivatives when present.
- **New or changed:** `src/data/media.ts` (manifest lookup, `Pic`), `Plate` (takes a `Pic`), `BreakdownViewer`, `ProjectCard`, `projects.ts`, `home.ts`, `scripts/aurelia/*`, `scripts/check-aurelia.mjs`, `scripts/shoot-pages.mjs`, `scripts/lib/*`. No new npm dependencies; the derivative tool needs Python with numpy, opencv-python-headless and Pillow (AVIF).

| Check | Result |
| --- | --- |
| `npm run verify` (with derivatives) | Passed: docs check (28 files), type check 0 errors and 0 hints, build 8 pages, built-output check, browser check on 7 routes (axe 0 violations at 390 and 1440 px, no overflow at 320 to 1440 px, reduced motion, JavaScript off, refresh, no console errors or external requests), `test:aurelia` |
| Same checks without derivatives (placeholder mode) | Passed (derivatives moved aside, rebuilt, restored) |
| `npm run test:aurelia` | Passed: every visible image decodes as AVIF at 1440 and 390 px, none fell back to a placeholder, no horizontal overflow, the five-stage viewer works from the keyboard (ArrowRight steps through all stages and each stage image loads) and its static table lists all five; largest derivative 130 KB, none over 250 KB; image bytes: hero 58 to 72 KB, case-study page 131 KB (phone) to 209 KB (desktop) with every image loaded |
| `npm run test:home` and the explore tests | Re-run after the font and media changes; results in the closing summary and below |
| Lighthouse 13.5 mobile (Edge 155), 3 runs each, real media | Home: performance 99, 100, 100, LCP 1.88 s, TBT 0, CLS 0, 166 KB. VFX Portfolio: 100 in all, LCP 1.36 s, 104 KB. Aurelia: 98 to 99 in all, LCP 2.03 to 2.11 s (after dropping an unused italic font preload; 2.20 to 2.26 s before), CLS 0, 225 KB. Accessibility, best practices and SEO 100 on every run. Lab figures with throttled 1.6 Mbps; the 2.5 s LCP target holds with about 0.4 s margin on the case study |
| Not done | Firefox, Safari, real phones, screen reader, YS Mobile v1 protocol, real film playback, Chrome (not installed here; Edge used) |

**Open items for the owner:** confirm the selection (hero, four renders, five pass stages) or choose from the contact sheet; say which shots are final (Shot 003 appears to be getting a composite now); approve the facts shown on the case study; approve committing the derivatives (about 1.8 MB); supply role, credits, brief, music and the film with captions and audio description; decide on WebP (omitted on quality grounds) and on pushing this branch. ADR statuses are unchanged.

**Codex resumption:** read AGENTS.md, this file, [M1B_AURELIA_MEDIA](reviews/M1B_AURELIA_MEDIA.md) and [CONTENT_MANIFEST](CONTENT_MANIFEST.md); `npm ci`; run `npm run verify` and compare with the table. To get the images locally, ask the owner for the derivatives folder or regenerate with `scripts/aurelia/make-derivatives.py` from masters (never from EXRs inside the repo). Do not commit anything under `public/media/` until the owner approves; when approved, remove the `.gitignore` entry, commit the derivatives and the manifest, and re-run all checks. Keep source files read-only.

## Homepage refinement round (2026-10-15), stopped for owner review

- **Owner verdict:** homepage visual identity approved with refinements (Direction A-led hybrid; palette and left-aligned wordmark preserved). Record and evidence: [M1B_HOME_DECISION](reviews/M1B_HOME_DECISION.md#visual-approval-and-refinements-2026-10-15). The VFX portfolio and Aurelia pages were not started.
- **Changes:** one-line-per-sentence mobile headline; refined system typography; new Featured Aurelia and Selected VFX layouts (slots still labelled); hero box sized by CSS with focal point, `srcset` and art-directed `mobileSrc`; transform-based hero opening (replaces `clip-path`); font evaluation without adding fonts ([M1B_FONT_EVALUATION](reviews/M1B_FONT_EVALUATION.md)); shared browser finder `scripts/lib/browser.mjs`; new `npm run test:home`; fix for the image-failure fallback (it must target the plate, not `<picture>`).
- **Environment change:** Google Chrome was no longer installed on the machine part-way through this work. Scripts now fall back to Microsoft Edge (Chromium 155); Lighthouse needs `CHROME_PATH` set to the browser, as its `--chrome-path` flag is not honoured. Set `CHROME_PATH` for any other browser location.
- **Image artwork guide:** desktop 2880 x 1206 (2.39:1) with the subject inside the central 70% of the height, optional 1200 x 1500 mobile crop, at most 250 KB per variant; set via `src/data/home.ts`.

| Check | Result |
| --- | --- |
| `npm run verify` | Passed: docs check (26 files), type check 0 errors and 0 hints, build 8 pages, built-output check (home entry 7.6 KB gzip, 0 B external JavaScript), browser check on 7 routes (axe 0 violations at 390 and 1440 px, no overflow at 320, 390, 768, 1024 and 1440 px, reduced motion, JavaScript off, refresh, no console errors or external requests) |
| `npm run test:home` | Passed. Headline is one line per sentence at 320, 360, 390, 430, 560, 768, 1024 and 1440 px (28 px at 320 up to 92 px at 1440), no overflow. Hero with synthetic art and a 1.2 s delayed image: 0.0 px layout shift at 320x640, 390x844, 560x900, 768x1024, 1024x768, 1440x900, 1920x1080 and 2560x1080; the central 70% band stays visible (70% to 100%); correct desktop or mobile source chosen |
| `npm run test:media`, `npm run test:explore` | Passed |
| Production build excludes exploration routes | Verified: no `dist/explore/`, no `explore` entry in the sitemap, no built HTML mentioning `explore` |
| Controlled mobile Lighthouse, 3 runs (Edge 155, LH 13.5) | Performance 100, 100, 100; accessibility, best-practices, SEO 100; FCP and LCP 0.90 s; TBT 0 ms; CLS 0; host benchmark 2,920-3,461 |
| Animation A/B (16 runs, clip-path versus transform) | No measurable difference; earlier 83-100 variance did not reproduce. Transform version kept. Details and caveats in the decision record |
| Not done | Firefox, Safari, real phones, screen reader, YS Mobile v1 protocol, testing with real artwork or licensed fonts |

Screenshots: `docs/design/m1b/home-*.jpg` (after) and `docs/design/m1b/before/` (previous round); font comparison: `docs/design/m1b/font-candidates.jpg`.

**Open items for the owner:** display-font decision (Q06), real hero and Aurelia images (manifest M-01, M-02), approval of the supporting copy, whether to push `feat/m1b-homepage-refine`, and authorization before phases 4 and 5. ADR statuses are unchanged.

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

- Routes (all static `index.html` + real `404.html`): `/`, `/work/`, `/work/aurelia/`, `/engineering/`, `/engineering/ibm-ai-racing/`, `/about/` (`/contact/` removed 2026-10-16). Slugs are Proposed (Q08).
- Components: `BaseLayout`, `Media` (labelled placeholder or responsive image), `ProjectCard`, `SlotCard`, `CaseHero`, `Pending`. Data: `src/data/site.ts`, `src/data/projects.ts` (typed, with readiness `status`).
- Design: tokens from [DESIGN_SYSTEM](DESIGN_SYSTEM.md); system fonts with a serif display stack (no webfonts, Q06); CSS-only motion, reduced-motion safe; cross-document view transitions as enhancement.
- Content: every project fact beyond owner-stated scope is a visible placeholder. No credits, tools, metrics, results, contact address or repository link were invented.

## Local preview

```text
cd worktrees/m1a-site-foundation      # a worktree, relative to the workspace root
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
