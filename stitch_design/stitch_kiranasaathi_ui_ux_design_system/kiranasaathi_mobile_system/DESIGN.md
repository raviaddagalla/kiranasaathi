---
name: KiranaSaathi Mobile System
colors:
  surface: '#f9faf7'
  surface-dim: '#d9dad8'
  surface-bright: '#f9faf7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f1'
  surface-container: '#edeeeb'
  surface-container-high: '#e7e8e6'
  surface-container-highest: '#e2e3e0'
  on-surface: '#191c1b'
  on-surface-variant: '#3f4942'
  inverse-surface: '#2e312f'
  inverse-on-surface: '#f0f1ee'
  outline: '#6f7a71'
  outline-variant: '#bfc9c0'
  surface-tint: '#186c45'
  primary: '#005131'
  on-primary: '#ffffff'
  primary-container: '#176b45'
  on-primary-container: '#99e9b9'
  inverse-primary: '#88d7a8'
  secondary: '#775a00'
  on-secondary: '#ffffff'
  secondary-container: '#fed265'
  on-secondary-container: '#755900'
  tertiary: '#623f00'
  on-tertiary: '#ffffff'
  tertiary-container: '#825400'
  on-tertiary-container: '#ffcf92'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a4f4c3'
  primary-fixed-dim: '#88d7a8'
  on-primary-fixed: '#002111'
  on-primary-fixed-variant: '#005232'
  secondary-fixed: '#ffdf97'
  secondary-fixed-dim: '#ecc156'
  on-secondary-fixed: '#251a00'
  on-secondary-fixed-variant: '#5a4400'
  tertiary-fixed: '#ffddb4'
  tertiary-fixed-dim: '#feb956'
  on-tertiary-fixed: '#291800'
  on-tertiary-fixed-variant: '#633f00'
  background: '#f9faf7'
  on-background: '#191c1b'
  surface-variant: '#e2e3e0'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
  currency-display:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 24px
  currency-body:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '700'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.5rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-mobile: 1rem
  margin-tablet: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

The design system is engineered for dual-sided usability across neighborhood kirana merchants and everyday shoppers. The visual tone balances Indian commercial familiarity with refined digital utility: authentic, community-rooted, dependable, and highly pragmatic. 

Drawing from modern Material Design 3 guidelines infused with approachable utility, the UI employs calm tonal layering, crisp borders, and recognizable physical retail metaphors. It rejects overly abstract minimalism in favor of structured data, readable weight measurements, instant inventory indicators, and legible pricing architecture.

Key tenets:
- **Immediate Clarity:** Ultra-legible pricing, vernacular-friendly visual iconography, high-contrast states, and strict 48dp minimum interactive touchpoints for rapid on-the-go or counter use.
- **Rooted Reliability:** A grounding deep forest green paired with harvest gold accents that evoke trust, fresh produce, and commercial security.
- **Ergonomic Handheld Efficiency:** Thumb-zone primary navigation, consolidated bottom sheets, anchored floating action buttons (FABs), and single-hand accessibility patterns tailored for diverse Android hardware.

## Colors

The palette grounds the interface in agricultural authenticity, mercantile trust, and high operational clarity across variable outdoor and fluorescent retail lighting.

- **Primary (`#176B45`):** Deep Forest Green. Used for primary actions, top app bars, selected states, bottom navigation active indicators, and core branding elements.
- **Primary Container Dark (`#104A31`):** High-emphasis headers, active batch indicators, and shopkeeper metric headers.
- **Primary Container Light (`#D5E8D4` / `#E8F5E9`):** Badges, chip selections, search pill containers, and positive callout backgrounds.
- **Secondary (`#F4C95D`):** Warm Saffron / Marigold. Used for promotional accents, loyalty milestones, active demand badges, and spotlight highlights.
- **Tertiary (`#E09F3E`):** Harvest Amber. Secondary CTA anchors, star ratings, and community demand volume tags.
- **Neutral Canvas (`#F7F8F5`):** Soft ivory background that reduces glare under direct sunlight.
- **Surfaces (`#FFFFFF`):** Elevated cards, bottom sheets, search inputs, and modal dialogs, separated by subtle borders (`#E3E8E3`).
- **Typography Neutrals:** Primary text uses Deep Charcoal (`#202522`) ensuring WCAG AAA legibility; secondary text uses Slate Ash (`#5C6560`); muted metadata and unit measures use Stone Gray (`#87928C`).
- **Semantic Signals:** Success (`#2E7D32`), In-Demand Warning (`#ED6C02`), Out of Stock/Alert (`#D32F2F`), and Intelligence/Info (`#0288D1`).

## Typography

Typography prioritizes functional scannability across numerical data, vernacular transliteration, Indian Rupee (`₹`) symbols, and unit quantifiers (e.g., `500 g`, `1 kg`, `250 ml`).

- **Font Family:** `Inter` is applied system-wide for neutral clarity, balanced x-height, and robust OpenType tabular lining figures which prevent baseline shifts in dynamic stock lists and currency columns.
- **Price Representation:** Prices must always render the Rupee symbol (`₹`) with a non-breaking space before the amount, using bold weight weights (`currency-display` or `currency-body`) to distinguish cost from item weight.
- **Unit & Weight Quantities:** Variant details (kg, g, packs) must use `body-sm` or `label-md` in secondary text (`#5C6560`) adjacent to the product title to prevent accidental variant mismatches.
- **Timestamp Indicators:** Stock refresh counters ("Updated 12m ago") utilize `label-sm` in tabular figures to maintain uniform grid alignments across live item feeds.

## Layout & Spacing

The layout is built upon an 8dp fundamental baseline grid (with a strict 4dp micro-step for tags and status chips) to align with Android system density buckets (hdpi, xhdpi, xxhdpi).

### Layout Structure
- **Mobile Handsets (< 600dp):** Single-column vertical stream or 2-column asymmetric product grid. Uses `16dp` (`1rem`) outer canvas margins and `12dp` or `16dp` column gutters.
- **Tablets / POS Displays (≥ 600dp):** Fluid 6 to 8-column layout with `24dp` margins, splitting screen real estate between live inventory controls and local aggregate demand graphs.
- **Touch Ergonomics:** All primary tappable elements (buttons, quantity pickers, category pills, list items) strictly observe a 48x48dp minimum physical touch boundary, even when visual containers are smaller.

### Spatial Rhythm
- **Micro Spacing (`space-xs` = 4dp, `space-sm` = 8dp):** Used for interior badge padding, distance between product title and pack size, and icon-to-label inline offsets.
- **Component Padding (`space-md` = 16dp):** Internal surface padding for product cards, standard list rows, and bottom sheet containers.
- **Section Breaks (`space-lg` = 24dp, `space-xl` = 32dp):** Distinct groupings between store shelves, community order aggregation zones, and dashboard summary sections.

## Elevation & Depth

Visual hierarchy combines tonal surface differentiation with targeted physical elevation, honoring Material Design 3 surface containers while retaining crisp edge definition on budget mobile screens.

- **Level 0 (Flat / Canvas):** Neutral canvas `#F7F8F5`. No shadow. Baseline for scrolling feeds and tab containers.
- **Level 1 (Resting Cards & Surfaces):** `#FFFFFF` surface accompanied by a structural border (`1px solid #E3E8E3`) and a subtle ambient shadow: `box-shadow: 0px 1px 3px rgba(32, 37, 34, 0.06), 0px 1px 2px rgba(32, 37, 34, 0.04)`.
- **Level 2 (Active States & Dropdown Menus):** Interactive card press states, popover menus, and category tabs. `box-shadow: 0px 3px 6px rgba(16, 74, 49, 0.08), 0px 2px 4px rgba(0, 0, 0, 0.04)`.
- **Level 3 (Sticky Headers & Bottom Sheets):** Top search bars and modal bottom sheets. `box-shadow: 0px 6px 16px rgba(23, 107, 69, 0.12), 0px 3px 6px rgba(0, 0, 0, 0.06)`.
- **Level 4 (Floating Action Buttons):** Community order pooling triggers and merchant barcode scanning actions. `box-shadow: 0px 8px 20px rgba(23, 107, 69, 0.22), 0px 4px 8px rgba(0, 0, 0, 0.08)`.

## Shapes

The design system adopts roundedness level `2` (8dp base radius), providing a balance between approachable softness and structural efficiency for grid packing.

- **Base Corner Radius (8dp / 0.5rem):** Standard product cards, input text boxes, merchant stock tiles, and dialog windows.
- **Large Radius (`rounded-lg` = 16dp / 1rem):** Modal bottom sheets (top corners), banner containers, and metric summary modules.
- **Extra-Large Radius (`rounded-xl` = 24dp / 1.5rem):** Search pill bars and Floating Action Buttons.
- **Full Pill (`9999px`):** Status badges (In Stock, 12 left), demand counter chips, filter tags, and stepped quantity add/subtract controllers.

## Components

### Buttons
- **Primary Action:** Solid Deep Forest Green (`#176B45`) background, `#FFFFFF` text, `label-lg` typography, height 48dp, corner radius 8dp or 24dp for full pills. Active/Pressed state darkens to `#104A31`.
- **Secondary / Accent Action:** Solid Warm Saffron (`#F4C95D`) with `#202522` text for high-priority commercial actions like "Join Bulk Order" or "Request Stock".
- **Outlined / Merchant Action:** Border `1.5px solid #176B45`, transparent surface, `#176B45` text.
- **Floating Action Button (FAB):** 56x56dp rounded square (16dp radius) or pill shape with icon + label, primary color background, Level 4 elevation, fixed to the bottom-right viewport (16dp margin above bottom nav).

### Product Cards
- **Structure:** Surface `#FFFFFF`, 1px border `#E3E8E3`, 8dp corner radius, 12dp internal padding.
- **Content Stacking:** 
  1. Image container (1:1 aspect ratio with subtle `#F7F8F5` background).
  2. Variant chip (`label-sm`, e.g., "500 g", "Combo Pack") overlaid or pinned above title.
  3. Product title in `title-md` (max 2 lines, truncated).
  4. Stock health chip / Live timestamp ("In Stock • 10m ago").
  5. Bottom row: Price layout (`currency-display`) alongside an "ADD" or stepper button (`- 1 +`).

### Quantity Stepper
- Compact pill container (`#E8F5E9`) with primary green borders and text.
- 48dp touch targets on `+` and `-` operators, holding `currency-body` numerical values in the center.

### Chips & Filter Tags
- **Filter Chips:** 36dp height, pill-shaped, `#FFFFFF` surface with `#E3E8E3` outline. When active: `#D5E8D4` fill with `#104A31` label and checkmark icon.
- **Demand Intelligence Chips:** Saffron-tinted background (`#FFF8E7`), border `#E09F3E`, featuring a flame or community icon and text (e.g., "18 neighbors requested").

### Input Fields
- **Search Bar:** Prominent 48dp to 52dp height pill container on `#FFFFFF`, Level 1 elevation, leading search icon, trailing vernacular voice search (microphone) icon.
- **Form Inputs:** 48dp height, 8dp radius, `#FFFFFF` surface, border `1px solid #E3E8E3`, transitioning to `2px solid #176B45` on focus. Supporting helper text in `body-sm`.

### Bottom Navigation
- Fixed 64dp height bar, surface `#FFFFFF`, border-top `1px solid #E3E8E3`.
- 4 to 5 ergonomic slots: Store, Categories, Community Demand, Orders, Profile.
- Active item displays a soft green pill background pill (`#E8F5E9`) behind the active icon with `#176B45` label below.

### Lists & Inventory Rows
- Single-line or two-line list items adhering to 56dp and 72dp heights.
- Left-aligned thumbnail, centered product metadata, right-aligned tabular price and instantaneous toggle/stock switch for shopkeepers.