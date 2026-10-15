# ADR 0004: Progressive media delivery and fidelity

Status: **Proposed**. Updated 2026-10-15. Owner: repository owner with technical reviewer. Related: FR-01b, FR-01c, FR-02, FR-04, QA-04, QA-07, QA-08, QA-12, QA-13, QA-17, Q09, Q10; findings I-2 through I-6.

## Context and proposal

No publication-ready media inventory or hosting budget is verified. Historical Cloudflare configuration is qualified in the [evidence register](../SITE_ARCHITECTURE.md#infrastructure-evidence); DNS delegation does not imply current proxying or a media service choice.

Use an optimized responsive poster for LCP, explicit dimensions and readable context. Full films/reels are user-triggered, with controls, fallback and the [media accessibility policy](../CONTENT_PLAN.md#media-accessibility-policy). `preload` is a hint; verify actual requests. Masters stay outside Git; version approved public derivatives with content hashes. Respect Pages size/bandwidth constraints when evaluating film hosting.

## Cinematic experience and budgets

A restrained hero can transition from a still to an optional muted `playsinline` loop, with visible pause and reduced-motion/data-saving poster mode. On mobile, prefer explicit play. An automatic loop, even started after page load, counts with all entry resources toward QA-07. The earlier <= 3 MB preview candidate is reserved for explicit user-requested playback; it is **not** an additional automatic-load allowance. If a loop cannot fit both QA-07 and visual-fidelity targets, keep the poster or require play rather than harming mobile performance.

Below-fold media loads near visibility; pause decoding/rendering offscreen. Full-film bytes/bitrate depend on real footage, duration and tested quality, not a fixed arbitrary encode target. Record quality/transfer at chosen renditions and compare adaptive versus progressive delivery under the reference profile.

## Fidelity and formats

M1b evaluates representative gradients, dark detail, metallic highlights, fine text and fast motion against approved reference frames:

- Document source colour space/transfer/HDR status and export transform. Use an approved sRGB SDR image baseline and correctly tagged SDR/Rec.709 video baseline; tone-map HDR/wide-gamut sources deliberately. Wide-gamut/HDR enhancements need tested fallbacks. Avoid double transforms and stripped/mismatched colour metadata.
- Test AVIF/WebP candidates and compatible fallback for banding, chroma edges and specular detail; compare at matched display size, not just smallest byte size. Record dimensions, quality settings, profile and owner visual sign-off.
- Provide a tested H.264/MP4 compatibility rendition; choose profile/level/pixel format based on target playback and fidelity, not an unconditional Baseline-profile rule. VP9/WebM or AV1 may supplement it after browser/device/decode-cost tests.
- Evaluate HLS only if real duration/network evidence warrants adaptive streaming. Detect native support; otherwise a reviewed JS player and its accessibility/transfer cost are required, or use progressive MP4. It is inaccurate to assume every non-Safari browser always needs the same player path.
- If Q10 justifies 3D later: compare glTF/GLB, Draco or Meshopt geometry compression and KTX2/Basis texture delivery, including decoder bytes, startup/GPU memory and static fallback. Provisional starting caps: <= 5 MB explicitly requested scene transfer, 1K textures by default and 2K only with evidence; record draw calls/texture memory and pause offscreen. These caps are proposals, not implemented assets or exceptions to the no-automatic-model entry policy.

## Alternatives and tradeoffs

Pages images/small video keep delivery simple but consume repository/site/bandwidth budgets. Object storage/CDN offers variant/cache control with operational/cost/CORS obligations. Managed video supplies rendition/player features at vendor/cost/privacy expense. Platform embeds add branding/tracking/scripts; use intent-based loading and a reviewed privacy decision. Live 3D costs GPU/battery and adds failure modes; rendered imagery is sufficient unless a concrete interaction is justified.

No service/account/upload is adopted by this record. Response compression and byte-range support must be measured, not inferred from format or provider. Cache headers are not assumed configurable on Pages; content hashes avoid stale-asset replacement. A transcript is not treated as a blanket AA substitute for synchronized audio description.

## Consequences and acceptance gate

Derivative creation, captioning/description and visual review add work but protect the quality/accessibility of the flagship. M1b needs real asset metadata/rights, accessible playback deliverables, reference-frame comparisons, network/seek tests, costs/privacy and owner approval before acceptance. M1a can test mechanics with fixtures, but cannot establish actual CGI fidelity. Revisit on measured cost/quality/performance or service changes.

References: [HTML video behavior](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/video), [video codec guide](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Formats/Video_codecs), [streaming delivery](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Streaming), [media accessibility sources](../CONTENT_PLAN.md#media-accessibility-policy), [Pages constraints](../SITE_ARCHITECTURE.md#pages-constraints).

## M1b evidence (2026-10-15)

Real Aurelia stills were converted and encoded under [M1B_AURELIA_MEDIA](../reviews/M1B_AURELIA_MEDIA.md). Findings: the project's AgX pipeline was reproduced to within 2 of 65,535 levels; dark smooth gradients band in AVIF at normal quality and in WebP at q95, and are clean in AVIF at q94 with `tune=iq` and triangular dither (hero 2880 px: 112 KB, all variants at most 130 KB, so the 250 KB goal is met without visible loss); WebP was dropped because it blocks at comparable sizes. Delivery is AVIF with a JPEG fallback in a `<picture>` element, art-directed at 560 px, with derivatives kept out of Git until the owner approves them. This is evidence for the owner; the status remains **Proposed**, and video hosting and the film are still undecided.
