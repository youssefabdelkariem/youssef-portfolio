# ADR 0005: Shared AI collaboration

Status: **Proposed**. Recorded: 2026-10-15. Decision owner: repository owner; approval pending.
Related: M0-04, OPS-02, Q11.

## Context

Codex and Claude Code will work on the same portfolio. Independent prompts and simultaneous edits can cause inconsistent requirements, overwrite shared files, or integrate individually working changes that fail together. Both tools need one decision history and a clear integration owner. No independent multi-agent review is claimed in M0.

## Proposal

Use `docs/` as the shared specification and `AGENTS.md` as the shared execution policy. Keep `CLAUDE.md` as a thin entry point. Use isolated branches AND worktrees/checkouts, exclusive file ownership, a named reviewer and integrator, and combined integration validation. The exact [AGENT_WORKFLOW](../AGENT_WORKFLOW.md) supplies the handoff fields and gate sequence.

Roles rotate by task; neither assistant can accept its own architectural proposal on behalf of the owner. Record ambiguity rather than duplicating a tool-specific specification. M0 safeguards already apply under the user's task and AGENTS.md even while this durable operating model is Proposed.

## Alternatives and tradeoffs

- Shared working directory: minimal setup but risky index/file collisions and accidental staging; reject for concurrent editors.
- Separate branches in one directory with branch switching: serialized use only; not isolation for simultaneous work.
- Separate worktrees/checkouts: clear ownership and independent diffs; requires explicit base synchronization and integration tests. Recommended.
- Separate Codex/Claude specifications: initially convenient but diverge; reject as a competing source of truth.
- One editor plus independent review: lower coordination cost, appropriate for small milestones such as M0; no need to manufacture parallel work.

## Consequences and constraints

Some tasks will be serialized, especially shared schemas, tokens, lockfiles and canonical docs. Integration needs fresh checks against current `main`; passing branches do not guarantee a passing combined build. Only authorized task communication/delegation mechanisms may be used. This ADR grants no persistent credentials, account permissions, external messaging, or automatic production access.

## Acceptance gate

Owner names reviewer/integrator and agrees the ownership convention. Conduct a representative handoff and review, record conflict handling (or how it would be handled if no conflict occurs), then validate the combined branch. Approval can mark this ADR Accepted; until then do not claim the long-term process has been adopted or independently tested.

Revisit if team size, automation permissions, tooling or integration failures warrant a revised process. References: [AGENTS.md](../../AGENTS.md), [CLAUDE.md](../../CLAUDE.md), [development gates](../DEVELOPMENT_PLAN.md).
