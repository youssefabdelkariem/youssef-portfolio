# M1b design decision record: hybrid identity and homepage

Date: 2026-10-15. Recorded by Claude Code from the owner's instruction. Status: **owner direction recorded; implementation on a feature branch, not deployed.** No ADR status changed. Related: FR-06, FR-01, FR-02, QA-01 to QA-09, QA-17, Q01, Q06; [design review](M1B_DESIGN_REVIEW.md), [content manifest](../CONTENT_MANIFEST.md).

## Decision (owner)

Use a hybrid of the two explored directions. Direction A (Cinematic Editorial) is the primary identity. Direction B (Digital Atelier) contributes technical elements to Engineering and IBM AI Racing. Typography, spacing, navigation and colour tokens stay shared so the site reads as one. Wordmark `YOUSSEF.STUDIO`; hero headline "Engineering precision. Cinematic imagination."; system fonts provisionally; no external fonts.

## How it was applied

| Area | Direction A (primary) | Direction B (accent only) |
| --- | --- | --- |
| Colour | ink `#0b0a09`, panel `#141210`, bone `#ebe5da`, muted `#a39b8d`, brass accent `#c9a96e`. Applied site-wide as the global tokens | vermilion `--signal` `#ff5a36`, used only in the engineering/racing teaser (eyebrow, index numbers, dimension lines) |
| Type | Display serif stack for headings, system sans for body, spaced caps for labels | System monospace for technical labels in the `.tech` block only |
| Navigation | Wordmark with a quiet link row; mobile uses a native `<details>` overlay | none |
| Hero | Letterboxed 2.39:1 plate with the headline on solid ink below | none |
| Engineering teaser | Same layout grid and headings | Numbered index rows with a wipe on hover, and a line-drawn technical plate |
| Motion | One-shot gate opening, headline rise, streak and scroll reveals | Snappy 180 ms row wipe |

Departures from the explored pages, with reasons:
- **Wordmark placement:** the explored centred wordmark crowded five links at desktop widths and wrapped "VFX Portfolio". The wordmark is now left-aligned with links right. Home is reached through the wordmark; the menu overlay also lists Home.
- **No continuous animation:** the explored streak drifted for ever. It now plays once and rests, in line with the brief.
- **Sitewide tokens:** inner pages (VFX Portfolio, Aurelia, Engineering, racing, About, Contact) inherit the new tokens, header and footer but their content and structure were not changed, and none was implemented further.
- **Wordmark versus metadata:** the visible wordmark is `YOUSSEF.STUDIO`; page titles and the accessible name use "Youssef Studio" for readability.

## Homepage structure (all content provisional)

1. Header with responsive navigation. 2. Cinematic hero with a real-media slot and placeholder fallback. 3. Introductory statement with three discipline notes drawn from the owner's stated scope. 4. Featured Aurelia (placeholder plate; role and credits "pending confirmation"). 5. Selected VFX work: two honest empty slots and a link to `/work/`; no project is invented. 6. Engineering and IBM AI Racing teaser in the technical register. 7. Contact/About call to action. 8. Footer.

## Real-media slot contract

`src/data/home.ts` holds `hero` and `aurelia` references, both `null`. A reference needs a verified derivative with explicit width and height and a descriptive alt. `Plate` then renders the image (eager and high priority for the hero), hides the placeholder label, and if the image fails to load marks the plate `data-state="failed"` so the labelled placeholder returns without any layout shift. Without JavaScript a failed image falls back to the browser's alt text over the dark plate. Poster target remains at most 250 KB (QA-08).

## Owner approvals still needed

- Real hero still and Aurelia frame: manifest items M-01 and M-02 (also M-03 to M-08 before the case study).
- Final font route and wordmark letterforms (Q06); the current serif and system sans resolve differently by operating system.
- The Home hero copy is the owner's headline; the supporting sentence and the section copy are proposed and unapproved.
- Whether "Let's talk about your project." is an acceptable call to action before a real contact destination exists (Q05).

## Owner decisions after the first review (2026-10-15)

Approved: the left-aligned wordmark. Kept provisionally: system fonts and the current call-to-action copy. Authorized: pushing the homepage and exploration branches (done). **The homepage visual design is not yet approved**; the screenshot set for review is [HOME_REVIEW](../design/m1b/HOME_REVIEW.md). No redesign was made in response to these decisions.

## Visual approval and refinements (2026-10-15)

Owner verdict: **approve with refinements**. The overall Direction A-led hybrid identity is approved; the warm-black, bone and restrained brass palette and the left-aligned `YOUSSEF.STUDIO` wordmark are preserved unchanged. Work is on `feat/m1b-homepage-refine`. No external fonts or media were added.

| Request | Change | Evidence |
| --- | --- | --- |
| Mobile headline | Each sentence now sits on one line from 320 px up (28 px at 320, 31 px at 390, 34 px at 430); fluid size `clamp(1.75rem, 8vw, 3.75rem)` below 860 px; tighter leading and tracking; stacked, equal-width buttons on phones | `npm run test:home`: lines per sentence 1+1 at 320, 360, 390, 430, 560, 768, 1024 and 1440 px, no overflow. Before: four lines at 390 px |
| Typography | System stacks kept. Added kerning, optical sizing, common ligatures, `text-wrap: pretty` for body text and balanced headings; heading leading 1.06 | Visual review; no new files |
| Display fonts | Two OFL candidates evaluated, not added: Instrument Serif and Newsreader | [M1B_FONT_EVALUATION](M1B_FONT_EVALUATION.md) |
| Project sections | Featured Aurelia is now a full-width cinematic plate with a three-part caption row (title, summary and action, facts). Selected VFX work is an asymmetric 7/5 column composition with numbered captions; both slots remain labelled "Project slot, none verified yet" | Screenshots in `docs/design/m1b/`; before images in `docs/design/m1b/before/` |
| Real-image readiness | See below | `npm run test:home` |
| Animation variance | See below | A/B runs below |

### Hero ready for a real Aurelia image

- The hero box is sized by CSS only, never by the image: height `max(clamp(24rem, 56svh, 42rem), 100vw / 3.4)` on desktop, 3:2 on tablets, 4:5 on phones. The image is absolutely positioned with `object-fit: cover` and a configurable focal point, so loading it cannot shift layout.
- `Plate` accepts `focal`, `srcset`, `sizes` and an optional art-directed `mobileSrc` (used at 560 px and below). Without `mobileSrc`, phones show a centred 3:2 crop of the desktop image. The artwork guide is in `src/data/home.ts`: master 2880 x 1206 (2.39:1), mobile crop 1200 x 1500 (4:5), subject inside the central 70% vertically, at most 250 KB per variant.
- Measured with synthetic artwork and a 1.2 s delayed image load (test-only, never shipped): layout shift 0.0 px at eight viewports from 320 x 640 to 2560 x 1080; the central 70% vertical band stays visible everywhere (from 70% at 2560 x 1080 to 100%; 84% at 1440 x 900 and 80% for the 4:5 art at 560 x 900); desktop and mobile art are not cropped horizontally outside the 561-860 px band; and the correct source is chosen at each width. At 768 px the desktop image shows 63% of its width (centred), which is why a focal point exists.
- A fix found by the new media test: the image-failure fallback targeted the image's parent, which became `<picture>`; it now targets the plate. `npm run test:media` passes again.

### Opening animation: clip-path versus transform

Earlier mobile Lighthouse runs on Chrome varied from 83 to 100 (total blocking time 0-697 ms) on a page with no JavaScript bundle. The hero opened with an animated `clip-path` on the whole plate, a main-thread paint animation. The alternative opens two letterbox bars with `transform` (compositor-only). The look is the same (frames compared at 250 ms); the bars stay hidden under reduced motion and whenever animations do not run.

Chrome disappeared from the test machine during this work, so the comparison ran on Edge 155 (Chromium) with Lighthouse 13.5, mobile preset, alternating variants, sequential runs, no other load from this session:

| Condition | Variant | Performance | Total blocking time | Longest long task before first paint |
| --- | --- | --- | --- | --- |
| 4x CPU (default), 5 runs each | clip-path | 100 in all 5 | 0 ms in all 5 | 138, 159, 260, 207, 224 ms (mean 198) |
| 4x CPU (default), 5 runs each | transform bars | 100 in all 5 | 0 ms in all 5 | 188, 208, 226, 183, 193 ms (mean 200) |
| 8x CPU (stress), 3 runs each | clip-path | 100 in all 3 | 0 ms in all 3 | 464, 386, 371 ms (mean 407) |
| 8x CPU (stress), 3 runs each | transform bars | 100 in all 3 | 0, 16, 0 ms | 392, 345 (plus 81), 418 ms (mean 385) |

Result: no measurable difference, and the earlier variance did **not** reproduce on a quiet machine with either variant. The cause of the Chrome-era variance is therefore unproven. Contention on the test host is the most likely explanation (host benchmark index 1,444 in the worst run versus about 3,000-3,600 now), and the earlier reduced-motion diagnostic is consistent with, but does not prove, an animation cost. **Decision:** keep the transform version. It was never slower in these 16 runs, avoids a main-thread paint animation by construction, and looks the same. The browser changed from Chrome to Edge, so the two sets of numbers are not directly comparable.

### Final controlled mobile Lighthouse (refined build)

Edge 155, Lighthouse 13.5, mobile preset, three sequential runs: performance 100, 100, 100; accessibility, best-practices and SEO 100 each time; FCP and LCP 0.90 s; total blocking time 0 ms; layout shift 0; host benchmark index 2,920-3,461; 26.8 KB transferred uncompressed. This is placeholder content only, so it does not predict performance with a real hero image.

### Still open

Font decision (Q06); real hero and Aurelia imagery (manifest M-01, M-02); owner confirmation of the supporting copy. The VFX portfolio and Aurelia pages remain unstarted.

