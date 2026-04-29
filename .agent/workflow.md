# Feature Implementation Workflow — Project Polaris

This file is the **single authoritative sequence** that every feature agent must follow from start to finish. No step may be skipped. Each step has a gate; the gate must pass before the next step begins.

**Dependencies:** Read [`agent.md`](./agent.md) before this file. Refer to [`planning_agent.md`](./planning_agent.md), [`review_agent.md`](./review_agent.md), [`styling.md`](./styling.md), and [`testing.md`](./testing.md) at their respective steps.

**Output artefact:** A completed feature with all checklist items ticked and the `project_data/` documentation updated.

---

## Feature Implementation Workflow

```
Feature Implementation Workflow
================================

1. READ  — Read agent.md, planning_agent.md, styling.md, testing.md, and the
           relevant design files in agent/Design/ before writing anything.
           Also read project_data/architecture.md and project_data/components.md
           to understand what already exists.
           Gate: You can accurately describe the feature's scope, affected pages,
                 and existing components that will be reused.

2. PLAN  — Run the planning_agent protocol (see planning_agent.md).
           Produce PLAN.md with all 10 sections completed.
           Gate: Zero open questions remain. Every affected surface is listed.
                 The planning_agent acceptance checklist (Section 10) is fully ticked.

3. IMPLEMENT — Follow the plan step by step.
           - One logical change per commit (or per clearly labelled code block).
           - After each step, verify TypeScript still compiles (tsc --noEmit).
           - Follow styling.md for every UI element touched.
           - Every new component must be in the correct folder (see architecture.md).
           - Every new hook must encapsulate dummy data — no raw arrays in components.
           Gate: TypeScript compiles with zero errors. All planned components exist.

4. SELF-REVIEW — Run the review_agent checklist (see review_agent.md) on your
           own output. For each checklist item, mark PASS or FAIL.
           Fix every FAIL before calling the review agent.
           Gate: All review checklist items marked PASS by self-assessment.

5. REVIEW — Submit to review_agent. The review agent runs its full checklist
           and produces a review report.
           - If ≤ 3 minor issues: fix inline, update the report, continue.
           - If > 3 issues or any critical issue (TS, INT, or A11Y category):
             return to step 3 with the review report as input.
           Gate: Review report shows zero unresolved items.

6. TEST  — Run the testing_agent protocol (see testing.md).
           Execute all happy-path, edge-case, and regression test cases.
           - If any test fails: diagnose, fix (return to step 3),
             re-run review (steps 4–5), then re-run tests.
           Gate: All test cases PASS. Zero regressions.

7. DOCUMENT — Update project_data/ markdown files:
           - Add any new global components to project_data/components.md.
           - Add any new global hooks to project_data/hooks.md.
           - Add any significant architectural decisions to project_data/decisions.md.
           Gate: project_data/ accurately reflects the current state of the codebase.

8. DONE  — All checklist items checked. Feature is complete.
           Signal to the orchestrator (agent.md) that the feature is done.
```

---

## Step Checklist (copy this into PLAN.md for tracking)

```markdown
## Workflow Checklist

- [ ] 1. READ — All required documentation read.
- [ ] 2. PLAN — PLAN.md complete; zero open questions.
- [ ] 3. IMPLEMENT — All planned code written; TypeScript compiles.
- [ ] 4. SELF-REVIEW — All review checklist items self-assessed as PASS.
- [ ] 5. REVIEW — review_agent report: zero unresolved items.
- [ ] 6. TEST — All test cases PASS; zero regressions.
- [ ] 7. DOCUMENT — project_data/ updated.
- [ ] 8. DONE
```

---

## Git Branch Naming Convention

```
feat/<feature-name>        # New feature (e.g., feat/project-collaboration)
fix/<bug-description>      # Bug fix (e.g., fix/login-redirect-loop)
refactor/<area>            # Refactoring without behaviour change
docs/<topic>               # Documentation-only changes
chore/<task>               # Dependency updates, config changes
```

Use lowercase kebab-case. Keep the name descriptive but concise (≤ 4 words after the prefix).

---

## Commit Message Format

```
<type>(<scope>): <short imperative description>

[optional body — what and why, not how]
[optional footer — breaking changes, linked issues]
```

**Types:** `feat`, `fix`, `refactor`, `docs`, `chore`, `test`, `style`

**Scope:** The feature area or page name (e.g., `auth`, `project-editor`, `portfolio-explorer`)

**Examples:**
```
feat(project-editor): add thesis draft upload with final draft selector
fix(auth): prevent redirect loop when token is expired
refactor(components): extract SearchBar into global component
docs(agent): add component-audit skill registration
```

Rules:
- Subject line ≤ 72 characters.
- Imperative mood ("add", "fix", "remove" — not "added", "fixing").
- No trailing period.

---

## Component Documentation Convention

Every new component must include a JSDoc comment immediately above the function declaration:

```tsx
/**
 * ProjectCard — displays a summary of a student project.
 *
 * @param title - The project title.
 * @param course - The course name the project belongs to.
 * @param languages - Array of programming language names.
 * @param rating - Optional instructor rating out of 5.
 * @param isPublic - Whether the project is visible on the student's portfolio.
 */
export default function ProjectCard({ title, course, languages, rating, isPublic }: ProjectCardProps) {
```

**Rules:**
- One JSDoc block per component — no inline comments unless explaining genuinely complex logic.
- Describe every prop on its own `@param` line.
- Do not describe the implementation — describe the purpose and the props.
- No Storybook stories are configured in this project. If Storybook is added in future, update this section.

---

## New Page Registration Checklist

When adding a new page, verify all of the following:

- [ ] Page folder created at `src/pages/[flow_name]/[page_name]/`.
- [ ] `components/` and `scripts/` sub-folders created inside the page folder.
- [ ] New `<Route>` added to the router configuration.
- [ ] Route is nested inside the correct layout (`AuthLayout`, `PortalLayout`, etc.).
- [ ] Role-based guard applied if the page is restricted to specific user roles.
- [ ] Page added to `pages.md` if it is a net-new page not previously listed.
