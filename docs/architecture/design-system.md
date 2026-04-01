# Academic Tracker - Design System & Brand Guide

## 🎨 Color System

### Brand Gradient

The primary brand identity is defined by a bold blue gradient:

```css
bg-gradient-to-br from-blue-600 via-gray-900 to-blue-700
```

Used in:

- Main app background
- Splash screen
- Visual brand presence

### Dark Glassmorphism Palette

**Background Base:**

- Primary: `gray-950` (deep dark) with `0.4` opacity
- Cards: `gray-900/40` with `backdrop-blur-xl` for glass effect
- Modals: `gray-900/80` with `backdrop-blur-xl`

**Text Hierarchy:**

- Primary: `text-white` (100% opacity) - headings, key data
- Secondary: `text-white/70` - body text, descriptions
- Tertiary: `text-white/50` - labels, metadata
- Disabled: `text-white/40` - inactive states

**Borders & Dividers:**

- Primary: `border-white/10` - card borders, section dividers
- Subtle: `border-white/5` - internal dividers

**Accents:**

- Blue glow: `shadow-blue-500/5` to `shadow-blue-500/15` (hover)
- Used on cards for depth and brand reinforcement

---

## 🎯 Component Patterns

### Glass Card Base

```jsx
className="rounded-2xl border border-white/10 bg-gray-900/40 backdrop-blur-xl
           shadow-lg shadow-blue-500/5 hover:shadow-blue-500/15 transition-shadow"
```

**Properties:**

- `rounded-2xl` - Modern rounded corners
- `border-white/10` - Subtle border definition
- `bg-gray-900/40` - Translucent dark background
- `backdrop-blur-xl` - Strong blur effect for glassmorphism
- `shadow-lg shadow-blue-500/5` - Subtle blue glow at rest
- `hover:shadow-blue-500/15` - Enhanced glow on hover
- `transition-shadow` - Smooth shadow animation

### Interactive Motion

All cards use consistent spring physics:

```jsx
whileHover={{ y: -2 }}
transition={{ type: "spring", stiffness: 280-300, damping: 22-24 }}
```

---

## 📐 Layout Spacing

### Grid Gaps

- Main container: `gap-6` (larger sections)
- Dashboard KPI tiles: `gap-4` (optimized for glance scanning)
- Subject comparison: `gap-4` (compact efficiency)

### Padding

- Cards: `p-5` - balanced internal spacing
- Modals: `p-6` to `p-8` - generous whitespace
- Sections: `py-8` - vertical breathing room

---

## 🔍 Typography

### Font Weights

- Titles: `font-semibold` to `font-bold` - command attention
- Body: `font-normal` - legibility
- Captions: `font-light` - de-emphasized

### Sizing

- Main title: `text-2xl` (header)
- Card titles: `text-base` (compact hierarchy)
- KPI values: `text-2xl` (numerical emphasis)
- Labels: `text-xs` (functional)

### Tracking

- Titles: `tracking-tight` - modern, confident
- Section headers: `tracking-wider` - spacious, premium
- Body: default - readable

---

## ✨ Effects & Transitions

### Backdrop Blur Levels

- `backdrop-blur` - light blur (footer, secondary)
- `backdrop-blur-xl` - strong blur (primary cards, modals)

### Shadow System

- Rest state: `shadow-lg shadow-blue-500/5`
- Hover state: `shadow-blue-500/15`
- Modal: `shadow-2xl shadow-blue-500/20`
- Header glow: `shadow-lg shadow-blue-500/10`

### Opacity Tiers

Used for visual hierarchy without color changes:

- 100%: Primary text, icons
- 70%: Secondary UI, headers
- 50%: Body text, descriptions
- 40%: Tertiary info, disabled states
- 10%: Borders, dividers
- 5%: Hover states, highlights

---

## 🎬 Animation Curves

### Spring Physics (Standard)

```
type: "spring"
stiffness: 280-300
damping: 22-24
```

Produces natural, confident motion without bounciness.

### Durations

- Micro-interactions: 0.2-0.4s
- Card transitions: 0.6-0.8s
- Modal enter/exit: 0.6s
- Splash exit: 0.6s

---

## 📱 Responsive Design

### Breakpoints

- Mobile: `grid-cols-1`
- Tablet: `md:grid-cols-2` / `md:text-lg`
- Desktop: `lg:grid-cols-4` / `lg:text-2xl`

### Optimization

- CSS Grid over Flexbox for multi-column layouts
- Tailwind's responsive prefixes for mobile-first approach
- Reduce gap spacing on mobile for efficiency

---

## ♿ Accessibility

### Focus States

All interactive elements:

```jsx
focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30
```

### ARIA Attributes

- `role="button"` for keyboard-interactive divs
- `aria-expanded` for collapsible components
- `aria-modal="true"` for modal dialogs
- `aria-labelledby` for heading references

### Keyboard Navigation

- Tab order preserved in document flow
- Enter/Space triggers actions
- Escape closes modals

---

## ⚡ Performance Optimization

### Rendering Efficiency

1. **Conditional Splash Screen**: Only renders during intro (early return pattern)
2. **Lazy Loading**: Modals render only when visible (`{showReport && <ReportView />}`)
3. **CSS-only Animations**: Use Tailwind transitions for hover states
4. **Optimized Blur**: `backdrop-blur-xl` cached by browser (GPU accelerated)

### Bundle Size

- Minimal custom CSS (Tailwind utility-first)
- Framer Motion animations lazy-loaded only where needed
- No unused color variants in config

### Network

- Blue gradient background as CSS gradient (no image assets)
- SVG progress rings instead of pre-rendered images
- Efficient icon library (lucide-react, 18-24px only)

---

## 🎯 Design Decisions

### Why Glassmorphism?

- Premium, modern aesthetic
- Maintains readability with proper contrast
- Works with blue gradient background
- GPU-accelerated backdrop blur = smooth performance

### Why Blue Gradient?

- Professional academic tone
- High contrast for accessibility
- Memorable brand anchor from splash screen
- Complements dark UI without looking cold

### Why Reduced Gap Spacing?

- Dashboard KPI tiles (4 columns) need compact layout
- Better mobile responsiveness
- Focuses attention on data, not whitespace
- Still maintains visual breathing room

### Why Shadow-based Depth?

- Subtle blue glow identifies component focus
- Avoids 3D skeuomorphism (outdated)
- Performance-friendly (shadow blur vs. real blur)
- Consistent with glassmorphism aesthetic

---

## 📝 Implementation Checklist

- [x] Global gradient background applied
- [x] Glassmorphic cards across all sections
- [x] Consistent shadow system with blue accents
- [x] Spring animation curves standardized
- [x] Text hierarchy with opacity tiers
- [x] Accessibility features (focus rings, ARIA)
- [x] Mobile responsiveness optimized
- [x] Performance-friendly blur effects
- [x] Splash screen brand integration
- [x] Modal glassmorphism effects
- [x] Header transparency with backdrop blur

---

## 🚀 Future Enhancements

- Dark/Light mode toggle (framework ready)
- Dynamic color themes (CSS variables prepared)
- Component library extraction (Storybook ready)
- Animation library documentation
- Design tokens JSON export

---

**Last Updated:** January 31, 2026  
**Version:** 1.0 (Brand System Launch)
