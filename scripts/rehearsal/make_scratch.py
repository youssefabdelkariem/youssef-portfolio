"""Create the local scratch repository for the Pages rehearsal. Nothing is pushed anywhere.

Usage (from the repository root, Python 3 with Pillow built with AVIF support):
    python scripts/rehearsal/make_scratch.py "C:/Dev/Website Portfolio/rehearsal/youssef-pages-rehearsal"

The scratch repository holds the site source, the check scripts, the rehearsal workflow and SYNTHETIC media: gradient
images with the same file names and sizes as the approved derivatives, labelled as synthetic. No Aurelia render, master,
EXR, project file, document, review report or real provenance manifest is copied.
"""
import json
import os
import shutil
import subprocess
import sys

from PIL import Image, ImageDraw

SRC = os.getcwd()
ARGS = [a for a in sys.argv[1:] if not a.startswith('--')]
EXISTING = '--existing' in sys.argv  # add the kit to an existing clone (keeps its readme and history) instead of creating a repository
DEST = ARGS[0] if ARGS else os.path.join(os.path.dirname(SRC), '..', 'rehearsal', 'youssef-pages-rehearsal')
DEST = os.path.abspath(DEST)

EXCLUDE_PREFIX = ('docs/', '.github/', 'scripts/aurelia/', 'public/media/', 'local-assets/', 'previews/')
EXCLUDE_EXACT = {'CNAME', 'public/CNAME', 'index.html', 'README.md', 'AGENTS.md', 'CLAUDE.md', 'package-lock.json',
                 'scripts/build-explore.mjs', 'scripts/preview-explore.mjs', 'scripts/check-explore.mjs', 'scripts/check-docs.mjs',
                 'scripts/shoot-explore.mjs', 'scripts/shoot-home.mjs', 'scripts/shoot-pages.mjs', 'scripts/lib/fixtures.mjs'}

if EXISTING:
    if not os.path.isdir(os.path.join(DEST, '.git')):
        sys.exit(f'{DEST} is not a git clone')
    if [n for n in os.listdir(DEST) if n not in ('.git', 'readme.md', 'README.md', 'LICENSE')]:
        sys.exit(f'{DEST} holds files other than a readme and a licence; refusing to mix them with the kit')
elif os.path.exists(DEST):
    sys.exit(f'{DEST} already exists; remove it first (scratch only).')
else:
    os.makedirs(DEST)

files = subprocess.check_output(['git', 'ls-files', '--cached', '--others', '--exclude-standard'], text=True).splitlines()
copied = 0
for f in files:
    if f in EXCLUDE_EXACT or f.startswith(EXCLUDE_PREFIX) or f.startswith('src/explore/'):
        continue
    dst = os.path.join(DEST, f)
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    shutil.copy2(f, dst)
    copied += 1
shutil.copy2('package-lock.json', os.path.join(DEST, 'package-lock.json'))

# package.json: same dependencies and checks, without the documentation and exploration scripts
pkg = json.load(open('package.json', encoding='utf8'))
pkg['name'] = 'youssef-pages-rehearsal'
pkg['scripts'] = {k: v for k, v in pkg['scripts'].items() if k in ('build', 'typecheck', 'test:dist', 'test:artifact', 'test:resolve', 'test:browser', 'test:aurelia', 'test:racing', 'test:a11y', 'test:repro', 'preview', 'dev')}
pkg['scripts']['verify'] = 'npm run typecheck && npm run build && npm run test:dist && npm run test:artifact && npm run test:resolve && npm run test:browser && npm run test:aurelia && npm run test:racing && npm run test:a11y'
json.dump(pkg, open(os.path.join(DEST, 'package.json'), 'w', encoding='utf8'), indent=2)

# the exploration routes are not part of the scratch site
cfg = open(os.path.join(DEST, 'astro.config.mjs'), encoding='utf8').read()
cfg = cfg.replace("process.env.YS_EXPLORE === '1'", "false")
open(os.path.join(DEST, 'astro.config.mjs'), 'w', encoding='utf8').write(cfg)

# ---- synthetic media
real = json.load(open('public/media/aurelia/manifest.json', encoding='utf8'))
media = os.path.join(DEST, 'public', 'media', 'aurelia')
os.makedirs(media)


def synth(path, w, h, label, fmt):
    im = Image.new('RGB', (w, h))
    px = im.load()
    for y in range(h):
        for x in range(w):
            v = int(18 + 40 * (x / w) + 30 * (y / h))
            px[x, y] = (v, v - 4, v - 8)
    d = ImageDraw.Draw(im)
    d.rectangle([w // 20, h // 20, w - w // 20, h - h // 20], outline=(201, 169, 110), width=max(2, w // 400))
    d.text((w // 12, h // 2), 'SYNTHETIC REHEARSAL IMAGE ' + label, fill=(235, 229, 218))
    if fmt == 'avif':
        im.save(path, 'AVIF', quality=40)
    else:
        im.save(path, 'JPEG', quality=60)


out = {'tool': 'synthetic rehearsal media', 'outputs': []}
for o in real['outputs']:
    n = {'id': o['id'], 'master': 'synthetic', 'master_sha256': '0' * 64, 'crop': o['crop'], 'variants': []}
    for v in o['variants']:
        p = os.path.join(media, v['file'])
        synth(p, v['width'], v['height'], v['file'], v['format'])
        n['variants'].append({'file': v['file'], 'format': v['format'], 'width': v['width'], 'height': v['height'], 'bytes': os.path.getsize(p), 'psnr_db': 0, 'quality': 0})
    out['outputs'].append(n)
json.dump(out, open(os.path.join(media, 'manifest.json'), 'w', encoding='utf8'), indent=1)
racing = os.path.join(DEST, 'public', 'media', 'racing')
os.makedirs(racing)
synth(os.path.join(racing, 'video-cover-640.jpg'), 640, 360, 'video-cover-640', 'jpg')
synth(os.path.join(racing, 'video-cover-960.jpg'), 960, 540, 'video-cover-960', 'jpg')

# ---- workflow, readme, git
wf = os.path.join(DEST, '.github', 'workflows')
os.makedirs(wf)
shutil.copy2('scripts/rehearsal/workflows/pages-rehearsal.yml', os.path.join(wf, 'pages.yml'))
if not EXISTING:
    open(os.path.join(DEST, 'README.md'), 'w', encoding='utf8').write(
        '# youssef-pages-rehearsal\n\nTemporary scratch repository for rehearsing the GitHub Pages deployment of youssef.studio. '
        'It publishes a synthetic, noindex copy of the site; it has no custom domain and contains no real renders. Delete it after the rehearsal.\n')
open(os.path.join(DEST, '.gitignore'), 'w').write('node_modules/\ndist/\n.astro/\nrehearsal-dist/\n.repro-*/\n')

env = dict(os.environ, GIT_AUTHOR_NAME='Rehearsal Kit', GIT_AUTHOR_EMAIL='rehearsal@example.invalid', GIT_COMMITTER_NAME='Rehearsal Kit', GIT_COMMITTER_EMAIL='rehearsal@example.invalid')
run = lambda *a: subprocess.check_call(a, cwd=DEST, env=env, stdout=subprocess.DEVNULL)
if not EXISTING:
    run('git', 'init', '-q', '-b', 'main')
run('git', 'add', '-A')
run('git', 'commit', '-q', '-m', 'rehearsal build 1')
if EXISTING:
    # Build 2 is made later with `--build2`, after build 1 has been deployed.
    print(f'kit added to {DEST}: {copied} source files, 1 commit (build 1); nothing pushed')
else:
    readme = next(n for n in ('README.md', 'readme.md') if os.path.exists(os.path.join(DEST, n)))
    open(os.path.join(DEST, readme), 'a', encoding='utf8').write('\nBuild 2 marker (used to tell two deployments apart in the rollback rehearsal).\n')
    run('git', 'add', '-A')
    run('git', 'commit', '-q', '-m', 'rehearsal build 2')
    print(f'scratch repository ready at {DEST}: {copied} source files, 2 commits, no remote configured')
