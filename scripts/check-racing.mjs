// Content and rendering checks for /engineering/ and /engineering/ibm-ai-racing/ (FR-03, FR-04, Q03, Q04).
// Guards the evidence rules: verified figures present, no placement/award language, planned work not shown as finished,
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
  for (const must of ['66.284', '279.22', '67.064', 'No placement or award claimed', 'Pending owner approval', 'AI-assisted', 'not a trained neural network', 'Native Windows only']) if (!race.includes(must)) fail(`racing page missing "${must}"`);
  for (const bad of [/\bwinner\b/i, /\bwon\b/i, /first place/i, /\bchampion/i, /\bpodium\b/i, /officially (ranked|endorsed)/i, /\b65\.772\b/, /\b4:39\b(?!\.22)/]) if (bad.test(race)) fail(`racing page contains forbidden wording ${bad}`);
  const chart = await page.evaluate(() => ({ d: document.querySelector('.chart .trace')?.getAttribute('d') ?? '', rows: document.querySelectorAll('.rung').length, runs: document.querySelectorAll('#runs-cap')[0]?.closest('table')?.querySelectorAll('tbody tr').length ?? 0, final: document.querySelectorAll('.rung.final').length }));
  const points = (chart.d.match(/[ML]/g) ?? []).length;
  if (points !== profile.distance_m.length) fail(`chart has ${points} points, data has ${profile.distance_m.length}`);
  if (chart.rows !== 13) fail(`ladder rows ${chart.rows}, expected 13`);
  if (chart.runs !== 8) fail(`run table rows ${chart.runs}, expected 8`);
  if (chart.final !== 1) fail(`expected exactly one final rung, found ${chart.final}`);
  const links = await page.evaluate(() => [...document.querySelectorAll('a[href^="http"]')].map((a) => [a.href, a.rel]));
  const allowed = ['https://github.com/youssefabdelkariem/IBM-AI-Racing-League', 'https://youtu.be/lp-c8A3NIJI'];
  if (links.length !== 2 || !allowed.every((u) => links.some(([h, rel]) => h === u && /noopener/.test(rel)))) fail(`outbound links unexpected: ${JSON.stringify(links)}`);

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
  for (const must of ['Planned, not built', 'Reserved, no project yet', 'Robotic arm', '66.284']) if (!eng.includes(must)) fail(`engineering page missing "${must}"`);
  if (/robotic arm[^.]*\b(completed|finished|built and tested)\b/i.test(eng)) fail('robotic arm described as finished');
  const entries = await page.evaluate(() => document.querySelectorAll('.entry').length);
  if (entries !== 3) fail(`engineering entries ${entries}, expected 3`);
  await page.close();
} finally { await browser.close(); server.close(); }
if (problems.length) { console.error('FAIL\n' + problems.map((p) => ' - ' + p).join('\n')); process.exit(1); }
console.log('check-racing: OK');
