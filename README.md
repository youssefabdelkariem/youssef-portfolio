# Youssef Studio

A personal portfolio intended to connect cinematic CGI, 3D rendering and VFX with mechatronics engineering and CAD work. Aurelia is the intended flagship CGI smartphone commercial; a dedicated bonus case study will cover the IBM AI Racing League / TORCS autonomous racing project. These are owner-supplied project descriptions, not verified claims about assets, results, or credits.

- Production: [youssef.studio](https://youssef.studio)
- Repository: [youssef-portfolio](https://github.com/youssefabdelkariem/youssef-portfolio)
- Current milestone: **M0 — documentation foundation, awaiting review on a separate branch.**

## Current implementation

The inspected `main` baseline is commit `c882895442ae6721e13bb59600dc8f84915f9eee`: three commits and three files (`README.md`, `index.html`, `CNAME`). The HTML is a minimal dark deployment test. `CNAME` identifies `youssef.studio`. GitHub Pages publishes `main` / root. There is no package manifest, application framework, test suite, or custom build workflow. M0 adds only Markdown and does not modify production HTML, domain settings, hosting configuration, or dependencies.

## Documentation map

| Document | Purpose |
| --- | --- |
| [Project vision](docs/PROJECT_VISION.md) | Audience, positioning, scope, success |
| [Requirements](docs/REQUIREMENTS.md) | Traceable requirements, proposed quality budgets, unresolved questions |
| [Design system](docs/DESIGN_SYSTEM.md) | Proposed visual, interaction, and accessibility direction |
| [Site architecture](docs/SITE_ARCHITECTURE.md) | Static delivery, routes, boundaries, stack evaluation |
| [Content plan](docs/CONTENT_PLAN.md) | Evidence-led inventory, case studies, asset readiness |
| [Development plan](docs/DEVELOPMENT_PLAN.md) | Milestones and acceptance gates |
| [Agent workflow](docs/AGENT_WORKFLOW.md) | Codex/Claude ownership, review, integration, release |
| [ADR register](docs/adr/README.md) | Decision history, statuses, approval criteria |
| [AGENTS.md](AGENTS.md) / [CLAUDE.md](CLAUDE.md) | Shared agent policy and Claude entry point |

## Working on the project

Read the shared agent policy before changes. Use a feature branch and separate working directory. `main` serves production; M0 must not be merged until reviewed. See the workflow for the exact review and integration sequence.

There are **no application install, build, or test commands yet**. Do not scaffold from a Proposed ADR. For M0, validate relative Markdown links/anchors, document references and ADR consistency, then confirm the diff contains only the 16 requested Markdown files. Future application commands must be introduced and documented in an authorized milestone.

## Decision state and next gate

GitHub Pages hosting is Accepted in [ADR 0001](docs/adr/0001-hosting.md). Stack, routing, media strategy, and AI collaboration are Proposed in ADRs 0002–0005. The collaboration safeguards in AGENTS.md apply to this task; the long-term operating model still needs review. Proposed M1 is evidence gathering and architecture validation on an isolated branch, with no production deployment. See [M1 scope and acceptance](docs/DEVELOPMENT_PLAN.md#m1--architecture-and-content-validation-proposed).

No project asset library, results, contact address, public biography, or final visual identity has been verified. Track decisions and evidence in the requirements question register and content inventory; publish only owner-approved material.
