# Design: Student Dashboard

**Page:** Student Dashboard
**Related Requirements:** Req 72
**Design System:** [stellar_academic/DESIGN.md](../stellar_academic/DESIGN.md)

---

## Layout

Portal layout wraps this page. It is the default landing page for a student after login.

```
┌────────────────────────────────────────────────────────────┐
│ SIDEBAR │  HEADER: "Dashboard"  Greeting: "Hello, [Name]"  │
│         │──────────────────────────────────────────────── │
│         │  ┌──────────┐  ┌──────────────────────────────┐ │
│         │  │ StatsCard │  │  Programming Languages Chart  │ │
│         │  │ Total     │  │  (Donut chart, % breakdown)  │ │
│         │  │ Projects  │  └──────────────────────────────┘ │
│         │  └──────────┘                                    │
│         │  ┌─────────────────────────────────────────────┐ │
│         │  │  Top Collaborators (per project)             │ │
│         │  │  Project A: [Avatar] [Avatar]                │ │
│         │  │  Project B: [Avatar] [Avatar] [Avatar]       │ │
│         │  └─────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

---

## States

### Default (student has projects)
- Stats card, language chart, and collaborators section all populated.

### Empty State (no projects)
- Stats card shows "0".
- Language chart area: placeholder card with "Create your first project to see language stats" message.
- Collaborators section: similar placeholder.

---

## Components

### StatsCard
- Large number in `font-jakarta font-bold text-4xl text-primary`.
- Label below: "Total Projects" in `font-lexend text-on-surface-variant`.
- Card: `rounded-xl bg-surface-container-lowest` with ambient shadow.

### ProjectLanguagesChart
- Donut / pie chart (implemented with a CSS-based or SVG-based approach — no external chart library unless added to `package.json`).
- Each language segment uses a distinct colour from: `primary`, `secondary`, `tertiary`, `tertiary-container`, `outline`.
- Legend: list of language + percentage pairs with colour dots.
- Card: `rounded-xl bg-surface-container-lowest` with ambient shadow.

### TopCollaboratorsChart
- Per-project row: project title as row header, then a `+AvatarStack` of collaborator avatars (stacked with `-space-x-2`).
- Avatar: circular initials chip, `rounded-full bg-primary-container text-on-primary-container font-jakarta font-bold`.
- Card: `rounded-xl bg-surface-container-lowest` with ambient shadow.
- If no collaborators for a project: "No collaborators" in `text-on-surface-variant`.

---

## Interaction States

| Element | Hover |
|---|---|
| StatsCard | Raised shadow |
| Chart legend item | Highlights corresponding chart segment |
| Collaborator avatar | Tooltip showing full name |

---

## Responsive Behaviour

| Breakpoint | Layout |
|---|---|
| Mobile | Single column — cards stacked vertically |
| `md:` | StatsCard + Language chart side by side (50/50) |
| `lg:` | Three-column top row; collaborators full-width below |
