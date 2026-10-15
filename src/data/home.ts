/**
 * Homepage media slots. `null` renders a labelled placeholder. To publish real media, set a
 * verified, owner-approved derivative here (see docs/CONTENT_MANIFEST.md items M-01/M-02).
 *
 * Hero artwork guide (see docs/reviews/M1B_HOME_DECISION.md):
 *  - desktop master 2880 x 1206 (2.39:1), keep the subject inside the central 70% vertically and
 *    set `focal` if it is off-centre; the box crops top and bottom on wide or short windows;
 *  - optional `mobileSrc` crop at 1200 x 1500 (4:5) used at 560 px and below; without it phones
 *    show a centred 3:2 crop of the desktop image;
 *  - poster budget: at most 250 KB per variant (QA-08), AVIF or WebP with a JPEG fallback.
 */
export interface MediaRef {
  src: string;
  alt: string;
  width: number;
  height: number;
  mobileSrc?: string;
  mobileWidth?: number;
  mobileHeight?: number;
  focal?: string;
  srcset?: string;
  sizes?: string;
}

export const homeMedia: { hero: MediaRef | null; aurelia: MediaRef | null } = {
  hero: null,
  aurelia: null,
};
