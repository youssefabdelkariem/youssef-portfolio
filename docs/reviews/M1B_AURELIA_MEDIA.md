# Aurelia media: discovery, selection, colour and derivatives

Date: 2026-10-15. Prepared by Claude Code under the owner's authorization to inspect the local Aurelia renders and make derivatives. **The selection was approved by the owner on 2026-10-15 and the derivatives listed in [CONTENT_MANIFEST](../CONTENT_MANIFEST.md) section H are committed** (about 1.9 MB). Masters, EXRs and project files are not in the repository. Related: [M1B_HERO_SELECTION](M1B_HERO_SELECTION.md), [ADR 0004](../adr/0004-media-strategy.md), FR-01a, FR-01b, FR-02, QA-08, QA-12, QA-13.

## Source protection

All original files were treated as read-only: renders on the owner's render drive, the C: project folder with its Blender, Nuke, EXR and composite files, and the Shot005 production folder. Files were opened for reading only; no original was moved, renamed, deleted, overwritten or recompressed, no Blender scene was opened, no Nuke script was touched, and no EXR was copied into the repository. Blender was started only with `--factory-startup` and a script, to convert in-memory arrays to display PNGs; it never loaded a project file. Output goes to a separate working directory, and the derivative tool refuses to write inside the masters folder.

Verification: a name/size/modified-time snapshot of 1,609 files (258.9 GiB) on both drives was taken before any work and compared after the last read. **No file was changed or removed.** One file was added by something else: `Compositing/shot 003/.nk`, created while the owner's own Nuke session was open (it is a Nuke autosave-style file, and I never wrote to that folder). It also suggests a Shot 003 composite is in progress, which matters for the selection below.

## Source inventory

| Shot | Frames | Size on disk | Frame size and type | Cycles samples | Camera object | Render dates (EXR metadata) |
| --- | --- | --- | --- | --- | --- | --- |
| 001 | 250 (0001 to 0250) | 3.4 GB | 3840 x 2160, single-part RGBA, half float | 4096 on the first 77 frames, 512 on 173 | Macro_120mm | 7 to 8 Oct 2026 |
| 002 | 72 | 10.5 GB | 3840 x 2160, 15-part multilayer (Combined, Depth, Normal, Glossy, Transmission, Emission, 6 Cryptomatte layers, Noisy Image) | 512 | Hero_85mm | 9 Oct 2026 |
| 003 | 72 | 19.0 GB | 3840 x 2160, 19-part multilayer (adds Position, Diffuse and AO passes) | 128 | Hero_85mm | 10 Oct 2026 |
| 004 | 72 | 6.3 GB | 3840 x 2160, single-part RGBA, 32-bit float | 256 | Hero_85mm | 11 to 12 Oct 2026 |
| 005 | 228 (0000 to 0227) | 206.4 GB | 3840 x 2160, 27-part multilayer, 772 MB to 2.6 GB per frame | 300 (320 on 6 frames) | Hero_85mm | 12 to 14 Oct 2026 |

All files: Blender 5.2.2 LTS, ZIP compression, `colorInteropID = lin_rec709_scene` (scene-linear Rec.709), and every frame header was readable (no truncated files). Shot 005 also has a `_preserved_originals` folder with two EXRs and one `.incomplete` file, which were not used. The Shot005_FINAL production folder holds only scripts, logs and a README (its EXR and preview folders are empty). Camera object names are quoted as written; the production notes call the Shot 005 camera 100 mm, so no lens claim is made on the site.

## Final or near-final?

The files alone cannot prove status, so this is evidence and not a verdict:

- **Shot 002:** a documented final composite exists (NukeX script, ProRes 422 HQ master and 16-bit stills for frames 1, 36 and 72). Treated as final for this selection.
- **Shot 001:** a 4K ProRes master and a Nuke script that only reads and views the EXRs exist. Mixed sample counts (4096 then 512) suggest earlier re-rendering. Frame 210 is one of the 512-sample frames.
- **Shots 003 to 005:** renders only. A Shot 003 Nuke file appeared during this session, so a composite may be coming. Shot 005 has 300-sample 4K frames and recorded production notes, but no final-status record.
- **Hence:** stills from shots 001 and 005 are labelled "render, display transform only". Shots 003 and 004 are not used until the owner confirms their status.

## EXR structure and colour

Beauty is the `Combined` layer in the multilayer files, or the `RGBA` channel in single-part files. Alpha is 1.0 throughout (no transparent background). Values are scene-linear with highlights above 1.0 (up to about 18 in shot 002 and 7 in shot 001 frames sampled), so a display transform is required.

The project's recorded pipeline is Blender's **AgX Base with no look and no exposure change**, for an sRGB display. To reproduce it, the stills were converted with Blender 5.2.2's own colour management (view transform AgX, look None, exposure 0, gamma 1, sRGB display) and saved as 16-bit PNG.

**Validation:** I converted Shot 002 frame 36 this way and compared it with the project's own "before" PNG, which was made through the project's AgX CTF transform. The two agree to within 2 of 65,535 levels (mean difference 0.18; 0 pixels differ by more than 1 at 8-bit). So the reproduction matches the project's pipeline. Separately, the project's final composite differs from its pre-composite frame 36 in only 54 pixels, which shows how light the compositing is.

## Provisional selection and provenance

Contact sheet: 29 candidate frames from all five shots (frame, source file and linear mean labelled), kept outside the repository and viewable in the review page shared with the owner. Selected, in order of use:

| Set | Source shot and frame | Source type | Crop | AVIF sizes | JPEG fallback |
| --- | --- | --- | --- | --- | --- |
| `hero` | Shot 002, frame 1 | Final composite (project 16-bit still) | 2.39:1 around the lens, centre 52% / 50% | 1440 px: 42 KB, 2160 px: 74 KB, 2880 px: 112 KB | 1440 px: 58 KB |
| `hero-home-m` | Shot 003, frame 1 | Final composite (AgX display transform only, no grade) | 4:5, centred | 600 px: 26 KB, 900 px: 41 KB, 1200 px: 65 KB | 900 px: 44 KB |
| `hero-m` | Shot 002, frame 1 | Final composite | 4:5 around the lens | 600 px: 42 KB, 900 px: 63 KB, 1200 px: 96 KB | 900 px: 85 KB |
| `phone` | Shot 002, frame 72 | Final composite | Full frame 16:9 | 960: 17 KB, 1440: 30 KB, 2160: 54 KB | 1440: 44 KB |
| `lenses` | Shot 002, frame 36 | Final composite | Full frame 16:9 | 960: 31 KB, 1440: 49 KB, 2160: 77 KB | 1440: 61 KB |
| `wordmark` | Shot 001, frame 210 | EXR beauty through Blender AgX | Full frame 16:9 | 960: 26 KB, 1440: 50 KB, 2160: 88 KB | 1440: 59 KB |
| `port` | Shot 005, frame 0 | EXR beauty through Blender AgX | Full frame 16:9 | 960: 16 KB, 1440: 28 KB, 2160: 50 KB | 1440: 48 KB |
| `pass-noisy` | Shot 002, frame 36 | EXR Noisy Image pass through Blender AgX | Full frame 16:9 | 960: 37 KB, 1440: 71 KB | 960: 35 KB |
| `pass-glossy` | Shot 002, frame 36 | EXR Glossy Direct + Indirect through Blender AgX | Full frame 16:9 | 960: 56 KB, 1440: 130 KB | 960: 42 KB |
| `pass-transmission` | Shot 002, frame 36 | EXR Transmission Direct + Indirect through Blender AgX | Full frame 16:9 | 960: 14 KB, 1440: 26 KB | 960: 22 KB |
| `pass-normal` | Shot 002, frame 36 | EXR Normal XYZ mapped to colour (data pass) | Full frame 16:9 | 960: 24 KB, 1440: 40 KB | 960: 35 KB |

Totals: 36 files, 1.79 MB, the largest 130 KB. The pass stills are data visualizations of real passes (the emission pass is empty in this frame and was dropped; depth was dropped as too noisy to read).

## Transformation steps

1. Read the beauty or pass arrays from the EXR (read-only), in scene-linear Rec.709.
2. Convert with Blender AgX Base to display sRGB and write a 16-bit PNG master (Shot 002 composites use the project's own 16-bit stills).
3. `scripts/aurelia/make-derivatives.py`: crop, convert to linear light, resize with area averaging, convert back, add triangular dither (plus or minus 1 level) before the 8-bit rounding, and encode with an sRGB ICC profile.
4. Encode AVIF (quality 94, `tune=iq`, 4:4:4) and a JPEG fallback (quality 92, 4:4:4, progressive). Record bytes and PSNR in `manifest.json`.

## Compression study (banding in near-black gradients)

The frames are dark with long smooth gradients, the worst case for banding. Tested on the 2880 px hero crop and judged on a view with the shadows lifted several stops:

| Encoding | Size | Result |
| --- | --- | --- |
| AVIF q85, dithered | 25 KB | Blocky flat patches in the dark gradient |
| AVIF q85, no dither | 25 KB | Visible hue-tinted bands |
| AVIF q94 | 55 KB | Faint blocking |
| **AVIF q94, tune=iq** | **114 KB (112 KB delivered)** | **Smooth, grain preserved, matches the lossless reference** |
| AVIF q97 | 433 KB | Smooth but needlessly large |
| WebP q95 | 77 KB | Blocky flat patches |
| JPEG q95 | 280 KB | Smooth, much larger |

All delivered variants are at most 130 KB, well under the 250 KB goal, without lowering quality to get there. **WebP was left out on purpose:** at sizes comparable to AVIF it shows blocking in the dark gradients, and at settings that avoid it it is larger than the JPEG fallback. All browsers in the QA-10 list support AVIF, so the ladder is AVIF, then JPEG. WebP can be added if the owner wants it (the tool supports it).

## Decisions recorded (2026-10-15)

Approved by the owner: desktop homepage hero Shot 002 frame 1; phone homepage hero Shot 003 frame 1; featured whole-phone plate Shot 002 frame 72; case-study hero Shot 002 frame 1; the four selected renders and all five render-pass stages unchanged; no pull-back render; no WebP. Shot 001 and Shot 005 stills stay labelled "render, display transform only". Still open: role, credits, brief, film, music and captions; the published technical facts remain read from the render files and project notes.
