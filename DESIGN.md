# Design

## 1. Visual Direction

The current UI system is:

- light-first
- warm-neutral
- premium but restrained
- content-readable before decorative

The design language should feel:

- bright
- clean
- soft
- structured
- trustworthy

This repository is not using a dark-heavy dashboard aesthetic by default.
Do not introduce an unrelated visual language for one page or one feature.

## 2. Source of Truth

The main design tokens live in:

- `src/app/globals.css`

The root font and global visual baseline live in:

- `src/app/layout.tsx`

The primitive UI layer lives in:

- `src/components/ui`

The shared CMS shell lives in:

- `src/components/cms/shared`

## 3. Typography

The current application font is:

- `Be Vietnam Pro`

Loaded through `next/font/google` in the root layout.

### Typography rules

- prefer readable Vietnamese-first typography
- use stronger weight and tighter tracking for headings
- use calmer, looser rhythm for body copy
- avoid decorative font changes outside the root system
- do not introduce a second font system for one feature

### Typical hierarchy

- heading: `text-heading`, semibold, tighter tracking
- body: `text-body`
- secondary/meta: `text-secondary`
- muted/supporting: `text-muted`

## 4. Core Color Tokens

Current semantic tokens in `globals.css`:

| Token | Value | Usage |
| --- | --- | --- |
| `--primary` | `#f7aa1b` | primary CTA, active state, highlight |
| `--app` | `#f8f6f2` | app/page background |
| `--subtle` | `#f0ede7` | softer section background |
| `--surface` | `#ffffff` | main card/surface color |
| `--footer` | `#26231f` | footer dark zone |
| `--footer-heading` | `#f5f0e8` | footer headings |
| `--footer-body` | `#c8bfb2` | footer body text |
| `--heading` | `#18160f` | main strong text |
| `--body` | `#302d26` | main body text |
| `--secondary` | `#6e6a62` | secondary text |
| `--muted` | `#a8a49e` | subtle/supporting text |
| `--hairline` | `#3d200a18` | light border |
| `--hairline-strong` | `#3d200a28` | stronger border |

### Color rules

- use semantic tokens before raw color values
- keep `primary` for action emphasis, not for full-page dominance
- keep large surfaces in the `app/subtle/surface` family
- do not introduce a separate dashboard palette unless the whole system changes
- keep admin status/badge tones local to the badge component instead of adding a scoped admin theme

## 5. Layout Primitives

Current layout primitives in `globals.css`:

- `layout-container`
- `layout-section-sm`
- `layout-section`
- `layout-section-lg`

### Current values

- `layout-container`
  - max width: `80rem`
  - mobile inline padding: `1rem`
  - tablet inline padding: `1.5rem`
  - desktop inline padding: `2rem`

- `layout-section-sm`
  - `2.5rem` mobile
  - `3.5rem` from `md`

- `layout-section`
  - `3.5rem` mobile
  - `5rem` from `md`

- `layout-section-lg`
  - `4.5rem` mobile
  - `6rem` from `md`

### Layout rules

- use `layout-container` for public content width control
- do not force `layout-container` into CMS shell level
- fix layout issues in the correct shell before patching many pages

## 6. Surface System

Current shared surface patterns:

### `surface-card`

- white surface
- light border
- rounded corners
- medium shadow

Use for:

- content cards
- listing cards
- stat blocks

### `surface-panel`

- white surface
- light border
- softer large-radius panel
- lighter shadow

Use for:

- settings blocks
- tables
- grouped content sections
- CMS content containers

### `surface-float`

- white surface
- light border
- stronger shadow
- backdrop blur

Use for:

- floating toolbar
- dropdown-like surfaces
- popovers
- sticky floating UI blocks

### Surface rules

- do not invent new card recipes if one of these already fits
- if a pattern repeats, promote it to a token or shared variant
- prefer subtle separation over heavy borders

## 7. Radius and Shadow

Current visual language prefers soft corners and soft depth.

### Radius usage

- `rounded-lg`
  - compact controls
- `rounded-xl`
  - common cards and controls
- `rounded-2xl`
  - larger premium blocks, hero surfaces, modals

### Shadow usage

- keep shadows soft and low-noise
- avoid harsh dark shadows
- use shadow for depth, not decoration
- avoid arbitrary one-off shadow stacks unless necessary

## 8. Interaction Rules

Global transitions currently cover:

- color
- background-color
- border-color
- box-shadow
- transform

### Hover

- subtle lift is acceptable
- subtle shadow increase is acceptable
- avoid aggressive scale or bounce

### Focus

- focus-visible must remain readable on light surfaces
- use the existing accent/focus language

### Disabled

- reduce emphasis without killing legibility
- avoid disabled states that still look interactive

## 9. Public Shell Language

Public shell characteristics:

- warm app background
- fixed header
- footer with a dedicated dark palette
- public content organized inside `layout-container`

Typical components:

- listing cards
- breadcrumbs
- sections with generous spacing
- editorial/news/project blocks

## 10. CMS Shell Language

CMS is a different layout system from the public site.

### Current CMS shell

From `src/components/cms/shared/CmsLayout.tsx`:

- full-width shell
- left sidebar
- mobile fixed rail with icon-first navigation
- desktop sidebar that can collapse into a rail
- right main area
- outer content padding at shell level
- no `layout-container` at the shell root

### CMS rules

- keep the shell full-width
- keep sidebar structurally separate from public layout primitives
- keep the mobile CMS sidebar as a fixed rail instead of a sheet menu
- use panel-based content inside the right column
- avoid squeezing CMS content into public-page width rules
- keep table and dashboard screens full-width
- constrain form-only CMS screens to a shared centered form shell

## 11. Component Language

### Header

- fixed
- light translucent background
- subtle border
- soft blur

### Footer

- dark background
- separate footer text tokens
- structurally distinct from the rest of the site

### Forms

Form language should stay consistent with current stack:

- `react-hook-form`
- `zod`
- shadcn-based inputs and controls

UI rules:

- inputs should feel clean and readable first
- validation messages should be concise and visible
- success/error states should not invent a second design language
- form-only CMS screens and listing-create screens should use a shared `max-w-2xl` content width
- use `surface-panel` as the default surface for those centered form screens

### Tables

CMS tables currently use:

- shadcn table primitives
- action dropdowns
- pagination footer
- surface panel wrappers

Rules:

- keep data tables visually aligned with CMS panels
- do not expose internal FE API endpoints in table actions
- prefer public-page links or domain actions instead

## 12. Library Alignment Rules

When adding new UI or state behavior, align with the stack already used by the repo:

- form handling: `react-hook-form`
- validation: `zod`
- primitives: shadcn-based components
- shared UI state: `zustand`
- query/mutation orchestration: `react-query`

Do not mix multiple approaches for the same problem without a strong reason.

## 13. Motion and Media

- keep image hover effects subtle
- use overlay only when legibility needs it
- loading states should reflect layout shape when practical
- avoid noisy or theatrical motion in content-heavy views

## 14. Copy and Localization

The UI is Vietnamese-first.

Rules:

- protect Vietnamese text from encoding drift
- prefer concise, readable labels
- keep naming consistent across route, navigation, page heading, and table copy

## 15. Design Drift Prevention

Before adding new visual code, check:

- is there already a token for this?
- is there already a surface for this?
- is there already a shared component for this?
- is this a public-shell pattern or a CMS-shell pattern?

If a style pattern appears in two or more places, stop copying it and promote it to:

- a token
- a shared variant
- a primitive
- a shared component

## 16. Minimum Design Verification

After meaningful UI work, verify:

- desktop layout
- mobile layout
- spacing rhythm
- text hierarchy
- hover/focus/disabled states
- Vietnamese copy rendering
- form error/success states if forms were touched
