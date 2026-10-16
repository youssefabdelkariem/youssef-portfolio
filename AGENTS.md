# Agent instructions

## Authority and scope

Read [README](README.md), [requirements](docs/REQUIREMENTS.md), the [active milestone](docs/DEVELOPMENT_PLAN.md#active-milestone), [agent workflow](docs/AGENT_WORKFLOW.md) and [ADR register](docs/adr/README.md) before editing. `docs/` is the shared specification for Codex and Claude Code; this file governs execution. User instructions take precedence.

Only implement the authorized milestone. Proposed decisions are candidates, not permission to adopt a framework, dependency, service or deployment change. The ADR register defines status and acceptance rules. If specifications conflict or an important requirement is ambiguous, identify the conflict and affected requirement IDs, offer a reversible recommendation, request an owner decision, and continue independent work. Silence is not approval.

## Evidence and validation

Never invent projects, credits, assets, results, contact details, clients or qualifications. Use the evidence/publication gate in [CONTENT_PLAN](docs/CONTENT_PLAN.md#evidence-and-rights-gate). Keep secrets and private source material out of this public repository.

Inspect branch, base commit and existing changes first; preserve user work. Use the smallest coherent diff and cite requirements. Run the checks appropriate to the change and report actual results and limits. Documentation needs link/anchor, reference, status and scope validation. Application checks use the commands established by the approved stack; do not invent commands or claim unavailable CI, browser, accessibility or performance results. Test combined production output before an authorized release.

## Collaboration and commits

Use isolated branches and working directories for concurrent editors. Assign exclusive file ownership in a task/PR comment before editing; shared specifications, tokens, schemas and lockfiles have one writer. Never stage another editor's work, reset their checkout or force-push a shared branch. Follow the [workflow](docs/AGENT_WORKFLOW.md) for base selection, handoff, independent review and integration.

Use `docs/<topic>`, `feat/<topic>`, `fix/<topic>` or `chore/<topic>` and imperative Conventional Commit subjects. Include an honest `Agent: Codex` or `Agent: Claude Code` commit-body line for agent-assisted changes; retain the real Git author and do not invent a coauthor identity. Do not spawn agents or message other chats without applicable user authorization.

## Production protection

Treat a merge or push to the publishing source as a potential production deployment, including documentation-only changes. Follow the [production and PR gate](docs/AGENT_WORKFLOW.md#production-and-pr-gate); written instructions are not technical branch protection. Never merge, deploy, alter DNS/Pages settings, or broaden access without authorization. Preserve the reviewed candidate and known-good rollback commit. Unverified protection or hosting state must be labelled, not assumed.
