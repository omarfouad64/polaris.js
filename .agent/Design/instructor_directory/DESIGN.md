# Design: Instructor Directory

**Page:** Instructor Directory
**Related Requirements:** Req 8, 9
**Design System:** [stellar_academic/DESIGN.md](../stellar_academic/DESIGN.md)

---

## Layout

Portal layout wraps this page. No tabs — single search/results view.

```
┌──────────────────────────────────────────────────────────────┐
│ SIDEBAR │  HEADER: "Course Instructors"                      │
│         │──────────────────────────────────────────────────  │
│         │  [SearchBar: Search by name or course…]            │
│         │──────────────────────────────────────────────────  │
│         │  ┌──────────────┐ ┌──────────────┐ ┌──────────┐  │
│         │  │InstructorCard│ │InstructorCard│ │         │  │
│         │  └──────────────┘ └──────────────┘ └──────────┘  │
│         │  — Empty / No Results State —                     │
└──────────────────────────────────────────────────────────────┘
```

---

## States

### Default (results exist)
- Grid of `InstructorCard` components.
- Search input at the top filters results in real time.

### No Results
- Icon (`search_off` Material Symbol in `surface-container` circle).
- Heading: "No instructors found".
- Body: "Try a different name or course keyword."

### Empty (no instructors in the system)
- Heading: "No instructors registered yet."

---

## Components

### SearchBar
- Full-width on mobile, 60% width on `lg:`.
- Placeholder: "Search by name or course…"
- Icon: `search` (Material Symbols, left-padded).
- Clears on × icon click.

### InstructorCardList
- Responsive grid: 1 col mobile, 2 col `md:`, 3 col `lg:`.

### InstructorCard
- Avatar: `rounded-full w-14 h-14 bg-primary-container` with initials fallback or profile picture.
- Name: `font-jakarta font-semibold text-on-surface`.
- Bio snippet: first 80 chars of bio in `font-lexend text-sm text-on-surface-variant`. Truncated with ellipsis.
- Linked Courses: horizontal list of course code chips (`bg-primary/10 text-primary rounded-full text-xs`). Max 3 shown; "+N more" badge if over.
- Full card is clickable → navigates to Instructor Profile (public view).
- Card: `rounded-xl bg-surface-container-lowest` with ambient shadow.

---

## Interaction States

| Element | Hover | Focus |
|---|---|---|
| InstructorCard | Raised shadow, `scale-[1.01]` | Ring 2px secondary |
| Course chip | `bg-primary/20` | n/a |
| SearchBar | `border-secondary` | Ring visible |

---

## Responsive Behaviour

| Breakpoint | Columns |
|---|---|
| Mobile | 1 |
| `md:` | 2 |
| `lg:` | 3 |
