/**
 * The finished Aurelia commercial. DORMANT: `aurelia-film.json` holds `{ "film": null }` until the owner supplies and approves the
 * published film, and while it is null nothing about a film reaches the build (no section, no script, no metadata, no third-party host).
 * To publish: fill `film` in aurelia-film.json (fields below) and add the poster derivative; see docs/AURELIA_PUBLICATION.md.
 *
 * `YS_FILM_FIXTURE=file|youtube` (build-time only, used by `npm run test:film`) substitutes a synthetic film so the component can be
 * tested without a real film; the production build never sets it and `check-publication` fails if film markup appears without a film.
 */
import config from './aurelia-film.json';

export interface FilmCaption { src: string; srclang: string; label: string; default?: boolean }
export type FilmPlayback =
  | { kind: 'file'; sources: { src: string; type: string }[]; captions?: FilmCaption[] }
  | { kind: 'youtube'; id: string }
  | { kind: 'vimeo'; id: string };

export interface Film {
  title: string;
  /** One or two sentences shown under the player. */
  description: string;
  /** A text description of what the film shows, for people who cannot watch it (WCAG 1.2). Required. */
  accessibilityNote: string;
  /** Link to a transcript or audio-description page, if one exists. */
  transcriptUrl?: string;
  /** ISO 8601 duration, for example PT1M30S. */
  duration: string;
  /** ISO 8601 date the film was published. */
  uploadDate: string;
  width: number;
  height: number;
  /** id of a poster derivative in public/media/aurelia/manifest.json (make it with scripts/aurelia/make-derivatives.py). */
  posterId: string;
  posterAlt: string;
  playback: FilmPlayback;
  /** The public watch page (YouTube, Vimeo or a hosted page): the no-JavaScript and external playback fallback. */
  externalUrl: string;
  /** Owner approval for publication; both are required. */
  approvedBy: string;
  approvedOn: string;
}

const fixtures: Record<string, Film> = {
  file: {
    title: 'Aurelia (fixture)', description: 'Synthetic fixture used by the film component test.', accessibilityNote: 'Synthetic fixture: no real film.',
    duration: 'PT30S', uploadDate: '2000-01-01', width: 2880, height: 1206, posterId: 'hero', posterAlt: 'Fixture poster',
    playback: { kind: 'file', sources: [{ src: '/media/aurelia/film/fixture.mp4', type: 'video/mp4' }], captions: [{ src: '/media/aurelia/film/fixture.vtt', srclang: 'en', label: 'English', default: true }] },
    externalUrl: 'https://example.invalid/watch', approvedBy: 'fixture', approvedOn: '2000-01-01',
  },
  youtube: {
    title: 'Aurelia (fixture)', description: 'Synthetic fixture used by the film component test.', accessibilityNote: 'Synthetic fixture: no real film.',
    duration: 'PT30S', uploadDate: '2000-01-01', width: 2880, height: 1206, posterId: 'hero', posterAlt: 'Fixture poster',
    playback: { kind: 'youtube', id: 'FIXTUREID01' }, externalUrl: 'https://youtu.be/FIXTUREID01', approvedBy: 'fixture', approvedOn: '2000-01-01',
  },
};

function load(): Film | null {
  const fixture = process.env.YS_FILM_FIXTURE;
  if (fixture) return fixtures[fixture] ?? null;
  const f = (config as { film: Film | null }).film;
  if (!f) return null;
  const missing = (['title', 'description', 'accessibilityNote', 'duration', 'uploadDate', 'posterId', 'posterAlt', 'externalUrl', 'approvedBy', 'approvedOn'] as const).filter((k) => !f[k]);
  if (missing.length || !f.width || !f.height || !f.playback) throw new Error(`aurelia-film.json: the film is incomplete (missing ${missing.join(', ') || 'size or playback'}); an unfinished film must not reach the build`);
  return f;
}

export const film: Film | null = load();
