# Design System Quick Reference

## Copy-Paste Components & Patterns

---

## 🎨 COMPONENT TEMPLATES

### Glass Card (Standard)

```jsx
className="rounded-2xl border border-white/10 bg-gray-900/40 backdrop-blur-xl
           shadow-lg shadow-blue-500/5 hover:shadow-blue-500/15 transition-shadow"
```

### Glass Card (Modal/Large)

```jsx
className="bg-gray-900/80 backdrop-blur-xl rounded-2xl border border-white/10
           shadow-2xl shadow-blue-500/20"
```

### Interactive Button

```jsx
className="p-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white
           transition-colors focus-visible:outline-none focus-visible:ring-2
           focus-visible:ring-white/30 active:scale-[0.98]"
```

### Status Badge (Color-Coded)

```jsx
className={`px-3 py-1 rounded-full text-xs font-medium
  ${percentage >= 80 ? 'text-emerald-300'
  : percentage >= 60 ? 'text-blue-400'
  : percentage >= 40 ? 'text-amber-400'
  : 'text-red-400'}`}
```

### Text Hierarchy

```jsx
// Primary (Heading)
className = "text-white font-semibold tracking-tight";

// Secondary (Body)
className = "text-white/70 text-sm";

// Tertiary (Label)
className = "text-white/50 text-xs";

// Disabled
className = "text-white/40";
```

### Motion - Card Hover

```jsx
whileHover={{ y: -2 }}
transition={{ type: "spring", stiffness: 280, damping: 22 }}
```

### Motion - Expand/Collapse

```jsx
initial={{ height: 0, opacity: 0 }}
animate={{ height: "auto", opacity: 1 }}
exit={{ height: 0, opacity: 0 }}
transition={{ type: "spring", stiffness: 260, damping: 22 }}
```

### Modal Backdrop

```jsx
className="fixed inset-0 bg-black/40 backdrop-blur-sm
           flex items-center justify-center z-50 p-4"
```

---

## 🎯 COLOR SEMANTIC GUIDE

### Performance Score

```jsx
const getScoreColor = (pct) => {
  if (pct >= 80) return "text-emerald-300"; // Excellent
  if (pct >= 60) return "text-blue-400"; // Good
  if (pct >= 40) return "text-amber-400"; // Warning
  return "text-red-400"; // Alert
};
```

### Trend Indicator (vs Class Average)

```jsx
className={
  delta === null ? "text-white/40"
  : delta >= 0 ? "text-emerald-400"
  : "text-red-400"
}
// Arrow: delta >= 0 ? "↑" : "↓"
```

### Status States

```
Success/Positive  → text-emerald-400
Warning/Caution   → text-amber-400
Error/Alert       → text-red-400
Info/Neutral      → text-white/50
```

---

## 📏 SPACING SCALE

```
xs: 0.25rem (2px)
sm: 0.5rem (4px)
1:  0.25rem (4px)
2:  0.5rem (8px)
3:  0.75rem (12px)
4:  1rem (16px)      ← Gap in compact layouts
5:  1.25rem (20px)   ← Padding in cards
6:  1.5rem (24px)    ← Gap in sections
8:  2rem (32px)      ← Padding in modals
```

---

## 🔤 TYPOGRAPHY SCALE

```
xs: 12px / 0.75rem   (labels, captions)
sm: 14px / 0.875rem  (body text)
base: 16px / 1rem    (card titles)
lg: 18px / 1.125rem  (section headers)
xl: 20px / 1.25rem   (page headings)
2xl: 24px / 1.5rem   (main title)
```

---

## ✨ EFFECTS & SHADOWS

### Base Shadow (Rest)

```jsx
className = "shadow-lg shadow-blue-500/5";
```

### Hover Shadow

```jsx
className = "shadow-blue-500/15";
```

### Modal Shadow

```jsx
className = "shadow-2xl shadow-blue-500/20";
```

### No Shadow (Subtle)

```jsx
className = "shadow-sm shadow-blue-500/5";
```

---

## 🎬 ANIMATION CURVES

### Standard Spring (Most Things)

```jsx
type: "spring";
stiffness: 280;
damping: 22;
```

### Slow Spring (Smooth Entrances)

```jsx
type: "spring";
stiffness: 200;
damping: 24;
```

### Snappy Spring (Quick Feedback)

```jsx
type: "spring";
stiffness: 300;
damping: 24;
```

---

## ♿ ACCESSIBILITY PATTERNS

### Focus Ring (All Interactives)

```jsx
focus-visible:outline-none
focus-visible:ring-2
focus-visible:ring-white/30
```

### Keyboard Support (Button-like Divs)

```jsx
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleAction();
    }
  }}
>
```

### Modal Close (Escape Key)

```jsx
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
  };
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, [onClose]);
```

### ARIA Labels

```jsx
role="dialog"
aria-modal="true"
aria-labelledby="dialog-title"
aria-label="Close report"
aria-expanded={isExpanded}
```

---

## 🌐 RESPONSIVE BREAKPOINTS

```
Mobile:  (default)  1 column
Tablet:  md:        2 columns
Desktop: lg:        3-4 columns
```

**Usage:**

```jsx
className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4";
```

---

## 🔍 COMMON PATTERNS

### Conditional Text Color

```jsx
className={`
  ${condition ? 'text-white' : 'text-white/50'}
  ${isHighlight ? 'font-semibold' : 'font-normal'}
`}
```

### Opacity Hierarchy

```
text-white      (100%) - Headings, critical
text-white/70   (70%)  - Body text
text-white/50   (50%)  - Labels, secondary
text-white/40   (40%)  - Disabled, tertiary
text-white/10   (10%)  - Borders, very subtle
```

### Card with Glassmorphism

```jsx
<div
  className="bg-gray-900/40 backdrop-blur-xl border border-white/10 
                rounded-2xl p-5 shadow-lg shadow-blue-500/5"
>
  {/* content */}
</div>
```

### Animated Progress Bar

```jsx
<div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
  <motion.div
    animate={{ width: `${percentage}%` }}
    transition={{ type: "spring", stiffness: 200, damping: 24 }}
    className="h-full rounded-full bg-emerald-400"
  />
</div>
```

---

## ⚠️ DO NOT

- ❌ Use `dark:` prefix (single theme only)
- ❌ Add gradient colors inside components (only global BG)
- ❌ Use color for emphasis (use bold/size instead)
- ❌ Hover-only content (use tooltips/labels)
- ❌ More than 3 font-weight variations per component
- ❌ Shadows with colors other than blue-500/X
- ❌ Gap larger than 6 (feels disconnected)
- ❌ Padding less than 4px inside cards (cramped)

---

## ✅ DO

- ✅ Use semantic colors (emerald/blue/amber/red)
- ✅ Pair color with icons/text (not color alone)
- ✅ Add focus rings to all interactive elements
- ✅ Test keyboard navigation (Tab, Enter, Escape)
- ✅ Use spring curves for smooth motion
- ✅ Include tooltips for non-obvious buttons
- ✅ Provide visual feedback on hover + click
- ✅ Keep contrast ratios ≥ 4.5:1 (WCAG AA)

---

## 🎯 DESIGN DECISION MATRIX

| Need           | Use                               | Example               |
| -------------- | --------------------------------- | --------------------- |
| Card container | `bg-gray-900/40 backdrop-blur-xl` | Subject cards, modals |
| Important text | `font-semibold text-white`        | Headings, grades      |
| Body text      | `text-white/70 text-sm`           | Descriptions          |
| Status color   | Semantic (emerald/blue/amber/red) | Performance %         |
| Hover effect   | `y: -2` lift + shadow glow        | Cards, buttons        |
| Click feedback | `scale-[0.98]`                    | Buttons               |
| Focus ring     | `ring-white/30`                   | Keyboard users        |
| Border         | `border-white/10`                 | Card edges            |
| Spacing        | `gap-4` compact, `gap-6` airy     | Grid, section         |

---

## 📋 COMPONENT CHECKLIST (Before Shipping)

Every card should have:

- [ ] Border: `border-white/10`
- [ ] Background: `bg-gray-900/40 backdrop-blur-xl`
- [ ] Shadow: `shadow-lg shadow-blue-500/5`
- [ ] Hover: shadow transition to `shadow-blue-500/15`
- [ ] Rounded: `rounded-2xl`
- [ ] Focus ring (if interactive): `focus-visible:ring-white/30`

Every interactive element should have:

- [ ] Hover state (color/bg shift or shadow)
- [ ] Active state (`scale-[0.98]`)
- [ ] Focus ring (always visible)
- [ ] Tooltip or aria-label (if icon-only)

Every heading should have:

- [ ] `font-semibold` or `font-bold`
- [ ] `tracking-tight` (titles) or `tracking-wider` (headers)
- [ ] `text-white` (not colored)

---

## 🚀 QUICK FIXES

**"Button isn't visible when focused"**
→ Add: `focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30`

**"Card looks flat"**
→ Change: `shadow-blue-500/5` → `shadow-lg shadow-blue-500/10`

**"Text is hard to read"**
→ Change: `text-white/70` → `text-white` OR increase `font-semibold`

**"Modal doesn't close with Escape"**
→ Add: `useEffect` with `keydown` listener for `Escape` key

**"Charts look washed out"**
→ Change: `stroke="#gray"` → `stroke="rgba(255,255,255,0.5)"`

**"Hover feels choppy"**
→ Change: `transition-colors` → `transition-all`
→ Add: `type: "spring" stiffness: 280 damping: 22`

---

## 🎓 LEARNING RESOURCES

- **Tailwind CSS:** https://tailwindcss.com/docs
- **Framer Motion:** https://www.framer.com/motion/
- **Accessibility (WCAG):** https://www.w3.org/WAI/WCAG21/quickref/
- **Color Theory:** https://www.interaction-design.org/literature/articles/color-theory
- **Typography:** https://www.smashingmagazine.com/2013/02/setting-weights-font-style/

---

**Version:** 1.0  
**Last Updated:** January 31, 2026  
**Maintainer:** Design System Team
