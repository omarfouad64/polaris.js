# Design: Content Moderation

**Page:** Content Moderation (Admin / Instructor)
**Related Requirements:** Req 59, 60, 61, 62, 63, 64
**Design System:** [stellar_academic/DESIGN.md](../stellar_academic/DESIGN.md)

---

## Layout

Rendered as a tab within the Admin Control Panel for admins. Instructors access it from their own portal view.

```
┌─────────────────────────────────────────────────────────────┐
│  Sub-tabs: [Flagged Projects (N)]  [Appeals (M)]            │
│────────────────────────────────────────────────────────────  │
│  TAB: Flagged Projects                                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ FlaggedProjectCard                                   │   │
│  │ [Project Title]  [Flagged by: Name]  [Date]          │   │
│  │ Reason: [reason text]                                │   │
│  │ Status: Active / Deactivated                         │   │
│  │ [Deactivate btn]  [Activate btn]  [View Project]    │   │
│  └──────────────────────────────────────────────────────┘   │
│  TAB: Appeals                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ AppealCard                                           │   │
│  │ [Student Name]  [Project Title]  [Appeal date]       │   │
│  │ Appeal: [student's message]                          │   │
│  │ [Activate Project] [Keep Deactivated]                │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## States

### Flagged Projects Tab
- List of all flagged projects (Req 62).
- Count badge on sub-tab label.
- Each card shows: project title, who flagged it, flagging date, reason, current status.
- Actions: Deactivate (if currently active) / Activate (if deactivated), View Project link.
- Empty state: "No flagged projects."

### Appeals Tab
- List of student appeals (Req 63).
- Each card shows: student name, project title, appeal date, the appeal message.
- Actions: "Activate Project" (primary) / "Keep Deactivated" (destructive outline).
- Empty state: "No appeals received."

---

## Components

### FlaggedProjectList
- Card list, each card `rounded-xl bg-surface-container-lowest` with ambient shadow.
- Status badge: Active (`bg-secondary-container text-on-secondary-container`), Deactivated (`bg-error/10 text-error`).
- "Reason" text: `bg-surface-container rounded-lg p-3 text-sm font-lexend text-on-surface-variant`.

### AppealReviewForm
- Read-only appeal message in a `bg-surface-container-low rounded-xl p-4` block.
- "Activate Project" button: `bg-secondary text-on-secondary`.
- "Keep Deactivated" button: `border border-error text-error`.
- Confirmation dialog before either action.

### ProjectStatusToggle
- Toggle used to flip a project between Active and Deactivated states.
- On: `bg-secondary`. Off: `bg-error`.
- Visible to both Admin and Instructor.

---

## Instructor Flag Flow (Req 59)
- On the Project Detail View page, instructors and admins see a `FlagButton` (flag icon, ghost variant).
- Clicking opens a modal: "Flag this project" with a reason textarea (required) and a "Submit Flag" primary button.
- After submission: project auto-deactivates if no appeal is sent within the defined window.

---

## Interaction States

| Element | Hover | Focus | Active |
|---|---|---|---|
| FlaggedProjectCard | Raised shadow | n/a | n/a |
| Activate btn | `bg-secondary/90` | Ring visible | `translate-y-0.5` |
| Deactivate / Keep Deactivated btn | `bg-error/10` | Ring visible | `translate-y-0.5` |
| View Project link | `text-primary underline` | Ring visible | n/a |
