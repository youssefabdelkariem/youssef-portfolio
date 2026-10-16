# Pages deployment rehearsal kit

Tools for rehearsing the GitHub Pages deployment of youssef.studio in a **scratch repository**, without touching production. Nothing here runs against `youssef.studio`, and nothing is pushed by these scripts. Background and results: [M25_REHEARSAL](../../docs/reviews/M25_REHEARSAL.md); production procedure: [DEPLOYMENT_RUNBOOK](../../docs/DEPLOYMENT_RUNBOOK.md).

| File | Purpose |
| --- | --- |
| `make_scratch.py` | Creates a local git repository (two commits, no remote) with the site source, the checks, the rehearsal workflow and **synthetic** media. No render, master, EXR, project file, document or real provenance manifest is copied |
| `workflows/pages-rehearsal.yml` | Becomes `.github/workflows/pages.yml` of the scratch repository: verify, reproducibility, rebase, artifact allowlist, upload, deploy, smoke test |
| `rebase-dist.mjs` | Rehearsal-only transform of `dist/` for a project-site sub-path: prefixes root-absolute URLs, points canonical and Open Graph URLs at the rehearsal URL, adds `noindex`, drops `CNAME`, sitemap and robots rules, stamps the build id |
| `serve-subpath.mjs` | Local emulator of a Pages project site (sub-path, gzip, trailing-slash redirect, real 404, `max-age=600`) |
| `check-rehearsal.mjs` | Read-only functional checks of a served rehearsal site in Chrome-family or Firefox |

Why a transform: the production build is rooted at `https://youssef.studio/` (`site` and `base: '/'`, root-absolute links). A project site is served under `/<repo>/`, so the unmodified artifact breaks there (verified: 404s for CSS, fonts and images). The production configuration is deliberately not changed to make a rehearsal pass.

## Local run (already done once; see the report)

```text
python scripts/rehearsal/make_scratch.py "C:/Dev/Website Portfolio/rehearsal/youssef-pages-rehearsal"
cd "C:/Dev/Website Portfolio/rehearsal/youssef-pages-rehearsal"
npm ci
REHEARSAL=1 npm run verify
node scripts/rehearsal/rebase-dist.mjs dist ../served --base /youssef-pages-rehearsal --url http://localhost:4710/youssef-pages-rehearsal --build local
node scripts/rehearsal/serve-subpath.mjs ../served /youssef-pages-rehearsal 4710
node scripts/rehearsal/check-rehearsal.mjs http://localhost:4710/youssef-pages-rehearsal
```

In Git Bash prefix commands that take a `/path` argument with `MSYS_NO_PATHCONV=1`, otherwise `/youssef-pages-rehearsal` is rewritten into a Windows path.

## Scratch repository on GitHub (executed 2026-10-16; see the report)

1. **Visibility and exposure.** The account's user site `youssefabdelkariem.github.io` has the custom domain `yousseff.me`. GitHub serves project sites without their own domain under that domain, and `https://youssefabdelkariem.github.io/<repo>/` redirects to `https://yousseff.me/<repo>/` (observed for an unrelated path). A public scratch repository would therefore appear at `yousseff.me/youssef-pages-rehearsal/`. Private-repository Pages needs a paid plan; check Settings, Pages in a private repository first. If private Pages is unavailable, either accept the exposure of a synthetic, noindex copy, use a separate throwaway GitHub account, or run only the build and artifact steps (remove the deploy job).
2. Create the repository `youssef-pages-rehearsal` (private if Pages allows it; a readme is fine) and clone it.
3. `python scripts/rehearsal/make_scratch.py <clone> --existing` adds the kit as one commit (it refuses a clone that holds other files); push it to `main`. Build 2 is any later commit; make a visible one to prove rollbacks.
4. In the scratch repository, Settings, Pages: choose a **branch** source first (deploy from `main`) to reproduce the production starting state, note what is served, then switch the source to **GitHub Actions** and record what the site serves before the first workflow deployment. This answers the open question in the runbook.
5. Run the `Deploy rehearsal` workflow (Actions tab, Run workflow). Check the run summary file list, the `artifact-files` artifact and the smoke job.
6. Rollback tests: (a) `git revert` the newer commit and push (rehearsed); (b) Run workflow with `ref` set to the first commit's SHA. After either, the page's `rehearsal-build` meta shows the commit that was built and `check-rehearsal.mjs --expect-build <sha>` confirms it.
7. Delete the scratch repository when finished.
