# Site architecture

Status: current baseline Confirmed; future architecture **Proposed**. Decisions live in [ADRs](adr/README.md); quality gates live in [requirements](REQUIREMENTS.md).

## Current and protected

`main` contains a root `index.html`, `CNAME` and README. GitHub Pages serves the root of `main` at the custom domain. No framework, dependency, router, backend, CMS or custom build workflow was found. M0 keeps this intact; documentation branches are not previews. Do not replace `index.html` with a development entry point, change Pages source, or edit DNS in M0.

## Proposed rendering and boundaries

Favor static, crawlable HTML per public route with narrowly scoped interaction. Shared content should be structured separately from presentation, with asset metadata (rights, variants, alt, dimensions, captions) validated before publication. No runtime backend is needed for the specified portfolio. Contact initially favors an owner-approved link; a form would require a separate service/privacy decision.

Candidate future boundaries (not directories created in M0): content records; reusable semantic UI; layout/tokens; case-study templates; media loaders; optional motion/3D enhancements; tests/build tooling. Case-study data must not import animation libraries. A media failure must not erase the narrative. Use trusted local content, not unsanitized HTML from third parties.

## Technology evaluation

| Candidate | Value | Cost/risk | Recommendation |
| --- | --- | --- | --- |
| Plain HTML/CSS with small JS | Minimal transfer, crawlable, matches current hosting | Repeated layouts/content can drift | Baseline and fallback; credible option for a small site |
| React | Reusable interactive components and ecosystem | Client JS/hydration cost; a bare SPA does not provide route HTML | Candidate for interactive areas; prove benefit with representative case study |
| Vite | Fast local builds and static asset bundling | Build output must be deployed; does not itself solve SEO/rendering | Candidate tooling, contingent on HTML generation and reviewed deployment plan |
| TypeScript | Content/component contracts and refactoring checks | Tooling and type maintenance | Recommend if a JS application/toolchain is adopted; type-check separately |
| Tailwind CSS | Shared utility vocabulary, generated static CSS | Class-heavy templates and extra build convention | Optional; compare against CSS custom properties/modules before adoption |
| GSAP | Complex timelines and synchronized animation | Extra JS, lifecycle and accessibility obligations | Defer until a specific sequence needs it; CSS/native APIs first |
| Three.js | Fine control over real-time 3D | GPU, battery, model/texture transfer, fallback and cleanup complexity | Optional later experiment; rendered CGI is the default showcase |
| React Three Fiber | React integration for Three.js scenes | Requires React/Three.js and rendering expertise; not inherently a speed fix | Consider only if React and an actual 3D interaction are justified |
| Static-first generator (e.g. Astro) | Generated route HTML, selective interactive islands | Additional framework/content convention | Compare in M1 with Vite multi-page/prerender approach |

ADR 0002 recommends evaluating React + Vite + TypeScript against a static-first alternative; it does not authorize installing the entire list. No versions are selected in M0. Select compatible maintained versions, runtime and one package manager during an approved M1 scaffold, then pin a lockfile.

## Proposed routes and SEO

| URL candidate | Purpose / requirement |
| --- | --- |
| `/` | Intro, selected work and flagship entry (FR-01, FR-02) |
| `/work/aurelia/` | Flagship case study (FR-02) |
| `/engineering/` | Mechatronics/CAD selection (FR-03) |
| `/engineering/<approved-slug>/` | Evidence-backed individual engineering case study (FR-03) |
| `/bonus/ai-racing/` | Dedicated bonus racing story (FR-04); final title/slug Q08 |
| `/about/`, `/contact/` | Approved biography and contact path (FR-05) |

Additional CGI case-study slugs require real content. This table defines candidate URLs, not live links. Keep `/` working throughout. Prefer generated `path/index.html` files, trailing-slash canonical URLs and route-specific metadata. A custom `404.html` should explain the error and link home; do not use an opaque 404-to-SPA redirect hack. Hash routing is a fallback option, not the preferred SEO story. See [ADR 0003](adr/0003-routing.md).

GitHub Pages serves static files, without arbitrary server-side rewrite rules or runtime server rendering. Test direct entry, refresh, back/forward, unknown routes and asset paths. Production custom-domain base is `/`; a future independent project-path preview may need `/youssef-portfolio/` or another explicit base. Never change production domain bindings to obtain a preview.

Each released page needs meaningful delivered HTML, unique title/description, canonical, social preview, accurate image alt and heading structure; sitemap/robots handling belongs to the eventual build. Do not add schema that invents job titles, organizations or awards.

## Media and release boundary

Posters and responsive images precede user-triggered film. Long CGI films/master renders stay out of Git history until a delivery choice is approved; see [ADR 0004](adr/0004-media-strategy.md). Optional WebGL is lazy and recoverable. Enforce the proposed transfer budget before visual effects.

Future build-based deployment will need an explicitly reviewed change from today's branch/root source, or another reviewed artifact-publishing arrangement. Keep domain preservation, least-privilege workflow permissions, trusted dependencies, immutable candidate review, and rollback in that plan. M0 creates no workflows and makes no deployment changes.

## Primary technical references

Reviewed 2026-10-15; documentation can change. These support evaluation, not adoption.

- [React application choices](https://react.dev/learn/creating-a-react-app)
- [Vite static deployment and base paths](https://vite.dev/guide/static-deploy.html)
- [TypeScript handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Tailwind with Vite](https://tailwindcss.com/docs/installation/using-vite)
- [GSAP media queries and cleanup](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/)
- [Three.js documentation](https://threejs.org/docs/)
- [React Three Fiber performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance)
- [GitHub Pages custom 404](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site)
