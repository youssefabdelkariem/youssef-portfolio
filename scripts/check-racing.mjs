// Content and rendering checks for /engineering/ and /engineering/ibm-ai-racing/ (FR-03, FR-04, Q03, Q04).
// Guards the evidence rules: verified figures present, no placement/award language, no planned or reserved project entries,
// chart drawn from the recorded data, outbound links limited to the two verified destinations.
import fs from 'node:fs';
import path from 'node:path';
import { serve } from './lib/serve.mjs';
import { launchBrowser } from './lib/browser.mjs';

const problems = [];
const fail = (m) => problems.push(m);
const profile = JSON.parse(fs.readFileSync('src/data/racing-speed-profile.json', 'utf8'));
const { server, port } = await serve(path.resolve('dist'));
const base = `http://localhost:${port}`;
const browser = await launchBrowser();
try {
  const page = await browser.newPage();
  const text = async (r, w = 1440) => { await page.setViewport({ width: w, height: 900 }); await page.goto(base + r, { waitUntil: 'networkidle0' }); return page.evaluate(() => document.body.textContent); };

  // ---- racing page content rules
  const race = await text('/engineering/ibm-ai-racing/');
  for (const must of ['65.968', '66.262', '66.020', '145 candidates', '9.4', '84.2', '3,241', 'not an official ranking', 'IBM Granite was not used', '279.22', '67.064', 'AI-assisted', 'not a trained neural network', 'Native Windows only', 'not part of the final controller', 'makes no claim of contest placement']) if (!race.includes(must)) fail(`racing page missing "${must}"`);
  for (const bad of [/pending owner approval/i, /role wording/i, /provisional/i, /independent developer/i, /evidence checked/i, /predictive[^.]{0,80}\b(is active|enabled|used in the final)\b/i, /\bwinner\b/i, /\bwon\b/i, /first place/i, /\bchampion/i, /\bpodium\b/i, /officially (ranked|endorsed)/i, /\b65\.772\b/, /\b4:39\b(?!\.22)/]) if (bad.test(race)) fail(`racing page contains forbidden wording ${bad}`);
  const chart = await page.evaluate(() => ({ d: document.querySelector('.chart .trace')?.getAttribute('d') ?? '', rows: document.querySelectorAll('.rung').length, runs: document.querySelectorAll('#runs-cap')[0]?.closest('table')?.querySelectorAll('tbody tr').length ?? 0, final: document.querySelectorAll('.rung.final').length }));
  const points = (chart.d.match(/[ML]/g) ?? []).length;
  if (points !== profile.distance_m.length) fail(`chart has ${points} points, data has ${profile.distance_m.length}`);
  if (chart.rows !== 15) fail(`ladder rows ${chart.rows}, expected 15`);
  if (chart.runs !== 5) fail(`P1 run table rows ${chart.runs}, expected 5`);
  if (chart.final !== 1) fail(`expected exactly one final rung, found ${chart.final}`);
  const links = await page.evaluate(() => [...document.querySelectorAll('a[href^="http"]')].map((a) => [a.href, a.rel]));
  const allowed = ['https://github.com/youssefabdelkariem/IBM-AI-Racing-League/tree/release/p1-65968'];
  if (links.length !== 1 || !allowed.every((u) => links.some(([h, rel]) => h === u && /noopener/.test(rel)))) fail(`outbound links unexpected: ${JSON.stringify(links)}`);

  // ---- nothing of the previous controller anywhere on the site: its lap time, commit or recording
  const stale = [];
  for (const f of fs.readdirSync('dist', { recursive: true }).map(String).filter((x) => /\.(html|xml|txt|json|js|css|webmanifest)$/.test(x))) {
    const t = fs.readFileSync(path.join('dist', f), 'utf8');
    if (/66\.284|8658c1b|lp-c8A3NIJI|video-cover/.test(t)) stale.push(f);
  }
  if (stale.length) fail(`references to the previous controller (66.284 s, old commit or recording) in: ${stale.join(', ')}`);

  // ---- final progression chart: four points with the verified values; the dormant final video leaves no trace
  const prog = await page.evaluate(() => ({ pts: (document.querySelector('.prog .trace')?.getAttribute('d').match(/[ML]/g) ?? []).length, vals: [...document.querySelectorAll('.prog text.val')].map((t) => t.textContent), zoomNote: /starts at 65\.9 s/.test(document.querySelector('.prog')?.textContent ?? ''), table: [...document.querySelectorAll('#opt-cap')][0]?.closest('table')?.querySelectorAll('tbody tr').length }));
  if (prog.pts !== 3 || prog.vals.join() !== '66.262,66.020,65.968') fail(`progression chart unexpected: ${JSON.stringify(prog)}`);
  if (!prog.zoomNote) fail('progression chart must say its axis does not start at zero');
  if (prog.table !== 9) fail(`optimisation table rows ${prog.table}, expected 9`);
  const dormant = await page.evaluate(() => ({ lap: !!document.querySelector('.lapvideo, .lap-stage'), nocookie: /youtube-nocookie|VideoObject/.test(document.documentElement.innerHTML), ifr: !!document.querySelector('iframe') }));
  if (dormant.lap || dormant.nocookie || dormant.ifr) fail(`final-video markup present although no video is approved: ${JSON.stringify(dormant)}`);

  // ---- ladder: bars scale with time; the final lap is the shortest stock-car bar
  const widths = await page.evaluate(() => [...document.querySelectorAll('.rung')].map((r) => [parseFloat(r.querySelector('.sec').textContent.replace(/[^0-9.]/g, '')), parseFloat(r.querySelector('.bar i').style.getPropertyValue('--w'))]));
  for (const [s, w] of widths) if (Math.abs(w - (s / 279.22) * 100) > 0.05) fail(`bar width ${w} does not match ${s} s`);

  // ---- motion: reduced motion shows the finished chart and ladder; JS-disabled too
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.reload({ waitUntil: 'networkidle0' });
  const rm = await page.evaluate(() => ({ off: getComputedStyle(document.querySelector('.chart .trace')).strokeDashoffset, tr: getComputedStyle(document.querySelector('.rung .bar i')).transform, run: document.getAnimations().filter((a) => a.playState === 'running').length }));
  if (rm.run) fail('animations running with reduced motion');
  if (!['0px', '0', 'none'].includes(rm.off)) fail(`trace dashoffset ${rm.off} with reduced motion`);
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'no-preference' }]);
  await page.setJavaScriptEnabled(false);
  await page.reload({ waitUntil: 'load' });
  const nj = await page.evaluate(() => ({ off: getComputedStyle(document.querySelector('.chart .trace')).strokeDashoffset, op: getComputedStyle(document.querySelector('.ladder')).opacity }));
  if (!['0px', '0', 'none'].includes(nj.off) || nj.op !== '1') fail(`no-JS render hidden: ${JSON.stringify(nj)}`);
  await page.setJavaScriptEnabled(true);

  // ---- keyboard: scrollable regions (chart, tables) are focusable; the first Tab is the skip link
  await page.goto(base + '/engineering/ibm-ai-racing/', { waitUntil: 'networkidle0' });
  const regions = await page.evaluate(() => [...document.querySelectorAll('[role="region"]')].map((e) => e.tabIndex));
  if (!regions.length || regions.some((t) => t !== 0)) fail('scrollable regions must be focusable');
  for (const w of [320, 390]) {
    await page.setViewport({ width: w, height: 800 });
    const over = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (over > 0) fail(`racing page overflows ${over}px at ${w}`);
  }

  // ---- engineering index rules
  const eng = await text('/engineering/');
  for (const must of ['IBM AI Racing League / TORCS controller', '65.968', 'What the case study covers', 'Verified tools']) if (!eng.includes(must)) fail(`engineering page missing "${must}"`);
  const idx = await page.evaluate(() => ({ features: document.querySelectorAll('article.feature').length, contents: [...document.querySelectorAll('.contents a')].map((a) => a.getAttribute('href')), spark: !!document.querySelector('.spark .trace'), entries: document.querySelectorAll('.entry').length }));
  if (idx.features !== 1) fail(`engineering page should have exactly one featured project, found ${idx.features}`);
  if (idx.entries) fail('engineering page still has gallery entries');
  if (!idx.spark) fail('engineering page lost the telemetry trace');
  if (idx.contents.length !== 10) fail(`case-study contents links ${idx.contents.length}, expected 10 (no demonstration section until the final video is published)`);
  // every contents link must resolve to a heading id on the case-study page
  await page.goto(base + '/engineering/ibm-ai-racing/', { waitUntil: 'networkidle0' });
  for (const href of idx.contents) { const id = href.split('#')[1]; if (!(await page.$(`#${id}`))) fail(`contents link ${href} has no target`); }
  await page.close();
} finally { await browser.close(); server.close(); }

// ---- the final-video component with a synthetic fixture (never part of the production build)
{
  const { spawnSync } = await import('node:child_process');
  const out = 'dist-racing-fixture';
  const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const r = spawnSync(npx, ['astro', 'build', '--outDir', out], { stdio: 'ignore', shell: process.platform === 'win32', env: { ...process.env, YS_RACING_VIDEO_FIXTURE: '1' } });
  if (r.status !== 0) fail('video fixture build failed');
  else {
    const fx = await serve(path.resolve(out));
    const b2 = await launchBrowser();
    try {
      const pg = await b2.newPage();
      await pg.setViewport({ width: 1280, height: 900 });
      const external = [];
      await pg.setRequestInterception(true);
      const origin = `http://localhost:${fx.port}`;
      let blocking = true;
      pg.on('request', (q) => { const u = q.url(); if (blocking && !u.startsWith(origin) && !u.startsWith('data:')) { external.push(u); q.abort(); } else q.continue(); });
      await pg.goto(`${origin}/engineering/ibm-ai-racing/`, { waitUntil: 'networkidle0' });
      const o = await pg.evaluate(() => ({ h: document.querySelector('#lap-title')?.textContent, btn: document.querySelector('.lap-play')?.hidden, link: document.querySelector('.lap-links a')?.href, facts: document.querySelector('.lap-facts')?.textContent, ld: !!document.querySelector('.lapvideo script[type="application/ld+json"]'), ifr: !!document.querySelector('.lapvideo iframe') }));
      if (!o.h?.includes('65.968')) fail(`video fixture heading: ${o.h}`);
      if (o.btn !== false) fail('video fixture: play button should be visible with JavaScript');
      if (!/01:05:96/.test(o.facts ?? '') || !o.ld || o.ifr) fail(`video fixture content: ${JSON.stringify(o)}`);
      if (external.length) fail(`video fixture: third-party requests before play: ${external.join(', ')}`);
      blocking = false;
      await pg.focus('.lap-play'); await pg.keyboard.press('Enter');
      const src = await pg.waitForSelector('.lap-stage iframe', { timeout: 8000 }).then((h) => h.evaluate((f) => f.src)).catch(() => '');
      if (!src.startsWith('https://www.youtube-nocookie.com/embed/FIXTUREID01')) fail(`video fixture: embed after Enter was "${src}"`);
      await pg.setViewport({ width: 320, height: 800 });
      if ((await pg.evaluate(() => document.documentElement.scrollWidth - innerWidth)) > 0) fail('video fixture overflows at 320 px');
    } finally { await b2.close(); fx.server.close(); fs.rmSync(out, { recursive: true, force: true }); }
  }
}
if (problems.length) { console.error('FAIL\n' + problems.map((p) => ' - ' + p).join('\n')); process.exit(1); }
console.log('check-racing: OK');
process.exit(0); // the fixture build leaves a handle open on CI
