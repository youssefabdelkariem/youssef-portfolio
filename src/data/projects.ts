/**
 * Project records. Only verified, completed work is listed (CONTENT_PLAN, "Verified work only"). `status` mirrors the
 * readiness gate: 'collected' = assets located and derivatives made, awaiting the owner's approval.
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
