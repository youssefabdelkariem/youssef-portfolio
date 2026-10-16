// Tests scripts/resolve-deploy-ref.mjs against a throwaway git repository: valid and short SHAs resolve to the full SHA,
// and invalid, unknown, ambiguous-looking, injected and off-main requests are rejected.
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const script = path.resolve('scripts/resolve-deploy-ref.mjs');
const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'ys-resolve-'));
const env = { ...process.env, GIT_AUTHOR_NAME: 't', GIT_AUTHOR_EMAIL: 't@example.invalid', GIT_COMMITTER_NAME: 't', GIT_COMMITTER_EMAIL: 't@example.invalid' };
const git = (...a) => execFileSync('git', a, { cwd: dir, env, encoding: 'utf8' }).trim();
git('init', '-q', '-b', 'main');
git('commit', '-q', '--allow-empty', '-m', 'one'); const one = git('rev-parse', 'HEAD');
git('commit', '-q', '--allow-empty', '-m', 'two'); const two = git('rev-parse', 'HEAD');
git('checkout', '-q', '-b', 'side', one); git('commit', '-q', '--allow-empty', '-m', 'side'); const side = git('rev-parse', 'HEAD');
git('checkout', '-q', 'main');
git('tag', 'v1', one);

const run = (ref) => {
  const out = path.join(dir, 'out.txt'); fs.rmSync(out, { force: true });
  const r = spawnSync(process.execPath, [script], { cwd: dir, env: { ...env, REF: ref, EVENT_SHA: two, GITHUB_OUTPUT: out }, encoding: 'utf8' });
  return { code: r.status, sha: fs.existsSync(out) ? fs.readFileSync(out, 'utf8').trim() : '' };
};
const problems = [];
const expectOk = (label, ref, sha) => { const r = run(ref); if (r.code !== 0 || r.sha !== `sha=${sha}`) problems.push(`${label}: expected sha=${sha}, got exit ${r.code} "${r.sha}"`); };
const expectFail = (label, ref) => { const r = run(ref); if (r.code === 0) problems.push(`${label}: should have been rejected`); if (r.sha) problems.push(`${label}: wrote an output although rejected`); };

expectOk('no ref uses the workflow commit', '', two);
expectOk('full SHA of an earlier main commit', one, one);
expectOk('short SHA', one.slice(0, 7), one);
expectOk('upper-case hex', one.slice(0, 10).toUpperCase(), one);
expectOk('the workflow commit itself', two, two);
expectFail('unknown commit', 'deadbeef');
expectFail('branch name', 'main');
expectFail('tag name', 'v1');
expectFail('relative reference', 'HEAD~1');
expectFail('range', `${one.slice(0, 7)}..${two.slice(0, 7)}`);
expectFail('option-looking text', '--help');
expectFail('injected command', `${one.slice(0, 7)}; echo pwned`);
expectFail('too short', one.slice(0, 5));
expectFail('commit on another branch (not in main history)', side);
fs.rmSync(dir, { recursive: true, force: true });
if (problems.length) { console.error('FAIL\n' + problems.map((p) => ' - ' + p).join('\n')); process.exit(1); }
console.log('check-resolve-ref: OK (14 cases)');
