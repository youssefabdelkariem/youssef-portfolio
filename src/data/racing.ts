/**
 * IBM AI Racing League / TORCS case study: verified facts and their evidence.
 *
 * Every figure below was read from the owner's project files on 2026-10-16 (see docs/reviews/M1B_ENGINEERING_RACING.md for
 * the evidence table). Nothing is estimated or generated. Items the evidence does not support are not present here.
 * The public repository is pinned to a commit so the page can be re-checked against what was read.
 */
import profile from './racing-speed-profile.json';

export const repo = {
  url: 'https://github.com/youssefabdelkariem/IBM-AI-Racing-League',
  commit: '8658c1b',
  commitFull: '8658c1bd54a6776dff06448dee44b44e60a91180',
  checked: '2026-10-16',
};

/** The video title is quoted from the platform's own metadata for this URL; it is the owner's recorded run, not a league broadcast. */
export const video = {
  url: 'https://youtu.be/lp-c8A3NIJI',
  title: 'IBM AI Racing League | Autonomous AI Racing — 66.284s Qualifying Lap (TORCS)',
};

export const best = {
  seconds: 66.284,
  lapLength: 3.608, // km, from the simulator log of the validated runs
  damage: 0,
  timeouts: 0,
  steps: 3331,
  hz: 50,
};

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
  { seconds: 66.284, label: 'Launch settings: final', detail: 'Clutch and traction allowance on the standing start. Five consecutive native runs, all 66.284 s with zero damage and zero timeouts.', when: '14 Oct', setup: 'stock', evidence: 'repo-xml', final: true },
];

export interface Run { id: string; label: string; order: string; seconds: number; damage: number; timeouts: number; valid: boolean; note?: string }

/** The five native validation runs and the three fresh-clone runs published in the repository's evidence folder. */
export const runs: Run[] = [
  { id: 'native_run1', label: 'Native run 1', order: 'client first', seconds: 66.284, damage: 0, timeouts: 0, valid: true },
  { id: 'native_run2', label: 'Native run 2', order: 'client first', seconds: 66.284, damage: 0, timeouts: 0, valid: true },
  { id: 'native_run3', label: 'Native run 3', order: 'TORCS first', seconds: 66.284, damage: 0, timeouts: 0, valid: true },
  { id: 'native_run4_state_diag', label: 'Native run 4', order: 'TORCS first', seconds: 66.284, damage: 0, timeouts: 0, valid: true, note: 'Also records the first server state: standing, 100.0 L fuel.' },
  { id: 'native_run5_final', label: 'Native run 5', order: 'TORCS first, final files', seconds: 66.284, damage: 0, timeouts: 0, valid: true },
  { id: 'fresh_clone_test', label: 'Fresh clone, attempt 1', order: 'copy outside the project', seconds: 67.058, damage: 0, timeouts: 1, valid: false, note: 'One server timeout while the PC was busy. Not counted as a reproduction.' },
  { id: 'fresh_clone_test2', label: 'Fresh clone, attempt 2', order: 'copy outside the project', seconds: 66.284, damage: 0, timeouts: 0, valid: true },
  { id: 'fresh_clone_test3', label: 'Fresh clone, attempt 3', order: 'copy outside the project', seconds: 66.284, damage: 0, timeouts: 0, valid: true },
];

/** Final optimisation series on the stock car, as tabulated in the repository README. Cumulative, one real TORCS lap per candidate. */
export const optimisation = [
  { step: 'Starting point for this series', seconds: 66.906 },
  { step: '1,528 m corner window', seconds: 66.78 },
  { step: '770 m corner window', seconds: 66.686 },
  { step: '1,042 m corner window', seconds: 66.526 },
  { step: '2,700 m corner window', seconds: 66.506 },
  { step: '330–680 m complex (line and speed nodes)', seconds: 66.356 },
  { step: 'Launch settings (clutch, traction allowance)', seconds: 66.284 },
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
    { label: 'Slowest point', d: lap.distance[low], v: lap.speed[low], note: 'The chicane section after the long straight.' },
    { label: 'Hairpin', ...at(3280), note: 'Lowest-speed corner of the final third.' },
  ];
})();

export const speedStats = {
  top: Math.max(...lap.speed),
  mean: best.lapLength / (best.seconds / 3600),
};
