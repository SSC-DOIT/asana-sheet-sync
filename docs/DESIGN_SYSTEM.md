# Asana Sheet Sync - Design System Documentation

## For Figma: Design Reference & Component Specifications

This document provides complete design specifications for creating high-fidelity mockups of the Asana Sheet Sync dashboard.

---

## Project Overview

**Name**: Asana Ticket Response Analytics Dashboard
**Purpose**: Real-time analytics dashboard for tracking ticket automation effectiveness
**Tech Stack**: React + TypeScript + shadcn/ui + Tailwind CSS
**Design Philosophy**: Clean, modern SaaS dashboard with data-dense visualizations

---

## Color System

### Primary Palette
```css
/* Success/Improvement - Used for positive metrics, automation wins */
--accent: #10b981 (emerald-600)
--accent-hover: #059669 (emerald-700)

/* Warning/Attention */
--warning: #f59e0b (amber-500)

/* Critical/Urgent */
--destructive: #ef4444 (red-500)

/* Primary Action */
--primary: #3b82f6 (blue-500)
--primary-hover: #2563eb (blue-600)

/* Neutral/Muted */
--muted: #6b7280 (gray-500)
--muted-foreground: #9ca3af (gray-400)
```

### Background Layers
```css
/* Light Mode */
--background: #fafafa (gray-50)
--card: #ffffff (white)
--card-border: #e5e7eb (gray-200)
--accent-bg: #f3f4f6 (gray-100)

/* Dark Mode */
--background: #0f172a (slate-900)
--card: #1e293b (slate-800)
--card-border: #334155 (slate-700)
--accent-bg: #334155 (slate-700)
```

### Text Hierarchy
```css
--foreground: #111827 (gray-900) /* Primary text */
--muted-foreground: #6b7280 (gray-500) /* Secondary text */
--accent-foreground: #ffffff /* Text on accent backgrounds */
```

---

## Typography

### Font Families
- **Primary**: Inter (sans-serif)
- **Monospace/Data**: SF Mono or JetBrains Mono

### Type Scale
```
Display/Page Title: 36px / 2.25rem, font-weight: 700 (bold)
Section Heading: 24px / 1.5rem, font-weight: 600 (semibold)
Card Title: 18px / 1.125rem, font-weight: 600 (semibold)
Body Text: 16px / 1rem, font-weight: 400 (regular)
Small Text: 14px / 0.875rem, font-weight: 400 (regular)
Micro Text: 12px / 0.75rem, font-weight: 400 (regular)
Metric Values: 36px / 2.25rem, font-weight: 700 (bold)
```

### Line Height
- Headings: 1.2
- Body: 1.5
- Small: 1.43

---

## Layout & Grid System

### Container
- Max width: 1280px (7xl)
- Padding: 32px (8)
- Centered with `mx-auto`

### Spacing Scale (Tailwind)
```
xs: 4px   (1)
sm: 8px   (2)
md: 16px  (4)
lg: 24px  (6)
xl: 32px  (8)
2xl: 48px (12)
```

### Grid System
- Desktop: 4 columns (metric cards), 2 columns (content cards)
- Tablet: 2 columns
- Mobile: 1 column (stacked)
- Gap: 24px (6)

---

## Component Specifications

### 1. Metric Card (KPI Card)

**Dimensions**: Flexible width, min-height: 128px
**Padding**: 24px (p-6)
**Border Radius**: 8px (rounded-lg)
**Shadow**: Subtle elevation (shadow-sm)

**Layout Structure**:
```
┌─────────────────────────────────────┐
│  LABEL TEXT (12px, muted)           │
│  VALUE (36px, bold, accent)         │
│  TREND/DETAIL (12px, muted)    [🎯] │ ← Icon (20px)
└─────────────────────────────────────┘
```

**States**:
- Default: White background (light) / Dark background (dark mode)
- Hover: Slight elevation increase (shadow-md)

**Icon Treatment**:
- Size: 20px × 20px
- Background: Accent color with 10% opacity
- Padding: 12px
- Border radius: 8px
- Position: Top-right or aligned with value

**Variants**:
1. **With Trend** - Shows percentage change with up/down arrow
2. **Simple** - Just label and value
3. **With Subtitle** - Additional context below value

### 2. Card Container

**Dimensions**: Full width of parent
**Padding**: 24px (p-6)
**Border**: 1px solid border color
**Border Radius**: 12px (rounded-xl)
**Background**: Card background color
**Shadow**: Subtle (shadow-sm)

**Header Pattern**:
```
┌─────────────────────────────────────┐
│  Title (18px, semibold)             │
│  Subtitle (14px, muted)             │
│  ─────────────────────── (divider)  │
│  Content Area                       │
└─────────────────────────────────────┘
```

### 3. Data Table

**Header**:
- Background: Muted background (gray-50 / slate-800)
- Text: 14px, font-weight: 500 (medium)
- Padding: 12px 16px
- Border bottom: 1px solid

**Rows**:
- Height: 48px
- Padding: 12px 16px
- Border bottom: 1px solid
- Hover: Light background tint

**Cells**:
- Alignment: Left (text), Right (numbers)
- Font: 14px regular
- Color: Foreground (primary text)

**States**:
- Default: White background
- Hover: Light gray/slate background
- Striped: Alternating rows optional

### 4. Badge

**Dimensions**: Inline, auto-width
**Padding**: 4px 12px (px-3 py-1)
**Border Radius**: 9999px (rounded-full) or 6px (rounded-md)
**Font**: 12px, font-weight: 500 (medium)

**Variants**:
- **Success**: Green background, white text
- **Warning**: Amber background, dark text
- **Destructive**: Red background, white text
- **Default**: Gray background, dark text
- **Outline**: Transparent background, border

### 5. Button

**Dimensions**: Variable
**Padding**: 8px 16px (small), 12px 24px (default), 16px 32px (large)
**Border Radius**: 6px (rounded-md)
**Font**: 14px, font-weight: 500 (medium)

**Variants**:
- **Default**: Primary color background, white text
- **Outline**: Transparent background, border, foreground text
- **Ghost**: Transparent background, foreground text
- **Destructive**: Red background, white text

**States**:
- Default: Base colors
- Hover: Darker shade (10-20%)
- Active: Even darker shade (20-30%)
- Disabled: 50% opacity, no hover effect

### 6. Input/Search Field

**Dimensions**: Full width or fixed (256px for search)
**Height**: 40px
**Padding**: 8px 16px, 8px 32px (with icon)
**Border**: 1px solid border color
**Border Radius**: 6px (rounded-md)
**Font**: 14px regular

**Icon Position**:
- Left: 8px from edge (search icon)
- Right: Action buttons

**States**:
- Default: Border color
- Focus: Ring (2px, primary color)
- Error: Red border
- Disabled: Muted background, 50% opacity

---

## Page Layouts

### Master Dashboard (Landing Page)

```
┌──────────────────────────────────────────────────────┐
│  [☰] Ticket Response Analytics                       │ ← Header (56px)
├──────────────────────────────────────────────────────┤
│ [SB]  ┌──────────────────────────────────────────┐  │
│  a    │  Master Dashboard                         │  │
│  r    │  Critical Tickets Overview                │  │
│  │    │  ─────────────────────────────────────    │  │
│  d    │  [Table: High Priority Tickets]          │  │
│  b    │  Priority=Highest or Level 11            │  │
│  a    │  (10 rows max)                           │  │
│  r    │                                           │  │
│       │  ─────────────────────────────────────    │  │
│       │  Recent Open Tickets                      │  │
│       │  [Table: 10 Newest Open Tickets]         │  │
│       └──────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### Board Dashboard (TIE/SFDC)

```
┌──────────────────────────────────────────────────────┐
│  [☰] Ticket Response Analytics                       │
├──────────────────────────────────────────────────────┤
│ [SB]  ┌──────────────────────────────────────────┐  │
│  a    │  TIE Board Analytics            [🔄]     │  │
│  r    │  Last updated: 3:24 PM                   │  │
│  │    │                                           │  │
│  d    │  ┌────┐ ┌────┐ ┌────┐ ┌────┐            │  │
│  b    │  │2.3h│ │5.1h│ │2.8h│ │ 47 │ ← KPI Row  │  │
│  a    │  │45%↑│ │Hist│ │Sav │ │Tix │            │  │
│  r    │  └────┘ └────┘ └────┘ └────┘            │  │
│       │                                           │  │
│       │  [Overview][Trends][Automation][...]     │  │ ← Tabs
│       │  ┌─────────────────────────────────────┐ │  │
│       │  │  Tab Content Area                   │ │  │
│       │  │  (Charts, Tables, Cards)            │ │  │
│       │  └─────────────────────────────────────┘ │  │
│       └──────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────┘
```

### Sidebar (Collapsible)

**Expanded State (240px)**:
```
┌──────────────────┐
│  📊 Ticket Dash   │ ← App Title
│  ────────────────│
│  🏠 Master        │ ← Nav Item
│  📈 TIE Board     │ ← Active (blue bg)
│  📊 SFDC Board    │
│  🔀 Comparison    │
└──────────────────┘
```

**Collapsed State (64px)**:
```
┌────┐
│ 📊 │
│────│
│ 🏠 │
│ 📈 │ ← Active
│ 📊 │
│ 🔀 │
└────┘
```

**Active State**:
- Left border: 4px solid primary color
- Background: Light tint of primary (10% opacity)
- Text: Primary color
- Icon: Primary color

---

## New Component: Automation Savings Card

### Layout Structure

**Three-Card Top Row (Per-Ticket Metrics)**:
```
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Avg Time     │ │ Automated    │ │ Total Time   │
│ Saved/Ticket │ │ Tickets      │ │ Saved        │
│              │ │              │ │              │
│  8.5m    [✨]│ │  342     [🤖]│ │  45.7h   [⏰]│
│              │ │  vs 156 man. │ │  5.7 days    │
└──────────────┘ └──────────────┘ └──────────────┘
```

**Response Time Comparison Card**:
```
┌─────────────────────────────────────────────────────┐
│  Response Time Impact                               │
│  Comparing automated vs manual (business hours)     │
│  ───────────────────────────────────────────────── │
│  Automated Avg    Manual Avg    Improvement        │
│     2.3h             5.1h          55%              │
│  (Green)          (Orange)       (Accent)           │
└─────────────────────────────────────────────────────┘
```

**Forecasting Projections Card**:
```
┌─────────────────────────────────────────────────────┐
│  🔺 Time Savings Projections                        │
│  Based on ticket rate: 5.2/day, 36.4/week          │
│  ───────────────────────────────────────────────── │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐    │
│  │ 📅 Current │ │ 📅 Monthly │ │ ⚡ Yearly   │    │
│  │ Month      │ │ Forecast   │ │ Forecast   │    │
│  │            │ │            │ │            │    │
│  │  15.3h     │ │  45.7h     │ │  548.4h    │    │
│  │  1.9 days  │ │  5.7 days  │ │  68.6 days │    │
│  └────────────┘ └────────────┘ └────────────┘    │
└─────────────────────────────────────────────────────┘
```

**Detailed Breakdown Table**:
```
┌─────────────────────────────────────────────────────┐
│  Automation Stage Breakdown                         │
│  Per-ticket time savings by automation rule         │
│  ───────────────────────────────────────────────── │
│  Stage      Tickets  Min/Ticket  Total Min  Total H│
│  R6 Comm.      89        10         890      14.8  │
│  R3 Desc.     112         8         896      14.9  │
│  R5 Valid.     76         6         456       7.6  │
│  R1 Triage    142         5         710      11.8  │
│  R4 Prior.     98         4         392       6.5  │
│  R2 Class.    125         3         375       6.3  │
└─────────────────────────────────────────────────────┘
```

### Color Usage in Automation Card

- **Per-Ticket Metrics**: Accent color (green) for values
- **Response Time - Automated**: Green (#10b981)
- **Response Time - Manual**: Orange (#f59e0b)
- **Response Time - Improvement**: Accent color (green)
- **Projections - Current Month**: Foreground (neutral)
- **Projections - Forecasts**: Accent color (green)
- **Icons**: Matching card colors with 10% opacity backgrounds

---

## Iconography

Using **Lucide React** icon set:

### Dashboard Icons
- `Home` - Master Dashboard
- `BarChart3` - TIE/SFDC Boards
- `ArrowLeftRight` - Comparison
- `Clock` - Response time metrics
- `TrendingDown` - Time savings
- `Ticket` - Ticket counts
- `Bot` - Automation indicators
- `Zap` - Speed/efficiency
- `AlertCircle` - Critical/warnings
- `CheckCircle` - Completed items
- `Calendar` - Date/time periods
- `Sparkles` - Per-ticket savings
- `TrendingUp` - Forecasting
- `RefreshCw` - Refresh button
- `Download` - Export CSV
- `Search` - Search fields

**Icon Sizing**:
- Small: 16px (w-4 h-4)
- Default: 20px (w-5 h-5)
- Large: 24px (w-6 h-6)
- Extra Large: 32px (w-8 h-8)

---

## Interactive States & Animations

### Hover Effects
- **Cards**: Subtle elevation increase (shadow-md)
- **Buttons**: Background darkens 10-20%
- **Table Rows**: Light background tint
- **Links**: Underline appears

### Loading States
- **Skeleton Screens**: Shimmer effect on placeholder shapes
- **Spinners**: Rotating icon (RefreshCw with animate-spin)
- **Progressive Loading**: Fade-in animation

### Transitions
- **Duration**: 150ms (fast), 300ms (default)
- **Easing**: ease-in-out
- **Properties**: background-color, border-color, opacity, transform

---

## Responsive Breakpoints

```css
/* Mobile First */
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large desktops */
```

### Responsive Patterns

**KPI Cards**:
- Mobile: 1 column (full width)
- Tablet: 2 columns
- Desktop: 4 columns

**Content Cards**:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 2 columns (wider) or 1 column (full-width)

**Tables**:
- Mobile: Horizontal scroll with sticky first column
- Tablet: Full table visible
- Desktop: Full table with comfortable spacing

**Sidebar**:
- Mobile: Drawer (overlay)
- Tablet: Auto-collapse to icons (64px)
- Desktop: Expanded (240px)

---

## Accessibility Specifications

### Contrast Ratios
- Normal text: Minimum 4.5:1
- Large text (18px+): Minimum 3:1
- Interactive elements: Minimum 3:1

### Focus States
- Visible outline: 2px solid ring, primary color
- Offset: 2px from element
- Never remove `:focus` styles

### Touch Targets
- Minimum size: 44px × 44px on mobile
- Spacing between targets: 8px minimum

### Screen Reader Support
- All icons have aria-labels
- Tables have proper th/td structure
- Form inputs have associated labels
- Loading states announce to screen readers

---

## Data Visualization Principles

### Number Formatting
- **Hours**: `5.7h` (under 24), `2.3d` (over 24)
- **Minutes**: `45m`
- **Percentages**: `55%` or `55.5%` (one decimal max)
- **Large Numbers**: `1,234` (with commas)

### Chart Colors
- **Primary Series**: Accent color (#10b981)
- **Secondary Series**: Primary color (#3b82f6)
- **Comparison**: Orange (#f59e0b)
- **Neutral**: Gray (#6b7280)

### Trend Indicators
- **Up (Positive)**: Green arrow ↑
- **Down (Negative)**: Red arrow ↓
- **Neutral**: Gray dash –

---

## Component File References

For implementation details, refer to:
- `/src/components/AutomationSavingsCard.tsx` - Full automation analytics UI
- `/src/components/MetricCard.tsx` - KPI card component
- `/src/components/BoardDashboard.tsx` - Main dashboard layout
- `/src/components/ui/` - Base shadcn/ui components

---

## Design System Dependencies

- **Component Library**: shadcn/ui (Radix UI primitives)
- **Styling**: Tailwind CSS 3.4+
- **Icons**: Lucide React
- **Charts**: Recharts (for line/bar charts)
- **Fonts**: Inter (primary), SF Mono (monospace)

---

## Notes for Designers

1. **Consistency**: Use the defined spacing scale consistently
2. **Hierarchy**: Maintain clear visual hierarchy with size and weight
3. **Color Purpose**: Each color has meaning (green=good, red=bad, blue=action)
4. **Mobile First**: Design mobile layouts first, then scale up
5. **Data Density**: Pack information efficiently without clutter
6. **Accessibility**: Always check contrast and touch target sizes
7. **Real Data**: Use realistic data in mockups (not lorem ipsum)

---

Last Updated: 2025-10-28
