# Design: Project Tasks

**Page:** Project Tasks
**Related Requirements:** Req 32, 33, 34, 37, 40, 41
**Design System:** [stellar_academic/DESIGN.md](../stellar_academic/DESIGN.md)

---

## Layout

Portal layout wraps this page. The page is accessed from a specific project context.

```
┌─────────────────────────────────────────────────────────┐
│ SIDEBAR │  HEADER: "[Project Title] — Tasks"            │
│         │  Breadcrumb: My Projects > [Project] > Tasks  │
│         │─────────────────────────────────────────────  │
│         │  [+ Add Task btn]   [Filter: status dropdown] │
│         │─────────────────────────────────────────────  │
│         │  ┌─────────────────────────────────────────┐  │
│         │  │ ≡  Task 1 — [title]    [Assignee] [Due] │  │
│         │  │    Status: [Pending ▼]                  │  │
│         │  │    [Instructor comment badge if any]    │  │
│         │  ├─────────────────────────────────────────┤  │
│         │  │ ≡  Task 2 ...                           │  │
│         │  └─────────────────────────────────────────┘  │
│         │  — Empty State (no tasks) —                   │
└─────────────────────────────────────────────────────────┘
```

---

## States

### Default (tasks exist)
- Ordered list of `TaskCard` rows, draggable by the project creator for reordering (Req 34).
- Each row shows: drag handle, task title, assignee avatar + name, deadline, status badge, and an instructor comment indicator.

### Empty State
- Centered icon (`checklist` Material Symbol in `surface-container` circle).
- Heading: "No tasks yet".
- Body: "Add tasks to track your project's progress."
- "Add Task" primary button.

### Loading State
- Skeleton rows (`animate-pulse`, `bg-surface-container`).

---

## Components

### TaskCard (list row)
- Drag handle: `≡` icon (`drag_indicator`) — visible only to project creator; `cursor-grab`.
- Title: `font-jakarta font-semibold text-on-surface`.
- Assignee: small avatar chip with initials + name (`text-sm font-lexend text-on-surface-variant`).
- Deadline: date string with `calendar_today` icon (`text-sm text-on-surface-variant`); turns `text-error` if past due.
- Status badge: pill dropdown — Pending (`bg-outline-variant/30 text-on-surface-variant`), Postponed (`bg-tertiary-container text-on-tertiary`), Completed (`bg-secondary-container text-on-secondary-container`).
- Comment indicator: `chat_bubble` icon badge with count in `primary` colour (appears when instructor has commented).
- Actions (project creator only): edit pencil icon, delete trash icon (appear on row hover).

### AddTaskModal
- `rounded-xl` modal with overlay.
- Fields: Title (required), Description (1 line), Assignee (searchable dropdown — collaborator list), Deadline (date picker), Status (dropdown, default: Pending).
- "Create Task" primary button / "Cancel" ghost button.

### TaskCommentSection
- Expandable panel below a task row (toggle on comment badge click).
- Shows each instructor comment with: instructor name, date, comment text.
- Instructor-only: "Add Comment" / "Edit" / "Delete" actions on their own comments.

### Status Dropdown (per task)
- Inline select styled as a pill badge.
- Collaborators: can change only their own task's status.
- Project creator: can change any task's status.

---

## Interaction States

| Element | Hover | Focus | Active | Disabled |
|---|---|---|---|---|
| TaskCard row | `bg-surface-container-low` background | n/a | n/a | n/a |
| Drag handle | `cursor-grab`, `text-secondary` | n/a | `cursor-grabbing` | Hidden for non-creator |
| Status dropdown | `bg-surface-container` | Ring visible | n/a | `opacity-50` (non-assignee) |
| Add Task button | `bg-primary-container` | Ring visible | `translate-y-0.5` | n/a |

---

## Responsive Behaviour

| Breakpoint | Change |
|---|---|
| Mobile | Assignee and deadline stack below task title |
| `md:` | Single-row layout with all details inline |
