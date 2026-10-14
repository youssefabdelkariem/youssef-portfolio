# ADR 0002: Portfolio stack and rendering

Status: **Proposed**. Recorded: 2026-10-15. Decision owner: owner with technical reviewer; approval pending.
Related: FR-01–FR-06, QA-02, QA-05–QA-09, Q07, Q10.

## Context

The current site is plain HTML/CSS with no toolchain. A richer portfolio may benefit from reusable templates and selective interactivity, but must preserve crawlable content, mobile performance and static hosting. The desired aesthetic does not by itself justify a large client application.

## Proposal

Evaluate React + Vite + TypeScript as a maintainable interaction/component toolchain, contingent on a demonstrated static HTML generation strategy for every public route. Compare it with a static-first generator such as Astro with selective React islands, and plain HTML/CSS with small scripts. Prefer the smallest option that passes the representative content and routing tests. **No final stack winner is selected in M0.**

If React/Vite is selected, document exactly how route HTML is emitted; a client-only React root is insufficient for the proposed SEO/progressive-content requirement. Vite alone does not make this choice. Choose maintained compatible versions and package manager only during a separately authorized scaffold.

Tailwind is optional, evaluated against CSS custom properties/modules; map one shared token source if adopted. Use CSS/native APIs for basic motion. Add GSAP only for a concrete approved timeline and cleanup/reduced-motion plan. Defer Three.js and React Three Fiber until a user goal requires live 3D and a measured prototype fits budgets. R3F is an integration approach for Three.js, not a substitute for GPU/asset optimization.

## Alternatives and tradeoffs

| Option | Advantages | Costs / rejection condition |
| --- | --- | --- |
| Plain HTML/CSS + small JS | Lowest complexity and transfer; current hosting compatible | Repeated case-study maintenance may become error-prone; retain if site stays small |
| React/Vite/TypeScript + generated HTML | Component reuse, typed content, rich interaction | Must prove prerender/build approach, accessibility and bundle budget |
| Static-first generator + islands | Route HTML by default, selective client code | New conventions; evaluate team familiarity and maintenance |
| Bare client SPA | Straightforward interactive routing | Empty initial route HTML and Pages refresh problems; not recommended for proposed quality requirements |
| Full-stack runtime framework | Broad capabilities | Server features cannot run on Pages; static export may work but added complexity needs justification |

## Consequences and risks

A selected build tool requires a later reviewed publishing change. No M0 dependencies, lockfiles or configuration files are introduced. Optional libraries are not a mandatory shopping list. Typed content does not verify factual claims, and static rendering does not establish accessibility without testing.

## Acceptance gate

M1 comparison records one representative home/case-study experiment, build output, direct nested entry, delivered HTML/metadata, actual initial transfer, keyboard/reduced-motion results and maintainer workflow. Select an option with rationale, compatible versions, commands, dependency/license review and a separate deployment plan. Owner review then permits Accepted status. Failure to meet budgets favors simpler output, not automatic exceptions.

Revisit when content scale or a validated interaction changes the tradeoff. Technical references and broader evaluation: [SITE_ARCHITECTURE](../SITE_ARCHITECTURE.md#primary-technical-references).
