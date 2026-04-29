# Design: Internship Explorer

**Page:** Internship Explorer (Student)
**Related Requirements:** Req 79, 80, 81, 82, 83, 84
**Design System:** [stellar_academic/DESIGN.md](../stellar_academic/DESIGN.md)

---

## Layout

Portal layout wraps this page. Two tabs: "All Internships" and "My Applications".

```
┌──────────────────────────────────────────────────────────────┐
│ SIDEBAR │  HEADER: "Internships"                             │
│         │  Tabs: [All Internships]  [My Applications]        │
│         │──────────────────────────────────────────────────  │
│         │  TAB: All Internships                             │
│         │  ┌──────────┐  ┌─────────────────────────────┐   │
│         │  │ Filter   │  │  [SearchBar]  [Sort: Date ▼] │   │
│         │  │ Sidebar  │  │─────────────────────────────│   │
│         │  │ Company  │  │  InternshipCard              │   │
│         │  │ Duration │  │  InternshipCard              │   │
│         │  │ Status   │  │  InternshipCard              │   │
│         │  └──────────┘  └─────────────────────────────┘   │
│         │  TAB: My Applications                            │
│         │  Application status list                         │
└──────────────────────────────────────────────────────────────┘
```

---

## States

### All Internships Tab — default
- Search bar + sort dropdown + filter sidebar.
- Results grid/list of `InternshipCard` components.
- Empty / no results: "No internships match your search."

### My Applications Tab
- List of internships the student has applied to, with current status (Nominated / Accepted / Rejected / Pending).
- Empty: "You haven't applied to any internships yet."

### Apply Flow (Req 84)
- "Apply" button on a card or internship detail view opens `ApplicationFormModal`.
- Modal: cover letter textarea (required, max 500 chars) + "Submit Application" primary button.

---

## Components

### InternshipFilterSidebar
- "Company" text filter input.
- "Duration" multi-select checkboxes (e.g., 1 month, 2 months, 3 months, 6 months).
- "Status" toggle: Hiring / All.
- "Clear Filters" ghost button.

### InternshipCardList
- Single-column list on mobile, two-column on `lg:`.

### InternshipCard
- Company logo avatar + company name + internship title.
- Skills chips (max 4 shown, "+N more" if over).
- Duration + application deadline.
- Status badge: "Hiring" (`bg-secondary-container text-on-secondary-container`) or "Position Filled" (`bg-outline-variant/30 text-on-surface-variant`).
- "Apply" primary small button (disabled if already applied or position filled).
- Full card clickable for detail view.
- Card: `rounded-xl bg-surface-container-lowest` with ambient shadow.

### ApplicationFormModal
- `rounded-xl` modal with overlay.
- Header: "Apply for [Internship Title]".
- Cover letter: `<textarea>` with char counter (max 500).
- "Submit Application" primary button / "Cancel" ghost button.
- Confirmation: "Application submitted!" success state with `check_circle` icon in `secondary` colour.

### SortDropdown
- "Sort by: Posting Date" — dropdown with option: Newest First / Oldest First.
- Styled as a select with `rounded-lg border-outline-variant`.

---

## Interaction States

| Element | Hover | Focus | Active |
|---|---|---|---|
| InternshipCard | Raised shadow | Ring visible | n/a |
| Apply button | `bg-primary-container` | Ring visible | `translate-y-0.5` |
| Filter checkbox | Check animation | Ring visible | n/a |

---

## Responsive Behaviour

| Breakpoint | Layout |
|---|---|
| Mobile | Filter sidebar collapses into a "Filters" modal trigger button |
| `md:` | Side-by-side: filter sidebar (25%) + results (75%) |
