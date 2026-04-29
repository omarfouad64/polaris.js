# Design: Project Detail View

**Page:** Project Detail View
**Related Requirements:** Req 38, 39, 46, 59, 65
**Design System:** [stellar_academic/DESIGN.md](../stellar_academic/DESIGN.md)

---

## Layout

Portal layout wraps this page. Three tabs for team members / instructors: Overview, Tasks, Feedback. Public viewers (non-team) see only Overview.

```
┌─────────────────────────────────────────────────────────────┐
│ SIDEBAR │  Breadcrumb: Project Explorer > [Project Title]   │
│         │────────────────────────────────────────────────  │
│         │  [ProjectHeader]                                 │
│         │  Title (h1)  Course chip  Rating stars           │
│         │  GitHub link btn  Favorite btn  Flag btn (admin)  │
│         │────────────────────────────────────────────────  │
│         │  Tabs: [Overview]  [Tasks*]  [Feedback*]         │
│         │  (* visible to team & instructor only)           │
│         │────────────────────────────────────────────────  │
│         │  TAB: Overview                                   │
│         │  [Demo Video player]                             │
│         │  Programming Languages: [chip] [chip]            │
│         │  Team Members: [avatar] [avatar]                 │
│         │  Creation Date                                   │
│         │                                                  │
│         │  TAB: Tasks   → links to Project Tasks page      │
│         │  TAB: Feedback                                   │
│         │  [FeedbackThread] — instructor comments/rating   │
└─────────────────────────────────────────────────────────────┘
```

---

## States

### Overview Tab — Public view
- Demo video, language chips, team avatars, creation date, ratings display.
- Favorite button visible to Students and Employers.
- Flag button visible to Admins and Instructors.
- GitHub link button always visible.

### Feedback Tab — Team + Instructor only
- List of instructor feedback items (general project feedback + individual thesis draft feedback).
- Rating display: 5-star `RatingComponent` showing average; only instructor can submit rating.
- If no feedback: "No feedback yet."

### Loading State
- Skeleton for header, skeleton for video player (`bg-surface-container rounded-xl animate-pulse h-64`).

---

## Components

### ProjectHeader
- `h1`: project title — `text-3xl font-jakarta font-bold text-on-background`.
- Course chip: `bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-jakarta font-semibold`.
- Rating stars: display-only star icons in `tertiary` colour with numeric average.
- GitHub link: outline button with `link` icon.
- FavoriteButton: icon toggle (`favorite_border` / `favorite`); filled = `text-error`.
- FlagButton: ghost icon button (`flag`), visible to Admin/Instructor.

### VideoPlayer
- `<video>` element or `<iframe>` if YouTube link.
- `rounded-xl bg-surface-container-lowest` wrapper with aspect-ratio 16/9.

### FeedbackThread
- List of comment blocks: instructor avatar + name, date, comment text.
- Instructor-only: "Add Comment" / "Edit" / "Delete" actions.

### RatingComponent
- 5 star icons — interactive for instructor, read-only for others.
- Filled star: `text-tertiary icon-fill`, empty star: `text-outline-variant`.
- On instructor's first submission: "Submit Rating" button appears.
- After submission: shows the submitted rating read-only with "Update Rating" option.

### FlagButton (action)
- On click: opens modal with reason textarea (required) + "Submit Flag" primary button.

---

## Responsive Behaviour

| Breakpoint | Layout |
|---|---|
| Mobile | Stacked vertical layout |
| `md:` | Video player left (60%), metadata right (40%) |
