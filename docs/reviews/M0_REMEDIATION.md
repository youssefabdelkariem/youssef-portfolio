# M0 independent review remediation

Source: the complete user-supplied Claude Code review titled **M0 independent review: `docs/m0-foundation`**, verdict APPROVE WITH CHANGES, against `f01e9e0`. Read in full on 2026-10-15. This record cites its finding IDs rather than copying the review. Corrections are documentation-only; no M1 work, settings change or release was performed.

## Critical findings

| Finding | Disposition | Correction / remaining condition |
| --- | --- | --- |
| C-1 | Resolved with factual correction | [Production gate](../AGENT_WORKFLOW.md#production-and-pr-gate) and [ADR 0006](../adr/0006-build-deployment-preview.md) explain merge-triggered publication. Reject `.nojekyll` as an exposure remedy: bypass is not exclusion. Exact Markdown output URLs depend on build/plugins; do not promise every file becomes a particular `.html` URL. Public repository content is already public on GitHub. |
| C-2 | Resolved | [FR-01a/FR-01b/FR-01c](../REQUIREMENTS.md#confirmed-scope), [routes](../SITE_ARCHITECTURE.md#proposed-routes-and-seo) and [content templates](../CONTENT_PLAN.md#work-index-and-reel) add `/work/`, reel policy and shot evidence/credits with Aurelia prominent. |
| C-3 | Resolved with qualification | [ADR 0006 preview alternatives](../adr/0006-build-deployment-preview.md#preview-alternatives) removes the same-repository hosted project-path assumption. Local subpath compatibility testing is valid; it is not an independent hosted preview. A second repo may inherit a user-site domain. |
| C-4 | Partially resolved; owner action | [Production/PR gate](../AGENT_WORKFLOW.md#production-and-pr-gate) specifies protection, approval and bypass review. Effective protection remains Unverified; the review could not establish that it is absent. Q13 must close before merge, or the owner must explicitly acknowledge unenforced controls and authorize residual risk. No settings were changed. |

## Important findings

| Finding | Disposition | Correction / evidence |
| --- | --- | --- |
| I-1 | Resolved | [ADR 0002](../adr/0002-tech-stack.md) neutrally compares Eleventy/static HTML, Astro, and React/Vite with a named build-time route-rendering candidate. No presumed winner; optional styling/animation/3D libraries stay outside the spike. |
| I-2 | Resolved at documentation level | [Pages constraints](../SITE_ARCHITECTURE.md#pages-constraints) cites current numeric limits, qualifies header-control assumptions and requires compression/cache/range measurements in M1a. Provider behavior is not reported as tested. |
| I-3 | Resolved | [Evidence register](../SITE_ARCHITECTURE.md#infrastructure-evidence) separates repository facts, prior setup observations and unverified current state. The earlier session did inspect settings; that does not constitute this review's fresh verification. |
| I-4 | Resolved with factual correction | [Media accessibility](../CONTENT_PLAN.md#media-accessibility-policy) classifies films. W3C SC 1.2.5 does not generally allow a transcript to replace synchronized-video AA audio description; the review's suggested equivalence is rejected. Record applicable exceptions and unmet criteria explicitly. |
| I-5 | Resolved | [QA-17 and budget protocol](../REQUIREMENTS.md#reference-performance-protocol), [design](../DESIGN_SYSTEM.md#motion-and-fidelity) and [media budget](../adr/0004-media-strategy.md#cinematic-experience-and-budgets) preserve poster-first cinematic enhancement. Delaying autoplay does not exempt it from entry bytes; a larger clip needs explicit play. |
| I-6 | Resolved with qualification | [Fidelity/formats](../adr/0004-media-strategy.md#fidelity-and-formats) covers colour, HDR/SDR, banding, fallback codecs, HLS detection and conditional 3D budgets. Do not mandate H.264 Baseline for all content or assume all non-Safari browsers have identical HLS support. |
| I-7 | Resolved | [Active milestone](../DEVELOPMENT_PLAN.md#active-milestone) is canonical. AGENTS/CLAUDE/README point there rather than imposing permanent M0 restrictions. |
| I-8 | Resolved | [CLAUDE.md](../../CLAUDE.md) uses a real standalone import; [workflow](../AGENT_WORKFLOW.md#claude-instruction-loading) cites current syntax/native-loading caveats. Runtime `/context` remains a later actual-session check, not claimed here. |
| I-9 | Resolved | [Worktree procedure](../AGENT_WORKFLOW.md#worktree-and-integration-procedure) fetches refs, uses `origin/main`, quotes paths and distinguishes continuing the unmerged M0 base. No new worktree is needed for this sequential correction. |
| I-10 | Resolved | [M1a](../DEVELOPMENT_PLAN.md#m1a---technical-architecture-validation-proposed) uses fixtures and named review roles; [M1b](../DEVELOPMENT_PLAN.md#m1b---design-and-content-validation-proposed) owns real content/design/media. Both still need authorization; no M1 starts automatically. |
| I-11 | Resolved | [ADR 0006](../adr/0006-build-deployment-preview.md) owns output/pipeline/preview alternatives, least-privilege validation and separately approved transition/rollback. |

## Minor findings

| Finding | Disposition | Correction / reason |
| --- | --- | --- |
| M-1 | Resolved | Historical initial file count lives only in [DEVELOPMENT_PLAN](../DEVELOPMENT_PLAN.md#active-milestone); gates refer to the scope inventory. |
| M-2 | Resolved | [Evidence/rights gate](../CONTENT_PLAN.md#evidence-and-rights-gate), [AGENTS](../../AGENTS.md) and [ADR lifecycle](../adr/README.md#lifecycle) own claims, execution and statuses respectively; other docs reference them. |
| M-3 | Resolved | [ADR 0005](../adr/0005-ai-collaboration.md) retained for history and trimmed to decision/tradeoff/gate; operating steps live in the workflow. |
| M-4 | Resolved | [YS Mobile v1](../REQUIREMENTS.md#reference-performance-protocol) specifies viewport/DPR, network/CPU, cold runs, host/tool recording and measurement windows; no physical-device equivalence is claimed. |
| M-5 | Resolved | [Focus-ring token](../DESIGN_SYSTEM.md#principles-and-tokens) specifies colour/width/offset and background validation; decorative border is not promoted to a focus indicator. |
| M-6 | Resolved as proposal | [Route table](../SITE_ARCHITECTURE.md#proposed-routes-and-seo) prefers `/engineering/ibm-ai-racing/`; bonus is editorial only. Final slug remains Q08. |
| M-7 | Resolved | FR-05a/FR-05b and QA-14 through QA-18 cover About/contact, favicon/OG, rights/licensing, language and indexing/privacy. No licence/language is invented. |
| M-8 | Resolved | [ADR 0003](../adr/0003-routing.md) now includes FR-01a/FR-01b and OPS-01 traceability. |
| M-9 | Resolved by alternative | AGENTS requires an honest `Agent:` commit-body line. A `Co-Authored-By` trailer is not required without an agreed real identity; no historical author metadata is rewritten. |
| M-10 | Partially resolved; maintenance deferred | This remediation uses automated scratch link/anchor/ID/status/scope checks. The earlier M0 handoff also recorded a local checker, so “manual only” was incomplete; no maintained repository/CI checker existed. [M2](../DEVELOPMENT_PLAN.md#m2---static-portfolio-implementation-proposed) schedules one; no app code/dependencies/CI are introduced now. |

## Merge-readiness and owner decisions

The documentation can return for final review; it is **not authorized for production merge**. Owner must resolve Q13's publication/exposure choice and effective protection/bypass state, approve the corrected candidate, and authorize the merge's production effect. No `.nojekyll`/exclusion/pipeline configuration has been added as a shortcut. Q11 named roles is a prerequisite before any M1a authorization. Other stack/routing/media/design/licensing decisions remain at their respective later gates.

The supplied review is independent evidence about the original candidate, not approval of this correction. ADR statuses remain exactly as the [register](../adr/README.md) states; no finding silently accepts a proposed architecture. Fresh infrastructure tests, actual CGI fidelity/mobile tests and a Claude runtime import check are not claimed by documentation validation.
