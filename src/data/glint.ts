export const glint = {
  name: 'Glint 1.0',
  subtitle: '1-Click Local AI Commercial Studio for Blender',
  category: 'Blender Extension · Local AI Directing',
  statusLabel: 'v1.0 · $18 on Gumroad',
  priceLabel: '$18 one-time · Zero subscriptions · Zero API keys',
  gumroadUrl: 'https://yousseffhossam.gumroad.com/l/glint',
  gumroadCta: 'Get Glint 1.0 on Gumroad',
  youtubeId: 'qFOEjvxwEbg',
  youtubeUrl: 'https://www.youtube.com/watch?v=qFOEjvxwEbg',
  youtubeTitle: 'I Trained a Local AI to Direct Blender Commercials in 30 Seconds (Glint 1.0)',
  youtubePoster: '/media/software/glint/demo-poster.webp',
  headline: 'Drop in any 3D product or vehicle. Click once. Get a full, editable Blender commercial rig in ~35 seconds.',
  supporting:
    '100% local AI powered by glint3d/glint-director (Qwen3-VL 4B via Ollama). No cloud, no credits, no monthly fees—every light, camera, and keyframe stays yours to tweak.',
  stages: [
    {
      id: 'scan',
      step: '01',
      label: 'Scene Scan',
      duration: '~4s',
      title: 'Analyze mesh, materials & sub-parts',
      detail: 'Reads bounding box, focal geometry, glossy/glass surfaces, and sub-parts from your active Blender scene.',
      readout: 'mesh_bounds: 4.62 x 1.98 x 1.34 m · materials: clearcoat + glass · sub_parts: 6',
    },
    {
      id: 'direct',
      step: '02',
      label: 'Glint AI Director',
      duration: '~14s',
      title: 'Local Qwen3-VL 4B plans the commercial',
      detail: 'Runs locally via Ollama (>3x faster than stock 8B models) to compose 3–12 shots, archetypes, and lighting mood.',
      readout: 'model: glint3d/glint-director · shots: 6 · mood: silhouette-to-reveal · api_calls: 0',
    },
    {
      id: 'rig',
      step: '03',
      label: 'Rig Build',
      duration: '~12s',
      title: 'Animated Glint Pass & Bezier cameras',
      detail: 'Places overhead strip softboxes, silhouette dimmers, Bezier camera trajectories, timeline markers, and AgX compositing.',
      readout: 'softboxes: 3 animated sweeps · cameras: 6 Bezier rigs · color: AgX',
    },
    {
      id: 'studio',
      step: '04',
      label: 'Editable Studio',
      duration: '~5s',
      title: 'Live Light Mixer & multi-aspect export',
      detail: 'Fine-tune lights in real time, reframe 16:9 / 9:16 / 1:1, swap camera archetypes, or export MP4 in one click.',
      readout: 'status: Ready · formats: 16:9, 9:16, 1:1 · renderers: Cycles & EEVEE Next',
    },
  ],
  features: [
    {
      title: '1-Click Local AI Directing',
      summary: 'Analyzes your product preview and scene geometry to build 3–12 shot commercial sequences for automotive, watches, electronics, glass, and footwear.',
    },
    {
      title: 'Match Video / YouTube Reference (Beta)',
      summary: 'Paste a reference commercial link to transfer its lighting mood, color temperature, and contrast straight into your Blender rig.',
    },
    {
      title: 'Animated Light Sweeps & Silhouette Reveals',
      summary: 'Overhead strip softboxes ("Glint Pass") glide across glossy metal, glass, and paint with full Cycles and EEVEE Next parity.',
    },
    {
      title: '7 Instant Offline Studio Presets',
      summary: 'Flagship studio vibes that build in under 1 second on any machine—even with zero AI running.',
    },
    {
      title: 'Live Studio Controls',
      summary: 'Real-time Light Mixer, multi-aspect reframing (16:9, 9:16, 1:1), per-shot camera archetype switcher, sub-part macro picker, and 1-click MP4 export presets.',
    },
    {
      title: '100% Non-Destructive & Yours',
      summary: 'Unlike flat AI video generators, Glint builds a real Blender rig. Every light, camera, and keyframe remains fully editable.',
    },
  ],
  setup: [
    {
      step: '01',
      title: 'Install the Blender extension',
      detail: 'Install glint-1.0.0.zip in Blender 4.5 – 5.3 via Preferences -> Extensions -> Install from Disk.',
    },
    {
      step: '02',
      title: 'Install Ollama (free local runtime)',
      detail: 'Download Ollama once so Glint AI can run offline on your own GPU with zero API keys.',
    },
    {
      step: '03',
      title: 'Download Glint AI in the N-Panel',
      detail: 'Open the Glint N-Panel inside Blender and click Download Glint AI (~3.2 GB).',
    },
  ],
  requirements: [
    ['Blender', '4.5 LTS, 5.2 LTS, or 5.3 (Windows / macOS / Linux)'],
    ['GPU / VRAM', 'NVIDIA, Apple Silicon, or AMD GPU with 6–8 GB+ VRAM for Glint AI (Offline Presets run on any machine)'],
    ['Disk space', '~3.5 GB free for the local Glint AI model'],
    ['License', 'Add-on code GPL v3.0 · All renders 100% royalty-free for commercial, freelance, and studio work'],
  ],
} as const;
