export interface InspectionWorkflow {
  id: string;
  tag: string;
  title: string;
  summary: string;
  items: string[];
}

export interface GallerySlot {
  id: string;
  step: string;
  title: string;
  area: string;
  image: string;
  alt: string;
  caption: string;
}

export interface CompatibilityRow {
  version: string;
  tier: string;
  status: string;
  notes: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const framesentry = {
  name: 'FrameSentry',
  category: 'Render Sequence Quality Control for Blender',
  headline: 'Catch render problems before they reach delivery.',
  supporting:
    'FrameSentry helps Blender artists and studios inspect rendered sequences, identify potential problems and review actionable findings before compositing or delivery.',
  statusLabel: 'Available on Gumroad',
  assets: {
    icon: '/media/software/framesentry/icon.webp',
    iconAlt: 'FrameSentry emblem: a stylized purple ribbon F inside four corner viewfinder brackets.',
    banner: '/media/software/framesentry/banner.webp',
    bannerAlt: 'FrameSentry Render Quality Control banner showing the FrameSentry mark and inspected render frames.',
  },
  whyMatters: {
    lead: 'Delivered animations often span hundreds or thousands of frames. Scrubbing by eye misses single-frame failures that are expensive when a client finds them first.',
    points: [
      {
        title: 'Silent render-node failures',
        detail: 'A crashed node or full disk leaves behind missing frames, zero-byte files, or truncated EXR and PNG containers that still look normal in a directory listing.',
      },
      {
        title: 'Mid-sequence visual accidents',
        detail: 'A GPU reset can drop a single black or blank frame, produce NaN or infinite pixel values, or trigger an abrupt brightness or exposure jump.',
      },
      {
        title: 'Read-only, non-destructive verification',
        detail: 'FrameSentry inspects your rendered sequence without modifying source files, storing engine paths in your .blend, or requiring an internet connection.',
      },
    ],
  },
  workflows: [
    {
      id: 'structural',
      tag: 'Certainty: Verified',
      title: 'Structural & Container Validation',
      summary: 'Deterministic checks performed by an isolated external decode worker, never inside Blender’s main process.',
      items: [
        'Missing frames compared against the active scene range or inferred sequence bounds, grouped into compact ranges',
        'Zero-byte, unreadable, and truncated file detection via a bounded container census (OpenEXR, PNG, TIFF, JPEG)',
        'Inconsistent frame dimensions, channel sets, per-channel pixel types, EXR part structure, or tiling',
        'Naming anomalies (mixed padding, frame-number collisions, out-of-range files)',
        'NaN and infinite pixel value counts in decoded float channels, plus exact duplicate frame detection',
      ],
    },
    {
      id: 'visual',
      tag: 'Certainty: Heuristic',
      title: 'Visual Analysis & Presets',
      summary: 'Statistical per-frame checks over decoded pixel values with transparent measured values and thresholds.',
      items: [
        'Black or blank frame detection with single-range grouping for intentional fades',
        'Brightness discontinuity checks using a robust median/MAD neighbourhood comparison',
        'Highlight clipping and exposure jump detection relative to neighbouring frames',
        'Configurable presets (Conservative, Default, Sensitive) that tune visual rules without altering structural checks',
      ],
    },
    {
      id: 'blender-ui',
      tag: 'In-Blender UI',
      title: 'In-Blender Quality Control Workflow',
      summary: 'Integrated into Blender’s Render Output properties and Image Editor sidebar for fast, non-blocking review.',
      items: [
        'One-click “Check Scene Output” or directory discovery with single-click sequence selection',
        'Asynchronous external engine execution with live progress and responsive cancellation',
        'Paginated, filterable Findings Browser (Errors vs. Warnings) with plain-language explanations',
        'Contained GPU proxy preview texture inside Blender’s Image Editor without loading untrusted renders directly',
        'Deduplicated “Copy Frames” and “Copy Filtered Frames” export (e.g. 4,7,10) for targeted re-rendering',
      ],
    },
    {
      id: 'architecture',
      tag: 'Offline-First',
      title: 'Offline Architecture, Reports & CLI',
      summary: 'Two-component design separating the Blender adapter extension from the standalone FrameSentry Engine.',
      items: [
        'Offline-first: zero network requests, no telemetry, no user accounts, and no online licence checks',
        'Strictly read-only against source render directories; never overwrites existing files',
        'Built for standalone HTML reports, structured JSON output, and command-line pipeline integration',
      ],
    },
  ] satisfies InspectionWorkflow[],
  gallerySlots: [
    {
      id: 'output-panel',
      step: '01',
      title: 'Output Tab & Sequence Discovery',
      area: 'Render Output Properties',
      image: '/media/software/framesentry/ui-discovery.webp',
      alt: 'FrameSentry Output Properties panel in Blender 4.5.15 LTS showing auto-detected EXR sequence frames 176-223, check presets, and Check Scene Output button.',
      caption: 'Auto-detects the active scene’s EXR sequence (frames 176–223) and engine readiness inside Blender’s Render Output panel.',
    },
    {
      id: 'findings-browser',
      step: '02',
      title: 'Findings Browser & Coverage Summary',
      area: 'Quality Control Panel',
      image: '/media/software/framesentry/ui-findings.webp',
      alt: 'FrameSentry Quality Control sidebar showing 48 of 48 frames examined, 1 error, 4 warnings, coverage summary, and frame 188 missing frame finding.',
      caption: 'Reports 48 of 48 frames examined with explicit coverage details, severity/certainty filters, and missing-frame error 188.',
    },
    {
      id: 'gpu-preview',
      step: '03',
      title: 'GPU Proxy Findings Preview',
      area: 'Image Editor Sidebar',
      image: '/media/software/framesentry/ui-gpu-preview.webp',
      alt: 'FrameSentry live GPU proxy preview in Blender Image Editor displaying Aurelia render frame 214 flagged for a +2.00 EV brightness discontinuity.',
      caption: 'Previews flagged frame 214 (+2.00 EV brightness discontinuity) via an isolated engine-generated GPU proxy texture.',
    },
    {
      id: 'copy-frames',
      step: '04',
      title: 'Actionable Frame List Export',
      area: 'Re-Render Preparation',
      image: '/media/software/framesentry/ui-copy-frames.webp',
      alt: 'FrameSentry Quality Control sidebar showing Copy Filtered Frames exporting deduplicated frame list 188,202,214 to the clipboard.',
      caption: 'Copies the deduplicated affected frame list (188,202,214) directly to the clipboard for targeted re-rendering.',
    },
  ] satisfies GallerySlot[],
  demo: {
    video: '/media/software/framesentry/demo.mp4',
    poster: '/media/software/framesentry/ui-gpu-preview.webp',
    caption: 'Aurelia EXR sequence (frames 176–223) scanned in Blender 4.5.15 LTS on Windows OpenGL: sequence discovery, out-of-process OpenImageIO scan, defect inspection, and clipboard export.',
  },
  compatibility: {
    milestoneNote:
      'FrameSentry is available now on Gumroad. Full multi-version GPU Findings Preview qualification across all targeted Blender versions and graphics backends remains in progress.',
    gpuGateNote:
      'Full GPU Findings Preview must qualify across all three targeted Blender versions and graphics backends before those configurations are described as supported.',
    formats: ['OpenEXR (single-part & multi-part/multilayer)', 'PNG (8/16-bit)', 'TIFF (8/16/32-bit)', 'JPEG (baseline & progressive)'],
    matrix: [
      {
        version: 'Blender 4.5.15 LTS',
        tier: 'Target Tier 1',
        status: 'Qualification in progress',
        notes: 'Windows OpenGL verified; Vulkan and Linux/macOS targets remain in qualification.',
      },
      {
        version: 'Blender 5.2.x',
        tier: 'Target Tier 1',
        status: 'Qualification in progress',
        notes: 'Targeted LTS line. Windows OpenGL GPU preview qualification and compatibility checks are in progress.',
      },
      {
        version: 'Blender 5.3.x',
        tier: 'Target Tier 2',
        status: 'Qualification in progress',
        notes: 'Targeted release. Full GPU Findings Preview qualification is required across backends before support is claimed.',
      },
    ] satisfies CompatibilityRow[],
  },
  purchasing: {
    status: 'Available on Gumroad',
    summary:
      'Get FrameSentry directly on Gumroad, including the Blender adapter extension and standalone analysis engine.',
    deliverables: [
      'FrameSentry for Blender (adapter extension)',
      'FrameSentry Engine (standalone analysis application & CLI)',
      'Offline-first operation with no telemetry or online activation servers',
    ],
  },
  faqs: [
    {
      question: 'Is FrameSentry available now?',
      answer:
        'Yes. FrameSentry is available on Gumroad, while full GPU Findings Preview qualification across Blender 4.5.15 LTS, 5.2.x, and 5.3.x continues.',
    },
    {
      question: 'Which Blender versions are targeted?',
      answer:
        'FrameSentry targets Blender 4.5.15 LTS, 5.2.x, and 5.3.x. Full GPU Findings Preview must qualify on all three targeted versions and graphics backends before they are described as supported.',
    },
    {
      question: 'Does FrameSentry modify my rendered frames or .blend files?',
      answer:
        'No. Sequence inspection is strictly read-only. FrameSentry never alters your rendered frames, never loads untrusted render files directly into Blender’s image loader during preview, and never stores local engine paths inside a .blend file.',
    },
    {
      question: 'Does FrameSentry require an internet connection or user account?',
      answer:
        'No. FrameSentry is designed offline-first with zero network access, zero telemetry, no user accounts, and no online licence servers.',
    },
    {
      question: 'What image formats are supported?',
      answer:
        'FrameSentry targets image sequences in OpenEXR (single-part and multi-part/multilayer), PNG, TIFF, and JPEG. Video containers such as MP4 or MOV are intentionally excluded from MVP.',
    },
    {
      question: 'How can I get FrameSentry or request studio support?',
      answer:
        'You can get FrameSentry directly on Gumroad, or use the Youssef Studio contact page to share your studio workflow, Blender version, and operating system.',
    },
  ] satisfies FaqItem[],
};
