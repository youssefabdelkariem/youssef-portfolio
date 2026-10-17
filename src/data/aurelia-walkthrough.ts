// Content for /work/aurelia/walkthrough/. Every step describes something visible in the clip it plays.
// Clip ids match scripts/aurelia/walkthrough.spec.json; `t` is the clip's range on the walkthrough master timeline.

export interface Step {
  clip: string;
  title: string;
  text: string;
  t: string;
  alt: string;
  /** Desktop and mobile poster/video aspect ratios, width / height. */
  ratio: [number, number];
  ratioM?: [number, number];
  hasMobile: boolean;
}

export interface Chapter {
  n: string;
  id: string;
  title: string;
  nav: string;
  app: string;
  deck: string;
  steps: Step[];
}

const UI: [number, number] = [1440, 878];
const UI_M: [number, number] = [800, 600];

export const hero = {
  clip: 'hero',
  alt: 'Three cuts from the finished commercial: a camera lens close-up, the phone with a 09:41 lock screen, and the phone from the front in a dark studio.',
};

export const pipeline = ['Illustrator', 'Plasticity', 'Blender', 'Nuke / After Effects'] as const;

export const chapters: Chapter[] = [
  {
    n: '01', id: 'design', title: 'Design', nav: 'Design', app: 'Adobe Illustrator',
    deck: 'The phone starts as a flat blueprint: proportions first, then the profile, the camera positions and the small openings.',
    steps: [
      { clip: 'd1', title: 'Establish the proportions', t: '0:11–0:16',
        text: 'A plain rectangle on a millimetre grid sets the overall size before any detail exists. The cursor readout reports offsets in millimetres as the shape is placed.',
        alt: 'Illustrator window with a dashed rectangle selected on a millimetre grid, beneath a heading reading Industrial Design Blueprint.', ratio: UI, ratioM: UI_M, hasMobile: true },
      { clip: 'd2', title: 'Refine the front profile', t: '0:16–0:24',
        text: 'The rectangle becomes a rounded outline drawn as a doubled contour. A second view is already laid out beside it on the same artboard.',
        alt: 'Illustrator showing the rounded outline of the phone front on a grid, with a second outline partly visible at the right.', ratio: UI, ratioM: UI_M, hasMobile: true },
      { clip: 'd3', title: 'Place the camera details', t: '0:24–0:29',
        text: 'Zoomed into a corner, a circle marks a lens position. The Layers panel splits the drawing by part: Title, Notes, Dimensions, Cameras, a Body group (Top, Bottom, Side, Back, Front) and Guides.',
        alt: 'Illustrator zoomed on the corner of the phone outline with a red circle for a lens and the Layers panel open on the right.', ratio: UI, ratioM: UI_M, hasMobile: true },
      { clip: 'd4', title: 'Resolve the small details', t: '0:29–0:34',
        text: 'The lower edge gets its own drawing: a rounded bar holding five small circles and a slot, with the Aurelia One name set above the top view.',
        alt: 'Illustrator showing the top of the phone outline and, below it, a rounded bar containing five small circles and an elongated slot.', ratio: UI, ratioM: UI_M, hasMobile: true },
    ],
  },
  {
    n: '02', id: 'form', title: 'Building the form', nav: 'Form', app: 'Plasticity',
    deck: 'The drawn curves become solid geometry: a body, ringed lenses, a flash opening and a side profile.',
    steps: [
      { clip: 'm1', title: 'Build depth from profiles', t: '0:36–0:44',
        text: 'The outline sits in the Outliner as numbered curves. In the front view the Extrude panel is set to pick regions from them; the first frame reports 55 regions selected.',
        alt: 'Plasticity front view of the phone body filled in blue with two lens circles, the Extrude panel open and a list of curves on the left.', ratio: UI, ratioM: UI_M, hasMobile: true },
      { clip: 'm2', title: 'Shape the lens assembly', t: '0:44–0:52',
        text: 'From the back, concentric circles define each lens housing. Selecting a circle and extruding it by a small distance gives the ring real thickness, so the rim catches light later.',
        alt: 'Plasticity back view of concentric lens circles, then the Extrude panel with a lens ring highlighted in yellow.', ratio: UI, ratioM: UI_M, hasMobile: true },
      { clip: 'm3', title: 'Refine the flash detail', t: '0:52–0:58',
        text: 'In perspective, the two raised lens rings, the small flash opening between them and the rounded body edge read as one object.',
        alt: 'Plasticity perspective view of the phone back with two lens rings, a small blue flash circle between them and a curved metal edge on the left.', ratio: UI, ratioM: UI_M, hasMobile: true },
      { clip: 'm4', title: 'Work through the side profile', t: '0:58–1:03',
        text: 'Seen edge-on, the body is a thin slab. The Outliner now lists five extruded solids, Extruded.001 to Extruded.005, alongside measurement objects.',
        alt: 'Plasticity showing the phone as a thin tilted blue slab, with five extruded solids and distance measurements listed in the Outliner.', ratio: UI, ratioM: UI_M, hasMobile: true },
    ],
  },
  {
    n: '03', id: 'surface', title: 'Materials and lighting', nav: 'Surface', app: 'Blender',
    deck: 'The model moves into Blender, where it is checked part by part, given surfaces, and placed inside a studio built from lights, cards and flags.',
    steps: [
      { clip: 'b1', title: 'Inspect the model in 3D', t: '1:05–1:11',
        text: 'Orbiting the phone in a direction-shaded view shows how the surfaces curve. The Outliner lists parts individually: flash diffuser, LED emitter and reflector, front glass and several lens elements.',
        alt: 'Blender viewport showing the back of the phone shaded in purple, magenta and blue, with two lens rings and a list of named parts at the right.', ratio: UI, ratioM: UI_M, hasMobile: true },
      { clip: 'b2', title: 'Review materials and reflections', t: '1:11–1:17',
        text: 'A dark back panel is checked up close. Its Bevel modifier is set to an offset width of 0.00006 m, two segments and an angle limit, which gives the edges a thin highlight-catching chamfer.',
        alt: 'Blender viewport showing a dark red-black phone back, then a close view of the flash and a lens with noisy preview lighting.', ratio: UI, ratioM: UI_M, hasMobile: true },
      { clip: 'b3', title: 'Explore the studio rig', t: '1:17–1:23',
        text: 'The scene collection reads like a photo studio: a cyclorama, key and fill softboxes, left and right rim strips, a rear kicker and top edge strip, a gradient background, five white cards and a 10 cm scale reference.',
        alt: 'Blender viewport looking at a studio rig of panels, cards and wireframe light shapes in front of a blurred backdrop, with the light list at the right.', ratio: UI, ratioM: UI_M, hasMobile: true },
    ],
  },
  {
    n: '04', id: 'motion', title: 'Animation and rendering', nav: 'Motion', app: 'Blender / Cycles',
    deck: 'Cameras are framed against the phone, the title lettering is lit, and the motion is keyed and reviewed before the final render.',
    steps: [
      { clip: 'b4', title: 'Check the phone in scene', t: '1:23–1:27',
        text: 'A plain grey phone sits inside the camera frame. The render panel shows Cycles with a viewport limit of 1024 samples and a final-render limit of 4096, with denoising enabled for the render.',
        alt: 'Blender viewport with a grey phone inside a wireframe camera frustum and render settings for Cycles on the right.', ratio: UI, ratioM: UI_M, hasMobile: true },
      { clip: 'b5', title: 'Shape the logo reveal', t: '1:27–1:33',
        text: 'The AURELIA lettering curves across the frame in a dark scene. The viewport reads Updating Shaders while the lighting is adjusted to rake across the letters.',
        alt: 'Blender viewport with raised AURELIA lettering receding along a curve in a dark scene, and the timeline below.', ratio: UI, ratioM: UI_M, hasMobile: true },
      { clip: 'b6', title: 'From viewport to render preview', t: '1:33–1:41',
        text: 'A close camera, labelled Hero_85mm in the viewport, frames the lens ring and flash. This is a grey solid view of the same framing that is later rendered.',
        alt: 'Blender viewport zoomed onto a lens ring and flash in grey solid shading, with a camera frame labelled Hero_85mm.', ratio: UI, ratioM: UI_M, hasMobile: true },
      { clip: 'b7', title: 'Review the keyframed turn', t: '1:41–1:49',
        text: 'Seen edge-on, the phone turns while yellow keyframe markers run along the timeline. The scene file is named Shot 006, Chunk 4, Motion Polish.',
        alt: 'Blender viewport showing the phone seen from the side in a grey studio, with keyframe diamonds on the timeline below.', ratio: UI, ratioM: UI_M, hasMobile: true },
    ],
  },
  {
    n: '05', id: 'comp', title: 'Compositing and finishing', nav: 'Finish', app: 'Nuke and After Effects',
    deck: 'Renders are reviewed in Nuke, the lock screen is built in After Effects, and the pieces are put together into the shot.',
    steps: [
      { clip: 'c1', title: 'Review the rendered reveal', t: '1:49–1:56',
        text: 'A Read node loads the Shot 001 EXR sequence, frames 1 to 250 at 3840 × 2160, and the Viewer plays through the wordmark reveal.',
        alt: 'Nuke Viewer showing the AURELIA lettering rendered against a grey wall, with the Read node and its properties beside it.', ratio: UI, ratioM: UI_M, hasMobile: true },
      { clip: 'c2', title: 'Preview the layered display', t: '1:58–2:02',
        text: 'The lock screen is a 1440 × 3200, 24 fps After Effects composition named Screen Animation, with separate Indicator, Camera and Flashlight layers and a 09:41 clock.',
        alt: 'After Effects showing a phone lock screen reading 09:41 above a timeline with layers named Lock Indicator, Lock Camera and Lock Flashlight.', ratio: UI, ratioM: UI_M, hasMobile: true },
      { clip: 'c3', title: 'Bring the display into the shot', t: '2:02–2:10',
        text: 'In Nuke the screen is placed into the render through an STMap driven by a utility pass from Shot 005, then graded (multiply 0.9, gamma 1.03 on Grade2) and merged back over the beauty.',
        alt: 'Nuke Viewer showing the phone with a 09:41 lock screen, and a node graph with Read, Shuffle, Grade, STMap and Merge nodes.', ratio: UI, ratioM: UI_M, hasMobile: true },
    ],
  },
];

export const compare = {
  a: { clip: 'cmp-a', label: 'Animation preview', alt: 'Animation preview: two camera lenses and a flash on a dark phone back beside a bright grey surface, soft and low resolution.' },
  b: { clip: 'cmp-b', label: 'Final composite', alt: 'Final composite of the same move: sharper lens rings with reflections in the glass, a small flash and a darker surface at the left.' },
};

export interface Frame { clip: string; label: string; shot: string; alt: string; layout: 'wide' | 'left' | 'right' | 'narrow'; }
export const finals: Frame[] = [
  { clip: 'f1', label: 'Raised wordmark', shot: 'Shot 001', layout: 'wide', alt: 'Raised AURELIA lettering on a grey surface, lit from the lower left.' },
  { clip: 'f2', label: 'Camera module', shot: 'Shot 002', layout: 'left', alt: 'Close-up of two ringed camera lenses and a flash on the black back of the phone.' },
  { clip: 'f3', label: 'The back of the phone', shot: 'Shot 003', layout: 'right', alt: 'The back of the phone from an angle, with two lenses at the top left and the Aurelia mark near the bottom.' },
  { clip: 'f4', label: 'Lens, macro', shot: 'Shot 004', layout: 'wide', alt: 'Extreme close-up of a lens ring and the flash against a dark matte surface.' },
  { clip: 'f5', label: 'Glass and edge', shot: 'Shot 005', layout: 'left', alt: 'A rounded corner of the glossy phone with the AURELIA name engraved near the edge, catching a long highlight.' },
  { clip: 'f6', label: 'Side profile', shot: 'Shot 006', layout: 'narrow', alt: 'The phone seen from the side, standing in a dark vignetted studio with two lenses visible on the back.' },
];
