// Publication gates (M3): unfinished content must not reach the public artifact.
//  1. While the walkthrough is not approved, the production build (dist/) has no walkthrough route, sitemap entry, link or text.
//  2. While no film is configured, dist/ has no film markup, player, embed host or metadata.
//  3. A local preview build of the draft works, is noindex, is not in its own sitemap and is linked from nowhere.
//  4. If publication is switched on, approval fields are present, every section is ready and no media is missing.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

const problems = [];
const fail = (m) => problems.push(m);
const readJson = (f) => JSON.parse(fs.readFileSync(f, 'utf8'));
const pub = readJson('src/data/walkthrough-publication.json');
const filmCfg = readJson('src/data/aurelia-film.json');
const content = readJson('src/data/walkthrough.json');
const published = pub.published === true;
const files = (dir) => fs.readdirSync(dir, { recursive: true, withFileTypes: true }).filter((e) => e.isFile()).map((e) => path.join(e.parentPath ?? e.path, e.name));
const html = (dir) => files(dir).filter((f) => f.endsWith('.html'));

if (!fs.existsSync('dist')) { console.error('dist/ missing: run npm run build'); process.exit(1); }

// 4. publication switch consistency
if (published) {
  if (!pub.approvedBy || !pub.approvedOn) fail('walkthrough is published without approvedBy and approvedOn');
  for (const s of content.sections) {
    if (s.status !== 'ready') fail(`published walkthrough has an unfinished section: ${s.title}`);
    for (const m of s.media) if (m.status === 'needed') fail(`published walkthrough lacks media: ${s.title}: ${m.description}`);
  }
  if (!fs.existsSync('dist/work/aurelia/walkthrough/index.html')) fail('walkthrough is marked published but missing from dist/');
} else {
  // 1. production artifact excludes the draft
  if (fs.existsSync('dist/work/aurelia/walkthrough')) fail('dist/ contains the unpublished walkthrough route');
  for (const f of html('dist')) {
    const t = fs.readFileSync(f, 'utf8');
    if (/walkthrough|explore the process|the making of/i.test(t)) fail(`${path.relative('dist', f)} mentions the unpublished walkthrough`);
  }
  for (const f of files('dist').filter((x) => /sitemap.*\.xml$/.test(x))) if (/walkthrough/.test(fs.readFileSync(f, 'utf8'))) fail(`${path.basename(f)} lists the unpublished walkthrough`);
  for (const f of files('dist')) if (/walkthrough/i.test(path.relative('dist', f))) fail(`dist/${path.relative('dist', f)} belongs to the unpublished walkthrough`);
}

// 2. dormant film
if (!filmCfg.film) {
  for (const f of html('dist')) {
    const t = fs.readFileSync(f, 'utf8');
    if (/<video|<iframe|VideoObject|film-stage|film-play|youtube-nocookie|player.vimeo|watch the film/i.test(t)) fail(`${path.relative('dist', f)} contains film markup although no film is approved`);
  }
  if (fs.existsSync('dist/media/aurelia/film')) fail('dist/ contains film files although no film is approved');
} else {
  for (const k of ['title', 'accessibilityNote', 'posterId', 'externalUrl', 'approvedBy', 'approvedOn']) if (!filmCfg.film[k]) fail(`film is configured without ${k}`);
}

// 3. preview build of the draft
if (!published) {
  const r = spawnSync(process.execPath, ['scripts/build-preview.mjs'], { stdio: 'ignore' });
  if (r.status !== 0) fail('the preview build of the walkthrough failed');
  else {
    const page = 'dist-preview/work/aurelia/walkthrough/index.html';
    if (!fs.existsSync(page)) fail('the preview build has no walkthrough page');
    else {
      const t = fs.readFileSync(page, 'utf8');
      if (!/<meta name="robots" content="noindex/.test(t)) fail('the preview walkthrough is not noindex');
      if (!/Draft, internal/.test(t)) fail('the preview walkthrough does not mark unfinished sections as internal drafts');
    }
    for (const f of files('dist-preview').filter((x) => /sitemap.*\.xml$/.test(x))) if (/walkthrough/.test(fs.readFileSync(f, 'utf8'))) fail('the preview sitemap lists the walkthrough');
    for (const f of html('dist-preview')) if (!f.includes('walkthrough') && /walkthrough/i.test(fs.readFileSync(f, 'utf8'))) fail(`${path.relative('dist-preview', f)} links to the unpublished walkthrough`);
  }
}
if (problems.length) { console.error('FAIL\n' + problems.map((p) => ' - ' + p).join('\n')); process.exit(1); }
console.log(`check-publication: OK (walkthrough ${published ? 'published' : 'excluded from dist, draft preview verified'}; film ${filmCfg.film ? 'configured' : 'dormant and absent from dist'})`);
