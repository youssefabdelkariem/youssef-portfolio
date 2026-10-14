# Design system direction

Status: **Proposed**; visual identity awaits M1b owner review. Related: FR-06, QA-01, QA-03, QA-04, QA-13, QA-17. Review findings: I-5, I-6, M-5; full mapping in [remediation](reviews/M0_REMEDIATION.md).

## Principles and tokens

Let finished CGI and engineering evidence lead. Use calm composition, generous spacing, readable captions and deliberate pacing. Avoid decorative telemetry, scroll hijacking and effects that obscure the work.

| Token | Candidate | Use |
| --- | --- | --- |
| canvas | `#101216` | Current test-page background; provisional branding |
| surface | `#191D24` | Panels |
| text-primary | `#F4F4F5` | Main text |
| text-secondary | `#A8ADB7` | Supporting text |
| accent | `#AAC4FF` | Links/highlights |
| focus-ring | `#AAC4FF`, 3 px outline, 3 px offset | Visible keyboard focus on dark surfaces; add contrasting dark backing on variable imagery/light surfaces |
| border | `#343B47` | Decorative separators only, never sole focus/control boundary |
| space | `4, 8, 12, 16, 24, 32, 48, 64, 96 px` | Scale large gaps down on mobile |
| radius | `0, 4, 8 px` | Restrained corners |

Use one token source; optional Tailwind mapping comes later, outside the stack spike. Check actual text contrast (normal 4.5:1, large 3:1) and meaningful UI/focus contrast (3:1 where applicable). Do not put essential text on uncontrolled film without a tested backing. Focus must remain visible and unobscured on every background; the token alone is not proof of conformance.

## Layout and component contracts

Start with a system sans-serif; licence/approve any display face through Q06. Proposed body: 16–18 px, line height 1.5–1.7, measure around 65 characters. Fluid headings wrap without fixed-height clipping. Candidate content maximum is 1200 px with 20–24 px mobile gutters. Check 320, 390, 768, 1024 and 1440 CSS px plus zoom. Images reserve aspect ratio; crop/focal point follows the approved asset.

| Component | Required behavior |
| --- | --- |
| Navigation | Current location, semantic anchors, visible focus; keyboard/touch menu; no hover-only destinations |
| Work index/card | Aurelia hierarchy plus other approved CGI/VFX work; descriptive links, captions and no nested controls |
| Case study | Ordered semantic headings, explicit roles/credits and labelled evidence |
| Media/hero | Poster-first; deliberate film playback and QA-12 accessibility; optional loop only under QA-17 and QA-07 |
| Breakdown comparison | Label stages; keyboard control and static side-by-side alternative |
| Contact | Approved functional destination; buttons only for actions |
| Optional 3D | Deferred loading, bounded canvas, static alternative and loading/error state |

## Motion and fidelity

Proposed durations: 120–220 ms for microinteractions, 250–450 ms for orientation transitions. Prefer opacity/transforms and CSS/native APIs. Cross-document View Transitions may progressively enhance ordinary links where supported; navigation must work without them. Reduced motion removes parallax, camera travel and scroll scrubbing. Pause moving content; stop optional rendering when offscreen. No forced audio or essential information solely in animation.

A cinematic hero may move after the poster, but mobile/data-saving/reduced-motion modes retain the still. Delayed autoplay still counts toward the entry transfer budget. GSAP needs a concrete approved sequence and cleanup plan; Three.js/R3F need a justified interaction and measured budget. Colour/rendition decisions follow [ADR 0004](adr/0004-media-strategy.md#fidelity-and-formats).

## Review gate

M1b reviews references and an annotated layout, representative work cards, case-study typography, media controls and mobile navigation. Record contrast, focus, zoom, motion and fidelity findings. [Requirements](REQUIREMENTS.md) own measurable targets; no design implementation is authorized by this proposal.

## M1b exploration status (2026-10-15)

The tokens above remain the provisional M1a set and are **not** replaced. Owner direction recorded: cinematic, elegant, distinctive, dark, minimalist, with a typography-first `YOUSSEF.STUDIO` wordmark. Two candidate systems (A: Cinematic Editorial, B: Digital Atelier) with palettes, type, motion and mobile treatments are specified and compared in [M1B_DESIGN_REVIEW](reviews/M1B_DESIGN_REVIEW.md). One will be promoted into this document only after owner selection. Unchanged constraints for either: poster-first heroes, text on solid backing rather than over imagery, reduced-motion parity, visible focus, and no webfont until licensed (Q06).

