# Deployment readiness and runbook (proposal)

Prepared 2026-10-16 and revised after the M2.5 review ([M25_REHEARSAL](reviews/M25_REHEARSAL.md)) on `chore/m2-pages-actions` for [ADR 0006](adr/0006-build-deployment-preview.md), which **stays Proposed** until the owner approves this architecture. Nothing here was run against production. Related: OPS-01, OPS-02, QA-02, QA-09, QA-18, Q13, Q14. Execution rules: [production and PR gate](AGENT_WORKFLOW.md#production-and-pr-gate).

## 1. Current production (probed read-only 2026-10-16)

| Fact | Evidence |
| --- | --- |
| `https://youssef.studio/` serves a one-page placeholder over HTTPS from GitHub Pages | `Server: GitHub.com`, HTTP 200, `max-age=600` |
| `http://` and the default project URL redirect to `https://youssef.studio/` | 301 responses |
| Every new route returns 404 today | `/work/` 404 |
| DNS resolves to GitHub Pages | `185.199.108.153` |
| `main` is `c882895` (README, `index.html`, `CNAME` only); no pull requests exist | GitHub API |
| Publishing source, HTTPS enforcement and branch protection | **Unverified**: the Pages and protection APIs need owner authentication. Check Settings, Pages and Settings, Rules |

Source of truth for "what is live" is therefore the placeholder at root of `main`. The branch under review contains the whole site but nothing is published from it.

## 2. Recommended architecture

**GitHub Actions builds the site and uploads only `dist/` as the Pages artifact; the Pages source is set to "GitHub Actions".** Source, docs, instruction files, evidence and tooling never leave the repository. This is the third option in ADR 0006 and the only one that excludes source structurally without generated-commit drift.

Files prepared (not active on `main`, not run on GitHub):

| File | Purpose |
| --- | --- |
| `.github/workflows/ci.yml` | Validation on pull requests and non-`main` pushes. Read-only token, no secrets, no deploy. Uploads `dist` for inspection |
| `.github/workflows/pages.yml` | On push to `main` or manual dispatch: build, `npm run verify`, upload artifact, deploy through the `github-pages` environment, then a read-only production smoke test. Actions pinned to commit SHAs. `workflow_dispatch` takes a `ref` to rebuild a known-good commit |
| `scripts/check-artifact.mjs` (`npm run test:artifact`, part of `verify`) | Allowlist for the complete artifact. Fails on any file outside site files, on docs, source, instruction files, maps, JSON, secrets or private paths, and on a missing `CNAME`, 404 or route. Negative-tested with injected files |
| `scripts/prune-dist.mjs` (runs in `npm run build`) | Removes `media/aurelia/manifest.json` (master file names and hashes) from the artifact |
| `scripts/check-live.mjs` (`npm run test:live`) | Read-only production smoke test: routes 200, titles, compression, `/work` redirect, real 404, robots, sitemap, files that must not be served, `http` to `https` |
| `public/CNAME` | Puts `youssef.studio` in the artifact. Harmless today; not relied on (see section 3) |
| `scripts/check-reproducible.mjs` (`npm run test:repro`) | Two consecutive builds must be byte-identical |
| `scripts/rehearsal/` | Kit for a scratch-repository rehearsal: synthetic scratch repo generator, sub-path transform, Pages emulator, functional checks, rehearsal workflow. See its README |

## 3. Requirements and findings

| Topic | Finding |
| --- | --- |
| Custom domain and CNAME | With an Actions source GitHub reads the domain from the repository's Pages setting, not from a `CNAME` file; copying the file does not configure it (ADR 0006). The setting normally persists when the source changes, but this was **not verified**. Never remove the domain while switching. Check Settings, Pages, Custom domain before and after |
| HTTPS | GitHub Pages issues and renews the certificate. Confirm "Enforce HTTPS" stays ticked after the switch; `check-live` asserts the `http` to `https` redirect |
| Direct nested routes | Astro emits `route/index.html`; Pages serves directories and 301-redirects the missing trailing slash. Locally verified with a Pages-like server (`/work` gives 301). Re-verified in production by `check-live` |
| 404 behaviour | `dist/404.html` is served with status 404 for unknown paths; the page has `noindex` and no canonical. Verified locally; production verified by `check-live` |
| Build artifact | 59 files, 2.3 MB (limit 1 GB). Only HTML, hashed CSS, fonts, AVIF/JPEG, sitemap, robots, `CNAME`, favicon |
| Excluding docs and source | Structural: only `dist/` is uploaded. Raw files stay readable on the public GitHub repository, as before |
| Repository permissions | Workflows default to no permissions. Build job `contents: read`; deploy job `pages: write` and `id-token: write` only. PRs from forks get no secrets and cannot deploy |
| Branch protection | **None today** (public data: `protected: false`, no rulesets). Recommended ruleset on `main`: require a pull request, require the `CI / verify` check, block force-push and deletion, require review |
| Environment | In Settings, Environments, `github-pages`: deployment branches `main` only; optionally a required reviewer (the owner) so every deployment needs an approval click |
| Actions policy | Allow GitHub-authored actions only; keep pinned SHAs and update deliberately. The first CI run warned that the pinned versions target Node.js 20; update `checkout`, `setup-node`, `upload-artifact`, `upload-pages-artifact` and `deploy-pages` together during the rehearsal |
| Rollback | See section 5. A revert commit pushed to `main` redeploys the earlier tree exactly (rehearsed twice: tree and pages identical); the `ref` dispatch path still needs one owner-run test |
| Production verification | `check-live` in the workflow (after deploy) and by hand; plus a manual visual pass and Lighthouse on the live URL, which cannot be done before deployment |

## 4. Cutover sequence (owner decisions marked)

The full, revised procedure with downtime assessment is in [M25_REHEARSAL, section 5](reviews/M25_REHEARSAL.md#5-production-architecture-review-and-cutover-proposal). In short:

0. **(Owner)** Rehearse on GitHub in a scratch repository, including what the site serves when the Pages source changes from a branch to GitHub Actions. Not done yet; it decides between the two transition variants.
1. Preflight on the release commit: `npm run verify`, `test:repro`, `test:artifact`; record the digest and the known-good commit `c882895`.
2. **(Owner)** Approval checkpoint: approver, release commit, rollback decision maker; push `rollback/placeholder`.
3. **(Owner)** Ruleset on `main` (pull request, `CI / verify`, no force-push or deletion); restrict the `github-pages` environment to `main`.
4. **(Owner)** Switch the Pages source to GitHub Actions at the point the rehearsal showed to be safe, keeping the custom domain and Enforce HTTPS. **Never merge source to `main` while the source is still a branch.**
5. **(Owner authorisation)** Merge the reviewed pull request; `pages.yml` builds, verifies, deploys and smoke-tests.
6. Verify live (`npm run test:live`, manual pass, Lighthouse on the live URL, domain, HTTPS, `www`).

## 5. Rollback

| Situation | Action |
| --- | --- |
| A deployed version is bad, a good build exists | Actions, `Deploy site`, Run workflow from `main`, `ref` = the last good commit SHA (7 to 40 hex characters, already in `main`'s history). The `resolve` job rejects branches, tags, unknown or off-main commits, resolves the full SHA, and `build`, `deploy` and `smoke` all use that one SHA. Afterwards confirm the deployed build is that commit. Or re-run the last good deployment run (artifacts kept 30 days) |
| Emergency, serve the old placeholder | Settings, Pages, Source: Deploy from branch, `rollback/placeholder`, `/ (root)`. Takes effect within minutes; custom domain stays |
| Workflow is broken | Revert the merge commit on `main` through a reviewed pull request; do not force-push |

Note that the `ref` rollback only works for commits that contain the Astro build (`package.json`); `c882895` does not, hence the branch-source emergency path.

## 6. Production verification checklist

`node scripts/check-live.mjs` (routes, 404, redirects, robots, sitemap, hidden files); open every route at 390 and 1440 px; confirm hero images are AVIF and load; confirm `https://youssef.studio/work` redirects; confirm the certificate and Enforce HTTPS; run Lighthouse mobile on the live URL three times; compare `dist` file list with the live sitemap; submit the sitemap only after owner approval.

## 7. What was tested locally and what was not (updated after M2.5)

Tested: full `npm run verify` with `CI=1` (no-sandbox launch path), artifact allowlist with injected bad files, `check-live` against a Pages-like local server and read-only against production (it fails today, as expected), YAML parse of both workflows. **Not tested:** the workflows on GitHub-hosted runners (Chrome path and sandbox on `ubuntu-24.04`), the deploy action, environment rules, the Pages source switch, domain persistence, branch protection. These need a rehearsal repository or the owner's settings access.

M2.5 added: byte-identical double builds, a local scratch-repository run of the whole pipeline including two deployments and a rollback by rebuilding the earlier commit, and Edge and Firefox checks of the rebased site under a sub-path. M2.5 then rehearsed the Pages deployment on GitHub in the private scratch repository `youssef-pages-rehearsal` ([results](reviews/M25_REHEARSAL.md#3b-github-pages-deployment-and-rollback-rehearsal-2026-10-16)): seven deployments with the Node 24 action pins, deployed-site checks in Edge, artifact exposure probes, and two repeatable rollbacks by revert commit. Still **not** tested there: the rollback by `workflow_dispatch` with `ref` (owner click), the Pages source transition and Firefox against the live URL. A GitHub-hosted CI run of the whole `verify` suite (including the browser tests on `ubuntu-24.04` with the no-sandbox path) passed on 2026-10-16 ([run](https://github.com/youssefabdelkariem/youssef-portfolio/actions/runs/38923066056)); it showed that pushing the branch triggers `CI` only. Still **not** tested: the Pages deployment on GitHub, the Pages source transition and what stays live during it, domain persistence, environment rules and branch protection.

## 8a. Rollback lessons from the rehearsal (2026-10-16)

- Rolling back with `git revert` also reverts scripts and workflow changes made in the reverted commits, so the next run may use older checks. Keep the smoke checks in the tip of `main` independent of what was rolled back (the smoke job already checks out the tip of `main`).
- A new deployment can take a short while to reach every Pages edge and HTML is cached for up to ten minutes (`max-age=600`): the smoke test waits for the expected build, and visitors may briefly see the previous version.
- The deployed build must be compared with the **resolved** commit, not with the commit that triggered the run. Details and run IDs: [M25_REHEARSAL, section 3c](reviews/M25_REHEARSAL.md#3c-manual-rollback-run-8-investigation-fix-and-re-test-2026-10-16).
- `scripts/resolve-deploy-ref.mjs` is tested by `npm run test:resolve` (14 cases). Production `check-live` does not yet verify which commit is live; consider publishing a build stamp (for example a `build.txt` added to the allowlist) so the post-deployment check can compare commits, as the rehearsal does.

## 8. Observed Pages behaviour (scratch deployment, 2026-10-16)

Trailing-slash 301 for directory routes, custom 404 with status 404, correct MIME types for HTML, CSS, WOFF2, AVIF, JPEG and SVG, gzip for text, `Cache-Control: max-age=600`, no directory listings, and none of the files outside the artifact reachable. About two minutes from push to the new version being live. Because production has its own custom domain, expect these on `youssef.studio` too; `check-live` verifies them after the real deployment. Differences to expect: no path prefix, `CNAME`, a sitemap and `robots.txt`.

