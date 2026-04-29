# Styling Agent — Project Polaris

This file is the **single source of truth for all visual implementation rules** in Project Polaris. Every agent that writes or modifies UI code must read this file and comply with every rule here. Deviation from these rules is a review-blocking failure.

**Dependencies:** Read [`agent.md`](./agent.md) before this file. The design system is defined in [`Design/stellar_academic/DESIGN.md`](./Design/stellar_academic/DESIGN.md). The Tailwind v4 `@theme` block lives in `src/index.css`.

**Output artefact:** N/A — this is a reference document, not a protocol that produces a file.

---

## Design Token Map

All tokens are defined in `src/index.css` under `@theme`. Use the Tailwind utility class names shown in the right column — never hard-code the raw hex/rem value.

### Colour Tokens

| Token Name | Raw Value | Tailwind Class (bg / text / border) |
|---|---|---|
| `primary` | `#1f108e` | `bg-primary` / `text-primary` / `border-primary` |
| `primary-container` | `#3730a3` | `bg-primary-container` |
| `on-primary` | `#ffffff` | `text-on-primary` |
| `on-primary-container` | `#a9a7ff` | `text-on-primary-container` |
| `secondary` | `#006a61` | `bg-secondary` / `text-secondary` |
| `secondary-container` | `#86f2e4` | `bg-secondary-container` |
| `on-secondary` | `#ffffff` | `text-on-secondary` |
| `on-secondary-container` | `#006f66` | `text-on-secondary-container` |
| `tertiary` | `#4f1e00` | `bg-tertiary` / `text-tertiary` |
| `tertiary-container` | `#722f00` | `bg-tertiary-container` |
| `on-tertiary` | `#ffffff` | `text-on-tertiary` |
| `background` | `#f8f9ff` | `bg-background` |
| `on-background` | `#0b1c30` | `text-on-background` |
| `surface` | `#f8f9ff` | `bg-surface` |
| `on-surface` | `#0b1c30` | `text-on-surface` |
| `on-surface-variant` | `#464553` | `text-on-surface-variant` |
| `surface-container-lowest` | `#ffffff` | `bg-surface-container-lowest` |
| `surface-container-low` | `#eff4ff` | `bg-surface-container-low` |
| `surface-container` | `#e5eeff` | `bg-surface-container` |
| `surface-container-high` | `#dce9ff` | `bg-surface-container-high` |
| `surface-container-highest` | `#d3e4fe` | `bg-surface-container-highest` |
| `outline` | `#777584` | `border-outline` / `text-outline` |
| `outline-variant` | `#c8c4d5` | `border-outline-variant` |
| `error` | `#ba1a1a` | `bg-error` / `text-error` |
| `on-error` | `#ffffff` | `text-on-error` |

### Typography Tokens

| Token | Tailwind Class | Usage |
|---|---|---|
| Plus Jakarta Sans | `font-jakarta` | All headings (`h1`–`h6`), buttons, labels, navigation |
| Lexend | `font-lexend` | Body copy, form inputs, descriptions |

**Type Scale (approximated in Tailwind utilities):**

| Role | Size | Weight | Class Combination |
|---|---|---|---|
| H1 | 40px | 700 | `text-4xl font-jakarta font-bold tracking-tight` |
| H2 | 32px | 700 | `text-3xl font-jakarta font-bold` |
| H3 | 24px | 600 | `text-2xl font-jakarta font-semibold` |
| Body LG | 18px | 400 | `text-lg font-lexend` |
| Body MD | 16px | 400 | `text-base font-lexend` |
| Body SM | 14px | 400 | `text-sm font-lexend` |
| Label | 14px | 600 | `text-sm font-jakarta font-semibold tracking-widest uppercase` |
| Button | 16px | 600 | `text-base font-jakarta font-semibold` |

### Spacing Tokens

| Token | Raw Value | CSS Variable | Usage |
|---|---|---|---|
| `polaris-base` | 8px | `--spacing-polaris-base` | Micro gaps (between icon and label) |
| `polaris-sm` | 12px | `--spacing-polaris-sm` | Internal component padding |
| `polaris-md` | 24px | `--spacing-polaris-md` | Section padding, card padding |
| `polaris-lg` | 40px | `--spacing-polaris-lg` | Between major sections |
| `polaris-xl` | 64px | `--spacing-polaris-xl` | Page-level top/bottom margins |
| `polaris-gutter` | 24px | `--spacing-polaris-gutter` | Column gutters in grid layouts |

Use `p-[--spacing-polaris-md]` syntax for the Polaris tokens when Tailwind has no direct alias. For standard Tailwind spacing (multiples of 4px), `p-4`, `p-6`, `p-8` etc. are acceptable equivalents.

### Border Radius Tokens

| Token | Raw Value | Tailwind Class | Usage |
|---|---|---|---|
| `radius-lg` | 0.5rem (8px) | `rounded-lg` | Buttons, inputs, chips, small cards |
| `radius-xl` | 0.75rem (12px) | `rounded-xl` | Large cards, modals, containers |
| `full` | 9999px | `rounded-full` | Avatar images, pill badges |

> **Never** use arbitrary radius values like `rounded-[10px]`.

### Shadow Tokens

All shadows use a soft indigo tint. Use `style` prop only for shadows (one of the few acceptable uses of inline styles).

| Level | Value | Use Case |
|---|---|---|
| Ambient (default) | `0 2px 8px rgba(55,48,163,0.06)` | Cards, inputs (resting) |
| Raised | `0 4px 16px rgba(55,48,163,0.10)` | Cards on hover, dropdowns |
| Floating | `0 8px 32px rgba(55,48,163,0.14)` | Modals, sidebars, toasts |

---

## Component-Level Styling Rules

### Buttons

```
Primary:   bg-primary text-on-primary rounded-lg px-6 py-3 font-jakarta font-semibold
           hover:bg-primary-container active:translate-y-0.5
           transition-all duration-150
           shadow: 0 2px 4px rgba(55,48,163,0.20)

Secondary: bg-secondary text-on-secondary rounded-lg px-6 py-3 font-jakarta font-semibold
           hover:opacity-90 active:translate-y-0.5
           transition-all duration-150

Outline:   border border-outline text-on-surface bg-transparent rounded-lg px-6 py-3
           hover:bg-surface-container focus-visible:ring-2 focus-visible:ring-secondary

Ghost:     text-primary bg-transparent rounded-lg px-4 py-2
           hover:bg-surface-container-low

Disabled:  opacity-50 cursor-not-allowed pointer-events-none
```

### Inputs

```
Base:      w-full bg-surface-container-low border border-outline-variant rounded-lg
           px-4 py-3 text-base font-lexend text-on-surface
           placeholder:text-outline
           focus:outline-none focus:border-secondary focus:ring-2 focus:ring-secondary/20
           transition-colors duration-150

Error:     border-error focus:border-error focus:ring-error/20
           + error message: text-sm text-error mt-1 font-lexend
```

### Cards

```
Base:      bg-surface-container-lowest rounded-xl p-6
           shadow: 0 2px 8px rgba(55,48,163,0.06)
           border border-outline-variant/40

Hover:     shadow: 0 4px 16px rgba(55,48,163,0.10)
           transition-shadow duration-200
```

### Badges / Chips

```
Default:   bg-surface-container text-on-surface-variant rounded-full px-3 py-1
           text-xs font-jakarta font-semibold

Primary:   bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-jakarta font-semibold
Secondary: bg-secondary/10 text-secondary rounded-full px-3 py-1 text-xs font-jakarta font-semibold
Error:     bg-error/10 text-error rounded-full px-3 py-1 text-xs font-jakarta font-semibold
```

### Navigation Items (Sidebar)

```
Resting:   flex items-center gap-3 px-4 py-3 rounded-lg text-on-surface-variant
           hover:bg-surface-container hover:text-on-surface transition-colors duration-150

Active:    bg-primary-container text-on-primary-container font-semibold
```

### Modals

```
Overlay:   fixed inset-0 bg-on-background/40 backdrop-blur-sm z-50 flex items-center justify-center

Container: bg-surface-container-lowest rounded-xl p-8 w-full max-w-lg
           shadow: 0 8px 32px rgba(55,48,163,0.14)
```

### Glassmorphic Surfaces (Sidebar, Floating Navbar)

```
backdrop-blur-[16px] bg-surface-container-lowest/80
border border-white/20
shadow: 0 8px 32px rgba(55,48,163,0.10)
```

---

## Do / Don't Examples

| ❌ Don't | ✅ Do |
|---|---|
| `className="text-gray-500"` | `className="text-on-surface-variant"` |
| `className="bg-indigo-900"` | `className="bg-primary"` |
| `style={{ color: '#0b1c30' }}` | `className="text-on-background"` |
| `className="rounded-[10px]"` | `className="rounded-lg"` |
| `className="shadow-md"` | `style={{ boxShadow: '0 2px 8px rgba(55,48,163,0.06)' }}` |
| `className="font-sans"` | `className="font-lexend"` or `className="font-jakarta"` |
| `className="text-blue-700"` | `className="text-primary"` |

---

## Responsive Breakpoints

The project uses **mobile-first** responsive design. Always write base styles for mobile, then override at larger breakpoints.

| Breakpoint | Tailwind Prefix | Min Width | Typical Usage |
|---|---|---|---|
| Mobile | (none) | 0px | Single-column stacked layouts |
| Small | `sm:` | 640px | Two-column grids, larger inputs |
| Medium | `md:` | 768px | Sidebar appears, content shifts |
| Large | `lg:` | 1024px | Full desktop layout, multi-column |

**Sidebar rule:** The sidebar is hidden on mobile (`hidden`) and shown on `md:` and above (`md:block`). A hamburger menu handles mobile navigation.

---

## Dark Mode Strategy

<!-- ASSUMPTION: Dark mode is not in the current requirements. The design system uses a light palette only. If dark mode is added in future, the strategy should be CSS variable swap via a `data-theme="dark"` attribute on `<html>`, toggling to an inverse palette. -->

Dark mode is **not currently implemented**. Do not add `dark:` variants unless explicitly approved.

---

## Animation & Transition Conventions

| Situation | Classes |
|---|---|
| Colour/background transitions | `transition-colors duration-150` |
| Shadow transitions (card hover) | `transition-shadow duration-200` |
| All-property transitions (button) | `transition-all duration-150` |
| Button press feedback | `active:translate-y-0.5` |
| List item hover (scale) | `hover:scale-[1.02] transition-transform duration-150` |
| Checkbox pop animation | Custom keyframe — defined in `src/index.css` if used |

**No custom keyframes** should be introduced without adding them to `src/index.css` and documenting them here.
