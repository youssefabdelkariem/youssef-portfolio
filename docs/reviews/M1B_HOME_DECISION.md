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
