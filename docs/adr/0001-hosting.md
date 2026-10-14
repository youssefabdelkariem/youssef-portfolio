# ADR 0001: Retain GitHub Pages hosting

Status: **Accepted** (existing owner-selected hosting decision recorded 2026-10-15).
Decision owner: repository owner. Related: OPS-01, M0-02.

## Context and evidence

The owner explicitly states the existing GitHub Pages site is functional and must remain intact. The inspected repository uses `main` / root publication, root HTML and a `CNAME` for `youssef.studio`. The earlier setup established HTTPS enforcement. This ADR records continuity; it does not claim a fresh production audit or authorize changing those settings in M0.

## Decision

Retain GitHub Pages and the current custom domain. Keep M0 entirely on a documentation branch, with no deployment/DNS changes. Static files are the delivery boundary. A future build pipeline is a separate implementation decision and review gate, not already approved by this ADR.

## Alternatives and tradeoffs

- Retain Pages: fits a public static portfolio and the owner's hosting preference; limited to static delivery and requires care with direct routes and built assets.
- Cloudflare Pages or another static host: offers different preview/build features, but migration adds configuration and domain risk without an M0 requirement.
- Managed app/server hosting: supports runtime services but adds cost/operations that the current portfolio does not require.

## Consequences and safeguards

Design for static output and valid real files at public routes. Do not rely on server-side rewrites, runtime APIs or secrets shipped to clients. Maintain a reviewed rollback path for future releases. Keep `CNAME` and custom-domain behavior intact when a later pipeline is approved. Hosting costs/limits must be rechecked if media scale or service use changes; no numerical quota is assumed here.

## Review and revisit

Acceptance justification: existing infrastructure plus the owner's explicit preservation requirement. Revisit if static hosting cannot meet an approved requirement, media delivery exceeds practical limits, or preview/deployment needs justify a separately reviewed migration. Document new evidence and a replacement ADR before migration.

Sources: [GitHub Pages overview](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages), [publishing sources](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
