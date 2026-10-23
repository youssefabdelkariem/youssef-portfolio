# IBM AI Racing League case study: final results update (P1, 65.968 s)

Date: 2026-10-23. Branch: `feat/ibm-racing-final-results`. Scope: content and presentation of `/engineering/ibm-ai-racing/` and the two places that quote its headline result. No redesign, no controller work, no change to the racing repository.

## What changed

| Area | Change |
| --- | --- |
| Headline and hero | Best validated lap 65.968 s (TORCS result screen `01:05:96`), "locally validated, not an official ranking", repository runs 5 / 5 |
| Data | `src/data/racing.ts`: final lap time, release branch and pinned commit, final-phase progression, Corkscrew comparison, P1 runs; `racing-speed-profile.json` replaced by the P1 telemetry (313 samples) |
| Ladder | The 66.284 row is removed; the launch settings are folded into one stage with the finish-line fix (66.262), followed by 66.020 and 65.968 (final). Earlier development stages are unchanged |
| New chart | `ProgressionChart.astro`: 66.262, 66.020, 65.968 on an explicitly zoomed axis (says so on the chart), with the same values in the cumulative table below it |
| Method text | Phases 2A to 2D, the F2 against P1 Corkscrew table, the single-corner decision |
| Testing | P1 validation text and runs table; technical details (track position, sideslip, 446 m complex, replay identity) in a disclosure. The previous package's runs are removed |
| Telemetry chart | Now the P1 lap; the Corkscrew window (2,301 to 2,493 m) is shaded |
| Source | Links to the repository's `main` branch (P1 was merged there on 2026-10-23), pinned to commit `e71b6fe` |
| Credits | Python, TORCS, IBM Bob, Claude Code, OpenAI Codex, OBS Studio; the page makes no claim about IBM Granite. The repository's AI-tool disclosure document was removed by the owner on 2026-10-23, so the tool credits rest on the owner's brief and the project history, not on that document |
| Other pages | Engineering index and home page quote 65.968 s (locally validated) |
| Previous controller | **Owner instruction 2026-10-23: nothing of the previous controller on the site.** No 66.284 s time, old commit, old recording or cover image remains in the built site; `check-racing` fails if `66.284`, `8658c1b`, the old video id or its cover appears anywhere in `dist/`. The three-stage progression replaces the four-stage one |
| Video | The old recording section and its cover images are removed. The Demonstration section (and its entry in the contents list) appears only once the final-lap video is published (`LapVideo.astro`, `racing-video.json`) |

## Evidence for each public claim

| Claim | Source (repository `main`, commit `e71b6fe`; text identical to release commit `3a0c950` except the removed disclosure, read 2026-10-23, unless noted) |
| --- | --- |
| 65.968 s, `01:05:96`, damage 0, 0 timeouts, locally validated, not official | README results table and note; `evidence/release_p1_65968/README.md` |
| 66.262, 66.020, 65.968 progression | README "Results and progression" table; `docs/TECHNICAL.md` performance history |
| Final series 66.906 to 65.968 s, 0.938 s, about 1.4% | Computed here from the README's optimisation series |
| 2A cause (speed look-ahead read the standing-start cap at the lap end) | README table row "Finish-line fix" |
| 2B parameters, +0.55 s full throttle, -0.39 s braking | README and TECHNICAL (parameter table: tc, abs, S_live, k_filter) |
| **145 candidates** | Owner's brief of 2026-10-23. **Not found in the repository's published documents.** Add a source or confirm if this should be checkable |
| 2C window 2,301 to 2,493 m, sideslip 14.4 to 9.4 degrees, minimum speed 79.9 to 84.2 km/h | Sideslip and +4.3 km/h in README; both speeds in the owner's brief (79.9 + 4.3 = 84.2) |
| 2D: 770 m study, no reliable gain | README; "65.966 s, 0.002 s" figures are from the owner's brief and are not in the published documents |
| 5 repository runs; 6 package races (5 through the real entry point) plus 1 OBS graphics race; replay identity over 3,241 states; max trackPos 0.967; peak sideslip 13.6 degrees; 446 m complex 0.721 against 0.73 | README "Testing and validation"; `evidence/release_p1_65968/README.md` |
| Stock files unchanged | Evidence README (nine stock files hash-checked before and after every race) |
| No Granite claim | Owner's brief: do not claim Granite contributed without evidence |

Not claimed anywhere: a competition result, ranking, award, endorsement, rule compliance (the repository's own compliance notes list open questions) or any role for Granite.

## Final-lap video: published (2026-10-23)

The owner uploaded the YouTube export and supplied the link, `https://youtu.be/Yw5mtOl9pfQ` ("IBM AI Racing League | 65.968s Autonomous Racing Lap | TORCS", 80 s, uploaded 2026-10-23). It is **unlisted** on YouTube (not private; the embed is allowed and plays), so it is reachable through the site and by link but does not appear in YouTube search. Change the visibility on YouTube if public discovery is wanted.

- **Presentation:** poster-first, click-to-play. The poster is a mid-lap frame (30 s) of the owner's file, made with `scripts/racing/make-lap-poster.mjs` (AVIF and JPEG, 960 and 1280 px, 66 to 105 KB). Nothing is requested from YouTube until the visitor presses play, when the privacy-enhanced `youtube-nocookie.com` player is created.
- **Text alternative:** describes the picture only (the file has no audio track); no transcript or captions exist and none are claimed.
- **Description:** from the owner's upload text (single recording, title card before the start, credit card after the results).
- **Config:** `src/data/racing-video.json`; the build refuses an incomplete entry. The video files themselves (about 300 MB) are not in the repository.
- The old 66.284 s recording and its cover-image note were removed in the previous update and are not coming back.

## Checks

See the report in the pull request and `docs/HANDOFF.md`. `npm run test:racing` now also builds a fixture with the final-video component and tests: poster first, no third-party request before play, keyboard play creates the privacy-enhanced embed, no overflow at 320 px, and that the production build holds no player markup while `racing-video.json` is null.
