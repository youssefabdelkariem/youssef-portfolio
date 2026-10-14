# Claude Code entry point

Read and follow [AGENTS.md](AGENTS.md). It is the shared execution policy for Codex and Claude Code. Product and technical specifications live in [docs](docs/PROJECT_VISION.md), not in tool-specific instructions.

Start with [requirements](docs/REQUIREMENTS.md), [development plan](docs/DEVELOPMENT_PLAN.md), [agent workflow](docs/AGENT_WORKFLOW.md), and the [ADR register](docs/adr/README.md). Use the same requirement IDs, decision statuses, ownership rules, and review gates as Codex. If an instruction differs, raise the conflict rather than maintaining a competing plan here.

Current scope is M0 documentation only: no dependency installation, UI implementation, deployment/DNS changes, or edits to `index.html` and `CNAME`. Use an isolated branch and working directory, agree file ownership before concurrent work, and return a reviewed diff with actual validation evidence. Do not merge into `main` without owner review. See the shared workflow for integration testing and handoff fields.

Claude-specific preferences may be added here only when they do not duplicate or override shared specifications. No Claude-specific product decisions or alternate content inventory should be maintained in this file.
