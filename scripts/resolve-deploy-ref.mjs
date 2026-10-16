// Resolves the commit a deployment may build. Runs in the first workflow job on the trusted checkout of the
// commit that carries the workflow file (the tip of the default branch), never on the requested commit.
//
//   REF        optional; a hexadecimal commit SHA (7 to 40 characters) requested for a rollback
//   EVENT_SHA  required; the full SHA of the commit carrying the workflow (github.sha)
//
// Rules: the request must be a plain hexadecimal commit SHA (no branch, tag, range, option or other text: tags and
// branches can move), it must exist in this repository, it must resolve unambiguously to a full SHA, and it must be an
// ancestor of (or equal to) EVENT_SHA, so only history already on the default branch can be deployed. Writes
// `sha=<full sha>` to $GITHUB_OUTPUT. Uses git without a shell, so the request cannot inject commands.
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';

const fail = (m) => { console.error(`resolve-deploy-ref: ${m}`); process.exit(1); };
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();

const eventSha = (process.env.EVENT_SHA ?? '').trim();
if (!/^[0-9a-f]{40}$/.test(eventSha)) fail('EVENT_SHA must be a full 40-character commit SHA');
const ref = (process.env.REF ?? '').trim();

let sha = eventSha;
if (ref) {
  if (!/^[0-9a-fA-F]{7,40}$/.test(ref)) fail('the requested ref must be a hexadecimal commit SHA of 7 to 40 characters');
  try { sha = git('rev-parse', '--verify', '--end-of-options', `${ref}^{commit}`); }
  catch { fail(`commit ${ref} does not exist in this repository (or the short SHA is ambiguous)`); }
  if (!/^[0-9a-f]{40}$/.test(sha)) fail('could not resolve the request to a full commit SHA');
  try { git('merge-base', '--is-ancestor', sha, eventSha); }
  catch { fail(`commit ${sha} is not in the history of ${eventSha}; only commits already on the default branch can be deployed`); }
}
console.log(`requested: ${ref || '(none, using the workflow commit)'}\nresolved:  ${sha}\nworkflow:  ${eventSha}`);
if (process.env.GITHUB_OUTPUT) fs.appendFileSync(process.env.GITHUB_OUTPUT, `sha=${sha}\n`);
