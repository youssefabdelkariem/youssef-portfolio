/**
 * Engineering index content. Only the racing project has evidence behind it (docs/reviews/M1B_ENGINEERING_RACING.md).
 * The robotic arm is planned, not built; the CAD entry is a reserved slot. Neither is presented as completed work (Q03, FR-03).
 */
import { best } from './racing';

export type EntryStatus = 'verified' | 'planned' | 'empty';

export interface EngineeringEntry {
  title: string;
  href?: string;
  status: EntryStatus;
  disciplines: string[];
  summary: string;
  facts: [string, string][];
}

export const engineeringEntries: EngineeringEntry[] = [
  {
    title: 'IBM AI Racing League / TORCS controller',
    href: '/engineering/ibm-ai-racing/',
    status: 'verified',
    disciplines: ['Programming', 'Simulation', 'Autonomous systems'],
    summary: 'An autonomous Python racing controller for the TORCS simulator, developed from a first completed lap of 279.22 s to a validated Corkscrew lap with zero damage. Method, tests, limits and source code are in the case study.',
    facts: [
      ['Best validated lap', `${best.seconds.toFixed(3)} s`],
      ['Language', 'Python'],
      ['Evidence', 'Official TORCS results, public repository'],
    ],
  },
  {
    title: 'Robotic arm',
    status: 'planned',
    disciplines: ['Robotics', 'Mechatronics', 'CAD'],
    summary: 'A planned mechatronics project. It has not been built, so no design, model, test or result is shown here. This entry becomes a case study only after the work exists and is documented.',
    facts: [
      ['Stage', 'Planned'],
      ['Evidence', 'None yet'],
    ],
  },
  {
    title: 'CAD and mechanical design',
    status: 'empty',
    disciplines: ['CAD', 'Mechanical design'],
    summary: 'No CAD project is published yet. The entry layout is ready for assemblies, drawings and design notes once a project, its role and its files are confirmed.',
    facts: [
      ['Stage', 'Reserved'],
      ['Evidence', 'None yet'],
    ],
  },
];

export const disciplines = [
  { name: 'Robotics and mechatronics', evidenced: false, note: 'The robotic arm is planned. No completed robotics or mechatronics project is published yet.' },
  { name: 'CAD and mechanical design', evidenced: false, note: 'No CAD project is published yet.' },
  { name: 'Programming and automation', evidenced: true, note: 'A real-time Python controller, a one-command validation script and checksummed run tooling, in a public repository.' },
  { name: 'Simulation', evidenced: true, note: 'Closed-loop testing in TORCS, and a search that used the simulator itself as an exact objective.' },
  { name: 'AI and autonomous systems', evidenced: true, note: 'An autonomous racing controller. It is deterministic, model-based control rather than a trained network, and was developed with AI coding assistants.' },
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
