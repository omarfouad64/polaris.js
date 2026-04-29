# Design: Course Directory

**Page:** Course Directory (Admin)
**Related Requirements:** Req 55, 56, 57, 58
**Design System:** [stellar_academic/DESIGN.md](../stellar_academic/DESIGN.md)

---

## Layout

Rendered as a tab within the Admin Control Panel. Two sub-tabs: "Course List" and "Link Requests".

```
┌──────────────────────────────────────────────────────────────┐
│  Sub-tabs: [Course List]  [Link Requests (N)]                │
│─────────────────────────────────────────────────────────────  │
│  TAB: Course List                                            │
│  [+ Add Course btn]                                          │
│  ┌───────────────────────────────────────────────────────┐   │
│  │ CourseRow: [Code]  [Name]  [Instructors count]  [⋮]  │   │
│  │ CourseRow: ...                                       │   │
│  └───────────────────────────────────────────────────────┘   │
│  TAB: Link Requests                                          │
│  ┌───────────────────────────────────────────────────────┐   │
│  │ RequestRow: [Instructor Name] → [Course Name]         │   │
│  │             [Type: Link/Unlink]  [Approve] [Reject]  │   │
│  └───────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

---

## States

### Course List Tab
- Full course list with search input.
- Each row: course code chip, course name, linked instructor count badge.
- Kebab menu per row: Edit (opens inline edit), Delete (with confirmation dialog).
- "Add Course" primary button opens `AddCourseModal`.
- Empty state: "No courses added yet."

### Link Requests Tab
- List of pending link/unlink requests from instructors.
- Each row: instructor name + avatar, arrow, course name, request type badge (Link / Unlink).
- "Approve" and "Reject" action buttons.
- Count badge on sub-tab label (number of pending requests).
- Empty state: "No pending link requests."

---

## Components

### CourseDataTable
- List-style table (not a true `<table>`, uses flex rows for responsiveness).
- Each row: `flex justify-between items-center p-4 border-b border-outline-variant last:border-0`.
- Course code: `bg-primary/10 text-primary rounded-full text-xs font-jakarta font-semibold px-3 py-1`.
- Linked instructors: `bg-surface-container text-on-surface-variant rounded-full text-xs px-2 py-0.5`.

### AddCourseModal
- Fields: Course Name (text input, required), Course Code (text input, required, max 10 chars).
- "Create Course" primary button / "Cancel" ghost button.

### RequestHandler
- "Approve" button: `bg-secondary text-on-secondary rounded-lg`.
- "Reject" button: `border border-error text-error rounded-lg`.
- Confirmation on Approve: snackbar toast confirmation.
- No confirmation needed for Reject (low-risk).

---

## Interaction States

| Element | Hover | Focus | Active |
|---|---|---|---|
| CourseRow | `bg-surface-container-low` | n/a | n/a |
| Kebab menu | `bg-surface-container` | n/a | n/a |
| Add Course btn | `bg-primary-container` | Ring visible | `translate-y-0.5` |
| Approve btn | `bg-secondary/90` | Ring visible | `translate-y-0.5` |
| Reject btn | `bg-error/5` | Ring visible | n/a |
