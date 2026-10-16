# Content manifest (M1b phase 1)

Prepared 2026-10-15 by Claude Code. Implements the manifest described in the [content plan](CONTENT_PLAN.md#evidence-and-rights-gate). Readiness states: Unknown, Collected, Verified, Owner approved, Published. **No asset has reached Verified; none is approved for publication.** Nothing was copied into this repository. Local files were inspected only by listing names, types and sizes; no file contents were read, and exact private paths are deliberately not recorded here.

## A. Owner decisions on record (2026-10-15)

| ID | Decision | Effect | State |
| --- | --- | --- | --- |
| D-01 | Primary audience: VFX/CGI studios, creative recruiters, potential clients. Secondary: engineering recruiters and collaborators | Answers Q01: creative-first hierarchy | Owner approved |
| D-02 | Creative focus is premium CGI, 3D rendering and VFX; Aurelia is the flagship; Engineering and IBM AI Racing stay important secondary sections | Homepage and navigation weighting | Owner approved |
| D-03 | Astro approved as the *provisional* implementation framework | Does not accept ADR 0002, which stays Proposed | Owner approved (provisional) |
| D-04 | Wordmark direction: typography-first, `YOUSSEF.STUDIO` | Partially answers Q06; no logo mark | Owner approved (direction only; final letterforms pending) |
| D-05 | Visual direction: cinematic, elegant, distinctive, dark, minimalist | Frames the two explorations | Owner approved (direction) |
| D-06 | No deploy, no merge to `main`, no DNS change | Constraint | Owner approved |

## B. Facts verified from the repository

| ID | Fact | Evidence |
| --- | --- | --- |
| F-01 | Production site is a text-only deployment test; domain `youssef.studio` is in `CNAME` | `index.html`, `CNAME` on `main` |
| F-02 | Aurelia is described by the owner as a CGI smartphone commercial and the flagship | Owner statement (D-02), README, PROJECT_VISION |
| F-03 | IBM AI Racing League / TORCS is described by the owner as an autonomous racing project needing a dedicated page | Owner statement, FR-04 |
| F-04 | No public asset, credit, date, tool list, result or contact address exists in the repository | Repository inspection |

## C. Local asset candidates (located, not reviewed, not approved)

The owner holds an Aurelia project folder outside this repository (about 12 GB). Counts and sizes are from a listing taken 2026-10-15. Names inside the folders are not reproduced because they were not reviewed for confidentiality.

| ID | Group (top-level folder name) | Contents seen (types only) | Size | Possible use | State | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| C-01 | Shots | Six numbered shot folders and a diagnostic folder; roughly 750 files, mostly PNG frames and EXR, plus a few preview MP4s and contact-sheet JPGs | ~7.6 GB | Finished frames, stills, hero poster | Collected | Needs the owner to pick final frames. EXR and frame sequences stay out of the repo. |
| C-02 | Compositing | Two shot folders with 4K ProRes-class MOV exports, before/after and frame-comparison JPGs, a written change report | ~0.36 GB | Breakdown sets, film cut | Collected | A before/after pair is the closest thing to the FR-01b breakdown. Needs owner confirmation of what each shows. |
| C-03 | Shot Edits | One shot edit folder (Premiere project files) | ~1 MB | Reference only | Collected | Project files, not publishable media. |
| C-04 | Walkthrough | Five long screen-recording MP4s | ~3.6 GB | Process material | Collected | Raw screen recordings can expose software UI, paths or private data. Not suitable for publication as-is; may inform a short edited process clip. |
| C-05 | Models | Scene and CAD-style source files | ~9 MB | Reference for breakdown captions | Collected | Source files only. |
| C-06 | Validation* (five folders) | Internal check renders, about 50 files | ~28 MB | Possibly breakdown or process visuals | Collected | Appear to be internal QA renders; owner to say whether any are presentable. |
| C-07 | Milanote | Seven planning-board PDFs | ~1 MB | Concept/process visuals | Collected | Boards may embed third-party reference imagery with unknown rights. |
| C-08 | Aurelia I | Design-blueprint PDF and a camera-projection image | ~15 MB | Design/process visuals | Collected | Rights and confidentiality unreviewed. |
| C-09 | Other | Python build scripts, JSON, OCIO config, Nuke and Blender and Plasticity file formats | small | None | Not for publication | Source and tooling. File formats do not establish which tools the owner used; tools stay Unverified. |

No local material exists yet for the IBM AI Racing project, engineering/CAD projects, About or Contact; those were not looked for in this pass.

## D. Missing items and decisions (blocking placeholder replacement)

| ID | Missing | Needed for | Owner action |
| --- | --- | --- | --- |
| M-01 | Selected hero still (poster) and 3-6 finished frames, exported as approved derivatives | Homepage, `/work/`, Aurelia | Choose from C-01/C-02 and confirm each may be shown publicly |
| M-02 | Film or cut for public release, or a decision to show stills only | Aurelia playback | Choose a cut from C-02, or confirm stills-only |
| M-03 | Captions, audio description or approved text alternative; music and voice rights | QA-12 | Supply or confirm the film is silent video-only |
| M-04 | Role, credits and collaborators, dates | Fact panel | State precisely; mark team versus personal work |
| M-05 | Tools actually used | Fact panel, workflow | Confirm; the site lists none until then |
| M-06 | Which production stages were performed | Workflow section | Confirm or delete the four candidate stages |
| M-07 | 1-2 breakdown sets with the frame each came from | Shot breakdowns | Confirm what C-02 comparisons show |
| M-08 | Rights check on reference imagery inside boards, blueprints, or any third-party assets | Any process visual | Clear or exclude |
| M-09 | Other CGI/VFX projects, if any, with the same evidence; showreel yes/no | `/work/` | List or say none |
| M-10 | Approved font choice or webfont licence; wordmark letterforms; hero copy | Identity | Select a direction (see [design review](reviews/M1B_DESIGN_REVIEW.md)) |
| M-11 | Racing evidence: role, methodology, results with logs, demo footage, repository URL | `/engineering/ibm-ai-racing/` | Evidence located and checked 2026-10-16 ([M1B_ENGINEERING_RACING](reviews/M1B_ENGINEERING_RACING.md)); role wording, footage approval and eligibility still open |
| M-12 | Biography, contact destination, launch language, OG image, code/asset licence | About, Contact, release | Later (Q05, Q15, QA-14) |

## E. Readiness summary

| State | Count |
| --- | --- |
| Owner approved (decisions) | 6 (D-01 to D-06) |
| Verified (repository facts) | 4 (F-01 to F-04) |
| Collected (local candidates, unreviewed) | 8 groups (C-01 to C-08) |
| Verified assets for publication | 0 |
| Missing items | 12 (M-01 to M-12) |

Until M-01 to M-08 are resolved, the Aurelia and `/work/` surfaces remain placeholders.

## F. Aurelia render archive and derivatives (2026-10-15 update)

The owner authorized inspecting the local renders. Full method, source inventory and provenance: [M1B_AURELIA_MEDIA](reviews/M1B_AURELIA_MEDIA.md). Originals were read-only and are unchanged (snapshot comparison: 0 files changed or removed).

| ID | Item | State | Notes |
| --- | --- | --- | --- |
| C-10 | Render archive: five shots (250, 72, 72, 72 and 228 UHD EXR frames, about 246 GB) | Collected | Blender 5.2.2 LTS / Cycles, scene-linear Rec.709. Final status confirmed only for the Shot 002 composite |
| C-11 | Shot 002 final composite stills (frames 1, 36, 72, 16-bit) | Collected, derivatives made | Hero, camera-module and phone stills |
| C-12 | Display-transformed renders from Shots 001 and 005 | Collected, derivatives made | No composite or grade; status of those shots unconfirmed |
| C-13 | Shot 002 render passes (noisy, glossy, transmission, normals) | Collected, derivatives made | Genuine passes from the EXR, shown as a breakdown |
| C-14 | Web derivatives (40 files, 11 sets, 1.9 MB) | Owner approved 2026-10-15 | Committed under `public/media/aurelia/` with `manifest.json` (master file names and SHA-256, crops, sizes, PSNR) |

Facts read from the render files and project notes (not yet owner-confirmed): renderer and version, frame size, frame rate, samples per shot, passes, display transform, Shot 002 compositing steps, scene lighting and material names. These appear on the case-study draft.

Progress on missing items: M-01 (hero still and frames) has a provisional selection awaiting confirmation; M-07 (breakdown set) has a render-pass breakdown; M-02 to M-06, M-08 are unchanged (role, credits, tools confirmation, film, captions, rights). The Aurelia page shows "pending confirmation" wherever the owner's input is required.

## G. Hero selection and newer composites (2026-10-15 update)

[M1B_HERO_SELECTION](reviews/M1B_HERO_SELECTION.md) compares four hero candidates (Shot 002 frame 1 macro lens, Shot 002 frame 72, Shot 003 frame 1, Shot 005 frame 160) in the real homepage at desktop and phone sizes and recommends keeping the macro lens for desktop and Shot 003 frame 1 as the phone crop. Nothing was switched or committed. Read-only check of the project folder: new finished composites exist for **Shot 003** (final comp script and 4K ProRes master, 15 Oct) and **Shot 004** (final comp with report and master, 15 Oct); **none exists for Shot 001 or Shot 005**, whose stills therefore stay labelled "render, display transform only". A Shot 006 Blender file and an After Effects "Screen Animation" project also appeared; neither was opened and no renders for Shot 006 were found.

| ID | Item | State |
| --- | --- | --- |
| C-15 | Shot 003 final composite (comp script and master) | Collected; first frame used as a hero candidate, derivatives local only |
| C-16 | Shot 004 final composite (comp, report, master) | Collected; not used yet |
| C-17 | Shot 006 Blender file, Screen Animation project | Located by name only; not opened |

## H. Approved Aurelia media (2026-10-15)

Approved by the owner on 2026-10-15. Pipeline: read-only EXR or project still, converted with Blender 5.2.2 AgX Base for an sRGB display (validated to within 2 of 65,535 levels of the project's own output), 16-bit master, linear-light resize, dither, AVIF (quality 94, `tune=iq`, 4:4:4) plus a JPEG fallback. No WebP. Originals untouched. Masters stay outside the repository; `manifest.json` records each master's file name and SHA-256.

| Slot | Set | Source shot and frame | Label shown on the site | Approval |
| --- | --- | --- | --- | --- |
| Hero, desktop (home and case study) | `hero` | Shot 002, frame 1 | Final composite | Approved |
| Hero, 560 px and below, homepage | `hero-home-m` | Shot 003, frame 1 | Final composite (AgX display transform only, no grade) | Approved |
| Hero, 560 px and below, case study | `hero-m` | Shot 002, frame 1 | Final composite | Approved (retained) |
| Featured plate, film slot, work index | `phone` | Shot 002, frame 72 | Final composite | Approved |
| Selected render 1 | `lenses` | Shot 002, frame 36 | Final composite | Approved (retained) |
| Selected render 2 | `phone` | Shot 002, frame 72 | Final composite | Approved (retained) |
| Selected render 3 | `wordmark` | Shot 001, frame 210 | Render, display transform only (not a final composite) | Approved (retained) |
| Selected render 4 | `port` | Shot 005, frame 0 | Render, display transform only (not a final composite) | Approved (retained) |
| Render passes: undenoised, glossy, transmission, normals | `pass-noisy`, `pass-glossy`, `pass-transmission`, `pass-normal` | Shot 002, frame 36 (EXR passes) | Passes from the render file | Approved (retained, all five stages) |

Not yet approved or supplied: role, credits, collaborators, the brief, the finished commercial, music, captions and audio description. The pages show "pending confirmation" for those and make no role or credit claim. Facts on the case study (renderer, resolution, samples, passes, object and material names, Shot 002 compositing steps) come from the render files and project notes and are published as part of this approval.

## I. Engineering and racing (2026-10-16)

| Item | Status | Evidence |
| --- | --- | --- |
| Best validated lap 66.284 s, damage 0, five native runs | Verified, pending owner approval | Official result files, public repository at `8658c1b` |
| Public repository link and YouTube link | URLs verified; channel ownership unconfirmed | HTTP check and platform metadata |
| Development history 279.22 s to 66.284 s (13 rows) | Verified; two rows are on a tuned car file and labelled | Project history reports and retained result files |
| Speed telemetry chart (314 samples) | Verified, already public | `evidence/lap_speed_profile.json` |
| Robotic arm | Planned, not built; no evidence | Owner statement |
| CAD project | Reserved slot, no evidence | None |
| Role, contest result, footage still, track-access eligibility, code licence | Pending owner | See report |

