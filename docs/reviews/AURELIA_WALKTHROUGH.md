# Aurelia walkthrough page: media and timeline

Status: implementation record for `/work/aurelia/walkthrough/`. The owner approved publication on 2026-10-17; the route is built through the publication gate in `src/data/walkthrough-publication.json`. It replaces the earlier text-only draft page; page content lives in `src/data/aurelia-walkthrough.ts`.

## Source

`Aurelia_Walkthrough_v002_4K.mp4` (kept outside this repository): H.264, 3840 x 2160, 24 fps, square pixels, 2:49:10, 34 shots. The edit's own shot list (`Final_Shot_List.csv`) and a contact sheet of every shot were used to check the order. Screen recordings sit in a 2920 x 1780 region at x=800, y=190 on a black caption rail; every web clip crops to that region, so the baked-in captions and title cards are excluded. Finished shots use the full frame.

## Chapters and source timestamps

Timestamps are on the master timeline (m:ss). The video's order is Illustrator, Plasticity, Blender, then Nuke, After Effects and Nuke again; the page keeps that order.

| Chapter | Software | Master timeline | Shots | Clips |
|---|---|---|---|---|
| Opening | finished shots | 0:00–0:08 | 1–3 | hero |
| 01 Design | Illustrator | 0:11–0:34 | 5–8 | d1–d4 |
| 02 Building the form | Plasticity | 0:36–1:03 | 10–13 | m1–m4 |
| 03 Materials and lighting | Blender | 1:05–1:23 | 15–17 | b1–b3 |
| 04 Animation and rendering | Blender (Cycles) | 1:23–1:49 | 18–21 | b4–b7 |
| 05 Compositing and finishing | Nuke, After Effects | 1:49–2:13 | 22, 24–26 | c1–c3, cmp-a, cmp-b |
| 06 The result | finished shots | 2:15–2:44 | 28–33 | f1–f6 |

Excluded: title cards (shots 4, 9, 14, 23, 27) and the end card (34). Shot 26 is a synchronized animation-preview and final-composite pair with the caption "Same camera move / source preview is 480 x 270"; the two panels are cropped out as separate clips for the before/after control.

## Clip table

Each clip is trimmed two frames inside its shot cuts, silent, H.264 (libx264, CRF 24–27, `+faststart`), and has an AVIF poster. `-m` renditions are cropped to the application viewport so the interface stays legible on phones; the crop rectangles are in [walkthrough.spec.json](../../scripts/aurelia/walkthrough.spec.json). Nothing is stretched: every crop scales uniformly. Total across both renditions: 16.4 MB; a visitor downloads one rendition of the clips they reach.

| Clip | Master timeline | Shot(s) | Desktop / mobile rendition |
|---|---|---|---|
| d1 | 0:11–0:16 | 5 | 1440x878 383 KB / 800x600 204 KB |
| f2 | 2:22–2:25 | 29 | 1920x1080 401 KB / 960x540 151 KB |
| hero | 0:00–0:08 | 1-3 | 1920x1080 793 KB / 960x540 291 KB |
| d2 | 0:16–0:24 | 6 | 1440x878 442 KB / 800x600 223 KB |
| d3 | 0:24–0:29 | 7 | 1440x878 183 KB / 800x600 69 KB |
| d4 | 0:29–0:34 | 8 | 1440x878 230 KB / 800x600 103 KB |
| m1 | 0:36–0:44 | 10 | 1440x878 278 KB / 800x600 108 KB |
| m2 | 0:44–0:52 | 11 | 1440x878 354 KB / 800x600 173 KB |
| m3 | 0:52–0:58 | 12 | 1440x878 188 KB / 800x600 68 KB |
| m4 | 0:58–1:03 | 13 | 1440x878 212 KB / 800x600 80 KB |
| b1 | 1:05–1:11 | 15 | 1440x878 380 KB / 800x600 173 KB |
| b2 | 1:11–1:17 | 16 | 1440x878 852 KB / 800x600 499 KB |
| b3 | 1:17–1:23 | 17 | 1440x878 1019 KB / 800x600 562 KB |
| b4 | 1:23–1:27 | 18 | 1440x878 147 KB / 800x600 41 KB |
| b5 | 1:27–1:33 | 19 | 1440x878 404 KB / 800x600 179 KB |
| b6 | 1:33–1:41 | 20 | 1440x878 943 KB / 800x600 569 KB |
| b7 | 1:41–1:49 | 21 | 1440x878 353 KB / 800x600 113 KB |
| c1 | 1:49–1:56 | 22 | 1440x878 414 KB / 800x602 209 KB |
| c2 | 1:58–2:02 | 24 | 1440x878 156 KB / 800x600 60 KB |
| c3 | 2:02–2:10 | 25 | 1440x878 368 KB / 800x602 106 KB |
| cmp-a | 2:10–2:13 | 26 (left panel) | 1280x720 298 KB |
| cmp-b | 2:10–2:13 | 26 (right panel) | 1280x720 212 KB |
| f1 | 2:15–2:22 | 28 | 1920x1080 1186 KB / 960x540 366 KB |
| f3 | 2:25–2:28 | 30 | 1920x1080 175 KB / 960x540 67 KB |
| f4 | 2:28–2:31 | 31 | 1920x1080 238 KB / 960x540 86 KB |
| f5 | 2:31–2:40.42 | 32 | 1920x1080 900 KB / 960x540 309 KB |
| f6 | 2:40.42–2:44.42 | 33 | 1920x1080 314 KB / 960x540 119 KB |

Regenerate with `python scripts/aurelia/make-walkthrough-clips.py <master.mp4> public/media/walkthrough`. The 4K master is never committed.

## Playback strategy

- Video is silent, `preload="none"`, and gets its source only near the viewport; posters are always in the page, so layout never shifts.
- A clip plays only while on screen; inside a pinned stage only the active step's clip plays. At most one clip plays at a time in normal use.
- Reduced motion and Save-Data: nothing autoplays. Every clip has a play/pause button (44 px, keyboard reachable).
- Comparison clips play once and hold the last frame; Replay restarts both. Other clips loop because they are continuous screen recordings or montage cuts.
- A failed video leaves its poster in place.

## Copy rules

Every step describes something visible in the clip it plays (values such as "55 regions", "0.00006 m" and "multiply 0.9, gamma 1.03" are read from the frames). No role, credit or result beyond the footage is claimed; credits stay pending as on the case study. There is no published full commercial, so the final chapter says so and links back to the case study.

## Validation

`npm run verify` runs docs, typecheck, build, dist, browser, Aurelia and `npm run test:walkthrough`. The walkthrough check covers console cleanliness, overflow, poster decode, hero and stage playback rules in both scroll directions, comparison slider and replay, reduced motion, failed media, no-JavaScript content, axe (WCAG 2.2 AA tags) at 1440 and 390 px, and case-study links both ways. Screenshots were reviewed at both widths with `scripts/shoot-walkthrough.mjs`. Not measured: Lighthouse, real devices, throttled networks, Safari and Firefox.
