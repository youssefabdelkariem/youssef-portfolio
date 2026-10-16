/**
 * Aurelia walkthrough ("Explore the process"). INTERNAL DRAFT until published: the route is only built when
 * walkthrough-publication.json says `published: true` with `approvedBy` and `approvedOn`, or when the build is a local preview
 * (`npm run build:preview`, never deployed). Content lives in walkthrough.json; every point carries its verified source.
 */
import data from './walkthrough.json';
import publication from './walkthrough-publication.json';

export type WalkthroughSection = (typeof data.sections)[number];
export const walkthrough = data;
export const published = publication.published === true && !!publication.approvedBy && !!publication.approvedOn;

/** Reasons the walkthrough cannot be published yet; empty when it is ready. */
export function blockers(): string[] {
  const out: string[] = [];
  for (const s of data.sections) {
    if (s.status !== 'ready') out.push(`${s.title}: ${s.need.join('; ') || 'not ready'}`);
    for (const m of s.media) if (m.status === 'needed') out.push(`${s.title}: media needed (${m.description})`);
  }
  return out;
}
