# M1b design review: two visual directions

Prepared 2026-10-15 by Claude Code for the owner. Status: **Proposed; awaiting owner selection.** Scope is Phase 2 of [M1B_PLAN](../M1B_PLAN.md): exploration only. Both directions are single concept pages that use placeholder content, are `noindex`, exist only in a local build, and are not the site. Owner decisions that frame them are D-01 to D-06 in the [content manifest](../CONTENT_MANIFEST.md#a-owner-decisions-on-record-2026-10-15). No ADR was accepted.

## Preview locally

From the worktree for branch `feat/m1b-design-exploration` (Node 22.12 or newer):

```text
npm ci
npm run build:explore     # builds into dist-explore/ (the normal build is unaffected)
npm run preview:explore   # serves http://localhost:4322/explore/
```

Open `/explore/a/` (Direction A) and `/explore/b/` (Direction B). Try narrow windows (about 390 px), keyboard Tab, and your OS reduced-motion setting. The default `npm run build` never emits these routes, and the sitemap excludes them. Regenerate screenshots with `node scripts/shoot-explore.mjs`.

## Fonts and assets: licence position

Both directions use only system font stacks and no images, so nothing external is loaded and no licence is involved. System stacks render differently per OS (the screenshots are from Windows, where the serif resolves to Palatino Linotype), so neither direction is final typography. For production, self-hosted open-licence faces are recommended, but their licences were **not** verified here and nothing was downloaded or bundled: Direction A could pair a high-contrast display serif with a neutral sans; Direction B could pair a grotesque with a monospace. Candidates widely published under the SIL Open Font License include Instrument Serif or Fraunces for A, and Space Grotesk or Geist with JetBrains Mono for B. Confirm each licence at download and keep the licence file in the repo before adoption (Q06).

## Direction A: Cinematic Editorial

**Concept.** A film title sequence in a gallery. A letterboxed 2.39:1 plate opens like a gate above solid ink; the headline sits on plain background, never over imagery (so contrast does not depend on the final render). The tone is quiet, high-contrast and restrained.

| Aspect | Specification |
| --- | --- |
| Wordmark | `YOUSSEF.STUDIO`, display serif, uppercase, wide tracking (about 0.34 em), brass full stop |
| Navigation | Centred wordmark, links split to the right as small spaced caps; underline grows from the left on hover. Mobile: wordmark left plus a native `<details>` "Menu" that opens a full-screen serif link list (works without JavaScript) |
| Hero concept | Letterboxed plate (placeholder labelled "Aurelia hero still, 2.39:1, not approved") with an anamorphic light streak; large serif headline below, with an italic brass phrase. Sample headline "Images that were never filmed." is not approved copy |
| Featured work | Asymmetric 12-column editorial grid: one large 2.39:1 Aurelia frame, two stacked smaller slots; italic numerals and serif captions |
| Case-study section | Sticky facts column (role, credits, tools: all "pending") beside three stacked stage frames (plate, render, composite) with roman numerals and a caption each |
| Mobile | Plate becomes 4:5, single column, large serif links in a full-screen menu, frames reflow to full width |
| Palette | ink `#0b0a09`, panel `#141210`, bone `#ebe5da`, muted `#a39b8d`, brass `#c9a96e`, rule `#2e2924` |
| Type | Display serif stack (Iowan Old Style, Palatino, Georgia), light weight, tight tracking; humanist system sans for labels and body; spaced caps for metadata |
| Contrast (computed) | bone on ink 15.8:1, muted on ink 7.2:1, brass on ink 8.8:1; rules are decorative at 1.4:1 |

**Motion.**
- *Gate:* plate `clip-path` opens from 32% to full height in 1100 ms, ease-out.
- *Copy rise:* kicker, headline and note rise 16 px and fade in at 350, 500 and 650 ms delays, 800 ms each.
- *Streak:* a 14 s alternating horizontal drift of the light line (transform only).
- *Reveal:* sections rise 18 px and fade over 600 ms as they scroll in.
- *Hover:* nav underline grows over 350 ms.
- *Reduced motion:* all of the above are removed. Content is visible without JavaScript.

**Performance and accessibility.** Measured entry transfer 4.6 KB gzip (HTML + CSS + icon), no JavaScript bundles. In production the cost is the poster: target at most 250 KB (QA-08), AVIF/WebP with explicit dimensions; the hero motion is a CSS effect, so no video is needed for first paint. Native `<details>` menu keeps keyboard and no-JS users working. Risk: very dark gradients can band after compression; verify on the real still (QA-13). Brass and bone pass AA with wide margin.

## Direction B: Digital Atelier

**Concept.** A technical drawing sheet that happens to be a CGI studio. A fixed vertical index rail, monospace annotations, a wireframe plate with dimension lines, and a single signal colour tie the creative and engineering sides together.

| Aspect | Specification |
| --- | --- |
| Wordmark | `YOUSSEF.STUDIO`, monospace bold, wide tracking, set vertically on the rail (desktop) and horizontally in a top bar (mobile); signal-coloured full stop |
| Navigation | Fixed left rail with numbered index links (01 Work, 02 Case, 03 Eng, 04 Contact). Mobile: the four links become a bottom bar with 44 px targets |
| Hero concept | Heavy uppercase headline in two lines of white and two of signal colour, beside a line-drawn plate (wireframe cube, dimension lines, corner crop marks) captioned as a placeholder. Sample headline "Rendered with intent. Engineered to run." is not approved copy |
| Featured work | Index rows: number, huge uppercase title, mono tag, placeholder thumbnail; a panel wipes across the row on hover or focus. Whole row is one link; empty slots are not links |
| Case-study section | Stage viewer built from a native radio group (Plate, Passes, Composite) with a placeholder frame and caption, plus a static summary table that is also the non-interactive alternative. No JavaScript |
| Mobile | Bottom nav bar, horizontal wordmark top bar, rows stack, table text reduced to avoid overflow at 320 px |
| Palette | base `#0d0f12`, panel `#14171c`, line `#262b33`, text `#e8ecef`, muted `#98a2ad`, signal vermilion `#ff5a36` |
| Type | Heavy grotesque-style system sans for display (uppercase, tight), system monospace for labels and annotations |
| Contrast (computed) | text on base 16.2:1, muted 7.4:1, signal on base 6.2:1, dark text on signal 6.2:1; lines decorative at 1.35:1 |

**Motion.**
- *Draw-in:* plate strokes draw over 1500 ms with a snap curve (`cubic-bezier(.2,.8,.2,1)`); dimension lines follow 700 ms later.
- *Headline:* each line slides up about 0.3 em and fades over 500 ms, staggered 60 ms.
- *Rows and buttons:* panel wipe and fill take 180 ms; tabs switch in 160 ms.
- *Reveal:* sections rise 10 px over 300 ms.
- *Reduced motion:* strokes appear fully drawn, wipes and transitions are removed, content is visible without JavaScript.

**Performance and accessibility.** Measured entry transfer 5.2 KB gzip (the plate is about 1 KB of inline SVG), no JavaScript bundles. The radio-group viewer is keyboard-operable by default (a one-off check confirmed ArrowRight moves from Plate to Passes and swaps the panel; the tab group shows a focus ring). The rail and bottom bar take space: mobile content is padded so nothing is covered. Risk: monospace and uppercase at large sizes read well for short titles but strain longer project names; heavy display type depends on the final font.

## Side-by-side

| | A: Cinematic Editorial | B: Digital Atelier |
| --- | --- | --- |
| First impression | Quiet, luxurious, film-title feel | Precise, graphic, engineered |
| Fit with D-01 (studios, recruiters, clients first) | Strong: imagery leads and the frame is the star | Good, but reads closer to a technical portfolio |
| Fit with CGI/engineering crossover | Engineering sits behind as a calmer second act | Crossover is the identity itself |
| Distinctiveness | Editorial conventions are well-trodden but execution is tasteful | More unusual and recognisable; a risk of looking like a dev portfolio |
| Dependence on real imagery | High: needs a strong hero still and frames | Lower: the type and graphics carry weak or missing imagery |
| Typography risk | Needs a good licensed serif to avoid looking generic | Needs a strong grotesque and mono pair; system fonts look plainer |
| Navigation | Familiar top bar plus no-JS full-screen mobile menu | Distinctive rail and bottom bar; less conventional, so needs testing |
| Motion character | Slow, filmic, restrained | Snappy, mechanical, short |
| Mobile | Straightforward reflow | Needs the bottom-bar layout and careful table handling |
| Accessibility | All checks pass; fewest moving parts | All checks pass; radio viewer and rail need ongoing testing |
| Performance | 4.6 KB gzip, no scripts | 5.2 KB gzip, no scripts |
| Content-risk resilience | Weak placeholders look empty | Placeholders still look designed |
| Build effort for the full site | Lower | Higher (rail, rows, viewer) |

## Recommendation (for the owner to accept or reject)

Because the owner's first audience is VFX/CGI studios and Aurelia leads, Direction A is the better fit for the homepage, `/work/` and the Aurelia case study, provided a strong hero still exists. Direction B's strongest ideas (numbered index rows, the stage viewer with a static table, the engineering crossover treatment) could carry into the Engineering section as a controlled hybrid, giving that section its own technical register. This is a recommendation only; choose A, B, a hybrid, or ask for a revision.

## Verification (2026-10-15)

| Check | Result |
| --- | --- |
| `npm run test:explore` | Passed three consecutive runs on `/explore/`, `/explore/a/` and `/explore/b/`: axe (WCAG 2.x A/AA, 2.2 AA, best-practice) at 390 and 1440 px with 0 violations, no horizontal overflow from 320 to 1440 px, no running animation under reduced motion, content visible with JavaScript off, refresh stable, no console errors, no external requests |
| `npm run verify` (default site, with the new scripts) | Passed: docs check, type check (0 errors), build, built-output check, browser check; the default `dist/` contains no `explore` routes |
| Iteration noted | First runs failed on a skip-link colour override, an unlabelled notice region, a 16 px table overflow at 320 px and an axe reading taken mid-animation; each was fixed and the check now waits for finite animations to settle |
| Keyboard spot checks | Direction B: ArrowRight in the stage group changes stage and panel. Direction A: Enter on the focused Menu summary opens the overlay (one-off scripted checks, not a full screen-reader test) |
| Not done | Lighthouse and the YS Mobile v1 protocol (no real media); Firefox, Safari and real phones; screen-reader testing; testing with approved fonts or images |

## Screenshots

Captured from `dist-explore/` at 1440 x 900 and 390 x 844, JPEG, placeholder content only.

| | Desktop | Mobile |
| --- | --- | --- |
| Direction A | [hero](../design/m1b/a-desktop-hero.jpg), [full page](../design/m1b/a-desktop-full.jpg) | [hero](../design/m1b/a-mobile-hero.jpg), [full page](../design/m1b/a-mobile-full.jpg), [menu open](../design/m1b/a-mobile-menu.jpg) |
| Direction B | [hero](../design/m1b/b-desktop-hero.jpg), [full page](../design/m1b/b-desktop-full.jpg) | [hero](../design/m1b/b-mobile-hero.jpg), [full page](../design/m1b/b-mobile-full.jpg) |

Full-page captures of Direction B show the fixed rail or bottom bar once at its scroll position, which is a screenshot artefact.

## Owner selection (recorded 2026-10-15)

The owner chose a hybrid: Direction A as the primary identity and Direction B's technical elements for Engineering and IBM AI Racing, with the headline "Engineering precision. Cinematic imagination." and system fonts for now. Application and departures are recorded in [M1B_HOME_DECISION](M1B_HOME_DECISION.md). The gate text below is kept as the original record.

## Owner approval gate

Implementation of the homepage, `/work/` and Aurelia surfaces (M1b phases 3 to 5) will not start until the owner records: (1) the chosen direction (A, B, hybrid or revise); (2) the typography route (approve system stacks for now, or choose licensed webfonts, Q06); (3) confirmation of wordmark letterforms and hero copy; and (4) which of the manifest items M-01 to M-08 can be supplied first. Until then the production-style pages stay as the M1a placeholders.
