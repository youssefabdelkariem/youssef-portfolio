/**
 * The final recorded lap of the P1 controller (65.968 s). DORMANT: `racing-video.json` holds `{ "video": null }` until the owner has
 * uploaded the video and approved its public URL. While it is null nothing about it reaches the build (no section, script, metadata
 * or third-party host). To publish: upload the YouTube export, put the video id and details into racing-video.json, create the poster
 * with scripts/racing/make-lap-poster.mjs and run `npm run verify`. See docs/reviews/RACING_FINAL_RESULTS.md.
 *
 * `YS_RACING_VIDEO_FIXTURE=1` (build-time only, used by `npm run test:racing`) substitutes a synthetic video so the component can be
 * tested without a real upload; the production build never sets it and check-racing fails if player markup appears without a video.
 */
import config from './racing-video.json';

export interface LapVideo {
  title: string;
  /** One or two sentences shown under the player. */
  description: string;
  /** Text description of the footage for people who cannot watch it. */
  accessibilityNote: string;
  youtubeId: string;
  /** The public watch page: the no-JavaScript and external playback fallback. */
  externalUrl: string;
  /** ISO 8601 duration, for example PT1M20S. */
  duration: string;
  uploadDate: string;
  /** Base name of the poster set in public/media/racing: <base>-960.avif|jpg and <base>-1280.avif|jpg. */
  posterBase: string;
  posterAlt: string;
  approvedBy: string;
  approvedOn: string;
}

const fixture: LapVideo = {
  title: 'Final lap (fixture)', description: 'Synthetic fixture used by the component test.', accessibilityNote: 'Synthetic fixture: no real video.',
  youtubeId: 'FIXTUREID01', externalUrl: 'https://youtu.be/FIXTUREID01', duration: 'PT1M20S', uploadDate: '2000-01-01',
  posterBase: 'lap-poster-fixture', posterAlt: 'Fixture poster', approvedBy: 'fixture', approvedOn: '2000-01-01',
};

function load(): LapVideo | null {
  if (process.env.YS_RACING_VIDEO_FIXTURE) return fixture;
  const v = (config as { video: LapVideo | null }).video;
  if (!v) return null;
  const missing = (['title', 'description', 'accessibilityNote', 'youtubeId', 'externalUrl', 'duration', 'uploadDate', 'posterBase', 'posterAlt', 'approvedBy', 'approvedOn'] as const).filter((k) => !v[k]);
  if (missing.length) throw new Error(`racing-video.json: the video is incomplete (missing ${missing.join(', ')}); an unfinished video must not reach the build`);
  return v;
}

export const lapVideo: LapVideo | null = load();
