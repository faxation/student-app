# Design System — Student App

## Color Tokens

### Brand (Primary)
| Token | Hex | Usage |
|-------|-----|-------|
| `brand-50` | `#e6f5f1` | Subtle backgrounds, hover states |
| `brand-100` | `#b3e0d4` | Badge backgrounds, selection |
| `brand-500` | `#00896a` | Primary buttons, active states, links |
| `brand-600` | `#007b5f` | Button hover |
| `brand-700` | `#006a52` | Dark accents |
| `brand-900` | `#003d2f` | Maximum contrast on brand |

### Surface (Neutrals)
| Token | Hex | Usage |
|-------|-----|-------|
| `surface-50` | `#fafbfc` | Page background |
| `surface-100` | `#f4f6f8` | Hover backgrounds, secondary surfaces |
| `surface-200` | `#e9ecf0` | Borders, dividers |
| `surface-300` | `#d3d8e0` | Input borders |
| `surface-400` | `#b0b8c4` | Disabled states |

### Ink (Text)
| Token | Hex | Usage |
|-------|-----|-------|
| `ink-900` | `#1a1d23` | Headings, primary text |
| `ink-700` | `#3d424d` | Labels |
| `ink-600` | `#545b69` | Body text |
| `ink-500` | `#6b7280` | Secondary text |
| `ink-400` | `#9ca3af` | Placeholder, tertiary |
| `ink-300` | `#d1d5db` | Disabled text |

### Accent (Semantic)
| Token | Hex | Usage |
|-------|-----|-------|
| `accent-amber` | `#f59e0b` | Warnings, pending states |
| `accent-red` | `#ef4444` | Errors, late states, urgent |
| `accent-blue` | `#3b82f6` | Info, online indicators |
| `accent-emerald` | `#10b981` | Success, submitted states |

## Typography

### Font Families
- **Headings**: `Playfair Display` (serif) — elegant, academic feel
- **Body / UI**: `Inter` (sans-serif) — clean, highly legible

### Scale
| Element | Font | Size | Weight |
|---------|------|------|--------|
| Page title | Playfair Display | `text-xl` (20px) | Semibold (600) |
| Card title | Playfair Display | `text-lg` (18px) | Semibold (600) |
| Section heading | Inter | `text-sm` (14px) | Medium (500), uppercase, tracking-wide |
| Body text | Inter | `text-sm` (14px) | Regular (400) |
| Small text | Inter | `text-xs` (12px) | Regular (400) |
| Badge | Inter | `text-xs` (12px) | Medium (500) |

## Spacing Scale

Based on Tailwind defaults with semantic additions:

| Token | Value | Usage |
|-------|-------|-------|
| `1` | 4px | Tight gaps (badge padding) |
| `2` | 8px | Inline spacing |
| `3` | 12px | Card internal gaps |
| `4` | 16px | Card padding (compact) |
| `6` | 24px | Card padding (standard) |
| `8` | 32px | Page padding, section gaps |
| `sidebar` | 72px | Collapsed sidebar width |
| `sidebar-expanded` | 256px | Expanded sidebar width |

## Card System

### Base Card
```
rounded-card (12px)
border: 1px solid surface-200
background: white
padding: 24px (p-6)
shadow: card (0 1px 3px rgba(0,0,0,0.04))
```

### Card with Hover
```
+ shadow-card-hover on hover (0 4px 6px rgba(0,0,0,0.06))
+ transition-shadow duration-200
```

### Card Header
- Title: Playfair Display, text-lg, semibold, ink-900
- Subtitle: Inter, text-sm, ink-500
- Optional action slot (right-aligned)

## Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `shadow-card` | `0 1px 3px rgba(0,0,0,0.04)` | Default card elevation |
| `shadow-card-hover` | `0 4px 6px rgba(0,0,0,0.06)` | Hover state |
| `shadow-sidebar` | `4px 0 12px rgba(0,0,0,0.05)` | Sidebar elevation |

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `rounded-lg` | 8px | Buttons, inputs, badges |
| `rounded-card` | 12px | Cards |
| `rounded-xl` | 12px | Brand icon containers |
| `rounded-2xl` | 16px | Large decorative containers |
| `rounded-full` | 9999px | Avatars, dot indicators |

## Borders

- Default: `1px solid surface-200`
- Input focus: `1px solid brand-500` + `ring-2 ring-brand-500/20`
- Dividers: `border-t border-surface-200` or `divide-y divide-surface-100`

## Interaction States

### Buttons
- **Primary**: `bg-brand-500 → hover:bg-brand-600`, white text
- **Disabled**: `opacity-60 cursor-not-allowed`
- **Focus**: `ring-2 ring-brand-500/30 ring-offset-2`

### Cards
- **Default**: `shadow-card`
- **Hover** (when interactive): `shadow-card-hover`
- **Transition**: `duration-200`

### Sidebar Items
- **Default**: `text-ink-600`, icon `text-ink-400`
- **Hover**: `bg-surface-100 text-ink-900`, icon `text-ink-700`
- **Active**: `bg-brand-50 text-brand-600`, icon `text-brand-500`

### Inputs
- **Default**: `border-surface-300`
- **Focus**: `border-brand-500 ring-2 ring-brand-500/20`
- **Placeholder**: `text-ink-400`

## Sidebar Behavior

| State | Width | Content |
|-------|-------|---------|
| Collapsed (default) | 72px | Icons only |
| Expanded (on hover) | 256px | Icons + labels |

- Transition: 250ms ease `[0.4, 0, 0.2, 1]`
- Labels fade in with slight delay (80ms)
- Brand text fades in with 100ms delay
- Shadow appears on expand: `shadow-sidebar`

## Page Layout Patterns

### Standard Page
```
<Header /> — fixed height 64px, border-bottom
<div className="p-8"> — page content with 32px padding
  <StatCards /> — grid of 2-4 stat cards
  <ContentCards /> — grid of content cards
</div>
```

### Grid Classes
- `.page-grid-2` — 2-column on lg+
- `.page-grid-3` — 2-column on md+, 3-column on lg+
- `.page-grid-4` — 2-column on sm+, 4-column on lg+
- Gap: 24px (gap-6)

## Badge Variants

| Variant | Background | Text |
|---------|-----------|------|
| `default` | surface-100 | ink-700 |
| `success` | emerald-50 | emerald-700 |
| `warning` | amber-50 | amber-700 |
| `danger` | red-50 | red-700 |
| `info` | blue-50 | blue-700 |
| `brand` | brand-50 | brand-700 |
