# M2.5 deployment rehearsal and launch readiness

Date: 2026-10-16. Prepared by Claude Code on `chore/m2-pages-actions` (local; not pushed). Related: ADR 0006 (Proposed), OPS-01, OPS-02, QA-02, QA-05, QA-09, QA-14, QA-18, Q13, Q14. Production was never modified: only read-only HTTP requests and unauthenticated GitHub API reads were made.

## Verdict

**The GitHub-hosted rehearsal was not performed, so the milestone is not complete.** There is no authenticated GitHub access in this environment (no token, no `gh`, no stored API credential was used), and creating a scratch repository needs your approval and has a side effect that must be decided first (section 3). Everything that can be proven without GitHub passed. For the prepared system the verdict is **PASS WITH CONDITIONS**: the conditions are the GitHub-hosted rehearsal, verified Pages and protection settings, and the owner approvals listed below. Local results are not evidence of a successful GitHub-hosted deployment and are not presented as such.

## 1. Repository and workflow inspection

State: `feat/m1b-engineering-racing` at `072ee22` (pushed), `chore/m2-pages-actions` (local, based on it), `rollback/placeholder` = `c882895` (local). All three worktrees clean, remote is `origin` = `youssef-portfolio`.

| Check | Finding |
| --- | --- |
| Triggers | `ci.yml`: `pull_request` and `push` to every branch except `main`. `pages.yml`: `push` to `main` and `workflow_dispatch`. The deploy job also requires `github.ref == refs/heads/main` |
| Would pushing `chore/m2-pages-actions` trigger anything? | Yes: `ci.yml` would run once per push (`npm ci`, `npm run verify`, artifact upload). It has `contents: read`, no secrets and no deploy step, so it cannot change production. `pages.yml` does not trigger on that branch. The existing `pages build and deployment` workflow runs only for the Pages source branch (`main`). Pushing `rollback/placeholder` would also start `ci.yml`, which fails harmlessly (no `package.json`). Not pushed |
| Permissions | Workflow default `{}`; build `contents: read`; deploy `pages: write` and `id-token: write`; smoke `contents: read`. `persist-credentials: false` on every checkout |
| Actions | Only GitHub-owned actions, pinned to commit SHAs (`checkout` v4, `setup-node` v4, `upload-pages-artifact` v3, `deploy-pages` v4, `upload-artifact` v4) |
| Artifact construction | Only `dist/` is uploaded. `check-artifact` allowlist (negative-tested), prune step removes the media manifest, `CNAME` included from `public/` |
| Reproducibility | New `npm run test:repro`: two consecutive builds give byte-identical output. Artifact digest `b26fedde...ae1fa5` for 59 files (local, committed tree, see also the clean-clone result below) |
| Environment | The workflow uses the existing `github-pages` environment |

Risks found before the rehearsal (ordered):

1. **`main` is unprotected and a push to `main` publishes the repository root.** Public API: `protected: false`, no rulesets, deployment history shows `pages build and deployment` runs triggered by pushes to `main`. Merging site source under the current source setting would publish it.
2. **Merging `docs/` to `main` under branch publishing would expose Markdown through Jekyll and as raw files.** Another reason to switch the source first.
3. **The user site has a custom domain.** `youssefabdelkariem.github.io` redirects to `yousseff.me`, so any new project site would be served at `yousseff.me/<repo>/`.
4. **The `github-pages` environment restricts deployment branches** (custom branch policy). Which branches are allowed is unknown; it must include `main`.
5. `www.youssef.studio` is a CNAME to `youssefabdelkariem.github.io` and returns a 301; it must keep working after the change (DNS is not touched).
6. Whether Actions are enabled, and the default workflow token permission, are unknown; set read-only.
7. The deploy build runs the full browser suite: a flaky run blocks a release (fail-closed, no retry).
8. Rollback needs `rollback/placeholder` to exist on GitHub; it does not yet.

## 2. GitHub production configuration

No authenticated access, so settings that need it are **unverified**. What public evidence shows (2026-10-16):

| Item | Evidence | Status |
| --- | --- | --- |
| Pages serves `main` at root via the dynamic "pages build and deployment" workflow | Workflow list contains only `dynamic/pages/pages-build-deployment`; latest successful run `event: dynamic`, head `c882895`, 2026-10-14 | Strong evidence of branch publishing; the exact source setting is unverified |
| Custom domain `youssef.studio`, HTTPS | `https://youssef.studio` returns 200 from GitHub.com; `http://` and the project URL give 301 to it; `www` gives 301 | Working; "Enforce HTTPS" setting itself unverified |
| DNS | Apex resolves to `185.199.x.153`; `www` CNAME to `youssefabdelkariem.github.io` | Consistent with GitHub Pages; domain verification status unverified |
| Default branch | `main` | Verified |
| Branch protection and rulesets | `main` `protected: false`; `GET /rulesets` returns an empty list | **No protection** (verified from public data) |
| Pages environment | `github-pages` exists, `can_admins_bypass: true`, `branch_policy` rule, custom branch policies | Allowed branch list unverified |
| Existing workflows and deployments | One dynamic Pages workflow; one `github-pages` deployment from `main` at `c882895` | Verified |
| Actions repository permissions, allowed actions, secrets | Not public | Unverified |

What you should check (Settings in `youssef-portfolio`): Pages (Build and deployment source, Custom domain, Enforce HTTPS, Domain verification); Rules, Rulesets and Branches (protection for `main`); Actions, General (actions permissions, workflow permissions: set read-only, fork pull-request approval); Environments, `github-pages` (deployment branches, required reviewers); Secrets and variables (none should be needed). A screenshot or pasted values of these screens is enough for me to complete this section.

## 3. Scratch-repository rehearsal

**Not executed.** Needed from you before it can run:

- **Approval, name and visibility.** Suggested name `youssef-pages-rehearsal`. I could not tell from here whether your account can use Pages on a private repository (it usually needs a paid plan).
- **Decision on exposure.** On a public scratch repository the synthetic, noindex site would appear at `https://yousseff.me/youssef-pages-rehearsal/` because of the user-site domain. That is another of your domains, not `youssef.studio`, but it is a live site. Alternatives: a private repository if Pages allows it, a separate throwaway account, or running the build and artifact steps only.
- **Authentication** to create it and push (I can prepare the commands; I did not run them). Exact steps are in [scripts/rehearsal/README.md](../../scripts/rehearsal/README.md).

Prepared and tested locally instead:

- `make_scratch.py` created `C:\Dev\Website Portfolio\rehearsal\youssef-pages-rehearsal` (local only, no remote, two commits, 1 MB). It contains the source, checks, the rehearsal workflow and **synthetic gradient media** with the real file names and sizes. A scan found no master names, hashes, EXR, Blender or Nuke references and no local paths in its content.
- The rehearsal workflow adds the source-transition test (branch source first, then Actions), a reproducibility check, a sub-path rebase, an allowlist check on the exact uploaded directory, a file-list artifact and a smoke test of the deployed URL.
- **Why a transform is needed.** The production artifact is rooted at `https://youssef.studio/`. Served under a project path it fails: 12 internal links and the CSS, fonts and images returned 404 in the emulator. `rebase-dist.mjs` produces a rehearsal-only copy (prefixed URLs, `noindex`, no `CNAME`, no sitemap, rehearsal canonical URLs). Production configuration was not weakened.

Local emulation of the full pipeline on the scratch repository (these are not GitHub-hosted runs):

| Step | Result |
| --- | --- |
| `REHEARSAL=1 CI=1 npm run verify` in the scratch repo | Passed: typecheck 0 errors, dist, artifact, browser and axe on 6 routes, Aurelia, racing, keyboard audit |
| Reproducibility | Identical, 58 files |
| Artifact allowlist on the rebased output | Pass; no symlinks; tar of the artifact holds regular files and directories only |
| Deploy of build 1, check | Pass |
| Deploy of build 2, check; expecting build 1 while build 2 is live | Pass; the wrong-build expectation fails as it should |
| Rollback: rebuild of the earlier commit, check | Pass; build id restored; repeated |
| Browsers | Edge 155 and Firefox 158: all 6 routes at 390 and 1440 px, no console errors, no failed requests, no overflow, fonts and images load, hero uses the 4:5 crop below 561 px, render-pass viewer reaches the third stage from the keyboard, racing chart 314 points and 13 ladder rows, first Tab is the skip link, 35 distinct links of which 2 external, 404 page and no-slash redirect behave |

Limits of the emulation: it cannot show the real Pages CDN, certificate, redirect from the project URL, MIME types, response headers other than the ones the emulator sets, environment rules, or the source transition.

## 4. Artifact security audit (local copy of the exact upload directory)

The allowlist (`scripts/check-artifact.mjs`) accepts only HTML routes, hashed CSS and JS, fonts, AVIF and JPEG under `media/aurelia` and `media/racing`, favicon and approved icon names, `robots.txt`, sitemaps and `CNAME`; everything else fails.

| Check | Result |
| --- | --- |
| Source, internal Markdown, review reports, instruction files, Git files, EXR, Blender, Nuke, masters, scripts, `.map`, JSON | None present; negative-tested by injecting `README.md`, `AGENTS.md`, `docs/index.html`, a `.map`, a manifest and a private-path string (all rejected) |
| Internal provenance manifest | `media/aurelia/manifest.json` removed from the artifact by `prune-dist.mjs`; the check fails if it returns |
| Private paths, tokens and the owner's email | Pattern scan of every text file in the artifact: none |
| Unapproved assets | Only the approved derivatives and the racing video cover; no other images |
| Size | Production 59 files, 2.3 MB; rehearsal 58 files, 0.5 MB |
| Symlinks | Rejected by the check; none present |
| Directory exposure | Directory URLs resolve to `index.html` only; there is no listing on Pages |
| MIME types and cache | Observed in the emulator only. Production sends `text/html; charset=utf-8` and `max-age=600` (observed for the placeholder); asset MIME types and compression on the new artifact are unverified until deployed (`check-live` covers HTML and compression) |
| Source maps | None emitted |

## 5. Production architecture review and cutover proposal

Recommended architecture stays as in the runbook: Astro static build, only `dist/` published, `main` as the sole production branch, official GitHub Actions deployment, least privilege, pinned actions, separate verification, smoke test, custom domain and HTTPS preserved, explicit rollback. The rehearsal results support it **only** at the build, artifact, routing and rollback-semantics level. The Pages source transition is untested.

Ordered cutover proposal (not executed; revised from the earlier runbook because of the findings above):

0. **Rehearse on GitHub** (section 3), including the source transition test. Stop if the previous site does not stay up when the source changes.
1. **Preflight.** Re-run `npm run verify`, `test:repro` and `test:artifact` on the release commit; record the digest. Record `c882895` as known good; push `rollback/placeholder` (needs your approval). Confirm Settings from section 2.
2. **Owner approval checkpoint.** Named approver, release commit hash, date and a rollback decision maker.
3. **Protect `main`:** ruleset requiring a pull request and the `CI / verify` check, blocking force-push and deletion; restrict the `github-pages` environment to `main`; optional required reviewer.
4. **Pages source transition** (only after step 0 shows what happens): either (a) switch the source to GitHub Actions while `main` still holds only the placeholder and, if the placeholder stays up, then merge; or (b) if the placeholder disappears on switching, merge and switch within minutes of each other. Do not merge source to `main` while the source is still a branch.
5. **Merge strategy.** Squash or merge the reviewed pull request from the release branch; never push the deployment branch to `main` directly. The merge triggers `pages.yml` (build, verify, deploy, smoke).
6. **Workflow execution.** Approve the environment prompt if configured; watch build, deploy and smoke.
7. **Domain and HTTPS.** Confirm the custom domain and Enforce HTTPS are unchanged; `https://youssef.studio/` serves the new site; `http://` redirects; `www` still redirects; the certificate is valid.
8. **Post-deployment tests.** `node scripts/check-live.mjs`; manual route and viewport pass; Lighthouse mobile on the live URL three times; check the sitemap lists only the six routes.
9. **Failure handling.** Build or smoke failure: nothing is replaced if the build fails; if deploy or smoke fails, roll back.
10. **Rollback.** Fastest: Actions, run `Deploy site` with `ref` of the last good release commit, or re-run the previous deployment; emergency placeholder: set the Pages source to branch `rollback/placeholder` (root). Neither rewrites history.

Expected downtime: zero if the previous deployment stays live after the source change (to be confirmed by the rehearsal); otherwise the time between the source change and the end of the first workflow run, roughly 5 to 10 minutes, during which pages may return 404. The current site is a one-page placeholder, so the impact is small, but this must be measured, not assumed.

## 6. Launch assets and metadata

Current state: `public/favicon.svg` only (a 64 px rounded square with a blue chevron, `#101216` and `#AAC4FF`, left over from the placeholder: it does **not** match the site's warm black, bone and brass identity); `theme-color` `#0b0a09` (correct); Open Graph title, description, URL, type, site name; `twitter:card` summary; no `og:image`, no PNG icons, no touch icon. Titles are unique and 14 to 45 characters. Descriptions are 84 to 147 characters (two over-long descriptions were shortened to 130 and 142 characters in this milestone). Canonical URLs are production URLs; the 404 page has none and is `noindex`. `robots.txt` allows all and points to `sitemap-index.xml`; the sitemap lists the six public routes only.

Code change made, no assets invented: `BaseLayout` now emits `og:image` (and switches the card to `summary_large_image`), `icon-192.png` and `apple-touch-icon.png` links **only if** `public/og-image.png`, `public/icon-192.png` or `public/apple-touch-icon.png` exists, and `og:locale`. Tested with a temporary file (tags appear) and without (they do not); the temporary file was removed. The artifact allowlist already accepts these names.

Asset specification (needs the owner's approval before anything is committed; none was generated):

| Asset | Spec |
| --- | --- |
| Favicon (SVG) | Replace the placeholder with the site wordmark idea: a restrained monogram on `#0b0a09` with a `#c9a96e` stroke, no gradients, legible at 16 px |
| PNG icons | `icon-192.png` and `icon-512.png`, `apple-touch-icon.png` at 180 px, solid `#0b0a09` background with safe margin, no text |
| Open Graph image | `og-image.png`, 1200 by 630 px, under 300 KB: `#0b0a09` canvas, the headline "Engineering precision. Cinematic imagination." in Instrument Serif with the italic second sentence in `#c9a96e`, small mono wordmark `YOUSSEF.STUDIO`; optionally an already approved render (hero crop) on the right. No credits, client names or claims. Alt text for sharing previews is not required but keep the text readable at 600 px wide |
| Page-specific cards (optional) | Aurelia: approved hero crop; racing: the telemetry trace on dark, not the video cover (rights open) |
| Theme colour | Keep `#0b0a09` |

Owner approval needed for every image above and for the final favicon concept.

## 7. Owner approval checklist

**Launch blockers**

1. Approve or replace the racing role wording; the public site uses only the README wording.
2. Rights to the racing video cover artwork (or remove it).
3. Racing track-file access and competition-rule question: decide how to resolve and whether the page needs a statement; today the page makes no compliance claim.
4. Aurelia technical claims: confirm that the metadata-derived facts (renderer, resolution, samples, passes, compositing steps) may be published.
5. Public video and GitHub links: confirm both are intended to be public.
6. Copyright treatment of the CGI images (all rights reserved or another statement) and the site code licence decision (Q15). The racing repository has no licence: **no licence was added to it**.
7. About page: confirm "Mechatronics" and "CAD" as areas of work, and the biography or its absence.
8. Contact: there is no public destination, so the contact page was removed; supply a verified one or launch without.
9. Social-card and icon assets (section 6).
10. Verified Pages and protection settings, an approved cutover and a GitHub-hosted rehearsal.
11. ADRs 0002 to 0006: none was accepted here; 0002 to 0004 have the evidence listed in the M2 audit.

**Optional improvements:** page-specific social cards, a launch language statement (QA-16), a sitemap submission after launch, a licence for the racing repository, a hosted preview environment.

## 8. Browser and accessibility retest

Run on the production build and on the rebased copy served under a sub-path.

| Tool | Result |
| --- | --- |
| Edge 155 (Chromium) | Full suite: `verify` 0 axe violations, keyboard audit, racing, Aurelia viewer; rehearsal check on 6 routes at 390 and 1440 px |
| Firefox 158 | Rehearsal check on 6 routes at 390 and 1440 px including the viewer keyboard test; no console errors; AVIF decodes |
| Not tested | Safari, iOS Safari, Android Chrome, any screen reader, forced-colours mode, 200 percent text zoom review. No such device or tool was available |

Manual checklist for the owner or a tester: (1) iPhone Safari: load every route, check hero image crop and the menu, scroll the racing tables and chart, play with the render-pass tabs; (2) Android Chrome: same; (3) macOS Safari: same; (4) NVDA or VoiceOver: headings list, landmarks, the render-pass tabs, the data tables and the chart description; (5) browser text zoom 200 percent and 400 percent: nothing clipped; (6) forced colours or high contrast: focus rings and buttons remain visible; (7) disable images: labelled fallbacks show.

## 9. Remaining decisions and next steps

1. Decide the scratch-repository route (section 3) and approve its name and visibility; provide authentication or run the commands in the kit README.
2. Run the rehearsal, including the source-transition test, and send me the run URLs.
3. Provide screenshots or values for the settings in section 2.
4. Approve and supply (or design) the launch assets; approve the owner checklist items.
5. After the rehearsal: update the runbook with observed behaviour, decide the cutover variant, name the approver, then request a separate, explicit production authorisation.
