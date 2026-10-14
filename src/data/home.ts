/**
 * Homepage media slots. `null` renders a labelled placeholder. To publish real media, set a
 * verified, owner-approved derivative here (see docs/CONTENT_MANIFEST.md items M-01/M-02),
 * with explicit dimensions and a descriptive alt text.
 */
export interface MediaRef { src: string; alt: string; width: number; height: number }

export const homeMedia: { hero: MediaRef | null; aurelia: MediaRef | null } = {
  hero: null,
  aurelia: null,
};
