# Aurelia media tools

`make-derivatives.py` turns display-referred 16-bit sRGB master PNGs into responsive AVIF and JPEG files. `derivatives.spec.json` lists each output set (master name, crop, widths, quality). `sync-media.mjs` copies finished derivatives into `public/media/aurelia/`, where the owner-approved set is committed.

Rules for anyone running these:

- Originals (EXRs, Blender and Nuke files, project stills) are read-only. Never write next to them; the tool refuses to write inside the masters folder.
- Masters live outside the repository. Do not commit masters, EXRs or Blender files.
- Commit only owner-approved derivatives ([CONTENT_MANIFEST](../../docs/CONTENT_MANIFEST.md), section H). A change of selection needs a new approval.
- Method, colour validation and the compression study: [M1B_AURELIA_MEDIA](../../docs/reviews/M1B_AURELIA_MEDIA.md).

```text
python -m venv venv && venv/Scripts/pip install numpy opencv-python-headless pillow
python scripts/aurelia/make-derivatives.py --spec scripts/aurelia/derivatives.spec.json --masters <masters dir> --out <derivatives dir>
node scripts/aurelia/sync-media.mjs <derivatives dir>
```
