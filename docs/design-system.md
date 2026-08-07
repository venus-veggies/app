### `design-system.md`

```markdown
# Design System

Venus PWA's visual language is built on **Tailwind CSS v4** using a custom theme defined entirely in `src/index.css`. Every token becomes a real Tailwind utility automatically — `--color-leaf-500` produces `bg-leaf-500`, `text-leaf-500`, `border-leaf-500`, etc.

**Design direction:** Fresh & Organic. The interface is intentionally calm, warm, and uncluttered — like a good vegetable shop, not a tech dashboard.

---

## Color palette

### Neutrals

| Token             | Hex       | Role                        |
| ----------------- | --------- | --------------------------- |
| `--color-ink`     | `#3D3833` | Primary text, headings      |
| `--color-body`    | `#6B6560` | Body text                   |
| `--color-muted`   | `#9C958A` | Secondary text, placeholder |
| `--color-subtle`  | `#B5AFA5` | Hints, disabled states      |
| `--color-page`    | `#F9F8F5` | Page background             |
| `--color-surface` | `#FFFFFF` | Cards, nav bars             |
| `--color-border`  | `#EBE7E0` | Dividers, input borders     |

### Brand greens

| Token              | Hex       | Role                      |
| ------------------ | --------- | ------------------------- |
| `--color-leaf-900` | `#24401E` | Darkest accents           |
| `--color-leaf-700` | `#3A7E30` | Headings, active text     |
| `--color-leaf-600` | `#3A7E30` | Hover states (same)       |
| `--color-leaf-500` | `#4A9E3F` | Primary buttons, active   |
| `--color-leaf-400` | `#6BAF5E` | Lighter accents           |
| `--color-leaf-100` | `#E8F5E1` | Light backgrounds, badges |

### Accent gold

| Token              | Hex       | Role                       |
| ------------------ | --------- | -------------------------- |
| `--color-gold-600` | `#C3811F` | Gold text                  |
| `--color-gold-500` | `#E0A039` | Cart badge, highlights     |
| `--color-gold-100` | `#FBECCB` | Gold background highlights |

Gold is used sparingly — cart badges, delivery upsell messages, and small highlights. It is **not** a marketing color and should not be overused.

### Functional tomato

| Token                | Hex       | Role                |
| -------------------- | --------- | ------------------- |
| `--color-tomato-600` | `#B8431F` | Error text          |
| `--color-tomato-500` | `#D1552F` | Destructive actions |
| `--color-tomato-100` | `#F8DCCF` | Error background    |

Tomato is reserved for errors and destructive actions (clear cart, logout). It is never used for badges, promotions, or general styling.

---

## Typography

Two font families are loaded from Google Fonts:

- **Inter** (`--font-sans`) — everything that isn't a heading or a price.
- **Fraunces** (`--font-display`) — headings, prices, and the logo.

All text should use one of the predefined type classes below. Never mix raw `font-size` / `font-weight` with these — it creates inconsistent visual rhythm.

| Class            | Font     | Size (mobile → desktop) | Weight | Usage                         |
| ---------------- | -------- | ----------------------- | ------ | ----------------------------- |
| `.type-hero`     | Fraunces | 1.5rem → 1.875rem       | 600    | Page-level main title         |
| `.type-section`  | Fraunces | 1.125rem → 1.25rem      | 600    | Section headings              |
| `.type-eyebrow`  | Inter    | 0.75rem                 | 600    | Small uppercase label         |
| `.type-name`     | Inter    | 0.875rem                | 500    | Product name in cards/lists   |
| `.type-price`    | Fraunces | 1rem                    | 600    | Price in cards and cart lines |
| `.type-price-lg` | Fraunces | 1.5rem                  | 600    | Large price (product detail)  |
| `.type-body`     | Inter    | 0.875rem                | 400    | Paragraphs, descriptions      |
| `.type-caption`  | Inter    | 0.75rem                 | 400    | Units, timestamps, fine print |

Prices use `tabular-nums` so digits align when listed vertically.

---

## Spacing, radii & shadows

**Radii**

- Cards: `rounded-card` (1.25rem)
- Buttons: `rounded-btn` (0.9rem)
- Pills (chips, stepper, input groups): `rounded-pill` (999px)

**Shadows**

- `shadow-card` — subtle resting shadow
- `shadow-card-hover` — elevated state with a green tint (`rgba(31,61,34,…)`)
- `shadow-float` — floating buttons (FAB-style)

**Layout dimensions**

- `--topnav-height`: 3.75rem
- `--bottomnav-height`: 4.25rem

These are used to offset page content so nothing hides behind the fixed nav bars.

---

## Light mode & dark mode

Light mode is **forced** globally via `html { color-scheme: light; }`. The OS dark mode preference is deliberately ignored — the app isn't designed for it yet. When dark mode is implemented, it will use a `html.dark` class toggled by user preference, and all dark variants will be added as `dark:*` Tailwind utilities. No component will need structural changes.

---

## Global utilities

- `.no-scrollbar` — hides scrollbars on horizontally scrolling rows (category chips).
- `.safe-bottom` — adds `padding-bottom: env(safe-area-inset-bottom)` for phones with gesture bars.
- Focus states: a two-layer `box-shadow` ring in `--color-leaf-500` instead of the default browser outline.
- Images have a `background-color: var(--color-leaf-100)` by default — this prevents a flash of white while images load and gives transparent images a soft backdrop.
- `prefers-reduced-motion: reduce` is respected: transitions drop to near-instant speeds.
```

---

```

```
