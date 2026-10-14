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
| M-11 | Racing evidence: role, methodology, results with logs, demo footage, repository URL | `/engineering/ibm-ai-racing/` | Later; outside this M1b scope |
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
