# ADR 0003: Static route contract

Status: **Proposed**. Updated 2026-10-15. Owner: repository owner with technical reviewer. Related: FR-01a, FR-01b, FR-02, FR-03, FR-04, FR-05a, FR-05b, OPS-01, QA-02, QA-05, QA-09, Q08; findings C-2, C-3, M-6, M-8.

## Context and proposal

Only `/` currently exists. Generate real HTML for approved public routes, preferably `route/index.html`, with trailing-slash canonicals and ordinary anchors. A client history router does not provide Pages server rewrites. [SITE_ARCHITECTURE](../SITE_ARCHITECTURE.md#proposed-routes-and-seo) owns candidate URLs, including `/work/`, Aurelia and the dedicated `/engineering/ibm-ai-racing/` proposal. Bonus is an optional navigation label; the racing story remains a standalone engineering page.

## Alternatives and tradeoffs

Static generated pages fit direct-entry/SEO needs but require consistent shared templates. Hash routing avoids server rewrites but compromises the proposed URL/metadata story. History routing plus a catch-all redirect can conceal real errors; prefer a genuine helpful `404.html`. A single long page alone cannot satisfy the dedicated racing case study.

## Base paths and preview consequences

The recorded custom-domain production base is `/`. The default GitHub project URL is not an independent branch preview; the repository has one Pages site. A second repository may inherit a user-site domain, so its independence must be verified too. A local test under a subpath tests path compatibility only. Do not rebind CNAME/domain/settings for previews. [ADR 0006](0006-build-deployment-preview.md) owns the alternatives and authorization.

## Acceptance gate

M1a tests home, work index, nested case-study fixtures, direct entry/refresh, back/forward, trailing slashes, relative assets, real not-found status, meaningful HTML without JS and unique metadata. Owner confirms stable slugs; M1b validates actual content labels. Record production versus approved-preview canonicals/indexing behavior before acceptance. Revisit when hosting or the public URL contract changes.

Sources and verified hosting constraints: [Pages constraints](../SITE_ARCHITECTURE.md#pages-constraints).
