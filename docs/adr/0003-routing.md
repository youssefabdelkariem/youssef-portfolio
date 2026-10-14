# ADR 0003: Static route contract

Status: **Proposed**. Recorded: 2026-10-15. Decision owner: owner with technical reviewer; approval pending.
Related: FR-02–FR-05, QA-02, QA-05, QA-09, Q08.

## Context

Only `/` is currently implemented. Project stories need shareable direct URLs and route-specific metadata. GitHub Pages serves static files and a custom 404, rather than arbitrary application server rewrites. A client history router alone cannot guarantee nested refreshes resolve correctly.

## Proposal

Generate one HTML file per approved route, preferably `route/index.html`, with trailing-slash canonicals and ordinary anchor navigation. Client enhancement may improve transitions without owning content availability. Preserve `/`; introduce only approved stable slugs. Candidate routes live in [SITE_ARCHITECTURE](../SITE_ARCHITECTURE.md#proposed-routes-and-seo), not as promises of live pages.

Use a real `404.html` with useful navigation and truthful not-found behavior. Do not mask missing routes with a redirect script that loads every URL as the home page. Decide alias/redirect handling explicitly if an approved URL later changes.

## Alternatives and tradeoffs

- Static multi-page/generated routes: strongest fit for direct entry and SEO; requires template/build discipline and consistent shared navigation.
- Hash routing: works without server rewrites but fragment URLs and metadata complicate shareable case studies; fallback only if owner accepts the tradeoff.
- History API SPA + 404 redirect workaround: convenient for some client apps, but error status, accessibility, initial rendering and indexing risks make it unsuitable as the default.
- One long page: simplest delivery but does not satisfy the dedicated bonus case-study page requirement by itself.

## Base paths and consequences

Custom-domain production uses `/`. A separately approved project-path preview needs its own base-path handling for assets, links, canonicals and sitemap URLs. The current default GitHub Pages URL redirects to the custom domain; do not treat it as an independent preview. Never change `CNAME` or domain settings to test a branch.

## Acceptance gate

M1 tests `/`, one nested route, direct load/refresh, back/forward, copied links, trailing slash behavior, asset paths and a nonexistent route against static production output. Check meaningful HTML without JS and unique metadata/canonical per page. Confirm final slugs with owner. Record base configuration for production and any approved preview before Accepted status.

Revisit if hosting or public URL requirements change. Sources: [GitHub custom 404 behavior](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-custom-404-page-for-your-github-pages-site), [Vite deployment/base guidance](https://vite.dev/guide/static-deploy.html).
