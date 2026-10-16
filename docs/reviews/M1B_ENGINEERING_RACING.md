# M1b engineering section and IBM AI Racing case study

Date: 2026-10-16. Prepared by Claude Code on `feat/m1b-engineering-racing` (based on `e7ac8cf`). Requirements: FR-03, FR-04, Q03, Q04, Q08, QA-01 to QA-04, QA-09, QA-11, QA-15. Status: implemented and verified locally; pushed to `origin/feat/m1b-engineering-racing` on 2026-10-16 at the owner's request (no force, no pull request); **content pending owner approval**; not merged or deployed.

## What was built

| Route | Content |
| --- | --- |
| `/engineering/` | Intro, featured project, numbered project gallery (one verified, one planned, one reserved), technical disciplines with evidence status, verified tools, navigation to VFX and About |
| `/engineering/ibm-ai-racing/` | Eleven-part case study: hero and key figures, overview, environment, architecture diagram, steering, speed and braking with a measured speed chart, seven development stages, lap-time ladder, testing table, demonstration link, source link and disclosures, lessons |

Code: `src/data/racing.ts` (verified facts), `src/data/racing-speed-profile.json` (telemetry), `src/data/engineering.ts`, components `SpeedChart`, `LapLadder`, `Architecture`, stylesheet `src/styles/engineering.css`, check `scripts/check-racing.mjs` (`npm run test:racing`, part of `npm run verify`). `scripts/check-dist.mjs` now allows exactly two outbound links with `rel="noopener"`. No new dependency, no JavaScript bundle, no external request.

## Evidence read (read-only, 2026-10-16)

| Claim on the page | Source read | Result |
| --- | --- | --- |
| Best lap 66.284 s, damage 0, one lap, `car1-ow1`, 5 native runs | Five `official_result.xml` files and `report.json` in `evidence/native_windows_validation/` of the public repository (same files in the owner's local copy) | Confirmed: all five 66.284 s, damage 0, 0 timeouts |
| Fresh-clone runs | `evidence/fresh_clone_validation/` | 67.058 s (1 timeout, not counted), 66.284 s, 66.284 s |
| Public repository | `github.com/youssefabdelkariem/IBM-AI-Racing-League`, public, default branch `main`, read at `8658c1bd54a6776dff06448dee44b44e60a91180` (2026-10-14T22:19Z); controller and telemetry file hashes match the owner's local `publication/` copy | Confirmed; no licence declared |
| Demonstration video | `https://youtu.be/lp-c8A3NIJI` resolves; platform metadata gives the title quoted on the page | URL and title confirmed; footage not frame-checked; channel ownership not confirmed |
| Architecture, steering, braking, ABS, traction, gearbox, launch | `controller/controller_c3.py`, `settings.json`, README | Confirmed in code. Predictive braking zones exist in code but are **off** in the final settings, so they are not claimed |
| 279.22 s first lap | `project_history/2026-10-09-baseline/outputs/validation-race-result.json`, results screenshot | Confirmed, but the driver was a deliberately slow 30 to 60 km/h policy; the page says so. The supplied example clients did not finish |
| 207.14 s, 186.56 s, 185.11 to 186.10 s | `project_history/2026-10-09-development/outputs` reports | Confirmed |
| 67.064 s on a tuned car file | `PROJECT_HISTORY_AND_RUN.md`, `Fastest-clean-result.md`, `car-setup.json` | Confirmed; page labels it not comparable (5 L fuel, 50/30 degree wings, 115/125 mm ride height) and not reproducible later |
| Stock-car series 74.750 to 66.284 s | `claude_dev/best_*` official XMLs (all damage 0), README table for the last steps | Confirmed from retained XMLs; only the final runs are published |
| Telemetry chart | `evidence/lap_speed_profile.json` (314 samples, every 10th) | Plotted unsmoothed; the check asserts one path point per sample |

## Corrections to the brief

- The brief's "baseline lap about 4:39" is real (279.22 s) but is a deliberately slow validation driver, not a competitive baseline. The page says so wherever the 4.2 times figure appears.
- Best validated lap is **66.284 s with the stock car**, confirmed. The older **67.064 s** figure in an earlier public README is historical and used only for a non-comparable tuned-car row.

## Deliberately not claimed

Contest placement, award, endorsement, official IBM recognition, any comparison with other competitors (a private reference lap exists in the owner's notes and is not published), and rule compliance. The owner's own notes record that permission to read track geometry at run time is **unresolved**; this is an owner decision and the page makes no compliance statement. The page discloses AI-assisted development (IBM Bob, Codex, Claude Code) as the project history and repository README do, and leaves the owner's role wording as "pending owner confirmation".

## Owner decisions recorded (2026-10-16)

Push the branch without force (done); do not merge or deploy; keep the old Drive-synchronised workspace for now; keep the robotic arm as Planned; add no licence to the racing repository; leave competition-rule compliance and placement unverified; use a provisional role statement (independent developer of the racing controller, with AI-assistance disclosure); prefer a verified YouTube thumbnail that links to the video without an embedded player.

## Follow-up changes (same date)

- **Role:** the overview and hero carry "Role wording provisional"; the overview row reads "Independent developer of the racing controller, working with AI-assisted tools (IBM Bob, Codex and Claude Code)". Remove the provisional chip only on owner approval.
- **Predictive braking:** it appears once, as a V3.4 experiment, and the page now states V3.4 is not part of the final controller. `check-racing` fails if the page calls predictive braking active.
- **Video thumbnail:** the page shows a stored copy of the video's cover image (`public/media/racing/video-cover-{640,960}.jpg`, from `i.ytimg.com/vi/lp-c8A3NIJI/maxresdefault.jpg`, SHA-256 of the original `71f0f7491bc58d7b0cc0ba9920c1ca98edec5e7dd37877bb9be97382cb6ddb9b`, downloaded 2026-10-16). It is wrapped in the only link to the video, loads lazily and loads nothing from YouTube. The cover was inspected: it is **stylised promotional artwork, not race footage**. Its headline 66.284 s matches the result files; its sector times (18.712, 23.441, 24.131), the 268 km/h read-out, the "Laguna Seca" track map and the photoreal car are not verified by any retained evidence, so the page says so next to the image.
- **Video identity:** the ID resolves to the quoted title, about 88 s long, published 2026-10-14 on a channel named "Youssef" (platform metadata). That the channel is the owner's rests on the owner's statement that the video is theirs.
- **Reuse:** the owner authorised the thumbnail treatment. The licence or origin of the artwork's elements (it looks generated or composited) was not verified, so the owner should confirm rights before launch.

## Performance investigation

Question: why did the first mobile Lighthouse runs vary (racing 89 to 99, engineering 94 and 95, with total blocking time up to 250 ms and one 6.4 s spike)?

Method: Lighthouse 13.5, mobile preset with simulated throttling, Edge 155, performance only, a fresh browser profile per run, static server with gzip (as GitHub Pages serves), host CPU load sampled before each run, runs interleaved and in random order. Variants were made by copying the committed build and injecting CSS or removing markup, so the site code was not changed for the test.

| Finding | Evidence |
| --- | --- |
| **The main cause was my own test harness.** Each Lighthouse run left its headless Edge running (`taskkill` on the launch process did not stop the browser tree). By the second batch about 400 orphaned browser processes were running, and host CPU sat near 65%. | 399 orphaned Edge, Node and timeout processes found and stopped; after fixing the cleanup, runs took about 22 s instead of about 60 s |
| **With the leak gone the page is stable.** Racing page, 8 runs: performance 98 to 100, FCP 1.21 s, LCP 1.36 s, TBT median 0 ms (max 147). Variants without the hero line animation or with a fade instead: 99 to 100 and 100 (8 runs each). Differences between variants are within noise. | `res3`, 32 runs |
| **The unchanged homepage fluctuated in the noisy batches too**, scoring 68 once with a 4 s blocking task, so the noise was not specific to the new pages. | Noisy batches, 12 homepage runs |
| **Remaining outliers hit all pages in the same repetition**, one per page in the last batch (homepage 81, racing 74, engineering 100), which points to a host event. At measurement time GoogleDriveFS (about 150% of a core), Nuke 17.1 and Windows Defender were active. | Final batch, 18 runs |
| **A plain local server inflates FCP.** Uncompressed, the racing HTML is 45 KB and FCP is 1.66 s; gzipped it is 13 KB and FCP 1.21 s. Earlier 1.8 to 2.8 s FCP figures came from an uncompressed server and are not representative of Pages. | `race-plain` against `race-gz` |
| **Not the cause:** CSS animations and transitions (median unchanged with them disabled), the chart (removing it changed HTML size by 3 KB and nothing else), and the scroll-reveal opacity (no difference). Style and layout work is the largest main-thread cost (about 0.8 s simulated) but is the same with each feature removed. | Variants `noanim`, `nochart`, `noreveal`, `nohero`, `fade` |

No site change was made for performance, because no site cause was found. After the final build (thumbnail added, below the fold and lazy): racing page 99, 100, 100, 100, 100, 74 (the 74 is the host event above), FCP 1.21 s, LCP 1.36 s, CLS 0; engineering index 100 in all six, LCP 1.36 s, CLS 0.001; homepage control 100, 100, 100, 99, 99, 81. Limits: lab data with simulated throttling on one busy Windows host; 5 to 12 runs per configuration; not field data; Chrome-based only.

The shared browser launcher now also stops any browser still using its temporary profile (`scripts/lib/browser.mjs`), so the repository checks cannot leak processes the way my Lighthouse harness did. The harness itself lives outside the repository.

## Open owner decisions

1. Approve the page content and tool-credit wording; confirm or replace the provisional role wording.
2. Confirm rights to the video cover artwork and decide whether the stylised cover should stay on the page.
3. Resolve and record the track-XML runtime-access eligibility question with the organisers before promoting the page (compliance stays unverified).
4. Racing code licence: none added, as instructed; the page says the repository has none.
5. Robotic arm stays Planned; provide any CAD project for the reserved slot.
6. Approve the derived telemetry JSON living in this repository (it is already public in the racing repository).
7. Old workspace copy: see the retirement checklist in the [handoff](../HANDOFF.md#engineering-and-ibm-racing-2026-10-16).

## Verification

See the [engineering section of the handoff](../HANDOFF.md#engineering-and-ibm-racing-2026-10-16) for run results and limits.
