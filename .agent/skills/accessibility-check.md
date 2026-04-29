# Skill: Accessibility Check

## Purpose
This skill audits a component or page for WCAG 2.1 Level AA compliance. It checks colour contrast ratios, keyboard navigability, ARIA roles and labels, focus management, and screen-reader text for icon-only buttons. Invoke this skill during implementation (as part of self-review) and as a gate in the review agent's A11Y checklist. Accessibility failures are classified as critical review items that can trigger a return to the implementer.

## Trigger
Invoke this skill when:
- Any interactive component is created or modified.
- A page is being submitted for review (`workflow.md` step 4 — SELF-REVIEW).
- The review agent flags one or more A11Y-* items as FAIL.
- A modal, dialog, dropdown, or other focus-trap element is implemented.

## Inputs
- **Target file(s)** — the component or page file to audit.
- [`styling.md`](../styling.md) — colour token values (needed for contrast ratio calculation).
- [`Design/stellar_academic/DESIGN.md`](../Design/stellar_academic/DESIGN.md) — colour palette raw hex values.
- WCAG 2.1 AA reference (contrast ratios: 4.5:1 for normal text, 3:1 for large text / UI components).

## Steps

1. **Colour Contrast (WCAG 1.4.3 & 1.4.11):**
   - Identify every text/background colour pair used in the component.
   - Calculate the contrast ratio using the WCAG formula (or a contrast checker).
   - **Pass threshold:** ≥ 4.5:1 for body text (< 18pt / < 14pt bold), ≥ 3:1 for large text and UI components (borders, icons).
   - Known passing pairs from the Polaris palette:
     - `text-on-primary` (#fff) on `bg-primary` (#1f108e): 12.6:1 ✅
     - `text-on-background` (#0b1c30) on `bg-background` (#f8f9ff): 14.3:1 ✅
     - `text-on-surface-variant` (#464553) on `bg-surface-container-low` (#eff4ff): ~7.8:1 ✅
     - `text-outline` (#777584) on `bg-surface-container-lowest` (#fff): ~4.6:1 ✅ (borderline — verify)
   - Flag any pair below threshold.

2. **Keyboard Navigation (WCAG 2.1.1 & 2.4.3):**
   - Tab through all interactive elements in the component's JSX structure.
   - Verify: buttons, links, inputs, selects, custom interactive elements — all reachable via Tab.
   - Verify: `tabIndex="-1"` is not applied to any natively focusable element unless it is intentionally hidden.
   - Verify: modals and dropdowns trap focus within themselves while open and restore focus to the trigger on close.
   - Verify: no keyboard trap outside of intentional focus traps (modals).

3. **Focus Visibility (WCAG 2.4.7):**
   - Confirm every interactive element shows a visible focus ring.
   - Polaris standard: `focus-visible:ring-2 focus-visible:ring-secondary` (or equivalent).
   - `outline: none` or `ring-0` without a visible replacement is a FAIL.

4. **Images and Icons (WCAG 1.1.1):**
   - Every `<img>` must have a non-empty `alt` attribute.
   - Decorative images: `alt=""` (empty, not absent).
   - Icon-only buttons (`<button>` with only a `<span class="material-symbols-outlined">` child): must have `aria-label="[description]"` on the button or a `<span className="sr-only">[description]</span>` inside.

5. **ARIA Roles and Labels (WCAG 4.1.2):**
   - Modals: `role="dialog"` + `aria-modal="true"` + `aria-labelledby="[title-id]"`.
   - Alerts / toasts: `role="alert"` or `aria-live="polite"`.
   - Navigation: `<nav>` element with `aria-label="[name]"` when multiple `<nav>` elements exist.
   - Tabs: `role="tablist"` on the container, `role="tab"` on each tab, `role="tabpanel"` on the panel, `aria-selected` on the active tab.
   - Toggle buttons: `aria-pressed="true/false"`.
   - Do not use ARIA roles on elements where semantic HTML suffices (e.g., don't add `role="button"` to a `<button>`).

6. **Form Labels (WCAG 1.3.1 & 3.3.2):**
   - Every `<input>`, `<select>`, `<textarea>` must have an associated `<label>` (via `for`/`id` pair) or `aria-label`.
   - Placeholder text does not substitute for a label.

7. **Error Identification (WCAG 3.3.1):**
   - Form validation errors must be communicated in text (not colour alone).
   - Error messages must be programmatically associated with the input (`aria-describedby="[error-id]"`).

8. **Compile the report** (see Output Artefact).

## Output Artefact

```markdown
# Accessibility Audit Report: <ComponentName or PageName>

**File:** `<path>`
**Date:** <ISO 8601>
**Standard:** WCAG 2.1 AA
**Verdict:** PASS | FAIL

## Failed Items
| WCAG | Element | Issue | Fix |
|---|---|---|---|
| 1.1.1 | `<img>` line 34 | Missing alt attribute | Add `alt="[description]"` |
| 4.1.2 | Button line 78 | Icon-only, no aria-label | Add `aria-label="Close dialog"` |

## Passed Items
Contrast pairs, keyboard nav, focus visibility, form labels, ... (compact list)

## Summary
Total checks: X | Passed: X | Failed: X | Critical: X
```

## Quality Gate
The audit is complete when:
- [ ] All 7 check categories above have been evaluated.
- [ ] Every FAIL has a WCAG criterion reference, element location, and concrete fix instruction.
- [ ] No critical failures remain (critical = colour contrast below threshold, missing alt on meaningful images, focus not visible, modals without `role="dialog"`).
