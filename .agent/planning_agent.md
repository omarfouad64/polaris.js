# Planning Agent — Project Polaris

This file defines the planning agent's responsibilities, inputs, output format, and acceptance gate. **Every feature implementation must pass through this agent before a single line of code is written.** The planning agent transforms a plain-language feature request into an unambiguous, executable plan.

**Dependencies:** Read [`agent.md`](./agent.md) before this file.

**Output artefact:** `PLAN.md` (created in the workspace root or a feature-specific scratch folder).

---

## Inputs

Before producing a plan, the agent must read and cross-reference:

1. The **feature description** — plain language provided by the user or orchestrator.
2. [`requirements.md`](./requirements.md) — Identify every requirement number that the feature touches.
3. [`pages.md`](./pages.md) — Identify every affected page, its sub-views, and the components it declares.
4. Relevant files from [`Design/`](./Design/) — Extract layout intent for every affected page.
5. [`project_data/architecture.md`](./project_data/architecture.md) — Verify routing impact.
6. [`project_data/components.md`](./project_data/components.md) — Check which global components already exist.
7. [`project_data/hooks.md`](./project_data/hooks.md) — Check which hooks already exist.

---

## Output Artefact — `PLAN.md`

The plan must contain exactly the following sections, in this order. No section may be left empty; write `N/A` only if truly not applicable.

```markdown
# PLAN: <Feature Name>

## 1. Feature Summary
One paragraph. What does this feature do? Who are the affected user roles?
Reference the requirement numbers covered (e.g., Req 19, 21, 22).

## 2. Affected Pages & Routes
| Page | Route | Change Type |
|---|---|---|
| <Page Name (from pages.md)> | <path> | New / Modified / Unchanged |

## 3. New Components to Create
For each new component, provide:

### `<ComponentName>` — `<path>`
```tsx
interface <ComponentName>Props {
  // List every prop with its TypeScript type and a one-line description.
}
```
- **Reusability:** Global (`src/components/`) or page-local (`src/pages/.../.../components/`)?
- **Design reference:** Which design file / section?

## 4. Existing Components to Modify
| Component | File | Change Description |
|---|---|---|

## 5. State Changes
| Context | New Keys Added | Type | Purpose |
|---|---|---|---|

If no Context changes are needed, describe any new local state clearly.

## 6. New Hooks to Create
For each hook:
- **Name:** `useXxx`
- **Location:** `src/hooks/` (global) or `src/pages/.../.../scripts/` (local)
- **Returns:** TypeScript return type.
- **Data source:** Which dummy data it encapsulates.

## 7. Routes to Register
List any new `<Route>` entries needed in the router configuration file, with exact paths.

## 8. Edge Cases & Error States
- List every empty state, loading state, and error state this feature must handle.
- List validation constraints (max lengths, required fields, format rules).

## 9. Open Questions
- [ ] <question> — Must be resolved before implementation begins.

## 10. Checklist (Acceptance Gate)
- [ ] All affected requirements listed.
- [ ] All affected pages/routes listed.
- [ ] All new components have props interfaces.
- [ ] All existing components' changes described.
- [ ] All Context/state changes listed.
- [ ] All new hooks listed with return types.
- [ ] All new routes listed.
- [ ] All edge cases listed.
- [ ] Zero open questions remain.
```

---

## Acceptance Gate

Implementation **must not begin** until:

- [ ] Every item in the PLAN.md checklist (Section 10) is ticked.
- [ ] There are zero open questions in Section 9.
- [ ] The plan has been reviewed by the implementer and found unambiguous.

If any open question cannot be resolved from the existing documentation, it must be escalated to the user **before** the plan is marked complete.

---

## Do / Don't

| Do | Don't |
|---|---|
| Reference exact requirement numbers. | Invent requirements not in `requirements.md`. |
| Sketch TypeScript interfaces, not implementation. | Write component bodies in the plan. |
| Note which global components can be reused. | Duplicate components that already exist. |
| List every route change explicitly. | Assume a route is already registered. |
| Mark ambiguities as open questions. | Silently assume a behaviour. |
