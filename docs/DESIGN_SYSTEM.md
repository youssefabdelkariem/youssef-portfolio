# Design system direction

Status: **Proposed**. No final identity, fonts, imagery, or interaction design has been approved. This is a testable starting point for FR-06 and QA-01–QA-08 in [requirements](REQUIREMENTS.md), not instructions to implement UI in M0.

## Visual principles

Let actual CGI and engineering artifacts carry the visual emphasis. Use calm composition, deliberate spacing, clear typographic hierarchy, and short explanations. Technical sophistication should be visible in evidence and precision. Avoid decorative terminal copy, fabricated telemetry, excessive gradients, or effects that compete with work.

## Provisional tokens

| Token | Candidate | Use / validation |
| --- | --- | --- |
| canvas | `#101216` | Dark background; derived from current test page, not final branding |
| surface | `#191D24` | Cards/panels; distinguish through spacing and borders too |
| text-primary | `#F4F4F5` | Main text |
| text-secondary | `#A8ADB7` | Supporting text; verify against every actual surface |
| accent | `#AAC4FF` | Links/focus candidate; test contrast and visibility |
| border | `#343B47` | Decorative separators; not sufficient alone for focus or control boundaries |
| space | `4, 8, 12, 16, 24, 32, 48, 64, 96 px` | Consistent rhythm; scale larger gaps down on mobile |
| radius | `0, 4, 8 px` | Restrained corners; media shape follows actual content |

Use CSS custom properties if adopted; Tailwind theme mapping is optional pending ADR 0002. Do not maintain duplicate token systems. Check WCAG contrast in final combinations: normal text 4.5:1, large text 3:1, meaningful UI boundaries/focus 3:1 where applicable. Do not place text directly over uncontrolled video without a tested solid/opaque backing.

## Typography and layout

Start with a system sans-serif; a licensed display face can be evaluated at Q06. Body text candidate: 16–18 px, line height 1.5–1.7, readable measure around 65 characters. Fluid headings must wrap without clipping or relying on fixed-height containers. Project captions stay readable on small displays; avoid tiny all-caps metadata as the only explanation.

Proposed content maximum is 1200 px, with 20–24 px mobile gutters and larger desktop margins. Use content-driven breakpoints; verify at 320, 390, 768, 1024 and 1440 CSS px and at zoom. Grids collapse to reading order on mobile. Wide engineering diagrams may use a labelled zoom/download treatment rather than illegible shrinking. Do not assume every render is landscape; crop/focal point needs owner approval.

## Component contracts for later implementation

| Component | Required states and behavior |
| --- | --- |
| Header/navigation | Current location, visible focus, keyboard order; menu usable without pointer; no hover-only routes |
| Project card | Genuine title/type, useful image alt, clear link; no fictional metrics; whole-card interaction avoids nested links |
| Case-study section | Semantic heading order, readable prose and captions, explicit role/credits |
| Video | Poster, deliberate play, controls, captions/transcript where needed, error fallback/link; no automatic sound |
| Breakdown comparison | Label both views; keyboard alternative and static side-by-side fallback if slider used |
| Contact action | Correct destination and descriptive label; no nonfunctional form or invented address |
| Optional 3D | Deferred, bounded dimensions, explicit loading/error state, static poster alternative, keyboard equivalent |

Use anchors for navigation and buttons for actions. Keep native focus behavior unless improving it with tested equivalents. Never make an entire case study dependent on a canvas.

## Motion

Proposed microinteraction duration: 120–220 ms; restrained section transitions: 250–450 ms. Animate opacity/transforms only when they help orientation. Content must be visible if animation fails. With `prefers-reduced-motion: reduce`, remove parallax, camera travel and scroll scrubbing; provide static content and manual media controls. Never hijack wheel/touch scrolling or hide a required action behind an animation timeline.

Use CSS first. GSAP is a candidate only for an approved sequence whose complexity warrants it; see [ADR 0002](adr/0002-tech-stack.md). It must clean up listeners/animations on navigation and honor reduced-motion changes. Do not implement custom cursors or scroll libraries by default.

## Design review gate

In M1, agree reference imagery and an annotated layout direction, test a representative card, case-study text block, media control and mobile navigation, and record contrast/zoom/reduced-motion findings. Tokens and screens remain Proposed until owner sign-off. See [development plan](DEVELOPMENT_PLAN.md) for scope boundaries.
