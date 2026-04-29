# Skill: Component Audit

## Purpose
This skill provides a systematic procedure for auditing an existing React component against the Polaris design system and the review agent's full checklist. It produces a structured pass/fail report with file-path and line-level citations so that the implementer knows exactly what to fix. Invoke this skill whenever a component is flagged in a review, when onboarding an existing component into the design system, or as part of a periodic quality sweep.

## Trigger
Invoke this skill when:
- The review agent flags a component as needing correction.
- A component is being considered for promotion from page-local to global (`src/components/`).
- A pull request modifies a component that previously passed review.

## Inputs
- **Target file path** (e.g., `src/components/Button.tsx`) — the component to audit.
- [`styling.md`](../styling.md) — design token map and component styling rules.
- [`review_agent.md`](../review_agent.md) — the full review checklist (all IDs: TS-*, DS-*, INT-*, ARCH-*, CTX-*, CQ-*, NAME-*, A11Y-*, VIS-*).
- The relevant design file from [`Design/`](../Design/) for the page where the component is used.

## Steps

1. **Read the component file in full.** Note all imports, props interface, JSX structure, and Tailwind classes used.

2. **Run TypeScript checks (TS-01 to TS-04):**
   - Confirm `tsc --noEmit` passes (or simulate by inspecting types).
   - Grep for `any` (explicit and implicit).
   - Confirm all exported functions have explicit return types.
   - Confirm all props are defined via an interface or type alias.

3. **Run design system checks (DS-01 to DS-05):**
   - List every Tailwind class used.
   - Cross-reference each against `styling.md` — flag any class not listed in the token map (e.g., `text-gray-500`, `rounded-[10px]`).
   - Check font classes: only `font-jakarta` and `font-lexend` are allowed.

4. **Run interactivity checks (INT-01 to INT-03):**
   - Find every interactive element (`button`, `a`, `input`, elements with `onClick`).
   - Confirm each has `hover:`, `focus-visible:`, `active:`, and `disabled:` variants.

5. **Run architecture checks (ARCH-01 to ARCH-05):**
   - Confirm one export per file.
   - Assess reusability — could this component only be used on one page?
   - Confirm file lives in the correct folder per the naming conventions.
   - Confirm no dummy data imported directly (must be via a hook).

6. **Run code quality checks (CQ-01 to CQ-04):**
   - Search for commented-out code, TODO comments, `console.log`, and semicolons.

7. **Run accessibility checks (A11Y-01 to A11Y-05):**
   - Check all `<img>` for `alt`.
   - Check all icon-only buttons for `aria-label` or `sr-only` text.
   - Check no `tabIndex="-1"` on focusable elements unless intentional.
   - Check ARIA role usage.

8. **Run visual consistency checks (VIS-01 to VIS-02):**
   - Compare the component's rendered layout (from JSX structure) against the relevant design file.
   - Confirm responsive breakpoints are present.

9. **Compile the report** (see Output Artefact).

## Output Artefact

A report in this format:

```markdown
# Component Audit Report: <ComponentName>

**File:** `<path>`
**Date:** <ISO 8601>
**Verdict:** PASS | FAIL

## Failed Items
| ID | Line(s) | Found | Expected | Fix |
|---|---|---|---|---|
| DS-01 | 42 | `text-gray-500` | `text-on-surface-variant` | Replace class |

## Passed Items
TS-01, TS-02, TS-03, TS-04, DS-03, DS-04, INT-01 ... (compact list)

## Summary
Total: X | Passed: X | Failed: X
```

## Quality Gate
The audit is complete when:
- [ ] Every checklist ID from `review_agent.md` is marked PASS or FAIL.
- [ ] Every FAIL has a file path, line reference, and a concrete fix instruction.
- [ ] The report has been handed to the implementer or committer for action.
