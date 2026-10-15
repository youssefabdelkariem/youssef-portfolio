#!/usr/bin/env python3
"""Create web derivatives (AVIF, WebP, JPEG) from display-referred 16-bit sRGB master PNGs.

Masters are never modified: they are opened read-only and every output is written to a separate
directory. Pipeline per output: read 16-bit sRGB master -> crop (aspect + centre) -> convert to linear
light -> resize with area averaging -> back to sRGB -> optional triangular dither -> 8-bit -> encode
with an sRGB ICC profile. Reports bytes and PSNR against the float result.

Requires: numpy, opencv-python-headless, Pillow with AVIF support.

Usage:
    python make-derivatives.py --spec derivatives.spec.json --masters <dir> --out <dir>
"""
import argparse
import hashlib
import json
import os
import sys

import cv2
import numpy as np
from PIL import Image, ImageCms


def srgb_to_linear(x):
    return np.where(x <= 0.04045, x / 12.92, ((x + 0.055) / 1.055) ** 2.4)


def linear_to_srgb(x):
    x = np.clip(x, 0.0, 1.0)
    return np.where(x <= 0.0031308, x * 12.92, 1.055 * np.power(x, 1 / 2.4) - 0.055)


def sha256(path):
    h = hashlib.sha256()
    with open(path, 'rb') as f:
        for chunk in iter(lambda: f.read(1 << 20), b''):
            h.update(chunk)
    return h.hexdigest()


def load_master(path):
    im = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    if im is None or im.dtype != np.uint16 or im.ndim != 3:
        raise SystemExit(f'{path}: expected a 16-bit RGB PNG')
    return im[..., ::-1].astype(np.float32) / 65535.0  # BGR -> RGB, sRGB-encoded 0..1


def crop_box(h, w, aspect, center):
    ar = aspect[0] / aspect[1]
    ch, cw = (h, int(round(h * ar))) if w / h > ar else (int(round(w / ar)), w)
    cw, ch = min(cw, w), min(ch, h)
    x0 = int(round(center[0] * w - cw / 2))
    y0 = int(round(center[1] * h - ch / 2))
    x0 = max(0, min(x0, w - cw))
    y0 = max(0, min(y0, h - ch))
    return x0, y0, cw, ch


def render(master, crop, width, dither, rng):
    h, w, _ = master.shape
    if crop:
        x0, y0, cw, ch = crop_box(h, w, crop['aspect'], crop.get('center', [0.5, 0.5]))
        master = master[y0:y0 + ch, x0:x0 + cw]
    h, w, _ = master.shape
    height = int(round(width * h / w))
    lin = srgb_to_linear(master)
    interp = cv2.INTER_AREA if width < w else cv2.INTER_LANCZOS4
    small = cv2.resize(lin, (width, height), interpolation=interp)
    ideal = linear_to_srgb(small).astype(np.float32)  # float result in sRGB, 0..1
    x = ideal * 255.0
    if dither:
        x = x + (rng.random(x.shape, dtype=np.float32) - rng.random(x.shape, dtype=np.float32))  # triangular, +-1 LSB
    return ideal, np.clip(np.rint(x), 0, 255).astype(np.uint8)


def psnr(ideal, q):
    mse = float(np.mean((ideal * 255.0 - q.astype(np.float32)) ** 2))
    return 99.0 if mse == 0 else 10 * np.log10(255.0 ** 2 / mse)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--spec', required=True)
    ap.add_argument('--masters', required=True)
    ap.add_argument('--out', required=True)
    ap.add_argument('--only', nargs='*')
    args = ap.parse_args()
    spec = json.load(open(args.spec, encoding='utf8'))
    out_dir = os.path.abspath(args.out)
    masters_dir = os.path.abspath(args.masters)
    if out_dir.startswith(masters_dir):
        raise SystemExit('refusing to write derivatives inside the masters directory')
    os.makedirs(out_dir, exist_ok=True)
    icc = ImageCms.ImageCmsProfile(ImageCms.createProfile('sRGB')).tobytes()
    rng = np.random.default_rng(20261015)
    manifest = {'tool': 'make-derivatives.py', 'outputs': []}
    for item in spec['outputs']:
        if args.only and item['id'] not in args.only:
            continue
        mpath = os.path.join(masters_dir, item['master'])
        master = load_master(mpath)
        entry = {'id': item['id'], 'master': item['master'], 'master_sha256': sha256(mpath), 'crop': item.get('crop'), 'variants': []}
        for width in item['widths']:
            ideal, q8 = render(master, item.get('crop'), width, item.get('dither', True), rng)
            height = q8.shape[0]
            img = Image.fromarray(q8)
            for fmt, opts in item['formats'].items():
                if 'only_widths' in opts and width not in opts['only_widths']:
                    continue
                name = f"{item['id']}-{width}.{fmt}"
                path = os.path.join(out_dir, name)
                if fmt == 'avif':
                    img.save(path, 'AVIF', quality=opts['quality'], subsampling=opts.get('subsampling', '4:4:4'), speed=opts.get('speed', 4), icc_profile=icc, advanced=opts.get('advanced'))
                elif fmt == 'webp':
                    img.save(path, 'WEBP', quality=opts['quality'], method=6, icc_profile=icc)
                elif fmt == 'jpg':
                    img.save(path, 'JPEG', quality=opts['quality'], subsampling=0, optimize=True, progressive=True, icc_profile=icc)
                elif fmt == 'png':
                    img.save(path, 'PNG', icc_profile=icc)  # lossless 8-bit reference, not for delivery
                else:
                    raise SystemExit('unknown format ' + fmt)
                dec = np.asarray(Image.open(path).convert('RGB'))
                entry['variants'].append({'file': name, 'format': fmt, 'width': width, 'height': height, 'bytes': os.path.getsize(path),
                                          'psnr_db': round(psnr(ideal, dec), 2), 'quality': opts.get('quality')})
                v = entry['variants'][-1]
                print(f"{name:28s} {v['width']}x{v['height']} {v['bytes'] / 1024:7.1f} KB  PSNR {v['psnr_db']:.2f} dB", flush=True)
        manifest['outputs'].append(entry)
    mpath = os.path.join(out_dir, 'manifest.json')
    if args.only and os.path.exists(mpath):  # merge with the previous run so partial runs keep earlier entries
        previous = json.load(open(mpath, encoding='utf8'))
        keep = [o for o in previous['outputs'] if o['id'] not in {e['id'] for e in manifest['outputs']}]
        manifest['outputs'] = keep + manifest['outputs']
    with open(mpath, 'w', encoding='utf8') as f:
        json.dump(manifest, f, indent=1)


if __name__ == '__main__':
    sys.exit(main())
