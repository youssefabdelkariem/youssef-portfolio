# M1b plan: visual identity, homepage, VFX portfolio, Aurelia

Status: **Phases 1-5 authorized and implemented as drafts (2026-10-15), pending owner review of the selection and content; phases 6-7 (full verification with approved media, release review) remain Proposed.** Homepage: [M1B_HOME_DECISION](reviews/M1B_HOME_DECISION.md). Results: [CONTENT_MANIFEST](CONTENT_MANIFEST.md), [M1B_DESIGN_REVIEW](reviews/M1B_DESIGN_REVIEW.md). Prepared 2026-10-15 by Claude Code. It elaborates [M1b in the development plan](DEVELOPMENT_PLAN.md#m1b---design-and-content-validation-proposed); the plan and [requirements](REQUIREMENTS.md) remain authoritative. Starting needs explicit owner authorization recorded in the active-milestone section. Nothing here accepts an ADR.

## Goal and boundaries

Replace the provisional look and placeholders with an owner-approved identity and real, verified content for three surfaces: the homepage, the VFX portfolio (`/work/`) and the Aurelia case study. Engineering, racing, About and Contact keep their current placeholders unless the owner supplies material earlier. No deployment, merge, DNS or Pages change is part of M1b.

## Owner inputs required first

Without these, the corresponding work stays a placeholder and is reported as blocked, not invented.

| Need | Used for | Requirement / question |
| --- | --- | --- |
| Audience priority (creative-first or engineering-first) | Homepage hierarchy and copy | Q01 |
| Visual references (3-6 sites, films, brands you like), any existing logo or colour preferences, and approval to use or replace the provisional serif display + system font stack; font licences if you choose a webfont | Identity, type, tokens | Q06 |
| Wordmark/monogram decision (the current favicon and "Youssef Studio" wordmark are provisional) | Header, favicon, OG image | Q06, QA-14 |
| Approved hero line and short positioning copy (current line is provisional) | Homepage | Q01 |
| Aurelia: poster still plus 3-6 finished frames as full-resolution exports you choose and have rights to publish | Homepage hero/featured, `/work/`, case study | Q02, FR-02 |
| Aurelia: the film (or a cut) with a decision on public release, plus captions, and audio description or a text alternative; music/voice rights | Playback, QA-12 | Q02, QA-12 |
| Aurelia: your actual role, credits and collaborators, dates, and tools genuinely used | Fact panel and workflow | Q02 |
| Aurelia: 1-2 breakdown sets (e.g. plate, passes, composite) with the shot or frame each came from | Shot breakdowns | FR-01b |
| Aurelia: the real production stages you performed (confirm or delete the four candidate stages now shown) | Workflow section | CONTENT_PLAN |
| Other CGI/VFX projects worth showing, if any, with the same evidence; whether a showreel exists | `/work/` index | FR-01a, FR-01c |
| Decision on categories (CGI and Compositing now) | `/work/` structure | FR-01a |
| Licence choice for code and for creative assets | Release | Q15 |

## Technical and process decisions needed (owner with reviewer)

- ADR 0002 stack decision (Astro provisionally recommended), ADR 0003 route/slug confirmation (Q08), ADR 0006 pipeline and preview approach (Q14). M1b can proceed on the provisional stack at the owner's risk; changing stacks later costs rework.
- Q11: name a reviewer and integrator. Q12: confirm the performance and accessibility targets and available real devices.
- Q13: merge-to-publish exposure and `main` protection. Needed before anything reaches `main`, not before M1b design work on the branch.
- Q09: video host, budget and renditions. Needed once the Aurelia film's real size and duration are known.

## Proposed work, in order

Each phase ends with a short owner review; the next starts only on approval.

1. **Intake (blocked on inputs above).** Create the content manifest (source, rights, credits, accessibility class, dimensions, byte sizes). Select derivatives; originals stay out of the repository. Output: a manifest and a blocked-items list.
2. **Identity and art direction.** Reference review, then two short static directions for the homepage hero and a case-study section, as screenshots or a throwaway branch page. Owner picks one; tokens, type scale, focus ring and motion rules are updated in [DESIGN_SYSTEM](DESIGN_SYSTEM.md). Output: approved direction and token file.
3. **Premium homepage.** Real poster-first hero from an approved Aurelia still, a restrained motion treatment (CSS first, QA-17), featured work, clear paths to Aurelia, work and engineering. Output: homepage on the branch with measured entry weight.
4. **VFX portfolio.** Reusable project card with real media, category structure, honest empty states, showreel entry only if a reel exists. Output: `/work/` with Aurelia leading.
5. **Aurelia case study.** Hero poster and explicit-play film, facts panel with verified role and credits, finished frames with captions, labelled breakdowns with keyboard and static alternatives, and a workflow section reduced to what you actually did. Output: complete case study with QA-12 deliverables or an explicit gap list.
6. **Verification.** Responsive image pipeline, fidelity comparison against reference frames (colour, banding), the YS Mobile v1 protocol on `/`, `/work/` and the case study, keyboard and reduced-motion checks, `npm run verify`, plus Firefox, Safari and a real phone if available. Output: recorded results and limits; budget exceptions need your approval.
7. **Handoff and review.** Update HANDOFF, DEVELOPMENT_PLAN, CONTENT_PLAN and, where evidence changes a decision, the Proposed ADRs; independent review of the full diff.

## Acceptance

- Every public fact and asset on the three surfaces is in the manifest as owner-approved, or is removed or placeholder-labelled.
- QA-01 to QA-09, QA-12, QA-13 and QA-17 results recorded for the three surfaces, with untested items stated.
- Owner signs off on the identity and the three surfaces. ADR statuses change only on recorded owner approval.

## Preview workflow for reviewing visual development (recommended)

GitHub Pages serves one site per repository from the source configured for it (today `main`), so a branch cannot be previewed there without changing production settings, which is out of scope ([ADR 0006](adr/0006-build-deployment-preview.md)). Recommended, in order of safety:

1. **Local production preview (use now, no authorization needed).** On the branch run `npm ci`, `npm run build`, `npm run preview`, and open the printed localhost address. Review real devices on the same Wi-Fi with `npm run preview -- --host` only on a trusted network. Screenshots at 390, 768 and 1440 px can be attached to review comments.
2. **Downloadable build artifact (needs a small workflow; separate authorization).** A workflow that runs `npm run verify` and uploads `dist/` as a build artifact with no deploy permission, so the reviewer can download and serve it locally. It is not a live preview.
3. **Shareable URL (only if you want one; separate authorization and verification).** A static preview host or a second repository, with `noindex`, no access to the production domain, and a check that it does not inherit `youssef.studio` (ADR 0006 notes user-site domains can be inherited). Review cost, privacy and access control first. Never repoint DNS, `CNAME` or the Pages source for previews.

Until option 2 or 3 is authorized, review means option 1 plus screenshots.

## Risks

- Real Aurelia files are large; the repository must receive only approved derivatives.
- Premium motion competes with the 1 MB entry budget; the poster-first rule decides, not the effect.
- Unresolved rights or credits block the case study; placeholders stay until resolved.
- Identity work is subjective; the two-direction step limits rework.
