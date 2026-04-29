# Design: Portfolio Detail View

**Page:** Portfolio Detail View
**Related Requirements:** Req 51, 65, 90
**Design System:** [stellar_academic/DESIGN.md](../stellar_academic/DESIGN.md)

---

## Layout

Portal layout wraps this page. Three tabs: About, Projects, Experience.

```
┌────────────────────────────────────────────────────────────────┐
│ SIDEBAR │  [PortfolioHeader]                                   │
│         │  [Avatar] [Name] [Major chip] [Message btn]         │
│         │  [Favorite btn] (visible to Student/Employer)        │
│         │  Tabs: [About]  [Projects]  [Experience]            │
│         │──────────────────────────────────────────────────── │
│         │  TAB: About                                         │
│         │  Bio text block                                     │
│         │  Skills cloud (chips)                               │
│         │  LinkedIn link                                      │
│         │                                                     │
│         │  TAB: Projects                                      │
│         │  ProjectGrid — public projects only                 │
│         │                                                     │
│         │  TAB: Experience                                    │
│         │  ExperienceTimeline — completed internships         │
└────────────────────────────────────────────────────────────────┘
```

---

## States

### About Tab
- Read-only view of the student's bio, skills, LinkedIn.
- Empty bio: "No bio added yet."
- Empty skills: "No skills listed."

### Projects Tab
- Grid of `ProjectCard` components showing only public projects.
- Empty state: "No public projects yet."

### Experience Tab
- Timeline list of completed internships (Req 90 — auto-populated when student completes an internship).
- Each item: company logo, internship title, duration, completion date.
- Empty state: "No completed internships yet."

---

## Components

### PortfolioHeader
- Avatar: `rounded-full w-24 h-24 bg-primary-container` with initials fallback.
- Name: `text-3xl font-jakarta font-bold text-on-background`.
- Major chip: `bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-jakarta font-semibold`.
- Message button: ghost variant with `chat_bubble` icon — opens direct message (Req 69).
- Favorite button: toggle icon (`favorite_border` / `favorite`) — `text-error` when favorited.

### ProjectGrid
- Responsive grid: 1 col mobile, 2 col `md:`, 3 col `lg:`.
- Each cell: `ProjectCard` (same as My Projects design).

### ExperienceTimeline
- Vertical timeline with left connector line (`border-l-2 border-outline-variant`).
- Each node: circle marker (`w-3 h-3 rounded-full bg-secondary`), company logo + title + duration + date.
- Card: `rounded-xl bg-surface-container-lowest p-4` with ambient shadow.

### Skills Cloud
- Flex-wrap collection of chips.
- Each skill: `bg-secondary/10 text-secondary rounded-full px-3 py-1 text-sm font-jakarta font-semibold`.

---

## Interaction States

| Element | Hover | Focus | Active |
|---|---|---|---|
| ProjectCard | Raised shadow, `scale-[1.01]` | Ring visible | n/a |
| Message button | `bg-surface-container` | Ring visible | `translate-y-0.5` |
| Favorite button | `scale-110` | Ring visible | `scale-90` |

---

## Responsive Behaviour

| Breakpoint | Layout |
|---|---|
| Mobile | Stacked — header, then tabs |
| `md:` | Header has side-by-side info + action buttons |
