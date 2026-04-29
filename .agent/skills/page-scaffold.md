# Skill: Page Scaffold

## Purpose
This skill generates a complete, convention-compliant new page scaffold for Project Polaris so that every new page starts from an identical, correct baseline. It produces the route file, layout wrapper integration point, default export component, TypeScript props interface, and an empty test file — following the exact file and naming conventions defined in `project_data/architecture.md`. Invoke this skill whenever a new page defined in `pages.md` is being implemented for the first time.

## Trigger
Invoke this skill when:
- A new page listed in `pages.md` is ready to be implemented.
- A feature plan (PLAN.md) requires creating a net-new page that did not previously exist.

## Inputs
- **Page name** — the page's name from `pages.md` (e.g., "My Projects").
- **Flow name** — the portal flow it belongs to (e.g., `student`, `employer`, `instructor`, `admin`, `auth`).
- **Route path** — the intended URL path (e.g., `/portal/student/my-projects`).
- **Props** — any props the page component accepts (from PLAN.md, Section 3).
- [`project_data/architecture.md`](../project_data/architecture.md) — directory conventions and routing hierarchy.
- [`styling.md`](../styling.md) — token classes for the initial shell.

## Steps

1. **Derive file paths** from the page name and flow:
   - Page folder: `src/pages/portal/[flow_name]/[page_name_snake_case]/`
   - Main component file: `[PageNamePascalCase].tsx` inside the page folder.
   - Scripts folder: `src/pages/portal/[flow_name]/[page_name_snake_case]/scripts/`
   - Components folder: `src/pages/portal/[flow_name]/[page_name_snake_case]/components/`
   - Test file: `[PageNamePascalCase].test.tsx` inside the page folder.
   - Auth pages use `src/pages/auth/[page_name_snake_case]/` instead.

2. **Generate `[PageNamePascalCase].tsx`:**

```tsx
// [PageNamePascalCase].tsx
interface [PageNamePascalCase]Props {
  // Define props from PLAN.md. Leave empty if page receives no props.
}

/**
 * [PageNamePascalCase] — <one-line description from pages.md>.
 * Related requirements: <comma-separated list from PLAN.md>.
 */
export default function [PageNamePascalCase]({ }: [PageNamePascalCase]Props) {
  return (
    <div className="p-[--spacing-polaris-md]">
      <h1 className="text-3xl font-jakarta font-bold text-on-background">
        [Page Title]
      </h1>
      {/* TODO: Implement page content */}
    </div>
  )
}
```

3. **Generate `[PageNamePascalCase].test.tsx`:**

```tsx
// [PageNamePascalCase].test.tsx
// TODO: confirm toolchain — see testing.md
// Add test cases once testing framework is configured.
```

4. **Create the `scripts/` placeholder:**  
   Create `scripts/.gitkeep` (or the first hook file if already planned in PLAN.md).

5. **Create the `components/` placeholder:**  
   Create `components/.gitkeep` (or the first component file if already planned in PLAN.md).

6. **Register the route:**  
   Open the router configuration file (typically `src/main.tsx` or `src/router.tsx`) and add:
   ```tsx
   <Route path="[route_path]" element={<[PageNamePascalCase] />} />
   ```
   Nest it inside the correct layout route.

7. **Verify TypeScript compiles:**  
   Run `tsc --noEmit` (or inspect for type errors) after generating all files.

## Output Artefact

A set of files:
```
src/pages/portal/[flow]/[page]/
  ├── [PageName].tsx          ← main component (scaffold)
  ├── [PageName].test.tsx     ← empty test file
  ├── scripts/
  │   └── .gitkeep
  └── components/
      └── .gitkeep
```

Plus the route entry added to the router config.

## Quality Gate
The scaffold is complete when:
- [ ] All four items above exist at the correct paths.
- [ ] The main component file compiles with zero TypeScript errors.
- [ ] The route is registered and navigating to the path renders the page (even if it only shows a heading).
- [ ] File and folder names follow the conventions in `architecture.md` (snake_case folders, PascalCase files).
