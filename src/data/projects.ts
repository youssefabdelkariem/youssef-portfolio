/**
 * Project records. `status` mirrors the CONTENT_PLAN readiness gate:
 * 'placeholder' = no verified asset or claim yet. Nothing here is a verified credit or result.
 */
export type Discipline = 'CGI' | 'Compositing' | 'Engineering';
export type Status = 'placeholder' | 'collected' | 'verified' | 'approved';

export interface Project {
  slug: string;
  title: string;
  discipline: Discipline;
  href: string;
  summary: string;
  status: Status;
  flagship?: boolean;
}

export const workProjects: Project[] = [
  {
    slug: 'aurelia',
    title: 'Aurelia',
    discipline: 'CGI',
    href: '/work/aurelia/',
    summary: 'Owner-designated flagship: a CGI smartphone commercial. Case study structure ready; media, role and credits pending verification.',
    status: 'placeholder',
    flagship: true,
  },
];

export const engineeringProjects: Project[] = [
  {
    slug: 'ibm-ai-racing',
    title: 'IBM AI Racing League / TORCS',
    discipline: 'Engineering',
    href: '/engineering/ibm-ai-racing/',
    summary: 'Autonomous racing controller project. Dedicated case study with structure for methodology, comparison, footage and source; evidence pending.',
    status: 'placeholder',
  },
];

/** Empty slots shown on index pages so the layout is testable without inventing projects. */
export const workSlots: { discipline: Discipline; note: string }[] = [
  { discipline: 'CGI', note: 'Additional CGI / product-visualization project slot' },
  { discipline: 'Compositing', note: 'Compositing / shot-breakdown project slot' },
];

export const engineeringCategories = [
  { name: 'CAD', note: 'Mechanical design, assemblies and drawings' },
  { name: 'Robotics / mechatronics', note: 'Electromechanical systems and control' },
  { name: 'Programming', note: 'Software and tooling projects' },
  { name: 'Simulation', note: 'Simulated systems with stated assumptions' },
] as const;
