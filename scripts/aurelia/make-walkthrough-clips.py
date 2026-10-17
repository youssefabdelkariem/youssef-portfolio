"""Cut the web clips and posters for /work/aurelia/walkthrough/ from the walkthrough master.

Usage: python scripts/aurelia/make-walkthrough-clips.py <master.mp4> <out dir> [clip ids...]
Requires PyAV (libx264) and pillow_heif. The 4K master is never committed; outputs go to public/media/walkthrough/.
Clips are silent H.264 and never stretched: a crop is only scaled uniformly (the mobile crops set their own height).
"""
import json
import os
import sys
from fractions import Fraction

import av
import pillow_heif

pillow_heif.register_heif_opener()
here = os.path.dirname(os.path.abspath(__file__))
spec = json.load(open(os.path.join(here, 'walkthrough.spec.json')))
src, out = sys.argv[1], sys.argv[2]
only = set(sys.argv[3:])
os.makedirs(out, exist_ok=True)
FPS = 24
CRF = {'full': 24, 'ui': 27, 'cmp': 25}


def encode(clip, variant):
    kind = clip.get('size') or ('full' if clip['crop'] == 'full' else 'ui')
    crop = spec['crops'][clip['crop']]
    rect = crop[variant] or crop['desktop']
    w, h = spec['sizes'][kind][variant]
    if kind != 'cmp':
        h = round(w * rect[3] / rect[2] / 2) * 2
    trim = spec['trimFrames'] / FPS
    t0, t1 = clip['in'] + trim, clip['out'] - trim
    ic = av.open(src)
    ist = ic.streams.video[0]
    ic.seek(int(t0 / ist.time_base), stream=ist)
    suffix = '-m' if variant == 'mobile' else ''
    path = os.path.join(out, f"{clip['id']}{suffix}.mp4")
    oc = av.open(path, 'w', options={'movflags': '+faststart'})
    ost = oc.add_stream('libx264', rate=FPS)
    ost.width, ost.height, ost.pix_fmt = w, h, 'yuv420p'
    ost.options = {'crf': str(CRF[kind]), 'preset': 'slow', 'g': '48', 'bf': '2',
                   'x264-params': 'colorprim=bt709:transfer=bt709:colormatrix=bt709:range=tv'}
    g = av.filter.Graph()
    b = g.add_buffer(template=ist)
    c = g.add('crop', f'{rect[2]}:{rect[3]}:{rect[0]}:{rect[1]}')
    s = g.add('scale', f'{w}:{h}:flags=lanczos+accurate_rnd')
    f = g.add('format', 'yuv420p')
    k = g.add('buffersink')
    b.link_to(c); c.link_to(s); s.link_to(f); f.link_to(k)
    g.configure()
    n = 0
    still = None
    want = t0 + 3.0 if clip['id'] == 'hero' else (t0 + t1) / 2
    for fr in ic.decode(ist):
        t = float(fr.pts * ist.time_base)
        if t < t0 - 0.5 / FPS:
            continue
        if t >= t1 - 0.5 / FPS:
            break
        b.push(fr)
        while True:
            try:
                of = k.pull()
            except (av.error.BlockingIOError, av.error.EOFError):
                break
            if still is None and t >= want:
                still = of.to_image()
            of.pts = n
            of.time_base = Fraction(1, FPS)
            n += 1
            for p in ost.encode(of):
                oc.mux(p)
    for p in ost.encode():
        oc.mux(p)
    oc.close()
    ic.close()
    poster = os.path.join(out, f"{clip['id']}{suffix}.avif")
    still.save(poster, quality=48, speed=6)
    return {'file': os.path.basename(path), 'bytes': os.path.getsize(path), 'poster': os.path.getsize(poster), 'frames': n, 'size': [w, h]}


manifest = {}
for clip in spec['clips']:
    if only and clip['id'] not in only:
        continue
    entry = {'in': clip['in'], 'out': clip['out'], 'shots': clip['shots'], 'variants': []}
    crop = spec['crops'][clip['crop']]
    variants = ['desktop'] + (['mobile'] if (crop['mobile'] or clip['crop'] == 'full') else [])
    for v in variants:
        entry['variants'].append(encode(clip, v))
        print(clip['id'], v, entry['variants'][-1], flush=True)
    manifest[clip['id']] = entry
mp = os.path.join(out, 'manifest.json')
old = json.load(open(mp)) if os.path.exists(mp) else {}
old.update(manifest)
json.dump(old, open(mp, 'w'), indent=1)
