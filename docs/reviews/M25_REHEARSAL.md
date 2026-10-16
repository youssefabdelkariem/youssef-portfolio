# M2.5 deployment rehearsal and launch readiness

Date: 2026-10-16. Prepared by Claude Code on `chore/m2-pages-actions` (local; not pushed). Related: ADR 0006 (Proposed), OPS-01, OPS-02, QA-02, QA-05, QA-09, QA-14, QA-18, Q13, Q14. Production was never modified: only read-only HTTP requests and unauthenticated GitHub API reads were made.

## Verdict

**PASS WITH CONDITIONS.** On 2026-10-16 the owner created the private scratch repository `youssef-pages-rehearsal` (Pages source: GitHub Actions) and authorised its use. The prepared pipeline was run on GitHub: seven workflow runs built, verified and deployed a synthetic site through the official Pages actions, and two rollbacks restored the earlier version exactly (section 3b). The conditions: the Pages source **transition** (branch to Actions) was not tested because the owner had already chosen Actions; the `smoke` job result and the logs are private and were not readable here (the deployment itself proves the build job passed, because `deploy` needs it); the rollback by `workflow_dispatch` with a `ref` input needs the owner to click Run workflow (no API token here) and has not been done; Firefox could not be driven against the deployed URL; production settings remain unverified; and the owner approvals listed in section 7. Nothing about `youssef.studio` or the production repository's Pages configuration was touched.

## 1. Repository and workflow inspection

State: `feat/m1b-engineering-racing` at `072ee22` (pushed), `chore/m2-pages-actions` (local, based on it), `rollback/placeholder` = `c882895` (local). All three worktrees clean, remote is `origin` = `youssef-portfolio`.

| Check | Finding |
| --- | --- |
| Triggers | `ci.yml`: `pull_request` and `push` to every branch except `main`. `pages.yml`: `push` to `main` and `workflow_dispatch`. The deploy job also requires `github.ref == refs/heads/main` |
| Would pushing `chore/m2-pages-actions` trigger anything? | Yes: `ci.yml` would run once per push (`npm ci`, `npm run verify`, artifact upload). It has `contents: read`, no secrets and no deploy step, so it cannot change production. `pages.yml` does not trigger on that branch. The existing `pages build and deployment` workflow runs only for the Pages source branch (`main`). Pushing `rollback/placeholder` would also start `ci.yml`, which fails harmlessly (no `package.json`). Not pushed |
| Permissions | Workflow default `{}`; build `contents: read`; deploy `pages: write` and `id-token: write`; smoke `contents: read`. `persist-credentials: false` on every checkout |
| Actions | Only GitHub-owned actions, pinned to commit SHAs (`checkout` v4, `setup-node` v4, `upload-pages-artifact` v3, `deploy-pages` v4, `upload-artifact` v4) |
| Artifact construction | Only `dist/` is uploaded. `check-artifact` allowlist (negative-tested), prune step removes the media manifest, `CNAME` included from `public/` |
| Reproducibility | New `npm run test:repro`: two consecutive builds give byte-identical output. Artifact digest `b26fedde...ae1fa5` for 59 files (local, committed tree). A fresh clone of the committed branch with a fresh `npm ci` produced the same digest |
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

## 3b. GitHub Pages deployment and rollback rehearsal (2026-10-16)

Scratch repository: `https://github.com/youssefabdelkariem/youssef-pages-rehearsal`, private, no custom domain, Pages source GitHub Actions, public Pages site. It held only a readme (`Create readme.md`, by the owner) before the kit was added; no unrelated work was present. The kit was added with `make_scratch.py --existing` (synthetic media only; scan of the scratch tree: no EXR, Blender, Nuke, video, document or provenance data). The `GITHUB_TOKEN` of that repository is the only deployment credential involved; no secrets exist; the production repository was not touched. Pushes used the owner's existing Git credential and went to the scratch remote only.

Workflow actions were updated to Node 24 releases (verified `using: node24` in each `action.yml`), pinned by commit SHA: `checkout` v7.0.1 `3d3c42e`, `setup-node` v7 `949feb2`, `upload-pages-artifact` v5 `fc324d3` (composite, wraps `upload-artifact` v7), `upload-artifact` v7 `cf430e0`, `deploy-pages` v5.0.1 `368f825`. The same pins are now in the production workflows on this branch.

Scratch Pages URL: `https://youssefabdelkariem.github.io/youssef-pages-rehearsal/` (answers 301 to `http://yousseff.me/youssef-pages-rehearsal/`, see compatibility below). Run IDs come from the `rehearsal-run` meta tag that each build stamps into the deployed site; the run pages are private to the owner.

| Deployment | Commit | Workflow run |
| --- | --- | --- |
''' + table + '''

Each push to `main` produced one run, and the live site showed the new build id about two minutes later. The `build` job (`npm ci`, `npm run verify`, reproducibility, sub-path rebase, allowlist on the exact upload directory, upload) and the `deploy` job succeeded for every run listed, because `deploy` depends on `build` and the live site changed.

Deployed site checks (Edge 155 against the Pages URL: all 6 routes at 390 and 1440 px, no console errors, no failed requests, fonts and images load, hero AVIF with the 4:5 crop below 561 px, render-pass viewer from the keyboard, 314 chart points and 13 ladder rows, 35 distinct links with 2 external, first Tab the skip link): **passed** for build 1, build 2 and the final rollback; the check expecting the wrong build correctly failed.

Observed Pages behaviour on the deployed site (HTTP):

| Item | Result |
| --- | --- |
| Routes | The six routes return 200 `text/html; charset=utf-8`; `/work` and `/engineering/ibm-ai-racing` return 301 to the trailing-slash URL; an unknown path returns 404 with the custom 404 page; `/404.html` returns 200 |
| Assets | CSS `text/css` gzip; fonts `font/woff2`; AVIF `image/avif`; JPEG `image/jpeg`; SVG `image/svg+xml`; all `Cache-Control: max-age=600`; text types gzip |
| Artifact contents | All 56 expected files return 200. Probes for `README.md`, `readme.md`, `package.json`, `package-lock.json`, `src/`, `docs/`, `scripts/`, `.git/config`, `.github/workflows/pages.yml`, `media/aurelia/manifest.json`, `CNAME`, `sitemap*.xml`, `astro.config.mjs`, `public/`, `node_modules/`, `AGENTS.md` all return 404 |
| Metadata | `noindex, nofollow`, canonical on the rehearsal URL (no `youssef.studio` reference), build and run stamps present |

Rollback rehearsal (two procedures from the runbook, executed with a revert commit pushed to the scratch `main`):

| Step | Evidence |
| --- | --- |
| Baseline | HTML of the 6 routes and the 404 page saved from build 1 content |
| Version 2 deployed | Footer text "REHEARSAL VERSION 2." appears on every page |
| Rollback 1 (`git revert`, no history rewrite) | Git tree of the rollback commit equals the tree of build 1; the live site returns to the original text; **7 of 7 HTML pages byte-identical to the baseline** once the build stamps are removed |
| Repeat | Version 2 re-applied by reverting the rollback, then rolled back again: tree equal to build 1 again, 7 of 7 pages identical again |
| Identifiable history | Every deployment has a run ID, a commit and a stamp in the page; the Actions artifacts `github-pages` and `artifact-files` are kept 14 days |
| Not done | Rollback by `workflow_dispatch` with `ref` (needs the owner to click Run workflow in the scratch repository and enter the build 1 commit `09a314b259411fbf3762c8327a0b8413242c339f`; afterwards the page stamp must show that commit) and re-running an earlier deployment run |

Compatibility findings and fixes:

1. **The project URL redirects to another domain.** `youssefabdelkariem.github.io/<repo>/` returns 301 to `http://yousseff.me/<repo>/` because the user site has that custom domain. The final location is **HTTP only**: `https://yousseff.me` fails the certificate check, so the rehearsal site could not be tested over HTTPS at its final address. The production site is unaffected (its own domain `youssef.studio` has valid HTTPS), but the `yousseff.me` HTTPS problem is a separate defect of the user site worth fixing.
2. **Canonical check bug in the rehearsal checks (fixed).** The checker compared canonical URLs with the redirect target; it now compares the path and rules out production references.
3. **Firefox could not be driven against the live site.** Headless Firefox 158 timed out or aborted navigation to the plain-HTTP final URL, and also to `http://example.com`, so this is a limitation of the test setup, not evidence about the site. Firefox passed the same checks against the local emulator and the earlier production build.
4. **Action versions.** The Node 20 deprecation warning is resolved by the Node 24 releases above; the deploy and upload actions worked on GitHub.
5. **Source transition not tested.** The repository was already set to Actions, so what stays live when the source changes remains unknown.

## 3c. Manual rollback run #8: investigation, fix and re-test (2026-10-16)

The owner dispatched `Deploy rehearsal` with `ref` = `09a314b259411fbf3762c8327a0b8413242c339f` ([run 38942505896](https://github.com/youssefabdelkariem/youssef-pages-rehearsal/actions/runs/38942505896)): build and deploy passed, smoke failed, and the failure reported the build `0b4d89c` and canonical URL mismatches.

**Findings**

1. **The `ref` input was used for the checkout.** The original build job had `ref: ${{ inputs.ref || github.sha }}`, and the stamp step recorded `git rev-parse HEAD` of that checkout. Proof from the deployed site: it now reports `rehearsal-build 09a314b259411fbf3762c8327a0b8413242c339f` and `rehearsal-run 38942505896-1`, i.e. the artifact of run #8 was built from the requested commit. The deployed rollback itself therefore worked.
2. **The smoke failure was in the checks, not in the rollback.** (a) The smoke job ran straight after the deploy job with no wait. A new Pages deployment takes some time to reach every edge, and HTML is served with `Cache-Control: max-age=600`; seeing the previous build (`0b4d89c`) for a short time is consistent with that. The logs are private, so which build the smoke saw could not be read; the later state of the site and the run stamp rule out a wrong checkout. (b) The smoke job checks out the tip of `main`, whose tree after my revert-based rollbacks was identical to build 1, so it ran the **old** checker. The corrected canonical-URL logic existed only in build 2 and had been reverted away with it (a side effect of rolling back by revert: scripts roll back too). The old checker compared each page's canonical URL, fixed at build time to the github.io address, with the URL the browser ended on after the redirect to `yousseff.me`.
3. **Two weaknesses did remain in the workflow**: the requested ref was not validated (a branch name, a tag or any string went straight to `checkout`), and the deploy and smoke jobs recomputed their own idea of the commit instead of sharing one resolved value.

**Canonical URL, redefined.** The expected canonical is `REHEARSAL_URL` plus the route, decided at build time and passed to the checker with `--canonical-base`. The URL the browser ends on is a different thing and may be on another host after a redirect. The checker now fails when a page has no canonical, when it mentions `youssef.studio`, when its path is not the route under the base path, or when it differs from `canonicalBase + route`. Verified locally with a correct base (pass) and a wrong base (fail).

**Propagation.** `check-rehearsal.mjs` now polls, for up to 5 minutes (`REHEARSAL_WAIT_MS`), the page the user would get and a cache-busted copy of it until the build stamp equals the expected commit, and reports after how many seconds each matched; it fails if the plain URL never matches. Browser cache is not involved in the smoke job (fresh runner, no cache), but real visitors can keep the previous HTML for up to ten minutes (`max-age=600`).

**Workflow changes (scratch template and production `pages.yml`)**

- New first job `resolve`, which runs on the tip of `main` (never on the requested commit) and calls `scripts/resolve-deploy-ref.mjs`. It requires a plain hexadecimal SHA of 7 to 40 characters (branches, tags, ranges, options and any other text are rejected before any git call), resolves it with `git rev-parse --verify --end-of-options` to a full SHA (rejecting unknown or ambiguous values), and requires it to be an ancestor of the workflow commit, so only history already on `main` can be deployed. No shell is involved; the request travels in an environment variable. Output: `sha`.
- `build` checks out `ref: ${{ needs.resolve.outputs.sha }}` and a step fails if `git rev-parse HEAD` differs; `deploy` needs `resolve` and `build`; `smoke` takes the same `needs.resolve.outputs.sha`. One resolved commit is used by all three jobs. The workflow file itself always comes from the default branch (a dispatch from another branch cannot deploy: the deploy job requires `github.ref == refs/heads/main`).
- Scratch only: because the agent has no API token to dispatch, a push to `main` whose message contains `[rollback-to: <sha>]` feeds the same `resolve` job. It is not in the production workflow.
- `npm run test:resolve` (also in `verify`) tests the resolver against a throwaway repository: 14 cases (no ref, full, short and upper-case SHA, the workflow commit itself, unknown commit, branch, tag, `HEAD~1`, range, `--help`, injected command, too short, a commit on another branch). All pass.

**Re-test on GitHub (scratch repository only)**

| Step | Commit | Run | Result |
| --- | --- | --- | --- |
| Push of the fixed workflow, scripts and checker | `dfcbf05` | [38943921505](https://github.com/youssefabdelkariem/youssef-pages-rehearsal/actions/runs/38943921505) | Normal path: `resolve`, `build`, `deploy`; the site stamp became `dfcbf05` |
| Rollback by push marker `[rollback-to: 09a314b259411fbf3762c8327a0b8413242c339f]` (empty commit `aece9ca`) | `aece9ca` carries the workflow | [38944332800](https://github.com/youssefabdelkariem/youssef-pages-rehearsal/actions/runs/38944332800) | **Deployed site reports `rehearsal-build 09a314b259411fbf3762c8327a0b8413242c339f` and `rehearsal-run 38944332800-1`**: the requested commit, not the commit that triggered the run |

Local verification of the live result with the same arguments as the smoke job (`--expect-build 09a314b… --canonical-base https://youssefabdelkariem.github.io/youssef-pages-rehearsal`, Edge 155): build stamp matched on the first probe (plain and cache-busted), canonical URLs correct on all pages at both widths, all other checks passed, and all 7 HTML pages are identical to the original build 1 pages once the stamps are removed. The smoke job's own result for these two runs is private and has to be read from the run pages by the owner; I did not treat a missing result as a pass.

**Status of manual rollback.** Rollback by dispatching with `ref` is proven for checkout and deployment by run #8 (live stamp equals the requested commit) and, with validation, by run 38944332800 through the identical `resolve` path. The only part not exercised on GitHub after the fix is the dispatch click itself; its input handling is the same `REF` environment variable the marker path uses. Treat the dispatch rollback as verified once the owner has re-run it once with the fixed workflow and the smoke job shows green.

## 3a. GitHub-hosted CI run (2026-10-16, after the owner approved the push)

Pushed without force: `chore/m2-pages-actions` at `9553361e46d27da4e51f382fdc1b7f372a5ceea4` and `rollback/placeholder` at `c882895` (the live placeholder; `main` is still `c882895`).

| Item | Observation |
| --- | --- |
| Runs triggered by the two pushes | Exactly one: `CI`, event `push`, branch `chore/m2-pages-actions`, run 38923066056. The `rollback/placeholder` push triggered nothing (its tip has no workflow files) |
| Run URL | https://github.com/youssefabdelkariem/youssef-portfolio/actions/runs/38923066056 |
| Conclusion | **success**, attempt 1, job `verify` 1 min 24 s (15:20:07 to 15:21:31 UTC) |
| Runner | GitHub-hosted, label `ubuntu-24.04`, runner group "GitHub Actions" |
| Steps | checkout, setup-node (Node 22, npm cache), `npm ci`, `npm run verify`, upload artifact: all success |
| `npm run verify` on the runner | Docs check, typecheck, build, built-output check, artifact allowlist, browser and axe on 6 routes, Aurelia, racing, keyboard audit and the two-build reproducibility check passed. The browser tests used the runner's installed Chrome through the `CI=1` no-sandbox launch path, which was untested before this run |
| Artifact | `site-dist`, 2.29 MB, retained 7 days; the allowlist check ran inside `verify` on the same `dist` |
| Warnings | One annotation: the pinned action versions target Node.js 20, which GitHub is deprecating, and were forced to Node 24 (`checkout`, `setup-node`, `upload-artifact`). Not a failure. Newer majors exist (`checkout` and `setup-node` v7, `upload-artifact` v7, `upload-pages-artifact` v5, `deploy-pages` v5); bump them together, with the deploy actions, during the Pages rehearsal rather than piecemeal, and re-run |
| Deployment and permissions | The CI job has `contents: read` only. No deployment was created (the deployment list still shows only `c882895` on `main`), no environment was requested, and `Deploy site` is not registered: GitHub lists a workflow only once it exists on the default branch or has run. Its first real execution will therefore be the merge, which is why the rehearsal matters |
| Not available | Run logs and the artifact download need authentication, so the runner's Chrome version and the artifact contents were not inspected here. To inspect: download `site-dist` from the run page, unzip it, and run `DIST=<folder> node scripts/check-artifact.mjs` |

## 3. Scratch-repository rehearsal

Status: executed on 2026-10-16, see section 3b. The text below is the original requirements list, kept for the record.

Needed from the owner before it could run:

- **Approval, name and visibility.** Requested: a **private** repository named `youssef-pages-rehearsal` under your account, created by you (or by me once authenticated), deleted after the rehearsal. Private-repository Pages could not be verified without authentication; it normally needs GitHub Pro, Team or Enterprise (a student plan may include it). To check: Settings, Billing and plans shows your plan, or create the private repository, open Settings, Pages, and see whether a source can be chosen or whether it asks you to upgrade or make the repository public. If it asks, stop: a public repository needs your separate approval and the exposure decision below.
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

Ordered cutover proposal (not executed; revised from the earlier runbook because of the findings above and section 3b; production still needs a separate, explicit authorisation):

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

On 2026-10-16 the owner approved these specifications **as design direction only**: no asset has been created or committed, and each final image still needs approval.

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

## 9. Updated cutover recommendation, blockers and next steps

Recommendations after the rehearsal:

1. Keep the architecture. The official Actions deployment, the allowlisted artifact and the revert-based rollback worked on GitHub as designed; deployments take about two minutes.
2. Use the pinned Node 24 releases now in the production workflows.
3. Before the real cutover, test the **source transition** once on a second scratch repository (start with branch publishing, add the workflow, then switch the source) or accept a short measured window. This is the last unknown for downtime.
4. Keep both rollback methods in the runbook: `workflow_dispatch` with `ref` (to be exercised by the owner) and a reviewed revert pull request (rehearsed twice). Keep `rollback/placeholder` for the emergency source change.
5. Production uses the custom domain `youssef.studio`, so the site is served at the domain root and needs no path transform; the transform exists only for project-path rehearsals.
6. Fix HTTPS on `yousseff.me` separately; it affects every project site under the user site.

Remaining launch blockers: owner approvals (section 7), branding assets, verified production Pages and protection settings (section 2), the ruleset on `main`, the transition test or accepted downtime, the dispatch-by-ref rollback click, ADRs 0002 to 0006 unresolved, and Safari, iOS, Android and screen-reader checks.

Next owner approval required: (a) run the dispatch-by-ref rollback in the scratch repository (or confirm it is not needed), (b) send the production settings screenshots from section 2, (c) approve the branding assets and the checklist items, (d) decide the transition test, (e) later, a separate explicit authorisation for production.
