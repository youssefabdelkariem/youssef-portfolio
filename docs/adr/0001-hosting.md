# ADR 0001: Retain GitHub Pages hosting

Status: **Accepted**. Existing owner choice recorded 2026-10-15; evidence wording corrected in M0 review remediation. Owner: repository owner. Related: OPS-01, M0-02; findings C-1, I-2, I-3, I-11.

## Context and decision

The owner requires preservation of the functional GitHub Pages site and `youssef.studio`. Retain that host/domain. Repository contents establish the HTML and CNAME baseline, not current account settings; historical Pages/HTTPS/DNS observations and unverified protection state are qualified in [infrastructure evidence](../SITE_ARCHITECTURE.md#infrastructure-evidence).

Acceptance rests on the explicit owner hosting decision, not an inferred infrastructure audit. It does not accept a framework, pipeline, preview service or settings change. A merge into the recorded publishing source can deploy documentation; the [production gate](../AGENT_WORKFLOW.md#production-and-pr-gate) applies.

## Alternatives and tradeoffs

Retaining Pages matches static delivery and the owner's existing setup. Another static host could offer different previews/build features, but migrating adds domain/configuration risk. Runtime application hosting supports server services that are not currently required and introduces operations/cost.

## Consequences and review

Emit static files and respect the verified [Pages constraints](../SITE_ARCHITECTURE.md#pages-constraints), including published size and soft bandwidth/build limits. Re-evaluate large-film delivery separately. Build/deployment/preview choices belong to [ADR 0006](0006-build-deployment-preview.md). Revisit hosting only if an approved requirement cannot be met or measured scale justifies migration; record a new reviewed decision before changing production.
