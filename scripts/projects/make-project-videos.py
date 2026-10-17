"""Prepare the two project clips for the early-work pages.

Usage: python scripts/projects/make-project-videos.py <projects root>
Each clip is remuxed without its audio track (no re-encode, faststart), and a poster frame is written as AVIF (960/1440 px
and native) plus a JPEG, using the same naming as make-project-images.py so framePic() finds it. The manifest entries are merged
into public/media/projects/manifest.json. Sources stay outside the repository and are only read.
"""
import json
import os
import sys

import av
import pillow_heif
from PIL import Image

pillow_heif.register_heif_opener()
root = sys.argv[1]
here = os.path.dirname(os.path.abspath(__file__))
out = os.path.join(here, '..', '..', 'public', 'media', 'projects')
CLIPS = [
    {'slug': 'iron-run', 'src': '3D Metal Ball 2020/3D Metal Ball Animation.mp4', 'poster_t': 4.0},
    {'slug': 'skyline-intruder', 'src': '3D Spaceship/3D Spaceship visual effects.mp4', 'poster_t': 1.0},
]
mpath = os.path.join(out, 'manifest.json')
manifest = json.load(open(mpath))

for c in CLIPS:
    src = os.path.join(root, c['src'])
    d = os.path.join(out, c['slug'])
    os.makedirs(d, exist_ok=True)
    ic = av.open(src)
    ist = ic.streams.video[0]
    oc = av.open(os.path.join(d, 'clip.mp4'), 'w', options={'movflags': '+faststart'})
    ost = oc.add_stream_from_template(ist)
    for pkt in ic.demux(ist):
        if pkt.dts is None:
            continue
        pkt.stream = ost
        oc.mux(pkt)
    oc.close()
    ic.close()
    # poster frame
    ic = av.open(src)
    ist = ic.streams.video[0]
    ic.seek(int(c['poster_t'] * 1e6))
    im = None
    for fr in ic.decode(ist):
        if fr.time >= c['poster_t'] - 0.05:
            im = fr.to_image().convert('RGB')
            break
    w0, h0 = im.size
    entry = {'width': w0, 'height': h0, 'avif': [], 'jpg': None,
             'video': {'bytes': os.path.getsize(os.path.join(d, 'clip.mp4')), 'duration': round(float(ic.duration) / 1e6, 2), 'width': w0, 'height': h0}}
    for w in sorted({960, w0}):
        r = im if w == w0 else im.resize((w, round(h0 * w / w0)), Image.LANCZOS)
        p = os.path.join(d, f'poster-{w}.avif')
        r.save(p, quality=55, speed=6)
        entry['avif'].append({'width': w, 'height': r.size[1], 'bytes': os.path.getsize(p)})
    jp = os.path.join(d, f'poster-{w0}.jpg')
    im.save(jp, quality=82, optimize=True, progressive=True)
    entry['jpg'] = {'width': w0, 'height': h0, 'bytes': os.path.getsize(jp)}
    manifest[f"{c['slug']}/poster"] = entry
    print(c['slug'], entry['video'], [a['bytes'] // 1024 for a in entry['avif']])

json.dump(manifest, open(mpath, 'w'), indent=1)
