# Youssef Studio

A premium personal portfolio for cinematic CGI, 3D rendering, VFX, product visualization, mechatronics and CAD. Aurelia is the owner-designated flagship CGI smartphone commercial. A dedicated IBM AI Racing League / TORCS page complements the creative work. Project descriptions are owner-supplied; publication evidence follows the content plan.

[Production website](https://youssef.studio) · [GitHub repository](https://github.com/youssefabdelkariem/youssef-portfolio)

## Start here

Read [AGENTS.md](AGENTS.md) or the Claude [entry point](CLAUDE.md), then consult:

| Document | Responsibility |
| --- | --- |
| [Project vision](docs/PROJECT_VISION.md) | Audience, positioning and success |
| [Requirements](docs/REQUIREMENTS.md) | Requirements, quality budgets and owner questions |
| [Design system](docs/DESIGN_SYSTEM.md) | Visual tokens, motion and interaction |
| [Site architecture](docs/SITE_ARCHITECTURE.md) | Stack comparison, routes and Pages constraints |
| [Content plan](docs/CONTENT_PLAN.md) | Work index, reels, case studies, evidence and rights |
| [Development plan](docs/DEVELOPMENT_PLAN.md) | Active milestone and M1a/M1b acceptance gates |
| [Agent workflow](docs/AGENT_WORKFLOW.md) | Ownership, review, integration and production protection |
| [ADR register](docs/adr/README.md) | Authoritative decision statuses |
| [M0 remediation](docs/reviews/M0_REMEDIATION.md) | Disposition of Claude's independent review findings |

## Baseline and publication risk

The inspected `origin/main` baseline is `c882895442ae6721e13bb59600dc8f84915f9eee`: three commits containing `README.md`, `index.html` and `CNAME`. The HTML is a minimal deployment test; `CNAME` contains `youssef.studio`. There is no package manifest or custom build workflow. These are repository facts; current hosting, HTTPS and protection state are qualified in the [evidence register](docs/SITE_ARCHITECTURE.md#infrastructure-evidence).

The previously observed Pages source was `main` / root. **Merging to that publishing source can deploy and expose documentation on the production domain.** Review alone does not suppress publication. `.nojekyll` does not hide Markdown. The owner must resolve the [production and PR gate](docs/AGENT_WORKFLOW.md#production-and-pr-gate) before any merge.

There are no application install/build/test commands yet. The active milestone defines what work is authorized; M1 proposals do not authorize scaffolding. Documentation validation and remaining approval conditions are in the remediation record. No final framework has been chosen.
