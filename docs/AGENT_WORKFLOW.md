# Codex and Claude Code workflow

Shared execution policy: [AGENTS](../AGENTS.md). Statuses: [ADR register](adr/README.md). Active scope: [development plan](DEVELOPMENT_PLAN.md#active-milestone). Related review findings: C-1, C-3, C-4, I-7 through I-10, M-2, M-3, M-9.

## Ownership and handoff

Use one editor plus independent review for small tasks; parallelism is optional. Before concurrent edits or M1a, the owner names reviewer/integrator. Record one task/PR ownership comment: objective/requirement IDs, exact base hash, editor, exclusive paths, branch/working directory, acceptance checks and reviewer. Update that comment when releasing/reassigning paths; it is an explicit coordination record, not an enforced filesystem lock. Shared specs/tokens/schemas/lockfiles have one writer. Do not post external comments without user authorization.

Handoff: branch/full hash, changed paths, requirement IDs, checks and limitations, decision impacts and open risks. Reviewer reads the complete diff and evidence. Integrator tests the combined result against the current base; a conflict-free merge is not validation. Agent attribution uses the truthful commit-body line specified in AGENTS, not a fabricated email/trailer.

## Worktree and integration procedure

Inspect status and `git worktree list`, preserve local/user changes, then fetch remote refs. For a new production-based feature branch, the following PowerShell example uses quoted paths and `origin/main`; no local `main` branch is assumed:

```powershell
git fetch origin
git rev-parse origin/main
git worktree add -b feat/case-study-spike "../website-portfolio-spike" origin/main
```

Do not run an example blindly: use a new branch/path, check existence/ownership, and record the base hash. When explicitly continuing unmerged documentation work, use the reviewed M0 hash or `origin/docs/m0-foundation` as the base instead of `origin/main`; record that dependency. The same branch cannot normally be checked out in two worktrees. If the existing branch is already checked out here, work here sequentially or create a separately named review branch from its exact hash. Never detach/reset another editor's working tree. [Git worktree reference](https://git-scm.com/docs/git-worktree).

After review, prepare a separately named integration branch from fetched `origin/main`, bring in only the reviewed commits using the agreed merge strategy, and rerun affected checks. If the base changes, repeat the comparison and integration checks. This procedure describes future work; no integration/merge is authorized during remediation.

## Production and PR gate

The earlier recorded Pages source is `main` / root; current state must be reverified. **A merge/push to the publishing source can trigger build/deployment even when only Markdown changes.** Source documents not excluded from output may be copied or rendered on the production domain. Exact URLs depend on the build/plugins, not a universal `.md` to `.html` rule. Files on this public GitHub repository are already publicly readable; website exclusion is publication hygiene, not confidentiality.

Before any M0 merge, the owner must record:

1. A fresh read-only Pages source/domain and effective `main` protection check, including who can bypass. Current protection state is **Unverified**. Written policy is not proof that pushes are blocked.
2. The documentation publication choice: knowingly publish the reviewed docs, or keep them out of published output via a separately authorized exclusion/build artifact or a publishing branch containing only website output. Leaving docs unmerged keeps them off the current publishing branch but does not make the public branch private.
3. A PR review policy: no direct agent pushes to `main`; required owner approval of the exact candidate, at least one independent review, resolved discussions, and applicable validation. Proposed technical enforcement is a branch rule/ruleset requiring PRs, stale-approval dismissal on new changes, checks once implemented, no force pushes/deletion, and narrowly restricted documented bypasses. Do not require nonexistent CI checks. Configure/verify these controls only with owner authorization; if unenforced, explicitly record the residual risk before any merge authorization.
4. Explicit authorization for the production effect of merging, candidate hash, content approval, applicable ADR gates, validated output and rollback hash. Owner approval of documentation wording alone is not release approval.

**`.nojekyll` only bypasses Jekyll processing. It does not exclude Markdown, make it private or prevent direct access.** Jekyll `exclude` can omit selected files only while that build runs; an allowlisted build artifact or output-only publishing branch omits files structurally. None changes public GitHub visibility. Do not add `.nojekyll`, `_config.yml`, a workflow or change publishing settings during M0. [ADR 0006](adr/0006-build-deployment-preview.md) evaluates the future pipeline without adopting it.

After an authorized release, verify actual production output, core routes/404, media/contact/HTTPS and unwanted-document absence or intentional exposure. Roll back using the recorded approved artifact/commit if an essential regression occurs. Do not alter DNS as a routine fix.

## Validation by change type

Documentation: relative links/anchors, requirement IDs, ADR-register agreement, finding traceability and full diff/protected-file checks. Current app commands do not exist. Later application work: selected build/type/lint checks, direct routes/404 and metadata, keyboard/touch/reduced-motion/failure cases, actual-content performance and media tests. Run these on the combined candidate output before production authorization; preserve test versions/results and coverage gaps.

## Claude instruction loading

Use a standalone `@AGENTS.md` line in CLAUDE.md, outside code fences/backticks; relative imports resolve from that file. The [current Claude Code memory documentation](https://code.claude.com/docs/en/memory#import-additional-files) confirms this syntax. A Markdown link is not an automatic import.

Current documentation also describes native AGENTS loading in supported versions when no qualifying project CLAUDE file takes precedence. The import remains useful here because CLAUDE.md exists, and on versions/sessions without native AGENTS support. Windows symlink workarounds are unnecessary. Verify loaded instructions with `/context` in the actual Claude session; documentation verification is not a claim that that runtime test was performed. Do not alter user settings as part of this correction.
