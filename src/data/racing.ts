/**
 * IBM AI Racing League / TORCS case study: verified facts and their evidence.
 *
 * The development-stage figures were read from the owner's project files on 2026-10-16 (docs/reviews/M1B_ENGINEERING_RACING.md);
 * the P1 results (65.968 s) and the final optimisation phases were read from the release branch and the owner's brief on
 * 2026-10-23 (docs/reviews/RACING_FINAL_RESULTS.md has the claim-by-claim evidence table). Nothing is estimated or generated.
 * The public repository is pinned to a commit so the page can be re-checked against what was read.
 */
import profile from './racing-speed-profile.json';

export const repo = {
  url: 'https://github.com/youssefabdelkariem/IBM-AI-Racing-League',
  /** The verified P1 release branch. */
  releaseUrl: 'https://github.com/youssefabdelkariem/IBM-AI-Racing-League/tree/release/p1-65968',
  branch: 'release/p1-65968',
  commit: '3a0c950',
  commitFull: '3a0c950a0f4d944ebf884b52f36ba287358cfcf8',
  checked: '2026-10-23',
};

export const best = {
  seconds: 65.968,
  lapLength: 3.608, // km, from the simulator log of the validated runs
  damage: 0,
  timeouts: 0,
  hz: 50,
};

/** The final phases, with the lap time reached after each. Source: release README results table and the owner's brief. */
export const progression = [
  { id: '2a', short: '2A', label: 'Phase 2A: launch settings and finish-line fix', seconds: 66.262, note: 'Standing-start launch settings, and the speed look-ahead no longer reads the standing-start cap at the end of the lap' },
  { id: '2b', short: '2B', label: 'Phase 2B: global parameter optimisation', seconds: 66.02, note: 'Traction control, ABS, yaw filtering and the live grip assumption (controller F2)' },
  { id: '2c', short: '2C', label: 'Phase 2C: Corkscrew racing line (P1)', seconds: 65.968, note: 'A straighter line through the left-right direction change at 2,301 to 2,493 m' },
] as const;

/** Corkscrew window, F2 against final P1 (release README and technical documentation). */
export const corkscrew = [
  { metric: 'Lap time', f2: '66.020 s', p1: '65.968 s' },
  { metric: 'Corkscrew peak sideslip', f2: '14.4°', p1: '9.4°' },
  { metric: 'Corkscrew minimum speed', f2: '79.9 km/h', p1: '84.2 km/h' },
  { metric: 'Lap damage', f2: '0', p1: '0' },
];

export interface Milestone {
  seconds: number;
  label: string;
  detail: string;
  when: string;
  /** stock = unmodified car files and 100 L fuel; modified = a separately tuned car file (5 L fuel, wings, ride height). */
  setup: 'stock' | 'modified';
  /**
   * Where the official result can be checked: the result files published in the repository, its README table,
   * a TORCS results screenshot kept with the project history, a line in the project history reports, or the result file kept in the owner's local project folder.
   */
  evidence: 'repo-xml' | 'repo-readme' | 'screenshot' | 'history-note' | 'local-xml';
  final?: boolean;
}

/**
 * Official TORCS lap times, one completed lap each, damage 0 in every row. Rows are ordered by development stage, not by time.
 * "modified" rows used a different car file and are not comparable with the stock rows (see the note on the page).
 */
export const ladder: Milestone[] = [
  { seconds: 279.22, label: 'Validation driver', detail: 'A deliberately conservative driver (30 to 60 km/h) proving the Windows TORCS and Python setup completes a lap. The supplied example clients did not finish.', when: '9 Oct', setup: 'stock', evidence: 'screenshot' },
  { seconds: 207.14, label: 'V2, 80 km/h ceiling', detail: 'First speed controller.', when: '9 Oct', setup: 'stock', evidence: 'screenshot' },
  { seconds: 186.56, label: 'V3, 100 km/h ceiling', detail: 'Steering, corner, braking, traction, gear and recovery logic. Three consecutive official runs gave exactly the same time.', when: '9 Oct', setup: 'stock', evidence: 'screenshot' },
  { seconds: 185.11, label: 'V3.2 to V3.4', detail: 'Gear selection, anti-hunting, slip response and predictive chicane braking. Results across the series: 185.11 to 186.10 s. The 100 km/h ceiling capped further gains.', when: '10 Oct', setup: 'stock', evidence: 'history-note' },
  { seconds: 89.386, label: 'Model-based rewrite, first lap', detail: 'Track geometry and a planned speed profile replace the fixed ceiling. Run on a tuned car file, so it is not comparable with the rows above or below.', when: '10–11 Oct', setup: 'modified', evidence: 'history-note' },
  { seconds: 67.064, label: 'Best on the tuned car file', detail: '5 L fuel, 50° front and 30° rear wing, 115 mm and 125 mm ride height. Later attempts did not reproduce the opening straight, so the result is recorded as one measured lap.', when: '11 Oct', setup: 'modified', evidence: 'local-xml' },
  { seconds: 74.75, label: 'Stock-car controller, lightweight runner', detail: 'New controller for the unmodified car: planned line and speed profile with a path-following steering law. Its first complete lap took 82.888 s; this time came from four identical official runs.', when: '13 Oct', setup: 'stock', evidence: 'local-xml' },
  { seconds: 68.846, label: 'Slide control and gearbox model', detail: 'After adding sideslip counter-steer, spin recovery, slip-aware traction control and a lowest-gear-below-rev-limit rule (laps of 74.1, 71.1 and 70.3 s on the way).', when: '13 Oct', setup: 'stock', evidence: 'local-xml' },
  { seconds: 66.986, label: 'Hairpin entry and exit work', detail: 'A local plan around the hairpin; three identical official runs.', when: '13 Oct', setup: 'stock', evidence: 'local-xml' },
  { seconds: 66.906, label: 'Minimum-time line, first corner complex', detail: 'Two identical official runs. Start of the simulator-in-the-loop series.', when: '14 Oct', setup: 'stock', evidence: 'local-xml' },
  { seconds: 66.526, label: 'Corner windows at 770 m and 1,042 m', detail: 'Per-window search, ranked by official lap time (66.686 s after the 770 m window).', when: '14 Oct', setup: 'stock', evidence: 'repo-readme' },
  { seconds: 66.356, label: '330–680 m complex', detail: 'Line and speed nodes searched together, after the 2,700 m window (66.506 s).', when: '14 Oct', setup: 'stock', evidence: 'repo-readme' },
  { seconds: 66.262, label: 'Launch settings and finish-line fix', detail: 'Clutch and traction allowance on the standing start, then a fix for braking near the finish line: the speed look-ahead read the standing-start speed limit at the end of the lap and is now clamped to the last plan sample.', when: 'Oct', setup: 'stock', evidence: 'repo-readme' },
  { seconds: 66.02, label: 'Traction control and ABS tuning', detail: 'A search over 145 candidates; looser traction control and earlier ABS release gave about 0.55 s more full throttle and 0.39 s less braking per lap.', when: 'Oct', setup: 'stock', evidence: 'repo-readme' },
  { seconds: 65.968, label: 'Corkscrew racing line: P1, final', detail: 'A straighter line through the left-right direction change at 2,301 to 2,493 m. Final package: six races at 65.968 s, and five more through the repository, all with zero damage and zero timeouts.', when: 'Oct', setup: 'stock', evidence: 'repo-xml', final: true },
];

export interface Run { id: string; label: string; order: string; seconds: number; damage: number; timeouts: number; valid: boolean; note?: string }

/** The five runs of the P1 release folder, published in the repository (evidence/release_p1_65968). */
export const p1Runs: Run[] = [1, 2, 3, 4, 5].map((n) => ({ id: `repo_run${n}`, label: `Repository run ${n}`, order: 'repository validation script', seconds: 65.968, damage: 0, timeouts: 0, valid: true }));

/** Final optimisation series on the stock car, as tabulated in the repository README. Cumulative, one real TORCS lap per candidate. */
export const optimisation = [
  { step: 'Starting point for this series', seconds: 66.906 },
  { step: '1,528 m corner window', seconds: 66.78 },
  { step: '770 m corner window', seconds: 66.686 },
  { step: '1,042 m corner window', seconds: 66.526 },
  { step: '2,700 m corner window', seconds: 66.506 },
  { step: '330–680 m complex (line and speed nodes)', seconds: 66.356 },
  { step: 'Launch settings and finish-line fix (phase 2A)', seconds: 66.262 },
  { step: 'Global parameter optimisation (phase 2B)', seconds: 66.02 },
  { step: 'Corkscrew racing line (phase 2C, P1)', seconds: 65.968 },
];

/** Sampled telemetry of the validated lap (every 10th sample, from the repository's evidence folder). */
export const lap = { distance: profile.distance_m, speed: profile.speed_kmh };

/** Landmarks read from the same data, for the text alternative of the chart. Distances are the nearest sample. */
export const landmarks = (() => {
  const at = (m: number) => {
    let k = 0;
    for (let i = 1; i < lap.distance.length; i++) if (Math.abs(lap.distance[i] - m) < Math.abs(lap.distance[k] - m)) k = i;
    return { d: lap.distance[k], v: lap.speed[k] };
  };
  const top = lap.speed.indexOf(Math.max(...lap.speed));
  const low = lap.speed.indexOf(Math.min(...lap.speed.filter((_, i) => lap.distance[i] > 1500)));
  return [
    { label: 'Start line', ...at(0), note: 'Standing start from a grid about 10 m behind the line, so the first sample is already moving.' },
    { label: 'Top speed', d: lap.distance[top], v: lap.speed[top], note: 'Highest sampled speed of the lap.' },
    { label: 'Slowest point', d: lap.distance[low], v: lap.speed[low], note: 'Inside the Corkscrew window (2,301 to 2,493 m), where the P1 racing line changed.' },
    { label: 'Hairpin', ...at(3280), note: 'Lowest-speed corner of the final third.' },
  ];
})();

export const speedStats = {
  top: Math.max(...lap.speed),
  mean: best.lapLength / (best.seconds / 3600),
};
