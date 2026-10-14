# ADR 0005: Shared collaboration process

Status: **Proposed**. Updated 2026-10-15. Owner: repository owner. Related: M0-04, OPS-02, Q11; findings I-7, I-8, M-2, M-3, M-9.

## Context and proposal

Codex and Claude need one specification and ownership history. Retain this process decision for continuity, but keep operational rules in [AGENTS](../../AGENTS.md) and [AGENT_WORKFLOW](../AGENT_WORKFLOW.md), not duplicated here. The supplied Claude independent review concerns the original M0 hash `f01e9e0`; it is not approval of the corrected candidate or proof of a completed multi-editor integration trial.

## Alternatives and tradeoffs

A shared writable checkout risks collisions; separate concurrent worktrees isolate files/indexes but need explicit integration checks. Separate tool-specific specifications drift. One editor plus independent review is the simpler default for small tasks; do not manufacture parallel work. Use the shared CLAUDE import and honest agent attribution rather than invented coauthor identities.

## Consequences and acceptance gate

Single-writer ownership serializes shared files deliberately. Owner-named reviewer/integrator, an ownership comment and a reviewed handoff/integration example are needed before this long-term model is Accepted. Active user safeguards remain binding without accepting a future process. Revisit if coordination overhead exceeds its benefit or integration failures expose a missing control.
