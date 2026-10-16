# Deployment readiness and runbook (proposal)

Prepared 2026-10-16 on `chore/m2-pages-actions` for [ADR 0006](adr/0006-build-deployment-preview.md), which **stays Proposed** until the owner approves this architecture. Nothing here was run against production. Related: OPS-01, OPS-02, QA-02, QA-09, QA-18, Q13, Q14. Execution rules: [production and PR gate](AGENT_WORKFLOW.md#production-and-pr-gate).

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
| Branch protection | **Unverified.** Recommended ruleset on `main`: require a pull request, require the `CI / verify` check, block force-push and deletion, require review |
| Environment | In Settings, Environments, `github-pages`: deployment branches `main` only; optionally a required reviewer (the owner) so every deployment needs an approval click |
| Actions policy | Allow GitHub-authored actions only; keep pinned SHAs and update deliberately |
| Rollback | See section 5 |
| Production verification | `check-live` in the workflow (after deploy) and by hand; plus a manual visual pass and Lighthouse on the live URL, which cannot be done before deployment |

## 4. Cutover sequence (owner decisions marked)

Do not merge before step 4. Under the current branch source, merging site files to `main` could publish repository files and leave the placeholder live.

1. **(Owner)** Rehearse on a scratch repository first: same workflow, no custom domain, Pages source "GitHub Actions". This confirms the permissions, the environment rule, the artifact and that switching the source keeps the previous site up until the first deployment (documented behaviour is unverified here). Not done: creating a repository needs the owner.
2. **(Owner)** Create the `main` ruleset and restrict the `github-pages` environment to `main`.
3. **(Owner)** Record the known-good commit `c882895` and create a rollback branch from it: `git branch rollback/placeholder c882895` then push it. It holds only `index.html`, `CNAME` and README, so serving it exposes nothing else. (A local branch of that name can be prepared; pushing is the owner's call.)
4. **(Owner)** Open a pull request to `main`; `ci.yml` must pass; review the artifact (`site-dist`) from the run.
5. **(Owner)** In Settings, Pages, set Source to "GitHub Actions"; confirm the custom domain and Enforce HTTPS are unchanged.
6. **(Owner authorisation)** Merge. `pages.yml` builds, verifies, deploys and smoke-tests. Watch the run; approve the environment prompt if configured.
7. Verify live: `npm run test:live`, then the manual checklist below.

## 5. Rollback

| Situation | Action |
| --- | --- |
| A deployed version is bad, a good build exists | Actions, `Deploy site`, run `workflow_dispatch` with `ref` set to the last good commit SHA. Or re-run the last good deployment run (artifacts kept 30 days) |
| Emergency, serve the old placeholder | Settings, Pages, Source: Deploy from branch, `rollback/placeholder`, `/ (root)`. Takes effect within minutes; custom domain stays |
| Workflow is broken | Revert the merge commit on `main` through a reviewed pull request; do not force-push |

Note that the `ref` rollback only works for commits that contain the Astro build (`package.json`); `c882895` does not, hence the branch-source emergency path.

## 6. Production verification checklist

`node scripts/check-live.mjs` (routes, 404, redirects, robots, sitemap, hidden files); open every route at 390 and 1440 px; confirm hero images are AVIF and load; confirm `https://youssef.studio/work` redirects; confirm the certificate and Enforce HTTPS; run Lighthouse mobile on the live URL three times; compare `dist` file list with the live sitemap; submit the sitemap only after owner approval.

## 7. What was tested locally and what was not

Tested: full `npm run verify` with `CI=1` (no-sandbox launch path), artifact allowlist with injected bad files, `check-live` against a Pages-like local server and read-only against production (it fails today, as expected), YAML parse of both workflows. **Not tested:** the workflows on GitHub-hosted runners (Chrome path and sandbox on `ubuntu-24.04`), the deploy action, environment rules, the Pages source switch, domain persistence, branch protection. These need a rehearsal repository or the owner's settings access.
