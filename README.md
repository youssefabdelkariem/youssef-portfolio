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
| [M1a evaluation](docs/reviews/M1A_EVALUATION.md) | Three-arm stack comparison and provisional recommendation |
| [Content manifest](docs/CONTENT_MANIFEST.md) | Owner decisions, verified facts, local asset candidates, missing items |
| [M1b design review](docs/reviews/M1B_DESIGN_REVIEW.md) | Two visual directions, comparison and selection gate |
| [Aurelia media](docs/reviews/M1B_AURELIA_MEDIA.md) | Source inventory, colour validation, selection provenance and compression study |
| [Font evaluation](docs/reviews/M1B_FONT_EVALUATION.md) | Two OFL display-font candidates compared with the system stack; none adopted |
| [Homepage review set](docs/design/m1b/HOME_REVIEW.md) | Desktop, tablet and mobile screenshots for owner visual approval |
| [M1b homepage decision](docs/reviews/M1B_HOME_DECISION.md) | Hybrid identity, homepage structure, media-slot contract and open approvals |
| [M1b plan](docs/M1B_PLAN.md) | Proposed visual identity, homepage, VFX portfolio and Aurelia plan, inputs and preview workflow |
| [Handoff](docs/HANDOFF.md) | Current implementation status, checks and resume steps |

## Baseline and publication risk

The inspected `origin/main` baseline is `c882895442ae6721e13bb59600dc8f84915f9eee`: three commits containing `README.md`, `index.html` and `CNAME`. The HTML is a minimal deployment test; `CNAME` contains `youssef.studio`. There is no package manifest or custom build workflow. These are repository facts; current hosting, HTTPS and protection state are qualified in the [evidence register](docs/SITE_ARCHITECTURE.md#infrastructure-evidence).

The previously observed Pages source was `main` / root. **Merging to that publishing source can deploy and expose documentation on the production domain.** Review alone does not suppress publication. `.nojekyll` does not hide Markdown. The owner must resolve the [production and PR gate](docs/AGENT_WORKFLOW.md#production-and-pr-gate) before any merge.

## Local development (feature branch only)

The provisional Astro site exists on `feat/m1a-site-foundation`, not on `main`. It is not deployed and no framework is an accepted decision; see [HANDOFF](docs/HANDOFF.md). With Node 22.12 or newer:

```text
npm ci
npm run dev        # development server
npm run verify     # docs check, type check, build, dist check, browser check (needs local Chrome/Edge)
npm run build && npm run preview   # serve the production build locally
```

The active milestone defines what work is authorized. Documentation validation and remaining approval conditions are in the remediation record.
