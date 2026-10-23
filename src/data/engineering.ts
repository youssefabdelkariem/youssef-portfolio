/**
 * Engineering index content. Only verified, completed work is presented (CONTENT_PLAN, "Verified work only"; FR-03, Q03).
 * Today that is the IBM AI Racing League / TORCS controller. Evidence: docs/reviews/M1B_ENGINEERING_RACING.md.
 */

/** Sections of the racing case study, in page order; ids match the headings on the case-study page. */
import { lapVideo } from './racing-video';

const allContents = [
  ['overview', 'Overview and challenge'],
  ['env', 'Simulator and development setup'],
  ['arch', 'Controller architecture'],
  ['steer', 'Steering and path following'],
  ['speed', 'Speed control, braking and the measured lap'],
  ['iter', 'Eight stages of development'],
  ['perf', 'Lap-time progression'],
  ['test', 'Testing and reliability'],
  ['demo', 'Final demonstration'],
  ['source', 'Source code and evidence'],
  ['lessons', 'Lessons from the lap'],
] as const;

/** Sections of the racing case study. The final-demonstration section exists only once the final lap video is published. */
export const caseContents = allContents.filter(([id]) => id !== 'demo' || lapVideo);

export const demonstrates = [
  { name: 'Programming and automation', note: 'A real-time Python controller, a one-command validation script and checksummed run tooling, in a public repository.' },
  { name: 'Simulation', note: 'Closed-loop testing in TORCS, and a search that used the simulator itself as an exact objective.' },
  { name: 'AI and autonomous systems', note: 'An autonomous racing controller. It is deterministic, model-based control rather than a trained network, and was developed with AI coding assistants.' },
];

export const verifiedTools = [
  { name: 'Python 3.9.13', use: 'Controller and test runner', evidence: 'Validation run reports' },
  { name: 'NumPy 2.0.2', use: 'Plan arrays and numerical model', evidence: 'Repository requirements file' },
  { name: 'TORCS and the SCR server', use: 'Simulator and client interface (UDP port 3001)', evidence: 'Repository README and run logs' },
  { name: 'gym_torcs / Snake Oil client', use: 'Starter client loop, used unmodified', evidence: 'Repository third-party notices (MIT)' },
  { name: 'CMA-ES', use: 'Per-window parameter search against the official lap time', evidence: 'Repository README (method; library not recorded)' },
  { name: 'Git and GitHub', use: 'Version control and public source', evidence: 'Public repository' },
  { name: 'IBM Bob, Codex, Claude Code', use: 'AI coding assistants, credited by stage in the project history', evidence: 'Repository README disclosure; project history reports' },
];
