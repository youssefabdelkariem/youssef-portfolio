# Content and evidence plan

Status: scope Confirmed; inventory readiness Unknown; templates and ordering Proposed. See [requirements](REQUIREMENTS.md) for question owners and [media ADR](adr/0004-media-strategy.md) for delivery decisions.

## Inventory as of M0

No portfolio assets were supplied or verified in this repository. The only production visual content is a text-only deployment test. A project mentioned by the owner is not automatically ready for publication.

| Content group | Confirmed owner direction | Missing evidence / readiness | Requirement |
| --- | --- | --- | --- |
| Aurelia | Flagship CGI smartphone commercial | Film/posters, final title treatment, role, dates, toolchain, process files, credits/rights Unknown | FR-02, Q02 |
| Other CGI/product/VFX | Showcase renders and compositing breakdowns | Project identities, selected artifacts, actual tools, ownership and captions Unknown | FR-01, Q02 |
| Mechatronics/CAD | Include engineering projects | Project names, diagrams/CAD views, requirements, individual contribution, test results Unknown | FR-03, Q03 |
| AI Racing League / TORCS | Dedicated bonus case study | Scope, role, code provenance, simulator details, experiments and reproducible results Unknown | FR-04, Q04 |
| About | Personal background and interests | Approved biography, portrait permission, public role/location details Unknown | FR-05, Q05 |
| Contact | A public way to reach the owner | Approved address/social links and preferred call to action Unknown | FR-05, Q05 |

## Readiness and publication gate

Use these states for each content item: Unknown -> Collected -> Verified -> Owner approved -> Published. Revisions to a Published asset return to review. Track each item in a later content manifest with: stable ID, project, source file/location, owner, individual/team credit, rights/license, public title, caption, alt text or decorative rationale, dimensions/duration, derivative filenames, poster/focal point, transcript/caption needs, byte sizes, approval and evidence source.

Do not commit source paths that disclose private personal folders or confidential client material. Store public derivatives separately from master files. No public sample card may imply a nonexistent project. A withheld item remains absent, rather than appearing as fabricated finished work.

## Proposed Aurelia narrative

1. Concise project premise and an approved still; film playback is optional to understand the page.
2. Scope, role, collaborators and credits, clearly distinguishing personal and team contributions.
3. Selected finished frames with factual captions.
4. Process: concept, modeling/look development, lighting/rendering, compositing as actually evidenced. Omit stages not performed or not documented.
5. One or two useful breakdowns with labels, accessible static alternatives and context explaining the decision.
6. Reflection: what was learned and what would change; metrics only with a traceable source.

This is an editorial outline, not confirmation that every stage or asset exists.

## Proposed engineering/CAD template

State the problem and constraints, explain the individual's scope, show design rationale and legible diagrams, describe build/simulation/testing actually performed, and distinguish measured results from predictions. Include units, assumptions, test conditions and limitations. Do not publish a simulation as a validated physical outcome or expose proprietary CAD/IP.

## Dedicated bonus racing template

Use a standalone page, linked as bonus technical work. Explain the IBM AI Racing League/TORCS context with accurate program/project attribution and avoid implying endorsement. Describe the actual environment, observation/action interface, approach, experiments and debugging evidence once supplied. List hardware/software versions and reproducibility instructions only when known. Separate measured runs from goals; lap times, ranks, reliability rates and records need logs, conditions and permission to publish. Do not assume a specific ML algorithm, sensor set, competition result or autonomous-driving capability.

## About, navigation and contact

Draft only after the owner's public biography and target audience are clear. Navigation labels can be concise and factual; final role labels, client names, availability and social links require approval. Prefer a verified contact link for a static first release. A form, analytics or embedded player introduces service/privacy decisions and is not part of M0.

## Asset preparation checklist for later milestones

- Keep originals outside the public repository; document rights and permitted derivatives.
- Create responsive image variants, preserve intended crop, strip unnecessary metadata, and record alt/caption information.
- Supply a still/poster and accessible text context for every film; prepare captions/transcripts as the content requires.
- Export film in practical delivery renditions, measure actual quality and transfer size, and test on mobile before selecting a host.
- For CAD and code screenshots, retain readable labels, remove confidential details and provide text explanations.
- Verify every quoted result against evidence and every public destination against an owner-approved URL.

M1 should produce an evidence inventory and at least one representative, approved case-study content packet or an explicit blocked-content list. It must not fabricate assets to satisfy a layout.
