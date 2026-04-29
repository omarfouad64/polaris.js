# Review Agent — Project Polaris

This file defines the review agent's trigger conditions, full review checklist, output artefact format, and escalation rule. The review agent is called after every round of implementation and after every round of fixes. Its job is to ensure zero-defect code leaves the implementation stage.

**Dependencies:** Read [`agent.md`](./agent.md) and [`styling.md`](./styling.md) before this file.

**Output artefact:** A structured review report (inline in the response or written to `REVIEW.md`).

---

## Trigger

The review agent is invoked:
1. After the implementer completes an implementation step and passes self-review.
2. After every round of fixes triggered by a prior review report.
3. On demand, for any component or page that has been modified.

---

## Review Checklist

The agent must evaluate **every item** and mark each as `PASS` or `FAIL`. A `FAIL` must include the file name, line reference (or line range), and a concrete fix instruction.

### TypeScript
- [ ] **TS-01** TypeScript compiles with zero errors (`tsc --noEmit` passes).
- [ ] **TS-02** Zero `any` types — neither explicit nor implicit.
- [ ] **TS-03** All exported functions have explicit return types.
- [ ] **TS-04** All component props are defined via an `interface` or `type`. No inline object types on function parameters.

### Design System Compliance
- [ ] **DS-01** No hard-coded colour values — all colours use Tailwind token classes (e.g., `bg-primary`) or CSS variables from `src/index.css`.
- [ ] **DS-02** No hard-coded spacing values — all spacing uses Tailwind utilities or the `polaris-*` spacing tokens.
- [ ] **DS-03** Typography uses only `font-jakarta` or `font-lexend` — no `font-sans`, `font-mono`, or raw font-family strings.
- [ ] **DS-04** Border radius uses only `rounded-lg` (0.5rem) or `rounded-xl` (0.75rem) tokens — not arbitrary values like `rounded-[10px]`.
- [ ] **DS-05** Shadows match the design system (soft indigo-tinted ambient — `rgba(55,48,163,0.06-0.12)`) — no raw `shadow-md` unless it maps to the design spec.

### Interactivity & States
- [ ] **INT-01** Every interactive element (button, link, input, toggle) has `hover:`, `focus:`, and `active:` states.
- [ ] **INT-02** Every interactive element has a `disabled:` state with reduced opacity and `cursor-not-allowed`.
- [ ] **INT-03** Focus states use a visible ring (`focus-visible:ring-2 focus-visible:ring-secondary`) — never removed.

### Component Architecture
- [ ] **ARCH-01** Each file contains exactly **one** exported component.
- [ ] **ARCH-02** No component is single-use — if it can only be used on one page and is too small to justify a separate file, it should be inlined or the split reconsidered.
- [ ] **ARCH-03** Page-local components live in `src/pages/[flow]/[page]/components/`. Global components live in `src/components/`.
- [ ] **ARCH-04** Page-local hooks and logic live in `src/pages/[flow]/[page]/scripts/`. Global hooks live in `src/hooks/`.
- [ ] **ARCH-05** No dummy data arrays imported directly into UI components — always via a custom hook.

### React Context
- [ ] **CTX-01** Context is used only for session-level global state, not for passing props two levels deep.
- [ ] **CTX-02** No prop drilling where context should be used.
- [ ] **CTX-03** No unnecessary context consumption — a component that doesn't need global state must not import `useContext`.

### Code Quality
- [ ] **CQ-01** No dead code — no commented-out blocks, no unused imports, no unreachable branches.
- [ ] **CQ-02** No `TODO` or `FIXME` comments left in the diff.
- [ ] **CQ-03** No `console.log` or other debug statements.
- [ ] **CQ-04** No semicolons (project convention: semicolon-free TypeScript).

### File & Naming Conventions
- [ ] **NAME-01** Page folders: `src/pages/[flow_name]/[page_name]/` (lowercase with underscores).
- [ ] **NAME-02** Component files: `PascalCase.tsx`.
- [ ] **NAME-03** Hook files: `camelCase.ts` with `use` prefix.
- [ ] **NAME-04** Utility/script files: `camelCase.ts`.

### Accessibility
- [ ] **A11Y-01** All `<img>` elements have a non-empty `alt` attribute.
- [ ] **A11Y-02** All icon-only interactive elements have `aria-label` or `<span className="sr-only">`.
- [ ] **A11Y-03** All interactive elements are reachable via keyboard (`tabIndex` not set to `-1` on focusable elements, unless intentionally hidden).
- [ ] **A11Y-04** ARIA roles are used where semantic HTML is insufficient (e.g., `role="dialog"` on modals, `role="status"` on live regions).
- [ ] **A11Y-05** Colour contrast — text on coloured backgrounds must meet WCAG AA (4.5:1 for body text, 3:1 for large text / UI components).

### Design Consistency
- [ ] **VIS-01** Layout, spacing, and colour match the relevant design file in [`Design/`](./Design/).
- [ ] **VIS-02** Responsive breakpoints (`sm:`, `md:`, `lg:`) are applied — no fixed-width layouts that break at mobile sizes.

---

## Output Artefact — Review Report

```markdown
# Review Report: <Feature Name>

**Date:** <ISO 8601>
**Reviewer:** review_agent
**Verdict:** PASS | FAIL

## Failed Items
| ID | File | Line(s) | Description | Fix Instruction |
|---|---|---|---|---|
| TS-02 | src/pages/foo/Bar.tsx | 42 | `data: any` | Replace with `data: ProjectRecord` |

## Passed Items
List all IDs that passed (compact — one line per ID).

## Summary
Total checks: X | Passed: X | Failed: X | Critical: X
```

---

## Escalation Rule

If **more than 3 critical items** fail (TypeScript errors, `any` types, missing interactive states, or broken accessibility), the agent must:
1. Write the review report.
2. Return execution to the **implementer** (step 3 of `workflow.md`) with the report as input.
3. **Not** attempt to silently fix issues itself.

A critical item is any failure in the **TS**, **INT**, or **A11Y** categories.
