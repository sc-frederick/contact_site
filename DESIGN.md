---
version: alpha
name: Mosaic Press
description: An editorial mosaic system that stacks cream paper, ink panels, and high-voltage accent tiles into confident card grids with serif headlines and modular sans labels.
theme: light
colors:
  primary: "#5B3FFF"
  primary-hover: "#3A26C7"
  secondary: "#86F46A"
  tertiary: "#101010"
  neutral: "#5A5345"
  surface: "#FBF7EC"
  surface-muted: "#F2EAD8"
  surface-inverted: "#101010"
  on-surface: "#101010"
  on-surface-muted: "#5A5345"
  on-inverted: "#F7F1DF"
  on-primary: "#F4EEF9"
  border: "#E2D9C2"
  focus: "#5B3FFF"
  error: "#C43D2A"
  success: "#2F7A2A"
typography:
  display-xl:
    family: "Instrument Serif"
    size: 72px
    weight: 400
    lineHeight: 1.05
    tracking: -0.02em
  display-lg:
    family: "Instrument Serif"
    size: 56px
    weight: 400
    lineHeight: 1.05
    tracking: -0.02em
  headline-lg:
    family: "Instrument Serif"
    size: 40px
    weight: 400
    lineHeight: 1.2
    tracking: -0.02em
  headline-md:
    family: "Instrument Serif"
    size: 32px
    weight: 400
    lineHeight: 1.2
    tracking: -0.02em
  title-lg:
    family: "Instrument Serif"
    size: 24px
    weight: 400
    lineHeight: 1.2
  title-md:
    family: "Inter Tight"
    size: 20px
    weight: 600
    lineHeight: 1.3
  body-lg:
    family: "Inter Tight"
    size: 16px
    weight: 400
    lineHeight: 1.5
  body-md:
    family: "Inter Tight"
    size: 15px
    weight: 400
    lineHeight: 1.5
  body-sm:
    family: "Inter Tight"
    size: 13px
    weight: 400
    lineHeight: 1.5
  label-sm:
    family: "Inter Tight"
    size: 12px
    weight: 500
    tracking: 0.14em
    textTransform: uppercase
rounded:
  none: 0
  sm: 6px
  md: 12px
  lg: 16px
  xl: 24px
  "2xl": 32px
  full: 999px
spacing:
  "2xs": 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  "2xl": 48px
  "3xl": 72px
  gutter: 20px
elevation:
  none: "none"
  soft: "0 8px 24px rgba(16, 16, 16, 0.08)"
  hover: "0 12px 32px rgba(16, 16, 16, 0.12)"
components:
  button-primary:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-inverted}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: "12px 22px"
  button-primary-hover:
    backgroundColor: "#2A2A2A"
    textColor: "{colors.on-inverted}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    border: "1px solid {colors.border}"
    rounded: "{rounded.full}"
    padding: "12px 22px"
  button-accent:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    padding: "12px 22px"
  button-accent-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
  input-field:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    border: "1px solid {colors.border}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
    height: 44px
  input-focus:
    border: "1px solid {colors.focus}"
    boxShadow: "0 0 0 3px {colors.surface-muted}, 0 0 0 5px {colors.focus}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-surface}"
    border: "1px solid {colors.border}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  card-ink:
    backgroundColor: "{colors.surface-inverted}"
    textColor: "{colors.on-inverted}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  card-accent:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
  checkbox:
    backgroundColor: "{colors.surface}"
    border: "1px solid {colors.border}"
    rounded: "{rounded.sm}"
    size: 18px
  checkbox-checked:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.surface-muted}"
    rounded: "{rounded.sm}"
  tabs:
    backgroundColor: "{colors.surface}"
    border: "1px solid {colors.border}"
    rounded: "{rounded.full}"
    padding: "4px"
  tabs-active:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-inverted}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
  feature-tile:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.xl}"
    padding: "{spacing.xl}"
    gradient: "linear-gradient(118deg, {colors.primary} 0%, {colors.primary-hover} 45%, #4CB234 75%, {colors.secondary} 100%)"
---

## Overview

Mosaic Press is an editorial card-grid system. It treats the screen as a printed press kit: warm cream paper tiles, deep ink panels for emphasis, and high-voltage violet and acid-green blocks that punctuate the layout. Transitional serif headlines do the talking while a tight grotesk handles labels, captions, and controls. Cards are generously rounded, layered into an irregular but disciplined grid, and rely on color and proportion - not glossy depth - for hierarchy.

The system is light by default. Its primary background is the cream **Paper** tone, with **Cloud** providing a slightly elevated card surface and **Ink** reserved for high-contrast tiles, headlines, and primary buttons. **Voltage Violet** is the loud accent, used for the hero feature tile, focus rings, primary call-to-action variants, and the diagonal gradient. **Lumen Green** plays as the secondary accent inside the signature gradient and on a small number of utility chips.

Mosaic Press is suited to editorial product surfaces: knowledge bases, blogs, internal newsrooms, dashboards that want personality, marketing site case studies, and product walls that mix portraits, color, and typography.

## Colors

The palette is anchored by three families: warm neutrals (Paper, Cloud, Stone, Muted Ink), inks (Ink), and accents (Voltage Violet, Voltage Violet Deep, Lumen Green).

| Token              | Value     | Role                                                            |
| ------------------ | --------- | --------------------------------------------------------------- |
| `surface-muted`    | `#F2EAD8` | Primary page background; warm "paper" tile.                     |
| `surface`          | `#FBF7EC` | Elevated card surface and input fill.                           |
| `border`           | `#E2D9C2` | Hairline borders on paper tiles and inputs.                     |
| `tertiary` (ink)   | `#101010` | Ink panels, primary buttons, headlines, checkbox fill.          |
| `on-inverted`      | `#F7F1DF` | Text and icons on ink tiles.                                    |
| `neutral`          | `#5A5345` | Secondary text on paper, captions, eyebrow labels.              |
| `primary`          | `#5B3FFF` | Voltage Violet - signature accent and focus.                    |
| `primary-hover`    | `#3A26C7` | Pressed/hover state for violet.                                 |
| `on-primary`       | `#F4EEF9` | Text on violet tiles.                                           |
| `secondary`        | `#86F46A` | Lumen Green - gradient counterpoint, accent chips.              |
| `error`            | `#C43D2A` | Form validation error.                                          |
| `success`          | `#2F7A2A` | Success messaging.                                              |

**Contrast targets.** Body text on Paper meets WCAG AA at body sizes (Ink on Paper, Muted Ink on Paper for small text). Text on Voltage Violet uses near-white **on-primary**; text on ink tiles uses **on-inverted**. Lumen Green is reserved for backgrounds with Ink text or as a non-essential accent inside the gradient and chips - it does not carry text-only meaning.

## Typography

Two families share the workload:

- **Instrument Serif** carries display, headline, and large title type. Its high contrast strokes and optional italic do the editorial talking - keep it large, tightly tracked, and short.
- **Inter Tight** handles all UI text - controls, labels, body copy, captions, metadata. Weight 500 carries small caps eyebrows; 400 handles body and chip text; 600 promotes utility titles like `title-md`.

**Scale.** Display sizes 56–72 px set hero moments. Headline sizes 32–40 px lead cards and sections. Title sizes 20–24 px act as card titles or large list entries. Body sizes 13–16 px cover paragraphs, descriptions, and captions. The `label-sm` token sets 12 px uppercase tracked text for eyebrow labels and tag rows.

**Treatment.** Pair serif headlines with a sans eyebrow above and sans body below for editorial rhythm. Use the italic of Instrument Serif sparingly for emphasis inside a single headline. Body copy uses 1.5 line height; large display blocks compress to 1.0–1.2.

## Layout

Mosaic Press uses a 12-column grid with a 20 px gutter and an outer shell that caps page width at 1240 px. Mosaic layouts mix `span-3`, `span-4`, `span-5`, `span-6`, and `span-7` cards in the same row so the grid reads as composed rather than uniform.

**Density.** Card padding is 32 px on default tiles and 24 px on compact tiles. Stacks within a card use 16–24 px gaps. Eyebrow labels sit 12 px above their headline.

**Rhythm.** Pair a tall ink "headline card" with a wide accent feature tile and shorter mini-tiles so the row reads like a magazine spread. At narrow widths the mosaic collapses to a single column without losing component proportions.

## Elevation & Depth

Depth is built from color blocking, not glassy shadows. Most surfaces are flat. The system reserves a single optional **soft** ink shadow (8% black, 24 px blur, 8 px y-offset) for hover-lift on cards. A heavier **hover** shadow is allowed on the primary feature tile when it sits on Paper.

Color is the depth language: Ink panels read as foreground, Cloud reads as a quiet lift above Paper, Stone hairlines act as the only constant border weight.

## Shapes

Mosaic Press is built on confident rounding without becoming pillowy.

- **Cards and tiles:** 24 px (`xl`) by default; 32 px (`2xl`) for hero blocks; 16 px (`lg`) for compact rows.
- **Controls:** 12 px (`md`) for inputs and selects, 6 px (`sm`) for checkbox tiles.
- **Pills:** `full` radius for buttons, chips, tabs, and avatar.
- **Borders:** Single 1 px hairline in Stone for paper surfaces; no borders on ink or accent tiles; focus uses a 2-step ring (3 px paper offset, 2 px violet halo).
- **Ornament:** A recurring diagonal gradient bar - Voltage Violet through Lumen Green at 118° - acts as the visual signature on feature tiles and section dividers.

## Components

### Buttons

Primary buttons are ink-filled pills with paper text. Secondary buttons use Cloud surface with a Stone hairline. The Accent variant uses Voltage Violet for hero calls to action. A ghost variant is available for tertiary actions inside dense card footers. Buttons are always pill-radius and use 22 px horizontal padding.

```html
<button class="mp-btn">Primary</button>
<button class="mp-btn mp-btn--secondary">Secondary</button>
<button class="mp-btn mp-btn--accent">Subscribe</button>
<button class="mp-btn mp-btn--ghost">Skip</button>
```

### Inputs

Inputs sit on Cloud with a Stone hairline, 12 px radius, and 12 × 14 px padding. The label above is uppercase tracked using `label-sm`. Focus combines a 3 px Paper offset with a 2 px Violet halo. Inputs accept an optional left-aligned icon (Lucide), positioned 12 px from the left edge.

```html
<label class="mp-field">
  <span class="mp-field__label">Email</span>
  <input class="mp-input" type="email" placeholder="you@studio.com" />
</label>
```

### Cards

The Card primitive is a 24 px-rounded tile with hairline border, vertical stack layout, and 32 px padding. Three variants extend the language:

- **Paper / Cloud** for default editorial tiles.
- **Ink** for high-contrast moments such as "8 Offices Around the World" hero blocks.
- **Accent** for violet feature blocks.

Cards support an optional `mp-card__media` block (4:3 aspect, rounded `lg`) and a `mp-card__footer` row for actions and chips.

### Checkbox

The checkbox is an 18 px Stone-bordered square tile that fills with Ink when checked, drawing a Paper-colored check mark. An `--accent` modifier fills with Voltage Violet when a checkbox represents a featured option.

```html
<label class="mp-checkbox">
  <input class="mp-checkbox__input" type="checkbox" checked />
  <span class="mp-checkbox__box"></span>
  Subscribe to the newsroom digest
</label>
```

### Tabs

Tabs use an inline pill row on Cloud with a Stone hairline track. The active tab is an ink-filled pill with paper text; inactive tabs use Muted Ink. Use `aria-selected="true"` or `.is-active` to mark the active tab.

```html
<div class="mp-tabs" role="tablist">
  <button class="mp-tab" role="tab" aria-selected="true">Stories</button>
  <button class="mp-tab" role="tab">Offices</button>
  <button class="mp-tab" role="tab">Reports</button>
</div>
```

### Feature Tile (signature)

The signature element is the **Feature Tile** - an oversized editorial tile that pairs a serif headline block with a diagonal violet-to-green gradient strip and an optional photographic or color sub-tile. It is the recurring hero motif: each major page typically uses one. The gradient strip is rendered with the system's `--gradient-step` token and a subtle 118° hatch overlay for material texture.

```html
<article class="mp-feature-tile">
  <div class="mp-feature-tile__body">
    <p class="mp-eyebrow">November 2025</p>
    <h2 class="mp-feature-tile__title">Press Digest</h2>
    <p class="mp-body">Stay current with the newsroom — every story, every release.</p>
  </div>
  <div class="mp-feature-tile__gradient" aria-hidden="true"></div>
</article>
```

### Icons

The system uses **Lucide** (ISC license, https://lucide.dev/) as its single icon library. Lucide's clean outline weight matches the editorial mood without competing with the serif display type. Icons inherit `currentColor` and use the `.mp-icon` class to set an 18 × 18 px footprint inside chips, buttons, and inputs. Do not mix in icons from other libraries.

## Do's and Don'ts

**Do**
- Lead with cream paper as the page background and let ink and accent tiles punctuate the layout.
- Pair a serif headline with a small uppercase eyebrow above and sans body below.
- Use the diagonal violet-to-green gradient on at most one feature tile per surface so it stays signature, not decorative noise.
- Keep card padding at 32 px and rely on white space and grid composition for hierarchy.
- Use Lumen Green only inside the gradient or sparingly as a chip - it is a punctuation color, not a surface.

**Don't**
- Don't drop generic grey backgrounds, neutral whites, or pure black into the system; the cream/ink contrast is what defines it.
- Don't add drop shadows or glass blur to cards. Depth comes from color blocking and the optional hover lift.
- Don't combine Voltage Violet text on Lumen Green or vice versa - both should pair with Ink or Paper text.
- Don't substitute the serif with a competing display family or use the serif for body copy.
- Don't introduce additional icon libraries; keep the system on Lucide only.
