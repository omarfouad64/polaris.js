# Design: My Favorites

**Page:** My Favorites
**Related Requirements:** Req 65, 66
**Design System:** [stellar_academic/DESIGN.md](../stellar_academic/DESIGN.md)

---

## Layout

Portal layout wraps this page. Two tabs: "Projects" and "Portfolios".

```
┌──────────────────────────────────────────────────────────────┐
│ SIDEBAR │  HEADER: "My Favorites"                            │
│         │  Tabs: [Projects (N)]  [Portfolios (M)]            │
│         │──────────────────────────────────────────────────  │
│         │  TAB: Projects                                    │
│         │  ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│         │  │ProjectCard│ │ProjectCard│ │ProjectCard│         │
│         │  │ [♥ Remove]│ │ [♥ Remove]│ │ [♥ Remove]│        │
│         │  └──────────┘ └──────────┘ └──────────┘          │
│         │  — Empty state —                                  │
│         │                                                   │
│         │  TAB: Portfolios                                  │
│         │  ┌──────────────┐ ┌──────────────┐               │
│         │  │PortfolioCard │ │PortfolioCard │               │
│         │  │ [♥ Remove]   │ │ [♥ Remove]   │               │
│         │  └──────────────┘ └──────────────┘               │
└──────────────────────────────────────────────────────────────┘
```

---

## States

### Projects Tab — has favorites
- Grid of `ProjectCard` components with an added "Remove from Favorites" icon button (unfill `favorite` → `favorite_border`).

### Projects Tab — empty
- Icon: `favorite_border` in `surface-container` circle.
- Heading: "No favorite projects yet."
- Body: "Browse projects and tap the ♥ to save them here."
- "Explore Projects" link button → `/portal/[role]/project-explorer`.

### Portfolios Tab — has favorites
- Grid of `PortfolioCard` components with "Remove from Favorites" button.

### Portfolios Tab — empty
- Similar empty state to Projects with "Explore Portfolios" link.

---

## Components

### ProjectCardGrid
- Responsive grid: 1 col mobile, 2 col `md:`, 3 col `lg:`.
- Each cell: existing `ProjectCard` component + `FavoriteButton` overlay (top-right of card, heart icon, filled red).

### PortfolioCardGrid
- Responsive grid: 1 col mobile, 2 col `md:`, 3 col `lg:`.
- Each cell: `PortfolioCard` — student avatar, name, major chip, project count badge.
- `FavoriteButton` overlay (top-right, heart icon, filled red).

### PortfolioCard (if not globally defined)
- `rounded-xl bg-surface-container-lowest` with ambient shadow.
- Avatar + name (`font-jakarta font-semibold`) + major chip + "N Projects" badge.
- Full card clickable → Portfolio Detail View.

### FavoriteButton (remove mode)
- Filled heart icon (`favorite`, `icon-fill`) in `text-error`.
- On click: confirm removal (snackbar undo toast) → removes from favorites list.

---

## Interaction States

| Element | Hover | Focus | Active |
|---|---|---|---|
| ProjectCard | Raised shadow, `scale-[1.01]` | Ring visible | n/a |
| PortfolioCard | Raised shadow, `scale-[1.01]` | Ring visible | n/a |
| Remove btn | `scale-110 text-error/80` | Ring visible | `scale-90` |

---

## Responsive Behaviour

| Breakpoint | Columns |
|---|---|
| Mobile | 1 |
| `md:` | 2 |
| `lg:` | 3 |
