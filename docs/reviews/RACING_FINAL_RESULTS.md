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
| Source | Links only to the verified branch `release/p1-65968`, pinned to commit `3a0c950` |
| Credits | Python, TORCS, IBM Bob, Claude Code, OpenAI Codex, OBS Studio; IBM Granite stated as not used (the repository's own disclosure) |
| Other pages | Engineering index and home page quote 65.968 s (locally validated) |
| Previous controller | **Owner instruction 2026-10-23: nothing of the previous controller on the site.** No 66.284 s time, old commit, old recording or cover image remains in the built site; `check-racing` fails if `66.284`, `8658c1b`, the old video id or its cover appears anywhere in `dist/`. The three-stage progression replaces the four-stage one |
| Video | The old recording section and its cover images are removed. The Demonstration section (and its entry in the contents list) appears only once the final-lap video is published (`LapVideo.astro`, `racing-video.json`) |

## Evidence for each public claim

| Claim | Source (release branch `release/p1-65968`, commit `3a0c950`, read 2026-10-23, unless noted) |
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
| Granite not used | `docs/AI_TOOL_DISCLOSURE.md` |

Not claimed anywhere: a competition result, ranking, award, endorsement, rule compliance (the repository's own compliance notes list open questions) or any role for Granite.

## Final-lap video: status and how to publish

The two exports exist only on the owner's machine (`C:\Users\youss\Videos\IBM_AI_Racing_League_Final\`, about 300 MB each, 1920 x 1080, 60 fps, no audio; the upload notes say "Not uploaded"). They are too large for the site, and no public URL exists, so **no video link or player is published**. The integration is ready and dormant:

1. Upload `IBM_AI_Racing_League_P1_65968_YouTube.mp4` to YouTube (title and description are in the owner's `YOUTUBE_UPLOAD_DETAILS.md`; the checklist there says to start as Unlisted, check it, then publish).
2. Create the poster: `node scripts/racing/make-lap-poster.mjs <video.mp4> <seconds>` (a mid-lap frame or the results screen; writes `public/media/racing/lap-poster-960|1280.avif|jpg`).
3. Fill `src/data/racing-video.json`: title, description, `accessibilityNote` (describe the picture; do not describe audio, there is none), `youtubeId`, `externalUrl`, `duration`, `uploadDate`, `posterBase: "lap-poster"`, `posterAlt`, `approvedBy`, `approvedOn`.
4. `npm run verify` and a pull request. Nothing reaches YouTube before the visitor presses play, and the build refuses an incomplete entry.

The video's title cards show no team or university name; the repository's compliance notes mention rule R4 for competition use. That is the owner's decision and is not stated on the website.

## Checks

See the report in the pull request and `docs/HANDOFF.md`. `npm run test:racing` now also builds a fixture with the final-video component and tests: poster first, no third-party request before play, keyboard play creates the privacy-enhanced embed, no overflow at 320 px, and that the production build holds no player markup while `racing-video.json` is null.
