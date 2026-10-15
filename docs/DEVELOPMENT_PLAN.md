# Development plan

## Active milestone

**M1b Aurelia assets, typography, VFX portfolio and case study**, on `feat/m1b-aurelia-portfolio` (worktree from `86799d0`, the pushed homepage refinement head). Owner authorization recorded 2026-10-15: inspect the local Aurelia renders read-only, make derivatives in a working directory, evaluate and adopt Instrument Serif once its licence is verified, and build `/work/` and `/work/aurelia/`. The homepage refinement is the approved baseline, subject to final visual review. Still prohibited without separate authorization: merging to or changing `main`, deploying, DNS or Pages settings, `.nojekyll`, workflows, paid services, committing the selected images, accepting any Proposed ADR, and altering or copying original project files. Root `index.html` and `CNAME` are unchanged; owner-approved M0 documentation remains subject to Q13 before any merge. Status and resume steps: [HANDOFF](HANDOFF.md).

M0's initial scope was 15 new Markdown files plus root README (16 files). Remediation adds ADR 0006 and a compact [finding disposition record](reviews/M0_REMEDIATION.md). The [ADR register](adr/README.md) owns statuses; only hosting records an existing Accepted decision. All proposed future work below needs separate owner authorization.

M0 acceptance (for the M0 commit range `f01e9e0`..`80af31c`, not this branch's later commits): M0-01 through M0-04, valid links/anchors/IDs, coherent proposal/evidence labels, a Markdown-only diff, unchanged production base/files and a recorded commit. Final owner/reviewer approval remains distinct from permission to merge: [production/PR gate](AGENT_WORKFLOW.md#production-and-pr-gate). The remediation record identifies findings whose operational closure still requires owner action.

## M1a - technical architecture validation (Proposed)

Progress: in progress under the owner's 2026-10-15 development authorization; see Implementation status below. The heading label reflects ADR status, not work state.

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

M1a technical work is complete on `feat/m1a-site-foundation` (pushed to origin, head `38283a1` at push time) and awaits owner review of ADRs 0002, 0003 and 0006, Q11 and Q13. No ADR was accepted. The next stage is M1b, detailed in [M1B_PLAN](M1B_PLAN.md); it is Proposed, not started and not authorized.

Done on `feat/m1a-site-foundation`: three-arm fixture comparison ([M1A_EVALUATION](reviews/M1A_EVALUATION.md)); provisional Astro static site with routes `/`, `/work/`, `/work/aurelia/`, `/engineering/`, `/engineering/ibm-ai-racing/`, `/about/`, `/contact/` and a real 404; shared layout, media placeholder, project/slot cards, case-study header and placeholder-notice components; sitemap, robots, favicon (provisional); build-output, browser and docs check scripts. Content is labelled placeholder throughout.

Remaining: owner decision on ADR 0002/0003/0006; Q13 and Q11 reviewer/integrator; real content and asset verification (M1b); hero film/poster pipeline and media-accessibility deliverables; design sign-off (Q06); Lighthouse/YS Mobile v1 measurement on representative content; a hosted-preview and deployment decision (ADR 0006); CI for the verify script (M2); optional Three.js island only if Q10 justifies it.

## M1b progress (updated 2026-10-15)

Phase 1 done: [CONTENT_MANIFEST](CONTENT_MANIFEST.md) (6 owner decisions, 4 verified facts, 8 local candidate groups, 12 missing items, 0 verified assets). Phase 2 done: two local-only design explorations (`/explore/a/`, `/explore/b/`, built only by `npm run build:explore`) with screenshots and a comparison in [M1B_DESIGN_REVIEW](reviews/M1B_DESIGN_REVIEW.md). **Stopped at the design-selection gate**: phases 3-5 wait for the owner to choose a direction and typography route and to supply manifest items M-01 to M-08.

## M1b phase 3 progress (updated 2026-10-15)

Homepage implemented on `feat/m1b-homepage`: sitewide hybrid tokens, new header/footer, `Plate` media slot with placeholder and failure fallback, technical engineering teaser, and eight homepage sections. Decision record: [M1B_HOME_DECISION](reviews/M1B_HOME_DECISION.md). Verification results are in [HANDOFF](HANDOFF.md). **Stopped after the homepage**: the VFX portfolio (phase 4) and Aurelia case study (phase 5) wait for owner review of the homepage and the manifest assets M-01 to M-08.

## M1b homepage refinement (updated 2026-10-15)

Done: mobile headline typography and breaks; refined system typography; font candidates evaluated ([M1B_FONT_EVALUATION](reviews/M1B_FONT_EVALUATION.md), none added); new Featured and Selected VFX composition with placeholders still labelled; hero ready for real artwork (stable box, focal point, art-directed mobile crop); animation comparison, with the transform-based opening kept; verification extended (`test:home`, hero fixtures). Record: [M1B_HOME_DECISION](reviews/M1B_HOME_DECISION.md#visual-approval-and-refinements-2026-10-15). **Stopped for owner review.** Phases 4 (VFX portfolio) and 5 (Aurelia) still need explicit authorization and manifest items M-01 to M-08.

## M1b Aurelia and VFX portfolio progress (updated 2026-10-15)

Done: read-only asset discovery and a 29-frame contact sheet; colour-pipeline validation (Blender AgX reproduces the project's output to within 2 of 65,535 levels); a provisional selection with 36 derivatives (1.79 MB, largest 130 KB) kept out of Git; Instrument Serif verified and adopted for h1 and h2; `/work/` and `/work/aurelia/` implemented with a render-pass viewer; `test:aurelia` added to `npm run verify`. Record: [M1B_AURELIA_MEDIA](reviews/M1B_AURELIA_MEDIA.md). **Awaiting the owner:** confirm the selection and whether shots 001, 003, 004 and 005 are final, approve committing the derivatives, confirm the facts published on the case study, and supply role, credits, brief and the film. Source protection verified (0 originals changed). Not published, not merged.

## M1b hero media selection (updated 2026-10-15)

Four-way hero comparison done and recorded in [M1B_HERO_SELECTION](reviews/M1B_HERO_SELECTION.md): recommendation is to keep the Shot 002 macro lens as the desktop hero and use Shot 003 frame 1 (or Shot 002 frame 72) as the phone crop; no whole-device frame fits the wide desktop hero. Read-only check found newer composites for Shots 003 and 004 but none for Shots 001 and 005. **Stopped at the media-selection approval gate:** no site change, no derivatives committed, originals untouched.

