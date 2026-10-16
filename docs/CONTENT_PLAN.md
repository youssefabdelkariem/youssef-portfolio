# Content and evidence plan

Scope is owner-confirmed; inventory readiness is Unknown; editorial templates are Proposed. Related findings: C-2, I-4, I-5, I-6, M-2, M-6, M-7; see [remediation](reviews/M0_REMEDIATION.md).

## Inventory

No portfolio assets have been verified for publication in this repository. A project title is not a completed content packet.

| Group | Required evidence | Requirements |
| --- | --- | --- |
| Work index / reel | Approved selection/order, thumbnails, reel availability and shot credits | FR-01a, FR-01c |
| Aurelia | Film/stills, individual role, dates, tools actually used, stages and rights | FR-02, FR-01b |
| Other CGI/VFX | Real project identities, finished shots and breakdown evidence | FR-01b |
| Engineering/CAD | Problem, constraints, contribution, diagrams and actual tests | FR-03 |
| IBM AI Racing / TORCS | Program attribution, role, code provenance, environment and supported results | FR-04 |
| About / Contact | Approved biography, optional portrait rights, public address/links and language | FR-05a, FR-05b, QA-16 |

## Evidence and rights gate

This is the canonical public-claims rule (AGENTS references it): do not invent assets, credits, qualifications, tools, metrics, affiliations or outcomes. Separate individual from team contribution and measured results from goals/simulations. Publish only supported, owner-approved material; otherwise omit the claim or mark the internal item blocked.

Readiness: Unknown -> Collected -> Verified -> Owner approved -> Published. A changed published asset returns to review. A later manifest records item/project ID, evidence source, role/credits, rights holder/permission, public title/caption, alt/decorative rationale, language, crop, dimensions/duration, colour/codec, variant filename/bytes, media-accessibility classification and approval. Keep private paths, confidential material and master files outside the public repository.

Q15 must distinguish code/documentation licensing from creative work, music, fonts, footage, models and third-party logos. A public repository is not a blanket licence for every asset. No licence is chosen in M0. Favicon and OG artwork need approval/rights and tested crops too (QA-14, QA-15).

## Work index and reel

`/work/` is the primary CGI/VFX portfolio index. Feature Aurelia, then approved projects with clear disciplines/roles and direct case-study links. Filters are optional and must not hide content without JS. Link engineering separately; do not manufacture cards to fill a grid.

An approved reel is a curated overview, not a substitute for case studies. Record duration, shot/timecode credits, responsibilities and links to relevant studies. Provide a poster, explicit play, controls, captions/description deliverables below and a playback failure alternative. If no reel is available, retain useful stills and project links without an invented player. A hero excerpt needs owner-approved crop/edit and the same rights review; automatic delivery follows QA-07 and QA-17.

## CGI/VFX case-study and shot template

State the premise, scope, personal/team role and credits. Show the finished shot and label each actual stage (such as plate, render passes or compositing); include timecode/frame context and explain a concrete technical/artistic decision. List tools only when evidenced. Comparisons need keyboard operation or static side-by-side views and explanatory text. Remove confidential plates/interfaces. Do not present stages the owner did not perform.

Aurelia uses this template with a prominent finished-film/still sequence, selected process decisions and reflection. It remains the flagship, while the work index lets other projects stand independently.

## Engineering and racing templates

Engineering: problem/constraints -> personal scope -> design rationale/diagrams -> actual build/simulation/test -> results and limitations. Supply units/conditions; distinguish simulated predictions from physical validation.

Racing retains a dedicated page, proposed at `/engineering/ibm-ai-racing/`. Explain IBM AI Racing League/TORCS context without implying endorsement, then actual environment, interface, method, experiments and reflection. Publish versions/reproduction steps only when known. Lap times/ranks/reliability claims require logs and conditions; no assumed algorithm, record or autonomous-driving capability. Bonus remains an editorial label, not the route identity.

## Media accessibility policy

For QA-12, classify every film/reel as synchronized audio-video, silent video-only, audio-only, or a documented clearly labelled media alternative for text; do not infer an exemption merely because playback starts muted.

- Prerecorded synchronized audio-video: captions cover speech, speakers and meaningful sounds/music. Supply audio description of important visual information not conveyed by the soundtrack, through integrated narration or an accessible described version. A transcript supplements access; **text alone is not an equivalent substitute for the AA audio-description requirement**.
- Video-only: supply an equivalent time-based text alternative or audio track conveying the visual information. Audio-only: supply an equivalent transcript. Record any claimed text-alternative exception and its rationale explicitly.
- Provide discoverable keyboard-accessible controls, readable captions that do not obscure essential imagery, poster/context and a fallback link. Check pause, focus, language and mobile playback. Decorative loops must add no unique information, remain pausable, and fall back to a still under reduced motion/data saving.

Review deliverables and record unmet criteria; do not claim WCAG AA for a page with unresolved applicable media failures. This corrects I-4's suggestion that a transcript alone can satisfy synchronized-video AA. Sources: [captions SC 1.2.2](https://www.w3.org/WAI/WCAG22/Understanding/captions-prerecorded.html), [audio description SC 1.2.5](https://www.w3.org/WAI/WCAG22/Understanding/audio-description-prerecorded.html), [audio/video-only SC 1.2.1](https://www.w3.org/WAI/WCAG22/Understanding/audio-only-and-video-only-prerecorded.html).

## Content gate

M1b delivers a verified manifest, representative Aurelia and VFX shot packets, a reel readiness decision, approved language/contact direction and media/fidelity results, or a precise blocked-content list. M1a uses clearly labelled local fixtures and does not wait for these assets. [DEVELOPMENT_PLAN](DEVELOPMENT_PLAN.md) owns milestone acceptance.

## Implementation status of placeholders (2026-10-15)

The provisional site renders every unverified item as a labelled placeholder (`Pending`, `Media`, `SlotCard` components); `src/data/projects.ts` carries a per-project readiness status, all currently `placeholder`. Public text asserts only owner-stated scope: no tools, role, credits, dates, results, metrics or contact address. The skill chips on About are discipline areas from the owner's scope, not proficiency claims. The racing page has structure for story, methodology, comparison table (no data), footage and source link; no repository URL is shown because none was supplied.

The owner holds a large local Aurelia project folder outside this repository. Nothing from it was read for content or copied; selecting derivatives, rights and credits is an M1b task under the gate above.

## M1b manifest (2026-10-15)

The first content manifest is [CONTENT_MANIFEST](CONTENT_MANIFEST.md): owner decisions, repository-verified facts, local asset candidates grouped by type and size (none reviewed or approved), and twelve missing items (M-01 to M-12). No asset has reached Verified. The readiness gate above is unchanged and still blocks publication.

## Homepage content status (2026-10-15)

The homepage ([M1B_HOME_DECISION](reviews/M1B_HOME_DECISION.md)) contains: the owner's headline; a supporting sentence, discipline notes, and section and call-to-action copy that are proposed and unapproved; placeholder media for the hero and Aurelia (labelled "not approved"); two empty VFX slots; and engineering and IBM AI Racing links with no results. Role and credits show "Pending confirmation". No project, tool, metric, credit or contact detail was invented. Replacing placeholders needs [CONTENT_MANIFEST](CONTENT_MANIFEST.md) items M-01 and M-02 first, then M-03 to M-08 for the case study.

## Hero artwork specification (2026-10-15)

When items M-01 and M-02 in [CONTENT_MANIFEST](CONTENT_MANIFEST.md) are met, supply: a desktop master of 2880 x 1206 (2.39:1) with the subject inside the central 70% of the height; an optional 1200 x 1500 (4:5) phone crop; a focal point if the subject is off-centre; descriptive alt text; and AVIF or WebP plus a JPEG fallback, at most 250 KB per variant. They are placed through `src/data/home.ts`, and no layout work is then needed. Until then the slots stay labelled placeholders.

## Aurelia and VFX portfolio content status (2026-10-15)

`/work/` and `/work/aurelia/` now carry draft content built only from evidence in the render files and project notes: five stills, a five-stage render-pass breakdown (Shot 002, frame 36), the rendering and compositing workflow, specifications and shot table, lighting and material notes from the scene's Cryptomatte manifests, and a film slot that states playback is not published. Role, credits, collaborators, music and the brief remain "Pending confirmation", and no achievement or client claim is made. Selection and provenance: [M1B_AURELIA_MEDIA](reviews/M1B_AURELIA_MEDIA.md); items awaiting the owner: [CONTENT_MANIFEST](CONTENT_MANIFEST.md#f-aurelia-render-archive-and-derivatives-2026-10-15-update).

## Engineering and racing content (2026-10-16)

Racing facts on the page come from the owner's racing repository and project history, read read-only and pinned to a public commit; the evidence table is in [M1B_ENGINEERING_RACING](reviews/M1B_ENGINEERING_RACING.md). Engineering entries other than racing are labelled planned or reserved and carry no result, image or claim. The page states AI-assisted development and makes no placement, award, endorsement or rule-compliance claim. Role wording stays pending.

