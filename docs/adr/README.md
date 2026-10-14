# Architecture decision records

ADRs explain why a durable decision was made, its alternatives and what could change it. They do not replace [requirements](../REQUIREMENTS.md) or grant authorization to deploy/install services.

## Register

| ADR | Title | Status | Review gate |
| --- | --- | --- | --- |
| [0001](0001-hosting.md) | GitHub Pages hosting | Accepted | Existing owner-selected working setup; changes require a new reviewed ADR |
| [0002](0002-tech-stack.md) | Portfolio stack and rendering | Proposed | M1 comparison, static HTML/build evidence, owner approval |
| [0003](0003-routing.md) | Static route contract | Proposed | M1 direct-load/refresh/404/SEO tests and owner approval |
| [0004](0004-media-strategy.md) | Progressive media delivery | Proposed | Asset inventory, mobile tests, service/cost/privacy approval |
| [0005](0005-ai-collaboration.md) | Shared AI collaboration | Proposed | Named roles, ownership agreement, reviewed trial handoff/integration |

## Status lifecycle

- **Proposed:** candidate under evaluation; cannot be assumed adopted.
- **Accepted:** stated gate met and owner/reviewer approval recorded. Include date and evidence/approval reference.
- **Superseded:** replaced by an Accepted ADR; link both directions and preserve history.
- **Deprecated:** no longer recommended, without necessarily naming a replacement; explain operational impact and migration conditions.

Accepted hosting records a decision already made by the owner, not a new M0 infrastructure action. No other ADR is Accepted at M0. Task-specific safeguards in AGENTS.md apply immediately even though the long-term collaboration model is Proposed.

## Creating and changing records

Allocate the next unused four-digit number and descriptive kebab-case filename. Use: title; status/date/decision owner; related requirement IDs; context; proposed/accepted decision; alternatives and tradeoffs; consequences/risks; validation and acceptance gate; sources; revisit triggers. Distinguish evidence from assumptions.

Keep editorial clarifications in the existing record. For a changed Accepted decision, add a new ADR and mark the old record Superseded only when replacement is Accepted. Update the register, affected specifications and links in the same reviewed change. Do not rewrite history to imply an earlier approval.
