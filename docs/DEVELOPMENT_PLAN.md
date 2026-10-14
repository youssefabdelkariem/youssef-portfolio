# Development plan

Status: M0 authorized; later milestones **Proposed** and independently scoped. No dates, budgets or asset completion are promised. Dependencies and questions are tracked in [requirements](REQUIREMENTS.md).

## M0 — documentation foundation

Deliver the requested 16 Markdown files on `docs/m0-foundation`, with a reviewable commit history. Inspect the current repository, record the baseline, articulate the vision and candidate architecture, and establish shared agent instructions. Hosting is Accepted; ADRs 0002–0005 remain Proposed.

Acceptance: M0-01–M0-04 pass; all relative links/anchors resolve within the documentation set; statuses and IDs agree; public claims are separated from proposals and unknowns; no changes to `index.html`, `CNAME`, dependencies, workflows, settings or DNS; no merge into `main`. Record checks and coverage limits in the handoff, not invented application test results.

## M1 — architecture and content validation (Proposed)

Purpose: remove the highest-risk uncertainties before portfolio implementation. Requires a new owner-approved scope after M0 review. Work on an isolated branch/worktree; production remains unchanged.

Scope:

1. Resolve Q01–Q09 and Q11–Q12 as far as owner evidence allows; record explicit blockers for missing content. Review Q10 rather than automatically adding 3D.
2. Gather a verified asset inventory and a representative Aurelia content packet. If real assets are unavailable, use clearly labelled neutral fixtures only in a private/local technical experiment.
3. Compare a static-first option against React + Vite + TypeScript with generated route HTML. Limit any authorized experiment to one home entry and one nested case-study skeleton. No production UI rollout.
4. Validate direct route load/refresh, HTML content and metadata, responsive image/poster loading, keyboard/reduced-motion behavior and initial transfer size. Record actual build commands, runtime/package manager, versions and coverage limits if scaffolding is explicitly authorized.
5. Finalize routing, media delivery, visual direction and an isolated preview/release plan. Owner review precedes changing ADR statuses.

Acceptance criteria:

- A comparison report names the selected rendering method, output shape, reasons, rejected alternatives and measured tradeoffs; ADR 0002 can be Accepted only with that evidence and approval.
- At least `/` and one nested candidate route work by direct static-server entry and refresh, with meaningful HTML and unique metadata. A missing route produces a real accessible 404. ADR 0003 records the reviewed URL contract.
- An asset manifest records provenance, rights, readiness, sizes and accessibility needs; absent items are explicitly blocked, never fabricated.
- A representative mobile media test supports ADR 0004's hosting/budget recommendation; costs/privacy requirements are known before provisioning anything.
- QA-01–QA-11 targets are reviewed; measured results and untested devices are reported separately. Budget failures have an agreed response, not silent exceptions.
- The Codex/Claude ownership/review model and integrator are agreed, satisfying ADR 0005's gate. No same-file concurrent edits.
- `main`, live HTML, domain and deployment configuration remain unchanged. Dependencies or scaffold files appear only within an explicitly authorized experiment; no M0 proposal alone authorizes them.

Do not call M1 complete if the prototype works but architecture/content approval is missing. Record the dependency and stop the affected stream.

## M2 — static portfolio foundation (Proposed)

After M1 decisions are Accepted, implement semantic layouts, approved tokens, navigation, case-study templates and verified content on a feature branch. Establish build/type/lint/check commands appropriate to the selected stack. Add meaningful tests for route generation, navigation and essential content. Provide a production-build preview without rebinding the live domain.

Acceptance: approved routes and core content work without decorative JS; QA gates are exercised on representative pages; content and accessibility review passes; build output preserves the custom domain under the approved deployment plan. Review may approve a release separately; completion does not itself authorize deployment.

## M3 — media, motion and technical storytelling (Proposed)

Add approved films, responsive renders, breakdowns, engineering projects and the racing page. Add GSAP or WebGL only if approved needs and measured budgets justify them. Pause/offscreen and fallback behavior must work; static narratives stay complete. Review every claim, credit and asset before publication.

Acceptance: FR-01–FR-06 have approved evidence and visible journeys; keyboard, touch, reduced motion and media failure all pass; mobile performance is within accepted budgets or approved exceptions; no avoidable heavy transfer at entry.

## M4 — release and post-release verification (Proposed)

Freeze a reviewed candidate commit, run the full production-build matrix, verify direct URLs/SEO/404/contact/media and record a rollback commit. Obtain explicit release authorization. Only then apply the separately approved deployment procedure. After release, verify HTTPS, domain preservation, redirects, core routes and content. If essential content or navigation fails, restore the known-good release using the approved rollback method; do not change DNS as a reflex.

## Task sizing and definition of done

Each task names requirement IDs, base commit, owner, exclusive file scope, acceptance evidence and reviewer. Done means reviewed implementation/documentation, actual checks recorded, affected specs/ADRs updated, no unauthorized scope, and a clean handoff. A milestone advances through its gate; elapsed time or a completed code patch does not substitute for approval.
