# Design: Employer Verification

**Page:** Employer Verification
**Related Requirements:** Req 14, 15, 16, 17, 18
**Design System:** [stellar_academic/DESIGN.md](../stellar_academic/DESIGN.md)

---

## Layout

Rendered as a tab within the Admin Control Panel. Three sub-tabs: Pending, Approved, Rejected.

```
┌─────────────────────────────────────────────────────────────┐
│  Sub-tabs: [Pending (3)]  [Approved]  [Rejected]            │
│────────────────────────────────────────────────────────────  │
│  TAB: Pending                                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ EmployerApplicationCard                             │   │
│  │ [Logo] Company Name + Email  Applied: [date]        │   │
│  │ [View Details]  [Accept btn]  [Reject btn]          │   │
│  └─────────────────────────────────────────────────────┘   │
│  DETAIL PANEL (slides in or modal):                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Company bio, address, contact info                  │   │
│  │  Uploaded Documents:                                 │   │
│  │  [Tax Certificate PDF]  [View]  [Download]          │   │
│  │  [Accept Company btn]  [Reject Company btn]         │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## States

### Pending Tab
- List of employer applications awaiting review.
- Count badge on the "Pending" sub-tab label.
- Empty: "No pending applications."

### Approved / Rejected Tabs
- Historical records of approved / rejected companies.
- Read-only — no action buttons.

### Detail Panel
- Opens on "View Details" click.
- Can be a slide-over panel (right side) or a modal.
- Shows all company info (Req 15) + document viewer (Req 16) + download button (Req 17).
- Accept / Reject action buttons at the bottom (Req 18).

---

## Components

### EmployerApplicationList
- Card list, each card: company logo avatar + name + email + application date + action buttons.
- Card: `rounded-xl bg-surface-container-lowest` with ambient shadow.

### DocumentViewer
- Embedded PDF viewer (or link that opens in a new tab if embedding is not feasible).
- `bg-surface-container rounded-xl p-4`.
- Download icon button: `download` Material Symbol, ghost variant.

### VerificationActions
- "Accept" button: primary / `bg-secondary text-on-secondary`.
- "Reject" button: outline / `border-error text-error hover:bg-error/10`.
- Confirmation dialog before final action: "Are you sure you want to [accept/reject] [Company Name]?"

---

## Interaction States

| Element | Hover | Focus | Active |
|---|---|---|---|
| Application card | Raised shadow | n/a | n/a |
| Accept btn | `bg-secondary/90` | Ring visible | `translate-y-0.5` |
| Reject btn | `border-error bg-error/5` | Ring visible | `translate-y-0.5` |
| View/Download btn | `text-primary` | Ring visible | n/a |
