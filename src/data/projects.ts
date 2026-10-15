/**
 * Project records. `status` mirrors the CONTENT_PLAN readiness gate:
 * 'placeholder' = no verified asset or claim yet; 'collected' = assets located and derivatives made, awaiting
 * the owner's approval. Nothing here is a verified credit or result.
 */
import { picture, type Pic } from './media';

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
  /** Responsive picture, or null when no approved derivative exists (a labelled placeholder renders). */
  pic: Pic | null;
}

export const aureliaPic = picture('lenses', 'Back of the Aurelia One phone showing two camera lenses ringed in polished metal on a near-black body.', '(min-width: 900px) 33vw, 100vw');

export const workProjects: Project[] = [
  {
    slug: 'aurelia',
    title: 'Aurelia',
    discipline: 'CGI',
    href: '/work/aurelia/',
    summary: 'A CGI smartphone commercial for the Aurelia One. Selected renders, a render-pass breakdown and technical notes from the project files.',
    status: 'collected',
    flagship: true,
    pic: aureliaPic,
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
    pic: null,
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
