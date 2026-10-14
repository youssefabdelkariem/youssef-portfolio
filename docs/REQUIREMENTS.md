# Requirements and decision register

Updated 2026-10-15. **Confirmed** means owner direction or inspected evidence; **Proposed** means a target awaiting approval; **Open** means insufficient evidence. IDs are stable. The [ADR register](adr/README.md) owns decision status; [DEVELOPMENT_PLAN](DEVELOPMENT_PLAN.md#active-milestone) owns authorization. Review traceability is in [M0_REMEDIATION](reviews/M0_REMEDIATION.md).

## Confirmed scope

| ID | Requirement | Acceptance evidence |
| --- | --- | --- |
| M0-01 | Establish the requested shared documentation and address valid review findings | Scope inventory in DEVELOPMENT_PLAN; reviewed documentation branch |
| M0-02 | Preserve production during M0 | No change to `main`, `index.html`, `CNAME`, DNS or Pages settings; no deployment or merge |
| M0-03 | No application implementation or dependency installation in M0 | Markdown-only diff; no `.nojekyll`, code, manifest, lockfile or workflow |
| M0-04 | Shared Codex/Claude policy and consistent references | Link/anchor, ID, ADR and final diff checks; independent review dispositions |
| FR-01 | CGI/VFX/product-visualization portfolio umbrella | Satisfied by FR-01a, FR-01b and FR-01c; retain this ID for existing references |
| FR-01a | Dedicated `/work/` VFX/CGI index | Browse approved projects, with Aurelia prominent; honest empty/missing-content handling |
| FR-01b | CGI case studies and per-shot breakdown evidence | Role/credits, finished shot, labelled stages, decision explanation and accessible comparison |
| FR-01c | Reel/showreel policy and discoverable playback | Approved reel when available; poster, manual play, controls, credit/shot index and accessible alternatives; never fabricate a reel |
| FR-02 | Aurelia is the flagship CGI smartphone commercial | Prominent work-index entry and approved case study |
| FR-03 | Mechatronics and CAD work | Discoverable engineering index and evidence-backed project pages |
| FR-04 | Dedicated IBM AI Racing League / TORCS page | Standalone descriptive engineering URL; accurate attribution, method and evidenced results; optional bonus navigation label |
| FR-05 | About/contact umbrella | Satisfied by FR-05a and FR-05b |
| FR-05a | About | Approved public biography and credits |
| FR-05b | Contact | Verified owner-approved contact destination; no nonfunctional form |
| FR-06 | Cinematic, refined, modern, technically sophisticated appearance | Owner review against approved references, with QA targets respected |
| OPS-01 | Retain GitHub Pages and custom domain | Hosting decision in ADR 0001; pipeline choice is separate |
| OPS-02 | Review and explicit production authorization | Production/PR gate in AGENT_WORKFLOW; no assumption that policy is enforced |

## Proposed release quality requirements

Accept or revise targets in M1a/M1b. They are not baseline measurements or a claim of WCAG conformance.

| ID | Requirement | Validation |
| --- | --- | --- |
| QA-01 | Target WCAG 2.2 AA | Manual keyboard/screen-reader/contrast/zoom review plus automated checks; document unresolved failures |
| QA-02 | Core content/navigation in delivered HTML | Inspect without JS; direct-load routes and real not-found response |
| QA-03 | Reflow from 320 CSS px; 200% text and 400% page zoom | No clipped content; labelled treatment for meaningful wide diagrams |
| QA-04 | Reduced motion, native scrolling, no automatic audio | Disable parallax/scrubbing; pause moving content and offscreen rendering |
| QA-05 | Unique title/description/canonical/social metadata per public route | Inspect generated HTML and resolve metadata assets |
| QA-06 | LCP <= 2.5 s, CLS <= 0.1; field INP <= 200 ms at p75 when available | Use the reference test protocol below; lab interaction timings are not field INP |
| QA-07 | Entry transfer <= 1 MB compressed; initial JS <= 150 KB gzip | Include fonts, images, scripts and all automatically fetched media, even delayed fetches before intent |
| QA-08 | Mobile LCP poster <= 250 KB; no automatic full film/model download | Record waterfall and reserved media dimensions; lazy-load offscreen images |
| QA-09 | No critical console errors, dead links or missing fallbacks | Production output with media blocked, JS absent, WebGL unavailable and failed requests |
| QA-10 | Chrome/Edge, Firefox, Safari, iOS Safari and Android Chrome smoke coverage | Record actual versions/devices and emulation limits |
| QA-11 | No secrets or unapproved external services | Diff/output inspection and service/privacy/cost review |
| QA-12 | Media accessibility classification and deliverables per film | Follow CONTENT_PLAN media policy; captions, description and alternatives reviewed before publication |
| QA-13 | Controlled CGI colour and format fidelity | ADR 0004 reference-frame comparisons across target browsers; record colour/codec metadata |
| QA-14 | Favicon and Open Graph images | Approved favicon variants and absolute HTTPS OG image URLs; preview/crop/alt checks |
| QA-15 | Explicit content rights and licensing | Owner chooses code/documentation licence separately from films, models, music and third-party assets; record permissions before release |
| QA-16 | Language declared and approved | Owner selects launch language(s); correct HTML `lang`, marked language changes; `hreflang` only for real translations |
| QA-17 | Cinematic hero as progressive enhancement | Poster-first LCP; optional muted `playsinline` loop only within QA-07 or after explicit play; reduced-motion/data-saving poster fallback and pause control |
| QA-18 | Sitemap, indexing and privacy plan | Sitemap/canonicals contain production URLs only; previews kept out of indexing; forms/analytics/embeds require a reviewed need and privacy decision |

## Reference performance protocol

Proposed **YS Mobile v1**: Chrome DevTools emulation of an iPhone 12-sized viewport (390 x 844 CSS px, DPR 3), custom throttling at 1.6 Mbps down / 750 Kbps up / 150 ms latency and 4x CPU slowdown. This is a repeatable desktop lab profile, not real iOS hardware. Record host CPU/OS, Chrome and measurement-tool versions, exact settings, candidate hash and server location; compare candidates on the same host/session. Validate real iOS/Android separately when devices are available.

For `/`, `/work/` and a representative case study: use built static output on the same local HTTP server configuration, clear cache/storage, disable extensions/service workers, and run three cold navigations. Capture the first 10 seconds without input plus the first explicit media play; report median and range of LCP/CLS/transfer, initial JS, interaction observations and waterfall. Count delayed automatic loops in QA-07; explicit play is the only media transfer exception. Repeat with reduced motion and data-saving/blocked-media scenarios. A proposed 3 MB loop cannot bypass the entry budget merely by waiting for page load. Budget exceptions need evidence, mitigation and owner approval.

After an authorized deployment, separately measure real response headers/compression/ranges and field data where available; local results cannot establish production/CDN behavior. These checks are planned, not performed during M0.

## Open questions

| ID | Decision | Owner / gate | Interim position |
| --- | --- | --- | --- |
| Q01 | Creative/engineering audience priority? | Owner / M1b | Creative-first hypothesis |
| Q02 | Publishable Aurelia/reel/VFX assets and credits? | Owner / M1b | Readiness Unknown |
| Q03 | Engineering/CAD projects and individual roles? | Owner / M1b | No assumed cards |
| Q04 | Racing methods, provenance and supported results? | Owner / M1b | No assumed metrics/algorithms |
| Q05 | Biography, contact and launch language(s)? | Owner / M1b | No invented addresses or translation promises |
| Q06 | Approved references, fonts and identity? | Owner / M1b | Provisional tokens/system font |
| Q07 | Stack and explicit route-HTML generation method? | Technical reviewer + owner / M1a | Neutral ADR 0002 comparison |
| Q08 | Final slugs and racing hierarchy? | Owner + reviewer / M1a, content confirmation M1b | Prefer `/engineering/ibm-ai-racing/`; bonus is a label |
| Q09 | Media host, budget, renditions and privacy? | Owner + reviewer / M1b | No service provisioning |
| Q10 | Any visitor goal requiring WebGL? | Owner / after content proof | Deferred, optional |
| Q11 | Named reviewer/integrator and exclusive path ownership? | Owner / prerequisite to M1a or concurrent work | Must be recorded before work starts |
| Q12 | QA targets, reference profile and real-device access? | Owner + reviewer / M1a; fidelity M1b | Proposals, not measured results |
| Q13 | Publishing exposure decision and branch/PR protection? | Owner / before M0 merge | No merge while unresolved; state Unverified |
| Q14 | Local/hosted preview and future deployment pipeline? | Owner + reviewer / M1a | ADR 0006 Proposed; local output first |
| Q15 | Code/docs and creative-asset licensing? | Owner / before public content release | No blanket licence assumption |

## Change control

Tasks cite the IDs above; new obligations receive new IDs. Evidence rules live in CONTENT_PLAN, execution rules in AGENTS, integration/production gates in AGENT_WORKFLOW and architectural status in the ADR register. Change affected references together. Revisit analytics/forms only for an approved measurement/contact need; evaluate data, third parties and cost first.
