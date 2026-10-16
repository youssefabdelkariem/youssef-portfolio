# ADR 0006: Build, deployment pipeline and previews

Status: **Proposed**. Recorded 2026-10-15. Owner: repository owner with technical reviewer. Related: OPS-01, OPS-02, M0-02, QA-02, QA-09, QA-18, Q13, Q14; findings C-1, C-3, C-4, I-2, I-11.

## Context

Hosting is retained, but the existing plain HTML site has no custom build pipeline. The earlier observed source is `main` / root. A future framework needs deliberate static output and publishing controls; merging source documentation today may trigger publication. No preview, exclusion mechanism, ruleset or workflow is established by this proposal.

## Pipeline alternatives

| Option | Value | Tradeoff / adoption requirement |
| --- | --- | --- |
| Keep current branch/root publishing | Few changes for plain HTML | Source/docs can be published; intentional exposure or tested Jekyll exclusions require owner decision |
| Output-only publishing branch | Keeps docs/source out of website artifact | Generated-commit drift and publishing permissions; separate reviewed source/branch transition |
| Custom Actions builds and uploads an allowlisted static output artifact | Separates source/docs from published files and can validate one immutable artifact | Workflow permissions/dependency pinning, environment protection and settings transition need review |

Evaluate in M1a with the chosen stack candidate; no pipeline is selected in M0. Never publish the repository root by default from a build job. Proposed output allowlist: generated route HTML, styles/scripts, approved media/icons, sitemap/robots/404 and required hosting files; deny source docs, instruction files, raw project evidence, secrets and build internals. Inspect the complete artifact and negative-test unwanted paths.

## Processing versus exclusion

`.nojekyll` bypasses Jekyll; it does not suppress Markdown files, confer privacy or block their direct URLs. Jekyll `exclude` omits files only under that build; it has no effect when Jekyll is bypassed. An output allowlist or output-only publishing branch excludes source structurally. Leaving documentation on an unmerged branch keeps it off the current publishing branch. All public repository files remain readable on GitHub. No `.nojekyll` or exclusion configuration is added during remediation.

## Preview alternatives

- Local static HTTP server for the exact built output: adequate for M1a fixture/direct-route checks, with no production binding. A Vite development server is not proof of built output; `vite preview` applies only if Vite is actually adopted.
- Downloadable Actions artifact: reviewable files that must be served locally; not a hosted live preview or production-header test.
- Separately authorized preview host (for example a static preview service) or second repository/site: verify hostname/isolation first, including inherited user-site custom domains; review costs/privacy/access before provisioning. Never modify the production domain to create it.

This repository's default project URL and `youssef.studio` cannot be treated as two independent versions. A local `/youssef-portfolio/` mount can test path compatibility only. A second repository does not by itself guarantee an independent domain. Preview noindex/canonicals keep preview URLs out of search; access controls, if needed, are a separate decision.

## Consequences and production transition gate

Follow the [production and PR gate](../AGENT_WORKFLOW.md#production-and-pr-gate): verify effective rules, require reviewed PR/candidate and explicit release authorization, preserve domain configuration and record a known-good rollback artifact/hash. PR validation must not publish production; untrusted PR code must not receive production secrets or deployment privileges. Use minimum required permissions, reviewed pinned actions/dependencies and an approved deployment environment policy in any future workflow.

M1a must demonstrate local artifact output, nested route/404/metadata behavior, exclusion inspection, header/range/compression probe plan and rollback rehearsal without deploying. Record the proposed future settings/source transition separately. Preserve the existing custom domain; do not assume copying a CNAME configures an Actions-based domain. Only owner approval of evidence can accept this ADR, and production implementation/deployment still needs explicit authorization. Revisit if hosting, build output or preview needs change.

Sources checked 2026-10-15: [GitHub publishing sources and Actions flow](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site), [Jekyll processing/exclusions](https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll/about-github-pages-and-jekyll), [disabling Jekyll](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site), [custom-domain behavior](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/about-custom-domains-and-github-pages).

## M2 readiness evidence (2026-10-16)

Status unchanged: **Proposed**. The Actions-artifact option was prepared on `chore/m2-pages-actions` and tested locally only (artifact allowlist with negative tests, Pages-like route and 404 checks, `CI=1` verification, workflow syntax). Findings, the cutover sequence, rollback paths and the list of untested items are in [DEPLOYMENT_RUNBOOK](../DEPLOYMENT_RUNBOOK.md). Acceptance still needs a rehearsal on a non-production repository, verified Pages and protection settings, and the owner's approval; production deployment needs separate explicit authorisation.
