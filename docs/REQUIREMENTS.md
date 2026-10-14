# Requirements and decision register

Updated: 2026-10-15. Labels: **Confirmed** = user requirement or inspected baseline; **Proposed** = recommendation awaiting review; **Open** = insufficient evidence. IDs remain stable when wording changes. An architectural proposal is implemented only after its ADR gate is met.

## Confirmed requirements

| ID | Requirement | Acceptance evidence / stage |
| --- | --- | --- |
| M0-01 | Create the 15 specified policy/specification/ADR files and update root README | 16 Markdown paths present; reviewable branch and commits |
| M0-02 | Preserve functional production | `index.html`, `CNAME`, deployment and DNS unchanged; no merge to `main` |
| M0-03 | No UI implementation, frameworks, or dependencies in M0 | Complete branch diff contains only requested Markdown |
| M0-04 | Validate links, consistency and references; support Codex and Claude | Local link/anchor check and manual status/ID review; shared workflow and policy |
| FR-01 | Feature CGI, 3D rendering, VFX and product/compositing breakdowns | Later owner-approved work selection and accessible case-study navigation |
| FR-02 | Aurelia is the flagship CGI smartphone commercial | Later prominent placement plus verified role, assets and context; no invented credits |
| FR-03 | Include mechatronics and CAD projects | Later dedicated discoverable work grouping with evidence for every project |
| FR-04 | Dedicated bonus IBM AI Racing League / TORCS case-study page | Later direct-loadable page with accurate provenance, method and evidenced outcomes |
| FR-05 | Include About and Contact | Later approved biography and working public contact path |
| FR-06 | Cinematic, refined, modern, technically sophisticated aesthetic | Owner review against approved references and responsive layouts |
| OPS-01 | Retain GitHub Pages and custom domain | Accepted ADR 0001; preserve current delivery during M0 |
| OPS-02 | Review before integration into production | Feature branch, recorded review, no unreviewed merge |

## Proposed release quality requirements

These are design targets, not measured baseline results. Accept or revise them in M1; record changes and rationale. Automated scores support manual checks and do not establish conformance alone.

| ID | Proposed requirement | Validation |
| --- | --- | --- |
| QA-01 | Target WCAG 2.2 AA across pages | Keyboard and screen-reader walkthrough; contrast, focus, zoom/reflow; automated scan with no unresolved serious/critical findings; document exceptions |
| QA-02 | Core project text/navigation available in delivered HTML | Inspect HTML without executing JS; direct load each route and unknown path |
| QA-03 | Responsive from 320 CSS px, with 200% text zoom and 400% page zoom/reflow | No clipped content or unnecessary horizontal scroll except meaningful diagrams; test touch and keyboard |
| QA-04 | Respect reduced motion; no scroll hijacking or forced audio | OS/browser reduced-motion test; stop/pause moving content; no essential information encoded only in motion |
| QA-05 | Route-specific title, description, canonical and social metadata | Inspect built HTML for each public URL; images and URLs resolve; accurate structured data only |
| QA-06 | LCP <= 2.5s, CLS <= 0.1, INP <= 200ms at p75 when field data exists | Before launch use 3 cold mobile lab runs per representative route on recorded device/network and report median; lab interactions are proxies, not field INP |
| QA-07 | Initial page transfer <= 1 MB compressed excluding user-requested media; initial JS <= 150 KB gzip | Cold network trace at mobile viewport; include fonts, poster, styles, scripts; record device, build, conditions |
| QA-08 | Default mobile hero/poster <= 250 KB; defer film and optional WebGL | Verify waterfall: no full film/model on initial load; fixed media dimensions; offscreen lazy loading |
| QA-09 | No critical console errors, dead links, or broken media fallbacks | Test production build, direct URLs, blocked media, JS disabled, WebGL absent, and offline/error states |
| QA-10 | Cross-browser smoke coverage | Current Chrome/Edge, Firefox, Safari and iOS Safari/Android Chrome; record tested versions and real-device/emulation limits |
| QA-11 | No secrets or unapproved external services | Inspect diff and output; approve embed/privacy/cost implications before adding service |

Full video encodes have separate budgets proposed in ADR 0004; the initial-load budget must not be bypassed by relabeling automatically fetched media as user-requested. A budget exception needs evidence, mitigation and owner review.

## Open questions

| ID | Question | Decision owner / needed by | Default while unresolved |
| --- | --- | --- | --- |
| Q01 | Creative versus engineering audience priority? | Owner / M1 content hierarchy | Proposed creative-first; no final copy |
| Q02 | Which Aurelia files, credits, tools and permissions are publishable? | Owner / M1 inventory | Asset readiness Unknown |
| Q03 | Which engineering/CAD projects and precise individual contributions? | Owner / before case-study writing | No invented project cards |
| Q04 | Racing project's role, dates, methods, evidence and approved results? | Owner / before bonus page | No ranks, lap times or achievements published without source |
| Q05 | Public biography, contact address, social links, language(s)? | Owner / before content sign-off | No live form, address or profile assumed |
| Q06 | Which visual references, fonts and identity are licensed and approved? | Owner / design gate | System fonts and provisional tokens only |
| Q07 | Final stack and static HTML generation method? | Technical reviewer + owner / M1 | ADR 0002 Proposed; current plain HTML remains |
| Q08 | Final route slugs and URL compatibility expectations? | Owner + technical reviewer / M1 | ADR 0003 Proposed; preserve `/` |
| Q09 | Video host, costs, privacy, formats and real asset sizes? | Owner + technical reviewer / M1 | ADR 0004 Proposed; no external accounts/provisioning |
| Q10 | Is WebGL necessary for a specific visitor goal? | Owner / after representative content prototype | Defer Three.js/R3F |
| Q11 | Reviewer, integrator, merge method and future preview location? | Owner / each task and M1 | Single editor per file; no production deployment |
| Q12 | Accept or revise QA targets and test-device access? | Owner + reviewer / M1 | Report proposals and coverage gaps explicitly |

## Traceability and change control

Every task cites an ID above and its milestone gate. [CONTENT_PLAN](CONTENT_PLAN.md) maps project evidence to FR IDs; [DEVELOPMENT_PLAN](DEVELOPMENT_PLAN.md) maps delivery gates. Add new IDs for new obligations. Update affected specs and ADRs together; avoid resolving an Open question silently in implementation. Owner feedback and approval are recorded in the task/PR, with the relevant decision summarized in the repository.
