# ADR 0004: Progressive media delivery

Status: **Proposed**. Recorded: 2026-10-15. Decision owner: owner with technical reviewer; approval pending.
Related: FR-01–FR-04, QA-04, QA-06–QA-09, Q02–Q04, Q09–Q10.

## Context

CGI films, renders and breakdowns are central to the portfolio, but no usable assets, rights, sizes or hosting budget have been verified. Full master renders and long films can overwhelm mobile transfer and repository history. Existing DNS uses Cloudflare, but that fact does not establish permission or suitability for a paid media service.

## Proposal

Serve a meaningful static poster and text first. Use responsive image derivatives with explicit dimensions and useful alt/captions. AVIF/WebP with compatible fallback are candidates; verify visual fidelity on gradients, specular detail and text. Load below-fold images lazily; avoid deferring the actual LCP poster unnecessarily.

Full CGI film is user-triggered, with native controls, no automatic sound, a poster, accessible text context, captions/transcripts as needed, and a failure link/message. `preload="none"` or a measured metadata policy is preferred; it is a hint and the network trace must confirm behavior. Optional ambient video requires a separate mobile/reduced-motion decision and counts toward initial transfer if automatically fetched.

Keep master media outside Git. Small approved poster/image derivatives may be versioned; use content-versioned filenames and record rights/source separately. Evaluate dedicated video delivery or externally hosted playback before committing long films. No host, external account, tracking embed, purchase or upload is selected/authorized in M0.

## Alternatives and tradeoffs

| Option | Benefit | Tradeoff |
| --- | --- | --- |
| Small static images on Pages | Simple versioned deployment | Repository growth and transfer; not a master-asset archive |
| Short optimized video file on Pages | Native control and few moving parts | Transfer/limits and rendition management; measure rather than assume suitability |
| Object storage/CDN | Control over files/cache and variants | Cost, configuration, CORS, bandwidth and maintenance |
| Managed video service | Renditions/adaptive streaming and player features | Cost/vendor dependence; privacy, captions and embed accessibility review |
| External video platform embed | Existing playback tooling | Branding, tracking, third-party JS; load only after consent where required and user intent |
| Live 3D | Inspectable object interaction | GPU/battery, model/texture size, accessibility/fallback and lifecycle costs; optional later |

## Provisional budgets and pipeline

Initial transfer and poster/JS limits are canonical in [requirements](../REQUIREMENTS.md#proposed-release-quality-requirements). Additional planning candidates: a short optional preview <= 3 MB, a deliberate full-film 720p rendition around 2–4 Mbps and 1080p around 4–8 Mbps. These are starting estimates, not guarantees of acceptable CGI quality. Duration multiplies transfer: 60 seconds at 4 Mbps is roughly 30 MB before overhead. Test real footage; use adaptive delivery or deliberate quality choice if needed rather than degrading imagery blindly.

Pipeline: verify rights -> select representative frame/crop -> export derivatives -> measure fidelity/bytes -> add manifest metadata -> test on mobile/slow connection -> owner review -> publish approved variants. Handle failed network, unsupported codec, reduced motion and missing WebGL without hiding the story. Defer optional models and pause rendering offscreen; use a poster when WebGL fails. See [CONTENT_PLAN](../CONTENT_PLAN.md).

## Consequences and risks

The repository stays small and core pages survive failed media, but derivative production and an external delivery service may add maintenance and cost. CDN/player privacy, licensing, CORS and caption support must be reviewed before adoption. A poster-first approach trades immediate motion for predictable mobile access; the owner should assess this with actual footage. No masters or external service credentials belong in the public repository.

## Acceptance gate

M1 must identify actual asset sizes/durations/rights, run a representative mobile network/quality test, evaluate captions and privacy requirements, choose a host/rendition plan with cost approval if applicable, and document fallback/cache behavior. Accept only after owner review. Revisit if transfer/cost/quality evidence changes or library licenses/platform limits change.

Sources: [HTML video behavior](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video), [R3F performance guidance](https://r3f.docs.pmnd.rs/advanced/scaling-performance). These inform candidates; final budgets are project proposals.
