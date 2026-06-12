# Techo Solutions Design System

This document captures the design direction implemented in [design-system.html](/home/kadd/Documents/Techo%20Solutions/design-system.html) and the interaction guidance established during review.

## Brand Direction

Techo Solutions should feel:

- Trustworthy
- Practical
- Clean
- Transaction-focused
- Modern without feeling flashy

The visual system is built from the supplied logo:

- Deep blue carries trust, structure, and primary emphasis
- Gold is reserved for action, highlights, and selective status cues
- Rounded forms soften the system, but composition remains structured
- Decorative elements stay restrained and never compete with core UI

## Core Design Rules

### Clean First

The interface should remain visually clean at all times.

- Avoid noisy gradients and decorative clutter
- Avoid heavy or overly stylized 3D effects
- Avoid unnecessary tinting on content cards
- Prefer clear spacing, simple depth, and legible hierarchy

### Decoration Layering

Decorative elements must stay behind content.

- Decorations may sit above a section background
- Decorations must not sit on top of buttons, inputs, text, badges, or product content
- Core components always take visual priority over decorative shapes

### Color Usage

Use color intentionally.

- Blue is the primary interface color
- Gold is the secondary accent color
- Neutrals carry surfaces, borders, and supporting text
- Gold should not wash across cards or become ambient decoration

## Color Tokens

| Token | Hex | Usage |
| --- | --- | --- |
| Blue 900 | `#0F2E6D` | Primary actions, strong headings, core brand emphasis |
| Blue 700 | `#23488F` | Secondary emphasis, gradients, icon accents |
| Blue 500 | `#3F69BB` | Supporting highlights, progress fill |
| Gold 500 | `#F3C63D` | Action accent, featured states, selective emphasis |
| Gold 100 | `#FFF5CC` | Light accent backgrounds only when needed |
| Ink | `#162033` | Primary text |
| Muted | `#61708B` | Secondary text |
| Line | `#DBE2EF` | Borders and dividers |
| Surface | `#F5F7FB` | Soft UI backgrounds |
| White | `#FFFFFF` | Primary card and page surfaces |

## Typography

### Primary Type

`Plus Jakarta Sans` is the main UI typeface.

Use it for:

- Headlines
- Body text
- Labels
- Pricing
- Buttons
- Product UI

### Accent Type

`Caveat` is reserved for expressive brand moments only.

Use it sparingly for:

- Taglines
- Soft reassurance
- Human brand accents

Do not use it for:

- Body text
- UI labels
- Forms
- Data-heavy surfaces

## Logo Usage

The design system uses the provided SVG logo mark from:

- [logo.svg](/home/kadd/Documents/Techo%20Solutions/logo.svg)

The logo should remain crisp, unmodified, and used with generous space around it.

## Components

### Buttons

Buttons should feel slightly dimensional, but restrained.

- Use soft inner highlight and inner shadow only
- Avoid heavy double borders
- Avoid exaggerated raised effects
- Primary buttons should read as one clean surface
- Secondary buttons should stay light and quiet

Primary button usage:

- Main CTA
- Product action
- Onboarding progression

Secondary button usage:

- Tracking actions
- Supporting actions
- Alternative navigation

### Cards

Cards should feel structured and polished.

- Clean white or near-white surfaces
- Soft border treatment
- Light shadow depth
- Minimal decoration
- No yellow surface tinting
- No decorative strips that resemble progress bars

Cards should communicate hierarchy through spacing, type, and grouping rather than ornament.

### Badges

Badges should be compact and intentional.

- Small size
- Tight padding
- Light fill
- Subtle border
- Used for trust, status, and condition markers

Examples:

- Verified buyer
- Fast payout
- Grade A
- High demand
- Priority batch

### Progress Bars

Progress bars belong in the component system explicitly, not as decorative card accents.

Use progress bars for:

- Offer review progress
- Payout processing
- Operational workflow states

Do not mimic this pattern decoratively elsewhere.

### Ecommerce Card

The ecommerce example demonstrates how product UI should feel in this system.

Include:

- Real product imagery
- Product title
- Price or estimate
- Status badges
- Clear primary CTA

The ecommerce CTA should be direct and commerce-oriented:

- `Buy now`

## Icon System

The page uses `Lucide` as the icon library.

Icons should be used with intention.

### Use Icons For

- Buttons where the action benefits from a cue
- Trust/status badges
- Progress or operational states
- Product purchase actions

### Avoid Icons For

- Every label
- Decorative repetition
- Sections that are already self-explanatory
- Adding visual noise without improving meaning

### Current Intentional Icon Patterns

- `smartphone` for `Sell Device`
- `scan-search` for `Track Offer`
- `shopping-bag` for `Buy now`
- `badge-check`, `shield-check`, `zap`, `flame`, `trending-up` for status/trust
- `clipboard-check` and `wallet` for progress state labels

## Layout Guidance

### Mobile-First Responsiveness

The system should be designed mobile-first and scaled upward for tablet and desktop.

- Start with the smallest practical viewport first
- Build single-column layouts by default
- Add complexity only when screen space genuinely supports it
- Treat desktop as an enhancement, not the baseline

Responsive rules:

- Default sections should stack vertically on mobile
- Cards should expand to full available width before forming multi-column grids
- Buttons should remain easy to tap and never feel cramped
- Text should wrap naturally without awkward compression
- Decorative elements should reduce or simplify on small screens
- Images should scale cleanly without cropping important content
- Form controls should stay large enough for touch interaction
- Badge rows should wrap cleanly instead of forcing horizontal overflow
- Product and dashboard cards should preserve hierarchy when stacked
- Spacing should tighten on mobile, but never become crowded

Breakpoint behavior:

- Mobile defines the base layout and spacing system
- Tablet may introduce wider card groupings and more balanced two-column layouts
- Desktop may expand into multi-column presentation where readability remains strong

Never do this:

- Do not design desktop-first and compress downward
- Do not rely on tiny text to preserve layout
- Do not let cards overflow horizontally
- Do not place decorative elements where they interfere with mobile readability
- Do not make touch targets too small
- Do not hide essential actions just to preserve composition

Touch and interaction guidance:

- Primary actions should remain obvious and reachable on smaller screens
- Interactive controls should have comfortable tap area
- Buttons should hold clear visual weight even when stacked
- Inputs, selects, and textareas should remain fully usable without zooming
- Progress bars, badges, and product metadata should remain legible at mobile sizes

### Responsive QA Checklist

Check every implementation against this list before signoff:

- Verify the layout works cleanly on a small mobile viewport first
- Verify no horizontal scrolling is introduced by cards, images, badges, or buttons
- Verify all primary actions remain visible and easy to tap
- Verify buttons and form inputs maintain comfortable touch size
- Verify headings, body copy, and labels remain readable without shrinking too far
- Verify stacked cards still preserve content hierarchy and spacing
- Verify badge rows wrap cleanly instead of colliding or overflowing
- Verify product images keep the important subject visible on smaller screens
- Verify decorative shapes do not cover text, buttons, or form fields
- Verify progress bars and metrics still read clearly at mobile widths
- Verify two-column and multi-column sections collapse in a controlled way
- Verify desktop enhancement does not break the mobile-first baseline
- Verify the page still feels clean and uncluttered at every breakpoint

### Hero

The hero should:

- Present the logo clearly
- Establish trust and purpose immediately
- Balance brand presence with a concise explanation
- Keep decorative shapes in the background only

### Token and Spec Sections

These sections should:

- Be easy to scan
- Use consistent card behavior
- Avoid novelty treatments
- Read as reference documentation, not marketing clutter

### Application Surfaces

Use application examples to demonstrate how the system behaves in practice.

Current examples:

- Landing hero card
- Operations dashboard card
- Ecommerce product card
- Onboarding panel

## Interaction Principles

- Keep actions obvious
- Use one strong CTA per area
- Make trust signals visible but not loud
- Keep surfaces readable at a glance
- Favor clarity over visual effects

## File Reference

Primary artifact files:

- [design-system.html](/home/kadd/Documents/Techo%20Solutions/design-system.html)
- [design-system.md](/home/kadd/Documents/Techo%20Solutions/design-system.md)
- [logo.svg](/home/kadd/Documents/Techo%20Solutions/logo.svg)

## Summary

This system should feel like a clean, trustworthy buying and selling platform. Blue leads, gold supports, icons are used intentionally, and decoration remains subordinate to content. Every component should reinforce clarity, trust, and ease of transaction.
