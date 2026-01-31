# 🎨 DESIGN SYSTEM VISUAL REFERENCE

## Academic Tracker - One-Page Design Spec

---

## BRAND FOUNDATION

### Color Palette

```
Environment:  Blue Gradient (from-blue-600 via-gray-900 to-blue-700)
Surface:      Dark Glass (bg-gray-900/40 backdrop-blur-xl)
Text Primary: White (text-white)
Border:       Subtle White (border-white/10)
Glow:         Brand Blue (shadow-blue-500/5 → shadow-blue-500/15)
```

### Semantic Status Colors

```
✓ Excellent (80%+)    → text-emerald-300/400
✓ Good (60-79%)       → text-blue-300/400
⚠ Needs Work (40-59%) → text-amber-300/400
✗ Alert (0-39%)       → text-red-300/400
→ Neutral/Unset       → text-white/50
```

---

## TYPOGRAPHY SCALE

```
Page Title      text-2xl  font-bold        tracking-tight
Section Header  text-lg   font-semibold    tracking-wider
Card Title      text-base font-semibold    tracking-tight
Body Text       text-sm   font-normal      (no tracking)
Label/Caption   text-xs   font-normal      text-white/50
```

### Text Hierarchy by Opacity

```
text-white       (100%) → Headings, critical data
text-white/70    (70%)  → Body text, secondary UI
text-white/50    (50%)  → Labels, captions, metadata
text-white/40    (40%)  → Disabled, tertiary info
text-white/10    (10%)  → Borders, very subtle
```

---

## COMPONENT ANATOMY

### Subject Card (Collapsed)

```
┌─────────────────────────────────┐
│ Subject Name      [Percentage]  │ ← Header (scannable)
│ Grade Badge  Trend Arrow        │ ← Status (at a glance)
│ ═════════════════════════════   │ ← Progress Bar (animated)
│ [Save] [Expand]                 │ ← Actions (clear affordance)
└─────────────────────────────────┘

Percentage Color: Semantic (emerald/blue/amber/red)
Trend Arrow:     ↑ green = improving, ↓ red = declining
Progress Bar:    Full width, animated on update
Border:          border-white/10, rounded-2xl
Shadow:          shadow-blue-500/5 base, hover: shadow-blue-500/15
```

### Dashboard Tile

```
┌──────────────────┐
│ LABEL (xs)       │
│                  │
│ 78.5%  [ICON]    │ ← Large number + icon for quick glance
│                  │
└──────────────────┘

Text Color:     text-white for label, text-white/70 for number
Icon BG:        bg-white/10 rounded-xl
Border:         border-white/10
Shadow:         shadow-lg shadow-blue-500/5
Gap:            gap-4 (compact, scannable)
```

### Modal (Report)

```
Header (Sticky)
├─ Title (text-2xl font-semibold)
├─ Close Button (X, top-right, always visible)
└─ [Print] button

Body (Scrollable)
├─ Stats Cards (4 columns, semantic colors)
├─ Subject Table (rows with hover: bg-white/5)
├─ Charts (dark theme, blue bars)
└─ Insights (text-white/70)

Background:     bg-gray-900/80 backdrop-blur-xl
Border:         border-white/10, rounded-2xl
Shadow:         shadow-2xl shadow-blue-500/20
Close:          X button (always visible), Escape key works
```

### Progress Bar

```
Container:  h-1.5 w-full rounded-full bg-white/10 overflow-hidden
Fill:       h-full rounded-full bg-emerald-400 (color by status)
Animation:  width 0 → 100% with spring(stiffness: 200, damping: 24)
```

---

## SPACING SYSTEM

```
Gap Compact:     gap-4   (16px) - Cards in grid, tight layouts
Gap Breathing:   gap-6   (24px) - Sections, breathing room
Padding Cards:   p-5     (20px) - Internal spacing
Padding Modals:  p-6/p-8 (24/32px) - Generous whitespace
Margin Section:  mt-6 mb-6 (24px) - Between sections
Border Radius:   rounded-2xl (16px) - All cards
```

---

## MOTION CURVES

### Standard Spring (Most Elements)

```
type: "spring"
stiffness: 280    (confident, snappy)
damping: 22       (slight bounce, premium feel)
```

### Smooth Spring (Entrances)

```
type: "spring"
stiffness: 200    (slow, graceful)
damping: 24       (controlled, no overshoot)
```

### Examples

```
Hover Lift:       y: -2px
Click Feedback:   scale: 0.98
Expand Height:    height: 0 → auto
Progress Width:   width: 0% → target%
Modal Entry:      opacity: 0 → 1, scale: 0.98 → 1, y: 8 → 0
```

---

## ACCESSIBILITY PATTERNS

### Focus Ring (All Interactive)

```jsx
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-white/30
```

### Keyboard Support

```
Tab       → Navigate between interactive elements
Enter     → Activate button
Space     → Toggle checkbox/button
Escape    → Close modal/dialog
Arrow ←→  → Navigate options (if applicable)
```

### ARIA Labels

```jsx
role="button"
aria-expanded={isExpanded}
aria-modal="true"
aria-labelledby="modal-title"
aria-label="Close dialog"
```

---

## SHADOW & GLOW SYSTEM

```
Base (at rest):
  shadow-lg shadow-blue-500/5

Hover (interactive):
  shadow-lg shadow-blue-500/15

Modal:
  shadow-2xl shadow-blue-500/20

Header:
  shadow-lg shadow-blue-500/10

Never use:
  Pure black shadows
  Gradients in shadows
  Non-blue colored shadows
```

---

## COLOR USAGE MATRIX

```
Status/Performance  → Semantic color (emerald/blue/amber/red)
Text Emphasis       → Font weight (bold), not color
Borders             → white/10 only
Backgrounds         → gray-950, gray-900, gray-900/40
Glassmorphism       → backdrop-blur-xl
Glows/Shadows       → blue-500/X only
Decorative          → NOT ALLOWED

✅ DO:    Color = Meaning (status, performance, trend)
❌ DON'T: Color = Decoration (pretty colors, gradients)
```

---

## RESPONSIVE GRID

```
Mobile (< 640px):    grid-cols-1
Tablet (640-1024px): md:grid-cols-2
Desktop (> 1024px):  lg:grid-cols-3 to lg:grid-cols-4
```

---

## COMPONENT CHECKLIST

Every card must have:

- [ ] `border-white/10` border
- [ ] `bg-gray-900/40 backdrop-blur-xl` background
- [ ] `rounded-2xl` corners
- [ ] `shadow-lg shadow-blue-500/5` at rest
- [ ] `shadow-blue-500/15` on hover
- [ ] `transition-shadow` for smooth hover

Every interactive element must have:

- [ ] `hover` state (color, bg, or shadow shift)
- [ ] `active:scale-[0.98]` feedback
- [ ] `focus-visible:ring-white/30` focus ring
- [ ] Tooltip or `aria-label` if icon-only

Every heading must have:

- [ ] `font-semibold` or `font-bold`
- [ ] `text-white` (not colored)
- [ ] Appropriate `text-` size

---

## QUICK COPY-PASTE

### Glass Card Base

```jsx
className="bg-gray-900/40 backdrop-blur-xl border border-white/10
           rounded-2xl p-5 shadow-lg shadow-blue-500/5
           hover:shadow-blue-500/15 transition-shadow"
```

### Text Hierarchy

```jsx
<h2 className="text-2xl font-bold text-white">Heading</h2>
<p className="text-sm text-white/70">Body text</p>
<span className="text-xs text-white/50">Label</span>
```

### Button/Interactive

```jsx
className="px-4 py-2 rounded-lg hover:bg-white/10 text-white/70
           hover:text-white transition-colors focus-visible:outline-none
           focus-visible:ring-2 focus-visible:ring-white/30 active:scale-[0.98]"
```

### Motion Hover

```jsx
whileHover={{ y: -2 }}
transition={{ type: "spring", stiffness: 280, damping: 22 }}
```

---

## FORBIDDEN (NEVER DO)

- ❌ `dark:` prefix (single theme)
- ❌ Gradient fills (only global BG)
- ❌ Non-blue shadows
- ❌ Non-semantic colors
- ❌ More than 3 font weights
- ❌ Gap > 6 (looks disconnected)
- ❌ Custom padding (use scale)
- ❌ Hover-only affordance
- ❌ Color-only status (needs icons)
- ❌ Light mode fallback

---

## REQUIRED (ALWAYS DO)

- ✅ Semantic colors (emerald/blue/amber/red)
- ✅ Focus rings on interactives
- ✅ Spring curves for motion
- ✅ Text opacity hierarchy
- ✅ Consistent spacing (gap-4 or gap-6)
- ✅ Border white/10
- ✅ Shadow-blue-500/X
- ✅ Rounded-2xl corners
- ✅ Backdrop-blur-xl on glass
- ✅ Tooltips on icon-only buttons

---

## DESIGN SYSTEM STATUS

```
✅ Color System:      Semantic (meaning-driven)
✅ Typography:        Consistent scale
✅ Motion:            Spring curves standardized
✅ Spacing:           Grid system established
✅ Accessibility:     WCAG AA compliant
✅ Components:        Glassmorphic pattern applied
✅ Documentation:     5 comprehensive guides
✅ Ready to:          Ship, extend, maintain
```

---

**Version:** 1.0  
**Date:** January 31, 2026  
**Status:** Production-Ready ✅
