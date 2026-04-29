# Design: My Projects

**Page:** My Projects
**Related Requirements:** Req 21, Req 22
**Design System:** [stellar_academic/DESIGN.md](../stellar_academic/DESIGN.md)

---

## Layout

Portal layout (sidebar + top header) wraps this page. Content fills the main area.

```
┌─────────────────────────────────────────────────────────┐
│ SIDEBAR │  HEADER: "My Projects"  [+ New Project btn]   │
│         │─────────────────────────────────────────────  │
│         │  [SearchBar]          [Visibility filter]      │
│         │─────────────────────────────────────────────  │
│         │  ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│         │  │ ProjectCard│ │ProjectCard│ │ProjectCard│    │
│         │  └──────────┘ └──────────┘ └──────────┘      │
│         │  ┌──────────┐ ┌──────────┐                    │
│         │  │ ProjectCard│ │ProjectCard│                  │
│         │  └──────────┘ └──────────┘                    │
│         │  — Empty State (if no projects) —             │
└─────────────────────────────────────────────────────────┘
```

---

## States

### Default (projects exist)
- Grid of `ProjectCard` components (2 columns on `md:`, 3 on `lg:`).
- Each card shows: project title, course name, creation date, public/private badge, language chips, and a quick-action menu (Edit, Delete, Toggle Visibility).
- A `VisibilityToggle` switch on each card allows direct toggling between public/private.

### Empty State
- Centered illustration (rocket or star icon in `primary/10` background circle).
- Heading: "No projects yet" (`font-jakarta font-bold text-on-surface`).
- Body: "Start by creating your first project to showcase your work." (`font-lexend text-on-surface-variant`).
- "Create Project" primary button linking to the Project Editor.

### Loading State
- Skeleton cards (3 on desktop, 1 on mobile) with `animate-pulse` in `surface-container` colour.

---

## Components

### Header Row
- `h1`: "My Projects" — `text-3xl font-jakarta font-bold text-on-background`
- "+ New Project" button: primary variant, links to `/portal/student/project-editor/new`

### SearchBar
- Full-width input on mobile, 50% width on `lg:`.
- Placeholder: "Search your projects…"
- Icon: `search` (Material Symbols, left-padded).

### Visibility Filter
- Segmented control / select dropdown: "All", "Public", "Private".
- Uses `surface-container` background with `outline-variant` border.

### ProjectCard
- `rounded-xl` container, ambient shadow.
- Top: project title (`font-jakarta font-semibold text-on-surface`) + public/private badge.
- Middle: course name chip (`bg-primary/10 text-primary rounded-full`), creation date (`text-on-surface-variant text-sm`).
- Bottom: row of language chips + quick-action kebab menu icon.
- Full card is clickable → navigates to Project Detail View.

### VisibilityToggle
- Toggle switch on the card, aligned right.
- On (public): `bg-secondary`. Off (private): `bg-outline-variant`.

---

## Interaction States

| Element | Hover | Focus | Active | Disabled |
|---|---|---|---|---|
| ProjectCard | Raised shadow, `scale-[1.01]` | Ring 2px secondary | Shadow flattens | n/a |
| New Project button | `bg-primary-container` | Ring visible | `translate-y-0.5` | `opacity-50 cursor-not-allowed` |
| VisibilityToggle | Cursor pointer | Ring visible | Knob animates | `opacity-50` |

---

## Responsive Behaviour

| Breakpoint | Columns | Search width |
|---|---|---|
| Mobile | 1 | 100% |
| `md:` | 2 | 70% |
| `lg:` | 3 | 50% |
