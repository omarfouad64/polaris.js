# Design: Employer Dashboard

**Page:** Employer Dashboard
**Related Requirements:** Req 71
**Design System:** [stellar_academic/DESIGN.md](../stellar_academic/DESIGN.md)

---

## Layout

Portal layout wraps this page. No tabs — single scrollable dashboard.

```
┌──────────────────────────────────────────────────────────┐
│ SIDEBAR │  HEADER: "Dashboard"  Greeting: "[Company]"    │
│         │───────────────────────────────────────────── │
│         │  ┌────────────────┐  ┌────────────────────┐   │
│         │  │   StatsCard    │  │     StatsCard       │   │
│         │  │ Internships    │  │  Students Placed    │   │
│         │  │   Offered: 12  │  │   Total: 34         │   │
│         │  └────────────────┘  └────────────────────┘   │
│         │  ┌──────────────────────────────────────────┐  │
│         │  │  Placements Over Time (Bar / Line chart)  │  │
│         │  │  X-axis: Month/Year  Y-axis: Students     │  │
│         │  └──────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

---

## States

### Default
- Two stat cards populated from dummy data.
- Chart showing placement history over time.

### Empty State (new employer, no internships yet)
- Stat cards show "0".
- Chart: placeholder card with "Post your first internship to start tracking placements."

---

## Components

### StatsCard
- Large metric: `text-4xl font-jakarta font-bold text-primary`.
- Label: `font-lexend text-on-surface-variant text-base`.
- Icon on top-right: relevant Material Symbol (`work` for internships, `people` for placements).
- Card: `rounded-xl bg-surface-container-lowest` with ambient shadow.

### PlacementOverTimeChart
- Chart type: Bar chart or Line chart (CSS/SVG-based; no external library unless added).
- X-axis: months (last 12).
- Y-axis: number of students placed.
- Bar colour: `secondary` for placements, `primary` for internships offered (if overlaid).
- Card: `rounded-xl bg-surface-container-lowest` with ambient shadow, `p-6`.

---

## Interaction States

| Element | Hover |
|---|---|
| StatsCard | Raised shadow |
| Chart bar | Tooltip showing exact count and month |

---

## Responsive Behaviour

| Breakpoint | Layout |
|---|---|
| Mobile | Cards stacked vertically; chart full-width |
| `md:` | Cards side-by-side (50/50); chart below |
