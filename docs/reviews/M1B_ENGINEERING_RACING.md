# M1b engineering section and IBM AI Racing case study

Date: 2026-10-16. Prepared by Claude Code on `feat/m1b-engineering-racing` (based on `e7ac8cf`). Requirements: FR-03, FR-04, Q03, Q04, Q08, QA-01 to QA-04, QA-09, QA-11, QA-15. Status: implemented and verified locally; **content pending owner approval**; not pushed, merged or deployed.

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

## Open owner decisions

1. Approve the page content and tool-credit wording; supply the role statement.
2. Confirm the YouTube channel is theirs and that linking (not embedding) is the intended treatment; approve any still or poster from the footage.
3. Resolve and record the track-XML runtime-access eligibility question with the organisers before promoting the page.
4. Choose a licence for the racing code (the repository has none) and whether the site should say so.
5. Robotic arm: supply a status and evidence, or keep the labelled planned entry. Provide any CAD project for the reserved slot.
6. Approve the derived telemetry JSON living in this repository (it is already public in the racing repository).

## Verification

See the [engineering section of the handoff](../HANDOFF.md#engineering-and-ibm-racing-2026-10-16) for run results and limits.
