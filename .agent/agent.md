# Agent Orchestrator — Project Polaris

This file is the **single entry point** for any agent working on Project Polaris. It describes the platform, the available sub-agents and skills, the handoff protocol between them, and the definition of a done feature. Read this file first, then follow the links it points to.

---

## Project Context

**Project Polaris** is a frontend-only portfolio hosting platform built for GUC (German University in Cairo). It serves four user roles — **Student**, **Course Instructor**, **Employer**, and **Administrator** — and provides project discovery, portfolio management, internship search, and academic collaboration features. There is no backend; all data is served via hardcoded dummy data accessed through custom React hooks.

**Stack:** React 19, TypeScript (strict), Vite, Tailwind CSS v4, React Router v7, React Context (no Redux, no Zustand).

**Key documentation:**
- [`requirements.md`](./requirements.md) — Full feature requirements (91 items).
- [`pages.md`](./pages.md) — UI blueprint: which pages exist and which components they own.
- [`Design/stellar_academic/DESIGN.md`](./Design/stellar_academic/DESIGN.md) — Design system tokens (colours, typography, spacing, radius, shadows).
- [`Design/`](./Design/) — Per-page HTML mock-ups used as layout references.
- [`project_data/architecture.md`](./project_data/architecture.md) — Routing hierarchy and directory conventions.
- [`project_data/components.md`](./project_data/components.md) — Catalogue of implemented global components.
- [`project_data/decisions.md`](./project_data/decisions.md) — Architectural decision log.
- [`project_data/hooks.md`](./project_data/hooks.md) — Catalogue of implemented custom hooks.

---

## Sub-Agent Registry

Each file below owns one concern. An agent must read the relevant sub-agent files **before** it touches code.

| File | Owns |
|---|---|
| [`planning_agent.md`](./planning_agent.md) | Feature decomposition into an executable `PLAN.md` before any code is written. |
| [`review_agent.md`](./review_agent.md) | Code audit against TypeScript, design system, accessibility, and architecture rules. |
| [`styling.md`](./styling.md) | Design token map, component styling rules, responsive breakpoints, and animation conventions. |
| [`testing.md`](./testing.md) | Test scope definition, toolchain, pass criteria, and test-run summary format. |
| [`workflow.md`](./workflow.md) | The authoritative step-by-step sequence every feature implementation must follow. |

---

## Available Skills

Skills are atomic, reusable procedures that any agent may invoke. They live in `agent/skills/`.

| File | Purpose |
|---|---|
| [`skills/component-audit.md`](./skills/component-audit.md) | Audit an existing component against the design system and review checklist. |
| [`skills/design-token-extractor.md`](./skills/design-token-extractor.md) | Extract a human-readable token map from `src/index.css` (`@theme` block). |
| [`skills/page-scaffold.md`](./skills/page-scaffold.md) | Generate a new page scaffold following the project's file and naming conventions. |
| [`skills/context-design.md`](./skills/context-design.md) | Design a React Context — state shape, actions, provider, and custom hook skeleton. |
| [`skills/accessibility-check.md`](./skills/accessibility-check.md) | Audit a component or page for WCAG 2.1 AA compliance. |

---

## Inter-Agent Handoff Protocol

```
planning_agent  →  produces PLAN.md
                   Gate: zero open questions, all affected surfaces listed.

implementer     →  reads PLAN.md, follows workflow.md step-by-step
                   Gate: TypeScript compiles; self-review checklist passes.

review_agent    →  reads diff, runs review checklist, produces review report
                   Gate: zero critical failures; ≤ 3 minor issues fixed inline.

testing_agent   →  runs test suite, produces test-run summary
                   Gate: all tests green, no regressions.
```

No agent may skip a gate. If a gate fails, execution returns to the previous agent with the failure report as input.

---

## Definition of Done

A feature is **done** when ALL of the following are true:

- [ ] Every step in [`workflow.md`](./workflow.md) is checked off.
- [ ] `review_agent` has produced a review report with zero unresolved items.
- [ ] `testing_agent` reports zero regressions and all new tests pass.
- [ ] [`project_data/`](./project_data/) markdown files are updated to reflect any new components or hooks.

---

## Data Architecture (CRITICAL)

- **No Backend:** This system has no backend API. All data is hardcoded dummy data.
- **Hook Encapsulation:** Dummy data MUST be accessed only through custom React hooks (e.g., `usePortfolioData()`). Never import raw data arrays directly into a UI component.
- **Global State:** Use React Context only for session-level state (e.g., authenticated user). Do not use Context as a replacement for local state.

---

## System Rules & Safety Constraints

1. **Scope Lock:** Do not touch files unrelated to the current task.
2. **No Raw Values:** Never hard-code colours, spacing, or font values — always use design token classes or CSS variables defined in `src/index.css`.
3. **Alert Protocol:** If a change risks breaking another part of the application, or if a requirement conflicts with existing code, explicitly flag this before proceeding.
4. **No `any`:** TypeScript strict mode is enforced. Zero `any` types, zero implicit `any`.