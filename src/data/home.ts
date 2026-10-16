/**
 * Homepage media. Each entry is null (a labelled placeholder renders) until the derivatives exist in
 * public/media/aurelia/ (see src/data/media.ts and docs/CONTENT_MANIFEST.md). Selection approved by the owner
 * on 2026-10-15 (docs/CONTENT_MANIFEST.md, section H).
 *
 * Artwork guide for replacements: desktop master 2880 x 1206 (2.39:1) with the subject inside the central
 * 70% vertically; optional 1200 x 1500 (4:5) phone crop used at 560 px and below; at most 250 KB per
 * delivered variant unless visible banding or loss requires more (QA-08, QA-13).
 */
import { artDirected, picture, type Pic } from './media';

export const homeMedia: { hero: Pic | null; aurelia: Pic | null } = {
  // Desktop: Shot 002 frame 1 (macro lens). Phones (560 px and below): Shot 003 frame 1 (whole phone). One alt text covers both crops.
  hero: artDirected('hero', 'hero-home-m', 'The Aurelia One smartphone: a close-up of a camera lens with violet and blue reflections on wide screens, and the whole phone seen from the back, rim-lit on black, on phones.'),
  aurelia: picture('phone', 'The back of the Aurelia One smartphone floating in a dark studio, showing two camera lenses and the engraved AURELIA ONE mark.', '(min-width: 1200px) 1200px, 100vw'),
};
