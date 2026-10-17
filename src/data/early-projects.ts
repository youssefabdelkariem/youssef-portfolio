/**
 * Earlier learning projects, each with its own page at /work/<slug>/. Pictures are the owner's own renders
 * (scripts/projects/make-project-images.py writes public/media/projects/<slug>/). Copy describes only what the frames show;
 * tools are listed only where the frames or the owner's notes support them. Owner direction, 2026-10-17: these are mostly
 * beginner, improving-level projects, and the car models come from the Traffiq add-on.
 */
import fs from 'node:fs';
import path from 'node:path';
import type { Pic } from './media';

export interface Frame { id: string; label: string; alt: string }
export interface Project {
  slug: string;
  title: string;
  year?: number;
  summary: string;
  body: string[];
  frames: Frame[];
  facts: [string, string][];
  /** Flagged when the project uses third-party car models. */
  cars?: boolean;
  /** A silent clip at /media/projects/<slug>/clip.mp4; the poster is the first entry of `frames`. */
  video?: { duration: number; alt: string };
  /** A plain-language credit line for third-party material in the shot. */
  credit?: string;
}

export const artstation = 'https://www.artstation.com/stampvfx';

export const projects: Project[] = [
  {
    slug: 'golden-hour-departure', title: 'Golden Hour Departure', year: 2023,
    summary: 'A propeller airliner on an empty apron under low sun, with a mountain range behind it.',
    body: [
      'The scene is about light. A low sun rakes across the apron, throws long shadows from the landing gear and warms the polished metal of the fuselage.',
      'Three frames are shown: the final render, a version with a cooler, greener grade, and a grey viewport view of the same layout before materials and lighting.',
    ],
    facts: [['Year', '2023'], ['Type', 'Personal learning project'], ['Tools', 'Blender (the grey view shows its viewport)']],
    frames: [
      { id: 'final', label: 'Final render', alt: 'A twin-engine propeller airliner with a polished metal body parked on a tarmac apron in low golden sunlight, with a rocky mountain range behind it.' },
      { id: 'alt-grade', label: 'Alternate grade', alt: 'The same aircraft and apron with a cooler, slightly greener colour balance.' },
      { id: 'viewport', label: 'Grey viewport view', alt: 'The same scene in plain grey shading: the aircraft, the apron and the mountains without materials or lighting.' },
    ],
  },
  {
    slug: 'cedar-and-concrete', title: 'Cedar & Concrete', year: 2022,
    summary: 'A modern garage with cedar doors and a brick wall, two cars parked outside and trees behind.',
    body: [
      'An exterior scene that puts architecture and cars together in daylight: a plastered garage with wooden doors, a brick wall, trees, a fence and two parked cars.',
      'The two colour versions are grades of the same render, the second darker and redder. The grey frame is the same scene in plain clay shading.',
    ],
    facts: [['Year', '2022'], ['Type', 'Personal learning project'], ['Tools', 'Blender (the clay view shows its viewport)'], ['Cars', 'Traffiq add-on models']],
    cars: true,
    frames: [
      { id: 'grade-a', label: 'Colour version A', alt: 'A cream garage with tall cedar doors beside a brick wall, a black car at the left and a red sedan at the right, under trees and a blue sky.' },
      { id: 'grade-b', label: 'Colour version B', alt: 'The same garage scene with a darker, redder grade.' },
      { id: 'clay', label: 'Clay view', alt: 'The same scene in plain grey clay shading, showing the garage, both cars and the trees.' },
    ],
  },
  {
    slug: 'cobalt-charge', title: 'Cobalt Charge', year: 2021,
    summary: 'A blue sports car facing the camera from a low angle in front of a glass building.',
    body: [
      'A low front three-quarter view of an Audi sports car. The work here is reflection: the glass facade, the sky and the paint all read in the bodywork and the chrome grille.',
      'It is an early car render from the learning stage of this portfolio.',
    ],
    facts: [['Year', '2021'], ['Type', 'Personal learning project'], ['Car', 'Traffiq add-on model']],
    cars: true,
    frames: [{ id: 'final', label: 'Final render', alt: 'A blue Audi sports car seen from a low front angle in front of a glass-fronted building, with the grille and headlights in sharp detail.' }],
  },
  {
    slug: 'night-shift', title: 'Night Shift', year: 2021,
    summary: 'A small blue helicopter on a dark pad at night, lit against a backdrop of glowing windows.',
    body: [
      'A night scene with one subject. Cool light picks out the helicopter\'s canopy and rotor mast while the pad and the building behind it fall away into darkness.',
      'It comes from the same learning stage.',
    ],
    facts: [['Year', '2021'], ['Type', 'Personal learning project']],
    frames: [{ id: 'final', label: 'Final render', alt: 'A small blue helicopter parked on a dark pad at night, lit from the front, with a grid of faint lit windows behind it.' }],
  },
  {
    slug: 'iron-run', title: 'Iron Run', year: 2020,
    summary: 'A steel sphere rolls down a long, worn corridor toward the camera.',
    body: [
      'A short animation with one moving object. The sphere starts as a speck at the far end of a narrow corridor with flaking painted walls and a wooden floor, and rolls forward until it fills the lower half of the frame.',
      'It is the oldest project on the site, from 2020.',
    ],
    facts: [['Year', '2020'], ['Type', 'Personal learning project'], ['Format', '1280 x 720, 24 fps, 5 seconds, silent']],
    video: { duration: 5.4, alt: 'A dark steel sphere rolls along a wooden-floored corridor with peeling painted walls, growing from a small dot in the distance to filling the frame.' },
    frames: [{ id: 'poster', label: 'Still from the animation', alt: 'A dark steel sphere on a wooden floor in a narrow corridor with peeling green and orange walls, near the camera.' }],
  },
  {
    slug: 'crimson-corridor', title: 'Crimson Corridor',
    summary: 'A red sedan on a road between two rows of dark glass buildings.',
    body: [
      'A symmetrical street scene: one red car, a road with lane markings, and tall glass buildings closing in on both sides with small lit windows.',
      'Two versions of the frame are shown. The final is dark and moody; the other is a lifted version of the same render.',
    ],
    facts: [['Type', 'Personal learning project'], ['Car', 'Traffiq add-on model (BMW)']],
    cars: true,
    frames: [
      { id: 'final', label: 'Final', alt: 'A red BMW sedan on a road between dark glass buildings, with small lit windows in the facades.' },
      { id: 'lifted', label: 'Lifted exposure', alt: 'The same street and red sedan with the shadows brought up, so more of the buildings can be seen.' },
    ],
  },
  {
    slug: 'earthlight', title: 'Earthlight',
    summary: 'The inside of a spacecraft, with a rounded porthole looking out on the Earth.',
    body: [
      'A dark interior with patterned wall panels, a metal-plate floor and railings, and one bright window. The light from outside is the only light that matters.',
      'Three frames of the same view: two with the Earth in the window and one with only stars.',
    ],
    facts: [['Type', 'Personal learning project']],
    frames: [
      { id: 'one', label: 'Earth in the window', alt: 'A dark spacecraft interior with a rounded porthole showing a small, bright Earth, above a metal-plate floor with railings.' },
      { id: 'two', label: 'Earth, larger', alt: 'The same view with the Earth larger and brighter in the porthole.' },
      { id: 'three', label: 'Stars only', alt: 'The same interior with the porthole showing only stars and a blue-white glow at the top of the frame.' },
    ],
  },
  {
    slug: 'skyline-intruder', title: 'Skyline Intruder',
    summary: 'A dark spaceship flies across aerial footage of a city and passes behind a tall tower.',
    body: [
      'A visual-effects shot: a spaceship is added to aerial footage and flies across the frame, disappearing behind a tower with a large billboard on its side. The sky is graded purple.',
      'Because the ship goes behind the building, the real structure has to hide it before it comes out the other side.',
    ],
    facts: [['Type', 'Personal learning project'], ['Format', '1280 x 720, about 20 seconds, silent'], ['My part', 'The spaceship added to the footage']],
    credit: 'The background footage and the billboard artwork belong to their respective owners; only the spaceship is added work.',
    video: { duration: 19.8, alt: 'Aerial footage of a city at dusk with a purple sky; a dark winged spaceship flies across the frame and passes behind a tower covered by a large blue drinks advertisement.' },
    frames: [{ id: 'poster', label: 'Still from the shot', alt: 'A dark spaceship with glowing orange engines flying beside a tall tower covered by a large blue advertisement, above a city under a purple sky.' }],
  },
  {
    slug: 'still-water', title: 'Still Water',
    summary: 'A wooden boat on calm water in a mountain valley, the cliffs reflected below it.',
    body: [
      'A quiet scene built around reflection: warm sunlight on rock faces, reeds along the far shore and a small wooden boat sitting on still water that mirrors the valley.',
      'Two frames of the same scene are shown.',
    ],
    facts: [['Type', 'Personal learning project']],
    frames: [
      { id: 'one', label: 'Frame one', alt: 'A wooden rowing boat on calm water in front of sunlit mountain cliffs, with the cliffs reflected in the water.' },
      { id: 'two', label: 'Frame two', alt: 'A second frame of the boat and valley with slightly different colour and brightness.' },
    ],
  },
];

interface Sized { width: number; height: number; bytes: number }
interface Entry { width: number; height: number; avif: Sized[]; jpg: Sized }
let manifest: Record<string, Entry> | null = null;
function entries(): Record<string, Entry> {
  if (!manifest) manifest = JSON.parse(fs.readFileSync(path.resolve('public/media/projects/manifest.json'), 'utf8'));
  return manifest as Record<string, Entry>;
}

/** Responsive picture data for one frame; every frame has files because the page is built from the manifest. */
export function framePic(slug: string, frame: string, alt: string, sizes = '100vw'): Pic {
  const e = entries()[`${slug}/${frame}`];
  if (!e) throw new Error(`early-projects: no derivative for ${slug}/${frame}`);
  const base = `/media/projects/${slug}/${frame}`;
  const largest = e.avif[e.avif.length - 1];
  return {
    id: `${slug}-${frame}`, alt, src: `${base}-${e.jpg.width}.jpg`, width: e.jpg.width, height: e.jpg.height,
    sources: [{ type: 'image/avif', srcset: e.avif.map((a) => `${base}-${a.width}.avif ${a.width}w`).join(', '), sizes }],
    large: `${base}-${largest.width}.avif`, largeBytes: largest.bytes,
  };
}

export const bySlug = (slug: string) => projects.find((p) => p.slug === slug) as Project;
