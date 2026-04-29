# Design: My Courses

**Page:** My Courses (Instructor)
**Related Requirements:** Req 7, 56
**Design System:** [stellar_academic/DESIGN.md](../stellar_academic/DESIGN.md)

---

## Layout

Portal layout wraps this page. Two tabs: "Linked Courses" and "Available Courses".

```
┌───────────────────────────────────────────────────────────┐
│ SIDEBAR │  HEADER: "My Courses"                           │
│         │  Tabs: [Linked Courses]  [Available Courses]    │
│         │─────────────────────────────────────────────── │
│         │  TAB: Linked Courses                           │
│         │  ┌──────────────────────────────────────────┐  │
│         │  │ CourseRow: [Code] [Name]  [Unlink btn]   │  │
│         │  │ CourseRow: [Code] [Name]  (auto-linked)  │  │
│         │  └──────────────────────────────────────────┘  │
│         │  TAB: Available Courses                        │
│         │  ┌──────────────────────────────────────────┐  │
│         │  │ CourseRow: [Code] [Name]  [Link btn]     │  │
│         │  │ CourseRow: [Code] [Name]  [Pending...]   │  │
│         │  └──────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
```

---

## States

### Linked Courses Tab
- List of courses the instructor is currently linked to.
- "Bachelor Project" row includes an auto-link indicator badge ("Auto-linked" chip in `secondary-container` colour).
- All other courses show an "Unlink" outline button.
- Empty state: "You are not linked to any courses yet."

### Available Courses Tab
- Full course list (Req 56) minus already-linked courses.
- Each row has a "Request Link" button (primary small variant).
- If a link request is pending admin approval: button disabled, "Pending Approval" chip shown.
- Empty state: "All courses are already linked."

---

## Components

### CourseList
- Table-like list: `rounded-xl bg-surface-container-lowest` card wrapping all rows.
- Each row: `flex justify-between items-center p-4 border-b border-outline-variant last:border-0`.
- Left: course code chip (`bg-primary/10 text-primary rounded-full text-xs font-jakarta font-semibold px-3 py-1`) + course name.
- Right: action button or status badge.

### RequestLinkButton
- Primary small: "Request Link" — triggers a confirm dialog before sending.
- Disabled state: `opacity-50 cursor-not-allowed`.
- Pending state: replaced with "Pending Approval" chip (`bg-tertiary-container/30 text-tertiary font-jakarta text-xs font-semibold rounded-full px-3 py-1`).

### Auto-Link Indicator
- Non-interactive chip: "Auto-linked" in `bg-secondary-container text-on-secondary-container rounded-full px-3 py-1 text-xs`.

---

## Interaction States

| Element | Hover | Focus | Active |
|---|---|---|---|
| CourseRow | `bg-surface-container-low` | n/a | n/a |
| Request Link btn | `bg-primary-container` | Ring visible | `translate-y-0.5` |
| Unlink btn | `border-error text-error` | Ring visible | n/a |
