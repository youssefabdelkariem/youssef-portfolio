/**
 * Homepage media. Each entry is null (a labelled placeholder renders) until the derivatives exist in
 * public/media/aurelia/ (see src/data/media.ts and docs/CONTENT_MANIFEST.md). Selection is provisional and
 * needs the owner's approval before any image is committed.
 *
 * Artwork guide for replacements: desktop master 2880 x 1206 (2.39:1) with the subject inside the central
 * 70% vertically; optional 1200 x 1500 (4:5) phone crop used at 560 px and below; at most 250 KB per
 * delivered variant unless visible banding or loss requires more (QA-08, QA-13).
 */
import { artDirected, picture, type Pic } from './media';

export const homeMedia: { hero: Pic | null; aurelia: Pic | null } = {
  hero: artDirected('hero', 'hero-m', 'Extreme close-up of a smartphone camera lens in a dark studio, with violet and blue reflections in the glass and a bright softbox reflected near the top.'),
  aurelia: picture('phone', 'The back of the Aurelia One smartphone floating in a dark studio, showing two camera lenses and the engraved AURELIA ONE mark.', '(min-width: 1200px) 1200px, 100vw'),
};
