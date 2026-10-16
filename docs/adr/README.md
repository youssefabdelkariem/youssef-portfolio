# Architecture decision register

This register is the authoritative status index. Review references and corrections are tracked in [M0_REMEDIATION](../reviews/M0_REMEDIATION.md); requirements live in [REQUIREMENTS](../REQUIREMENTS.md).

| ADR | Decision | Status | Acceptance gate |
| --- | --- | --- | --- |
| [0001](0001-hosting.md) | Retain GitHub Pages hosting | Accepted | Existing owner hosting choice; no pipeline/settings authorization |
| [0002](0002-tech-stack.md) | Stack and rendering | Proposed | Neutral M1a comparison and owner approval |
| [0003](0003-routing.md) | Static route contract | Proposed | M1a direct-route/404/metadata evidence and approved slugs |
| [0004](0004-media-strategy.md) | Media delivery and fidelity | Proposed | M1b actual-asset/accessibility/mobile/cost review |
| [0005](0005-ai-collaboration.md) | Shared collaboration process | Proposed | Named roles, ownership and reviewed handoff/integration |
| [0006](0006-build-deployment-preview.md) | Build, deployment and previews | Proposed | M1a pipeline/preview evidence plus separately authorized production transition |

## Lifecycle

- **Proposed:** evaluation candidate, not implementation/adoption permission.
- **Accepted:** stated evidence/gate and owner approval recorded with date/reference.
- **Superseded:** replaced by an Accepted ADR; link old/new records both ways.
- **Deprecated:** no longer recommended; explain impact and migration conditions.

The user's active-task boundaries apply regardless of proposed long-term process. No other architecture is implicitly Accepted by accepting hosting.

## Maintenance

Allocate the next unused four-digit number and kebab-case filename. Record status/date/owner, requirement/finding references, context, decision/proposal, alternatives/tradeoffs, consequences, evidence/approval gate and revisit triggers. Editorial clarification may update a record; a materially changed Accepted decision needs a replacement ADR. Update this register and affected references together. Preserve history rather than implying retrospective approval.
