# Aurelia hero selection: four-way comparison

Date: 2026-10-15. Prepared by Claude Code at the owner's request. Status: **approved by the owner on 2026-10-15 as recommended** (desktop A, phone C); the recommendation text below is kept as written. Before the approval nothing was switched or committed. The site still uses the Shot 002 macro lens everywhere, no image derivative was added to Git, and the candidate files live in `local-assets/` and `previews/` (outside the repository). Related: [M1B_AURELIA_MEDIA](M1B_AURELIA_MEDIA.md), [CONTENT_MANIFEST](../CONTENT_MANIFEST.md), QA-08, QA-12, QA-13.

Originals were read-only throughout: EXRs, Blender and Nuke files and composites were opened for reading or listed by name only. Candidate frames were converted with the project's colour pipeline (Blender AgX Base, sRGB), validated earlier to within 2 of 65,535 levels of the project's own output.

## Candidates

| | Source | Type | Cycles samples | Device in frame |
| --- | --- | --- | --- | --- |
| **A** (current) | Shot 002, frame 1: macro of the camera lens | Final composite (project's 16-bit still) | 512 | Lens only |
| **B** | Shot 002, frame 72: whole phone floating in the studio | Final composite (project's 16-bit still) | 512 | Whole device, 72% of frame height |
| **C** | Shot 003, frame 1: phone upright on black, angled, rim-lit | Final composite: the Shot 003 script applies only the AgX display transform to the beauty, no grade, so the still is the same pixels | 128 | Whole device, 92% of frame height |
| **D** | Shot 005, frame 160: phone front on a grey gradient, screen off | Uncomposited render, display transform only | 300 | Whole device, about 95% of frame height |

Scanned and rejected before choosing C and D: Shot 003 frames 8 to 72 (the phone touches the bottom edge from about frame 22 and grows after that), Shot 005 frames 100 to 130 (close views of the lower edge) and 145 to 227 (the same front view as D), and Shot 002 frames 18 to 54 (device larger than frame 72).

## What the hero box actually shows

The homepage hero box is sized by CSS: 1440 x 504 (2.86:1) at a 1440 x 900 window, up to about 2.4:1 on tall windows, and 390 x 488 (4:5) on phones. A full-frame 16:9 still is therefore cropped to about 62% of its height on a typical laptop. A phone that is 72 to 95% of the frame height cannot fit; the only whole-device images in the five shots are tall objects in a wide frame.

Previews below are the real homepage with each candidate swapped in (same CSS, same crop rules), at 1440 x 900 and 390 x 844. Files: `previews/aurelia/hero-candidates/` (`compare-desktop-2x2.jpg`, `compare-mobile-4up.jpg`, `compare-sources-2x2.jpg`).

| | Desktop 1440 x 900 | Mobile 390 x 844 |
| --- | --- | --- |
| A | Lens fills the box and survives the crop. Strong, cinematic | Lens fills the 4:5 box. Strong |
| B | Only the middle of the phone shows: two lenses and the mark, with top and bottom clipped (about 86% of the device visible) | Whole phone visible with its shadow and cyclorama. Clear, calm |
| C | Upper part of the phone: lenses, flash and edge, bottom cut (about 68% visible); large black areas left and right | Whole phone, angled and rim-lit, large in frame. Dramatic, strongest product read |
| D | A slice of a black screen and edge. No branding, nothing to recognise | Phone shape visible but blank. Weak |

## Assessment

Scores are my judgement from 1 (poor) to 5 (strong), against the five criteria asked for.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Framing in the wide desktop hero | 5 | 2 | 2 | 1 |
| Visual impact | 5 | 3 | 4 | 2 |
| Product recognition | 3 | 5 | 4 | 2 |
| Mobile crop (4:5) | 4 | 5 | 5 | 3 |
| Image fidelity | 5 | 5 | 3 | 4 |

Fidelity detail (all denoised and clean; flat-region noise 0.03 to 0.04 levels in every candidate):

- **A, B:** 512 samples, project final composites. No concerns.
- **C:** only 128 samples, and 91% of its pixels are below 10/255, the worst case for banding. With the same AVIF settings (quality 94, `tune=iq`, dither) the near-black regions differ from the lossless reference by a mean of about 0.5 levels (99th percentile 2, maximum 4), so it is acceptable, but this is the candidate that would need a higher quality setting if chosen. The hero set is 89 KB at 2880 px.
- **D:** 300 samples, uncomposited, black screen with no detail.
- **Delivered sizes (AVIF 2880 px desktop / 900 px phone):** A 112 / 63 KB, B 72 / 33 KB, C 89 / 45 KB, D 44 / 26 KB. All are inside the 250 KB goal.

## Recommendation

**Keep A (the Shot 002 macro lens) as the homepage and case-study hero on desktop.** It is the only candidate that holds up in a 2.4 to 3.4:1 box, it is a final composite, and it carries the brand's visual idea (precision optics). The whole phone is shown straight away below it, in the featured plate (image B).

**For phones, use C as the art-directed crop** (`hero-m`), with B as the safer fallback. The site already serves a separate image at 560 px and below, so no layout or code change is needed, only a different 4:5 derivative. C reads as a complete, recognisable product at phone size and is more dramatic than B; B repeats the featured image a scroll further down and is calmer. If banding on a very dark phone screen worries the owner, choose B. **D should not be used.**

This is a recommendation. If the owner wants a whole device in the desktop hero, none of the existing frames does it: either render a pull-back version of the Shot 002 or Shot 003 camera (phone no more than about 55% of the frame height), or accept a different, taller hero box, which would change an approved layout. I do not recommend extending the canvas of an existing frame, because it invents pixels.

## Check for newer finished composites (read-only)

| Shot | Finding |
| --- | --- |
| 001 | No newer composite. The ProRes master `shot001_premium_4K_v002` (8 Oct) and a Nuke script that only reads and views the EXRs are unchanged. The Shot 001 still stays labelled "render, display transform only" |
| 005 | None. There is no composite folder for it, the 228 EXRs are unchanged since 14 Oct, and a new After Effects project (`Screen Animation.aep`) was saved on 15 Oct; its contents were not opened. The Shot 005 still stays labelled "uncomposited" |
| 003 | New: a final comp script and a 4K Rec.709 ProRes 422 HQ master were saved on 15 Oct. The comp is "combined-only, no grade, glow, sharpen, matte isolation or refocus" with the AgX display transform baked in. Stills from it may be labelled "final composite" |
| 004 | New: a final comp with report, verification files and a 4K master on 15 Oct. It adds a constant exposure lift of x1.12 before AgX. It is not a whole-device shot, so it is not a hero candidate; a still from it would need the x1.12 lift applied to match |
| 006 | A Blender file exists in the project; no renders were found for it |

## Proposed final media manifest (pending approval)

Only the hero crop for phones changes from the current local set. Everything else is as listed in [M1B_AURELIA_MEDIA](M1B_AURELIA_MEDIA.md).

| Slot | Set | Source | Label | Status |
| --- | --- | --- | --- | --- |
| Hero, desktop (home, case study) | `hero` | Shot 002, frame 1 | Final composite | Keep |
| Hero, 560 px and below | `hero-m` | **Shot 003, frame 1 (proposed)**, or keep Shot 002 frame 1, or Shot 002 frame 72 | Final composite (Shot 003: AgX display transform only, no grade) | Owner to choose |
| Featured plate (home, `/work/`, film slot) | `phone` | Shot 002, frame 72 | Final composite | Keep |
| Selected render 1 | `lenses` | Shot 002, frame 36 | Final composite | Keep |
| Selected render 2 | `phone` | Shot 002, frame 72 | Final composite | Keep |
| Selected render 3 | `wordmark` | Shot 001, frame 210 | Render, display transform only | Keep, label stays |
| Selected render 4 | `port` | Shot 005, frame 0 | Render, display transform only | Keep, label stays |
| Render passes (five stages) | `pass-*` plus `lenses` | Shot 002, frame 36 | Passes from the EXR; composite for the first stage | Keep |

The proposed `hero-m` set (900 px: 45 KB AVIF, 1200 px and 600 px variants) has been generated locally for review; it has not been added to the site.

## Approval questions

1. Hero on desktop: keep the macro lens (A)? Yes or no.
2. Hero on phones: use Shot 003 frame 1 (C, recommended), Shot 002 frame 72 (B) or keep the lens?
3. Do you want a pull-back render for a whole-device desktop hero, or is the featured plate enough?
4. Confirm the status labels: Shot 001 and Shot 005 stills stay "display transform only" unless you supply composites. Shot 003 may be called a final composite. Should I add a Shot 003 or Shot 004 still anywhere?
5. After you choose, may the final derivatives (about 1.8 MB) be committed, and the facts on the case study (samples, renderer, passes, object and material names) be published?
