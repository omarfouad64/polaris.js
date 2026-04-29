# Design: Applicant Review

**Page:** Applicant Review
**Related Requirements:** Req 75, 76, 86, 87, 88
**Design System:** [stellar_academic/DESIGN.md](../stellar_academic/DESIGN.md)

---

## Layout

Portal layout wraps this page. Two tabs: "Candidates" and "Suggested Matches".

```
┌─────────────────────────────────────────────────────────┐
│ SIDEBAR │  HEADER: "[Internship Title] — Applicants"    │
│         │  Breadcrumb: Internship Management > [Title]  │
│         │  Tabs: [Candidates]  [Suggested Matches]      │
│         │─────────────────────────────────────────────  │
│         │  TAB: Candidates                              │
│         │  [Sort: Top Contributors toggle]              │
│         │  ┌────────────────────────────────────────┐   │
│         │  │ ApplicantCard                          │   │
│         │  │ [Avatar] Name + Email  [View Portfolio] │   │
│         │  │ Status: [Nominated ▼] [Accept] [Reject] │   │
│         │  │ Cover Letter preview (collapsed)       │   │
│         │  └────────────────────────────────────────┘   │
│         │  TAB: Suggested Matches                       │
│         │  (Same ApplicantCard list, pre-filtered)      │
└─────────────────────────────────────────────────────────┘
```

---

## States

### Candidates Tab — default
- List of `ApplicantCard` rows for all students who applied.
- "Sort by Top Contributors" toggle button (chip toggle, top-right).
- Empty state: "No applications yet."

### Suggested Matches Tab
- Pre-filtered list of top suggested applicants based on employer's favorites list (Req 76).
- Empty state: "No suggestions available yet. Save student portfolios to your favorites to receive suggestions."

---

## Components

### ApplicantCard
- Left: student avatar (`rounded-full w-12 h-12 bg-primary-container`), name (`font-jakarta font-semibold`), email (`text-sm font-lexend text-on-surface-variant`).
- Right: "View Portfolio" ghost button linking to Portfolio Detail View.
- Status row: `StatusSelector` dropdown — Nominated (`bg-primary/10 text-primary`), Accepted (`bg-secondary/10 text-secondary`), Rejected (`bg-error/10 text-error`).
- Collapsible cover letter section (click to expand): `bg-surface-container-low rounded-xl p-4`.

### StatusSelector
- Styled as a pill-shaped dropdown.
- Three states: Nominated / Accepted / Rejected.
- Colour-coded as described above.
- Quick-action buttons: green "Accept" icon button, red "Reject" icon button (appear on row hover for creator convenience).

### Sort Toggle
- Chip button: "Sort by Top Contributors" — when active: `bg-primary text-on-primary`; when inactive: `bg-surface-container text-on-surface-variant`.

---

## Interaction States

| Element | Hover | Focus | Active |
|---|---|---|---|
| ApplicantCard | `bg-surface-container-low` | n/a | n/a |
| StatusSelector | `bg-surface-container` | Ring visible | n/a |
| Accept/Reject icon btn | Scale `1.05`, colour shift | Ring visible | `translate-y-0.5` |
| View Portfolio btn | `text-primary underline` | Ring visible | n/a |
