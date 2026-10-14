# Development plan

## Active milestone

**M1a technical validation plus provisional site foundation**, on `feat/m1a-site-foundation` (worktree from reviewed M0 commit `80af31c`). Owner authorization recorded 2026-10-15: develop the site on an isolated feature branch while Codex is unavailable. Still prohibited without separate authorization: merging to or changing `main`, deploying, DNS or Pages settings, `.nojekyll`, workflows, paid services, accepting any Proposed ADR, and removing the existing production page. The root `index.html` and `CNAME` are unchanged on this branch. Owner-approved M0 documentation remains subject to Q13 before any merge. Current status and resume steps: [HANDOFF](HANDOFF.md).

M0's initial scope was 15 new Markdown files plus root README (16 files). Remediation adds ADR 0006 and a compact [finding disposition record](reviews/M0_REMEDIATION.md). The [ADR register](adr/README.md) owns statuses; only hosting records an existing Accepted decision. All proposed future work below needs separate owner authorization.

M0 acceptance (for the M0 commit range `f01e9e0`..`80af31c`, not this branch's later commits): M0-01 through M0-04, valid links/anchors/IDs, coherent proposal/evidence labels, a Markdown-only diff, unchanged production base/files and a recorded commit. Final owner/reviewer approval remains distinct from permission to merge: [production/PR gate](AGENT_WORKFLOW.md#production-and-pr-gate). The remediation record identifies findings whose operational closure still requires owner action.

## M1a - technical architecture validation (Proposed)

Progress: in progress under the owner's 2026-10-15 development authorization; see Implementation status below. The heading label reflects ADR status, not work state.

Prerequisites: explicit scope authorization, owner-named reviewer/integrator and exclusive ownership comment (Q11). Uses labelled local fixtures; does not depend on portfolio assets, public copy or Q01–Q06. No production/settings changes.

Time box: proposed maximum two focused engineering days, with a checkpoint after the first; owner approves duration. If unfinished, report evidence/gaps rather than expanding automatically.

Scope and acceptance:

1. Compare the three ADR 0002 arms on identical home, `/work/` and nested case-study fixtures. Record actual delivered HTML/metadata, initial JS/transfer, keyboard/reduced-motion behavior and time/steps to add a case study. Name the React build-time renderer and hydration plan. Select nothing without evidence and owner review.
2. Validate direct entry/refresh/back/forward, assets, slash/canonical behavior and real 404 against local static production output. Use a local subpath test only for compatibility, not as a claimed hosted preview. Record Q07/Q08 recommendations.
3. Resolve the technical Q14 preview/pipeline recommendation in ADR 0006. Local static serving suffices for this spike; Actions artifacts are downloadable output, not live previews. Any hosted preview requires separate authorization and verified domain isolation.
4. Use YS Mobile v1 from [requirements](REQUIREMENTS.md#reference-performance-protocol); report actual tools/versions and results. A named browser/runtime/package-manager/lockfile is introduced only if that experiment is explicitly authorized. No Tailwind/GSAP/R3F comparison is required.
5. Specify cache-header, content-hash, compression and video byte-range probes. Run them only against local fixtures or an approved read-only endpoint; distinguish local from production observations. Record `Content-Encoding`, `Vary`, cache headers, `206`/`Content-Range` and seek behavior. No CDN/proxy capability is assumed.

Gate: reviewed comparison/output and route/preview evidence, Q12 target review, updated Proposed ADRs ready for owner decision. Missing content is not a blocker to M1a. Passing fixtures does not validate final film quality or authorize deploying a pipeline.

## M1b - design and content validation (Proposed)

Owner-dependent stream after technical direction is available; gathering evidence may run alongside an authorized M1a without conflicting edits. Resolve Q01–Q06, Q09 and Q15; evaluate Q10 rather than adding WebGL by default.

Acceptance: verified content/rights manifest; Aurelia and representative CGI/VFX breakdown packets; reel availability/credits/accessibility classification; engineering/racing evidence plan; approved biography/contact/language direction; favicon/OG licensing direction; annotated design/reference review including focus and responsive layouts. Run actual footage through the media/fidelity/mobile protocol and choose or explicitly defer hosting/renditions with costs/privacy known. Record blockers when assets/approval are missing. Complete applicable QA-12 through QA-18 checks; no fictional work fills missing content.

M1b cannot be declared complete from fixtures. Architecture/media adoption requires the respective ADR gate and owner approval. Neither M1a nor M1b changes production under this plan.

## M2 - static portfolio implementation (Proposed)

After the needed architecture, design and content decisions are approved, implement semantic layouts, work index/reel policy, case-study templates and verified content on isolated branches. Establish stack-appropriate build/type/lint/tests and a dependency-free or approved Markdown-link check (M-10). Test combined built output, not only development mode. Acceptance: approved routes/content, quality budgets and accessible fallbacks; protected candidate ready for release review. Completion does not itself authorize deployment.

## M3 - media and optional enhancements (Proposed)

Complete approved films/breakdowns, engineering work and the racing page. Add GSAP/WebGL only for an approved visitor goal with lifecycle/fallback and measured budgets. Acceptance: FR scope fulfilled, QA checks on actual content, content approval and no mobile regressions. A static, high-quality release is acceptable without these optional libraries.

## M4 - release (Proposed)

Meet ADR 0006 and the production/PR gate, freeze candidate/rollback hashes, obtain explicit release authorization, and use only the approved publishing procedure. Verify actual HTTPS, routes, metadata/media/contact/404, redirects, compression/cache/ranges and exclusion of source-only documentation. Record failures and restore the approved known-good artifact/commit if needed; DNS changes are not a routine rollback.

## Implementation status (updated 2026-10-15)

Done on `feat/m1a-site-foundation`: three-arm fixture comparison ([M1A_EVALUATION](reviews/M1A_EVALUATION.md)); provisional Astro static site with routes `/`, `/work/`, `/work/aurelia/`, `/engineering/`, `/engineering/ibm-ai-racing/`, `/about/`, `/contact/` and a real 404; shared layout, media placeholder, project/slot cards, case-study header and placeholder-notice components; sitemap, robots, favicon (provisional); build-output, browser and docs check scripts. Content is labelled placeholder throughout.

Remaining: owner decision on ADR 0002/0003/0006; Q13 and Q11 reviewer/integrator; real content and asset verification (M1b); hero film/poster pipeline and media-accessibility deliverables; design sign-off (Q06); Lighthouse/YS Mobile v1 measurement on representative content; a hosted-preview and deployment decision (ADR 0006); CI for the verify script (M2); optional Three.js island only if Q10 justifies it.
