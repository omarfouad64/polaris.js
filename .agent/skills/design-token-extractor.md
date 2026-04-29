# Skill: Design Token Extractor

## Purpose
This skill extracts a human-readable token map from the project's Tailwind v4 configuration (the `@theme` block in `src/index.css`) so that any agent can quickly reference the full design token inventory without parsing raw CSS. It produces a structured markdown reference document that mirrors the format in `styling.md` and can be regenerated whenever `src/index.css` changes. Invoke this skill when onboarding a new agent, when verifying that `styling.md` is up to date, or when a developer suspects the CSS variables have drifted from the documented tokens.

## Trigger
Invoke this skill when:
- `src/index.css` has been modified and `styling.md` may be stale.
- A new agent or developer needs a quick reference of all available design tokens.
- A review fails on DS-01 or DS-02 and the correct token name is unclear.

## Inputs
- `src/index.css` — the source file containing the `@theme { }` block.
- [`styling.md`](../styling.md) — the existing documented token map (for comparison / drift detection).

## Steps

1. **Read `src/index.css`** and extract the entire `@theme { }` block.

2. **Parse colour tokens:**  
   For every `--color-*` variable, record:
   - CSS variable name (e.g., `--color-primary`)
   - Raw value (e.g., `#1f108e`)
   - Derived Tailwind utility classes (e.g., `bg-primary`, `text-primary`, `border-primary`)

3. **Parse font tokens:**  
   For every `--font-*` variable, record:
   - CSS variable name (e.g., `--font-lexend`)
   - Font family value
   - Tailwind class (e.g., `font-lexend`)

4. **Parse radius tokens:**  
   For every `--radius-*` variable, record:
   - CSS variable name and value
   - Corresponding Tailwind class (e.g., `rounded-xl`)

5. **Parse spacing tokens:**  
   For every `--spacing-polaris-*` variable, record:
   - CSS variable name and raw value
   - How to use it in Tailwind (e.g., `p-[--spacing-polaris-md]`)

6. **Check for drift:**  
   Compare the extracted tokens against the tables in `styling.md`. List any:
   - Token in `src/index.css` missing from `styling.md` → flag as **Added**.
   - Token in `styling.md` missing from `src/index.css` → flag as **Removed / Stale**.
   - Token present in both but with a different value → flag as **Changed**.

7. **Produce the output artefact.**

## Output Artefact

A markdown file `TOKEN_MAP.md` with four sections: Colours, Fonts, Radius, Spacing — formatted identically to the tables in `styling.md`. Plus a Drift Report section listing Added / Removed / Changed tokens.

```markdown
# Token Map — Project Polaris

_Generated from `src/index.css` on <ISO 8601>_

## Colours
| CSS Variable | Raw Value | bg class | text class | border class |
|---|---|---|---|---|

## Fonts
| CSS Variable | Value | Tailwind Class |
|---|---|---|

## Radius
| CSS Variable | Value | Tailwind Class | Usage |
|---|---|---|---|

## Spacing
| CSS Variable | Value | How to Use |
|---|---|---|

## Drift Report
| Status | Token | Detail |
|---|---|---|
| Added | `--color-new-token` | Present in CSS, missing from styling.md |
```

## Quality Gate
The skill is complete when:
- [ ] All `--color-*`, `--font-*`, `--radius-*`, and `--spacing-*` variables from the `@theme` block are listed.
- [ ] The drift report is present and accurate.
- [ ] `styling.md` is either confirmed up-to-date or updated to match any drift found.
