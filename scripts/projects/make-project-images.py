"""Make the web derivatives for the early-work project pages.

Usage: python scripts/projects/make-project-images.py <projects root> [out dir]
Writes AVIF at 960/1440/1920 px wide (never upscaled beyond the source) and a 1440 px JPEG fallback per frame,
plus public/media/projects/manifest.json with the sizes. Sources stay outside the repository and are only read.
"""
import json
import os
import sys

import pillow_heif
from PIL import Image

pillow_heif.register_heif_opener()
here = os.path.dirname(os.path.abspath(__file__))
spec = json.load(open(os.path.join(here, 'images.spec.json')))
root = sys.argv[1]
out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(here, '..', '..', 'public', 'media', 'projects')
WIDTHS = [960, 1440, 1920]
mpath = os.path.join(out, 'manifest.json')
manifest = json.load(open(mpath)) if os.path.exists(mpath) else {}

for f in spec['frames']:
    src = os.path.join(root, f['src'])
    im = Image.open(src).convert('RGB')
    w0, h0 = im.size
    d = os.path.join(out, f['slug'])
    os.makedirs(d, exist_ok=True)
    widths = sorted({min(w, w0) for w in WIDTHS})
    entry = {'width': w0, 'height': h0, 'avif': [], 'jpg': None}
    for w in widths:
        h = round(h0 * w / w0)
        r = im if w == w0 else im.resize((w, h), Image.LANCZOS)
        p = os.path.join(d, f"{f['frame']}-{w}.avif")
        r.save(p, quality=52, speed=6)
        entry['avif'].append({'width': w, 'height': h, 'bytes': os.path.getsize(p)})
    jw = min(1440, w0)
    jr = im if jw == w0 else im.resize((jw, round(h0 * jw / w0)), Image.LANCZOS)
    jp = os.path.join(d, f"{f['frame']}-{jw}.jpg")
    jr.save(jp, quality=80, optimize=True, progressive=True)
    entry['jpg'] = {'width': jw, 'height': jr.size[1], 'bytes': os.path.getsize(jp)}
    manifest[f"{f['slug']}/{f['frame']}"] = entry
    print(f['slug'], f['frame'], [a['bytes'] // 1024 for a in entry['avif']], entry['jpg']['bytes'] // 1024)

json.dump(manifest, open(mpath, 'w'), indent=1)
