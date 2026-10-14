# Agent instructions

## Scope and authority

This repository is Youssef Studio. Read [README](README.md), [requirements](docs/REQUIREMENTS.md), [development plan](docs/DEVELOPMENT_PLAN.md), and [agent workflow](docs/AGENT_WORKFLOW.md) before editing. The shared specifications in `docs/` are authoritative for both Codex and Claude Code; this file governs execution, not a separate product specification. [CLAUDE.md](CLAUDE.md) points to the same sources.

User instructions take precedence. Confirmed facts and owner requirements constrain proposals. Only Accepted [ADRs](docs/adr/README.md) authorize architectural decisions; Proposed ADRs describe candidates, not permission to install or migrate. If documents conflict, stop the dependent change, identify the conflict, and request an owner decision. Continue independent, reversible work.

## Current milestone and safeguards

M0 is documentation only. Preserve `index.html` and `CNAME`; do not change DNS, Pages settings, deployment workflows, dependencies, or the portfolio UI. Do not introduce a package manifest, lockfile, framework, generated assets, or secrets during M0. `main` is the production branch. Documentation on a feature branch is not a deployment.

## Development and validation

- Inspect the actual tree and current changes first. Never assume proposed directories or commands already exist.
- Work to a requirement ID and an explicit acceptance criterion. Use the smallest coherent change. Preserve semantic HTML, keyboard access, readable content, and progressive enhancement.
- For documentation: check every relative link, anchor, ADR status, requirement reference, and cross-document claim; inspect the final diff for scope and sensitive material.
- There is no application test/build command at M0. Report checks actually run and their limitations. Do not claim CI, accessibility, performance, or browser tests passed without evidence.
- Future application changes must run the commands established in the reviewed M1 README, plus affected route, keyboard, reduced-motion, media-failure, and mobile checks. Test the production build rather than only a development server. See the [requirements](docs/REQUIREMENTS.md) for proposed budgets and release gates.

## Branches, commits, and review

Use `docs/m0-foundation` for M0; subsequent branches use `docs/<topic>`, `feat/<topic>`, `fix/<topic>`, or `chore/<topic>`. Keep one scope per branch. Use imperative Conventional Commit subjects such as `docs: establish shared project specifications`; never include credentials or unverified claims. Do not rewrite another contributor's commits or force-push shared branches.

Review the complete diff against the integration base. Include purpose, requirement IDs, changed files, checks and limitations, ADR impacts, and deployment risk in the handoff or PR. Do not merge M0 into `main` until the owner reviews it. Do not silently change repository permissions, rules, or branch protection to enforce this policy.

## Concurrent work

Use a separate branch AND working directory/worktree per agent. Before editing, record the base commit, file ownership, acceptance criteria, and integrator in the shared task/PR discussion. Do not edit the same files concurrently, stage another agent's work, reset their checkout, or reuse a working directory. Shared documents and schemas have one designated editor at a time. A second agent reviews a diff or proposes a follow-up; it does not overwrite the editor's changes.

Follow [AGENT_WORKFLOW](docs/AGENT_WORKFLOW.md) for handoff and integration. This policy permits an agreed team workflow; it does not authorize spawning agents or messaging external chats without the user's applicable authorization.

## ADRs and ambiguity

Create the next numbered ADR for decisions affecting stack, URLs, hosting, media, collaboration, or material dependencies. Include status, context, alternatives, tradeoffs, evidence, approval gate, and consequences. Link affected requirements. Only mark Accepted after the stated gate is met and the owner/reviewer records approval. Keep historical ADRs and link replacements when superseding them.

Never invent credits, assets, metrics, contact details, client relationships, or project outcomes. Track unknowns in the requirements question register. Label assumptions as Proposed, provide a reversible recommendation and its impact, and ask the owner when a decision affects claims, scope, costs, data, or architecture. No answer is not approval.

## Deployment

M0 must change only Markdown. For later releases, require an approved hosting/deployment plan, a reviewed immutable candidate commit, integration checks, a preview or local production build, and a recorded known-good rollback commit. Preserve the custom domain and test direct URLs and HTTPS after an authorized release. Never use DNS or production as a preview environment.
