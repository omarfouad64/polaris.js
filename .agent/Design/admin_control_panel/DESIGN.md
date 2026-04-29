# Design: Admin Control Panel

**Page:** Admin Control Panel
**Related Requirements:** Req 73
**Design System:** [stellar_academic/DESIGN.md](../stellar_academic/DESIGN.md)

---

## Layout

Portal layout wraps this page. Five tabs in the top navigation: Stats, Verification, User Management, Courses, Moderation.

```
┌────────────────────────────────────────────────────────────┐
│ SIDEBAR │  HEADER: "Control Panel"                         │
│         │  Tabs: [Stats][Verification][Users][Courses][Mod] │
│         │────────────────────────────────────────────────  │
│         │  TAB: Stats                                      │
│         │  ┌──────────┐ ┌──────────┐ ┌──────────────────┐ │
│         │  │ StatsCard │ │ StatsCard │ │    StatsCard     │ │
│         │  │  Users   │ │ Projects  │ │    Courses        │ │
│         │  └──────────┘ └──────────┘ └──────────────────┘ │
│         │  ┌──────────────────────────────────────────────┐ │
│         │  │  Users by Role breakdown (stacked bar/donut) │ │
│         │  └──────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

Each of the other tabs (Verification, User Management, Courses, Moderation) renders its own sub-page component within the tab area — these are designed in their respective design files:
- Verification → [employer_verification/DESIGN.md](../employer_verification/DESIGN.md)
- User Management → [user_directory/code.html](../user_directory/code.html)
- Courses → [course_directory/DESIGN.md](../course_directory/DESIGN.md)
- Moderation → [content_moderation/DESIGN.md](../content_moderation/DESIGN.md)

---

## Stats Tab Components

### StatsCard (×3)
- "Total Users": number (`text-4xl font-jakarta font-bold text-primary`) + "across all roles" sub-label.
- "Total Projects": number in `text-secondary`.
- "Total Courses": number in `text-tertiary`.
- Card: `rounded-xl bg-surface-container-lowest` with ambient shadow, icon in top-right.

### UserGrowthChart
- Stacked bar chart or donut chart showing user count broken down by role (Students, Instructors, Employers, Admins).
- Role colours: Students = `primary`, Instructors = `secondary`, Employers = `tertiary`, Admins = `outline`.
- Card: `rounded-xl bg-surface-container-lowest` with ambient shadow, `p-6`.

---

## Responsive Behaviour

| Breakpoint | Layout |
|---|---|
| Mobile | Stats stacked vertically |
| `md:` | 3-column stats row |
| `lg:` | Stats row + chart side by side (or below) |
