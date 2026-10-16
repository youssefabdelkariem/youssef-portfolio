# Site architecture

Future architecture is **Proposed**; the [ADR register](adr/README.md) owns statuses. Review traceability: C-1, C-2, C-3, I-1, I-2, I-3, M-6, M-7, M-8 in [M0 remediation](reviews/M0_REMEDIATION.md).

## Infrastructure evidence

| Claim | Evidence / current confidence |
| --- | --- |
| Production-branch contents | `origin/main` fetched on 2026-10-15 remains `c882895442ae6721e13bb59600dc8f84915f9eee`; README, HTML and CNAME inspected; no package manifest or custom workflow |
| Custom-domain file | Repository fact: `CNAME` contains `youssef.studio`; this alone does not prove active Pages settings or DNS |
| Pages source `main` / root | Observed during the earlier 2026-10-14 browser setup; not reverified in this remediation. Treat as the production-risk assumption until a fresh read-only check before merge |
| HTTPS/enforcement | Earlier setup recorded valid HTTPS responses and enabled enforcement; not a fresh independent verification or guarantee of current state |
| Cloudflare DNS/proxy | Earlier setup observed Cloudflare nameservers and changed apex/`www` to DNS-only. Current delegation/proxy/cache behavior is not reverified here; do not assume Cloudflare proxies website traffic |
| Branch protection / PR requirements | **Unverified**. Neither presence nor absence is established by local Git. Owner must verify and record effective rules and bypasses before merge |

Do not infer account configuration from source files or the reviewer's lack of `gh`. A future check records date, method and result; repository facts, historical observations and current external verification remain distinct.

## Pages constraints

Primary documentation checked 2026-10-15; recheck before pipeline adoption.

| Constraint | Architectural consequence / verification |
| --- | --- |
| Static hosting; one project site per repository | No runtime server, arbitrary application rewrites or per-branch Pages sites; emit actual route HTML. [Overview](https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages) |
| Branch publishing source is root or `/docs`; changes to the source can publish | A Markdown-only merge can deploy. Custom Actions can publish a selected artifact instead. [Publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) |
| Published site <= 1 GB; source repository recommended <= 1 GB | Keep master renders/films outside Git; measure delivered artifact size. [Limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) |
| Soft bandwidth 100 GB/month; deployment timeout 10 minutes | Model video bandwidth and build time before choosing delivery. [Limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) |
| Soft 10 builds/hour; that limit does not apply to custom Actions builds/publishing | Batch work; Actions still has its own applicable quotas. [Limits](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits) |
| No documented per-site arbitrary response-header configuration in the Pages interfaces reviewed | Do not assume repo files can set cache/security headers. Use content-hashed immutable asset names; measure actual cache, Brotli/gzip and video Range behavior in M1a where a safe endpoint exists, and again after an authorized deployment |

The default GitHub project URL and custom domain refer to the same published site, not independent previews. A user-site custom domain can also be inherited by project sites unless overridden; a separate repository alone does not guarantee an isolated hostname. [Custom domains](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages). Preview isolation and publication controls belong to [ADR 0006](adr/0006-build-deployment-preview.md).

## Neutral stack comparison

M1a compares the same fixture content, interactions and routes in three arms; none is the default winner:

| Arm | Value | Evidence needed |
| --- | --- | --- |
| Eleventy/static HTML with small JS | Direct HTML, small runtime, straightforward delivery | Template reuse versus manual duplication; case-study authoring cost |
| Astro static output with optional islands | Generated route HTML and selective interactivity | Actual hydrated bytes and authoring/build complexity |
| React + Vite + build-time prerendering | Shared interactive components and optional typed contracts | Named rendering method, route HTML, hydration correctness and total complexity |

See [ADR 0002](adr/0002-tech-stack.md) for the candidate React `prerenderToNodeStream` build-time route renderer and comparison rubric. Vite is build tooling, not automatic prerendering. TypeScript is an optional contract choice; Tailwind, GSAP, Three.js and React Three Fiber remain separately justified later options, not M1a selection requirements. No versions or framework are adopted in M0.

## Proposed routes and SEO

| Candidate URL | Purpose / traceability |
| --- | --- |
| `/` | Cinematic introduction and selected work; FR-06, QA-17 |
| `/work/` | Dedicated CGI/VFX index, Aurelia prominent, reel access; FR-01a, FR-01c |
| `/work/aurelia/walkthrough/` | **Not built.** Internal draft route injected only when `src/data/walkthrough-publication.json` is approved (or in a local `build:preview`); excluded from `dist/`, the sitemap, navigation and page text until then; FR-01b |
| `/work/aurelia/` | Flagship CGI case study; FR-02, FR-01b |
| `/work/<approved-slug>/` | Other evidenced CGI/VFX studies and shot breakdowns; FR-01b |
| `/engineering/` | Engineering index with one featured project (IBM AI Racing, with a telemetry trace and key figures), a linked contents list of its case study, the disciplines the evidence supports and verified tools; FR-03. Verified work only. Implemented |
| `/engineering/<approved-slug>/` | Further engineering case studies, added only after their evidence is verified and approved; FR-03 |
| `/engineering/ibm-ai-racing/` | Dedicated IBM AI Racing League / TORCS case study with a measured speed chart, lap ladder and run table drawn at build time from `src/data/racing*`; FR-04, Q08. Implemented, pending owner approval. Two verified outbound links (GitHub, YouTube), no embeds |
| `/about/` | Concise page limited to owner-confirmed scope and links to the two documented projects; FR-05a. Implemented |
| `/contact/` | **Not built.** Removed on 2026-10-16 because no verified, owner-approved contact destination exists; it returns with one (FR-05b, Q05). The nav, homepage and footer carry no contact link |

Racing is engineering work with an optional bonus label in navigation; the URL should not encode temporary editorial framing. All slugs await owner review. Keep `/` working. Prefer `route/index.html`, normal links and a real `404.html`; no opaque SPA fallback redirects. Cross-document transitions are optional enhancements. [ADR 0003](adr/0003-routing.md) defines route tests.

Production custom-domain base is `/` if the recorded binding remains active. Test nested-path compatibility locally or on an explicitly independent host; a path setting is not a preview environment. Unique metadata, favicon/OG assets, sitemap/canonicals and approved language follow QA-05, QA-14, QA-16 and QA-18. Preview indexing controls are not privacy controls.

## Content and enhancement boundaries

Keep structured project evidence separate from templates and optional motion/media loaders. Core narrative and navigation are delivered as HTML; no canvas-only content. No backend is presently required. Responsive images/posters precede films; [ADR 0004](adr/0004-media-strategy.md) governs fidelity and delivery. External forms, analytics or players require a reviewed need/privacy/cost decision. Build output must exclude source-only documentation unless the owner explicitly approves publishing it; see the [production gate](AGENT_WORKFLOW.md#production-and-pr-gate).

## Provisional implementation (feature branch, 2026-10-15)

Not deployed and not an accepted decision ([ADR 0002](adr/0002-tech-stack.md) is Proposed). Evidence: [M1A_EVALUATION](reviews/M1A_EVALUATION.md).

| Aspect | State |
| --- | --- |
| Stack | Astro 7 static output (`output: 'static'`, `format: 'directory'`, `trailingSlash: 'always'`), TypeScript strict, plain CSS custom properties from [DESIGN_SYSTEM](DESIGN_SYSTEM.md); no UI framework, Tailwind, GSAP or Three.js |
| Source layout | `src/pages/` routes; `src/layouts/BaseLayout.astro` (metadata, canonical, skip link, nav, reveal script); `src/components/` (`Plate`, `BreakdownViewer`, `LapSparkline`, `SpeedChart`, `LapLadder`, `Architecture`, `Pending`; the unused `Media`, `ProjectCard`, `SlotCard`, `TechPlate` and `CaseHero` components and `src/data/projects.ts` were deleted on 2026-10-16); `src/data/` typed site and project records with a content-readiness `status`; `src/styles/global.css`; `public/` (favicon, robots) |
| Routes built | `/`, `/work/`, `/work/aurelia/`, `/engineering/`, `/engineering/ibm-ai-racing/`, `/about/`, `404.html`; sitemap excludes 404. Slugs remain Proposed (Q08) |
| JavaScript | One tiny inline reveal observer. Content is visible without JS and with reduced motion. Zero external JS bundles |
| Motion | CSS only: hero light sweep, reveal fade, CSS cross-document `@view-transition`; all gated by `prefers-reduced-motion` |
| Future 3D | Add as an Astro island (`client:visible`, dynamic import) on one route only; not implemented, no `three` dependency (Q10) |
| Publishing | Build output is `dist/`. No workflow, `CNAME` copy or Pages change exists; the Actions/CNAME handling is an [ADR 0006](adr/0006-build-deployment-preview.md) decision. Do not publish the repository root |

## Homepage implementation (feature branch `feat/m1b-homepage`, 2026-10-15)

Still Proposed and not deployed. `/` now implements the approved hybrid identity ([M1B_HOME_DECISION](reviews/M1B_HOME_DECISION.md)). Reusable pieces: `Header` and `Footer` (shared by every page through `BaseLayout`), `Plate` (real-media slot with placeholder and failure fallback), `TechPlate` (technical SVG accent), tokens in `global.css`, editorial components in `editorial.css`, and media references in `src/data/home.ts`. Other routes keep their M1a content and inherit only tokens, header and footer. JavaScript is still one small inline script (scroll reveal and image-failure fallback); no new dependencies.

## Media and portfolio pages (feature branch `feat/m1b-aurelia-portfolio`, 2026-10-15)

Still Proposed and not deployed. `/work/` and `/work/aurelia/` are implemented. Derivatives are looked up at build time from `public/media/aurelia/manifest.json` by `src/data/media.ts`, and the owner-approved set is committed there. If the folder or an entry is missing, every picture is null and pages render labelled placeholders, so the site builds and passes `npm run verify` either way. Tooling: `scripts/aurelia/` (derivative pipeline, sync). Checks: `npm run test:aurelia` verifies AVIF decoding, the hero source at the 560 px breakpoint, the render-pass viewer from the keyboard, and the placeholder-only mode.

## M3 additions (2026-10-16)

`FilmPlayer` (dormant, `src/data/aurelia-film.json`), `src/walkthrough/` with `walkthrough.json` and the publication gate, `aurelia-passes.ts` shared by the case study and the walkthrough, `LapSparkline`. New checks: `test:publication`, `test:film`. Optional launch assets (`og-image.png`, `icon-192.png`, `apple-touch-icon.png`) are emitted as tags only when the approved file exists in `public/`.

