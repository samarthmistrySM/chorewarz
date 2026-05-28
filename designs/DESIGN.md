---
name: Harmonious Living Design
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#444654'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#747685'
  outline-variant: '#c4c5d6'
  surface-tint: '#2f52d0'
  primary: '#2c50cd'
  on-primary: '#ffffff'
  primary-container: '#496ae8'
  on-primary-container: '#fffbff'
  inverse-primary: '#b8c4ff'
  secondary: '#3e6658'
  on-secondary: '#ffffff'
  secondary-container: '#c0ecda'
  on-secondary-container: '#446c5e'
  tertiary: '#4d5d73'
  on-tertiary: '#ffffff'
  tertiary-container: '#66768d'
  on-tertiary-container: '#fdfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dde1ff'
  primary-fixed-dim: '#b8c4ff'
  on-primary-fixed: '#001453'
  on-primary-fixed-variant: '#0337b8'
  secondary-fixed: '#c0ecda'
  secondary-fixed-dim: '#a5d0be'
  on-secondary-fixed: '#002117'
  on-secondary-fixed-variant: '#264e41'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding-desktop: 40px
  container-padding-mobile: 20px
  gutter: 24px
  section-gap: 64px
  card-gap: 16px
---

## Brand & Style
This design system is built for the "Flat Task Tracker," an application designed to reduce the friction of shared living through clarity and accountability. The brand personality is **calm, organized, and cooperative**, aiming to evoke a sense of domestic peace rather than bureaucratic chore-management. 

The aesthetic follows a **Soft Modernist** approach. It leverages high-quality typography, generous whitespace, and a "soft-touch" interface that feels tactile yet digital. By avoiding harsh edges and high-vibrancy colors, the UI lowers the cognitive load for users who are simply trying to check their daily responsibilities. The emotional response should be one of relief and order—a digital reflection of a clean, well-kept home.

## Colors
The palette is rooted in nature and stability. 
- **Primary (Soft Blue):** Used for main actions and branding elements to instill a sense of reliability.
- **Secondary (Sage Green):** Used for growth-related UI, success states, and positive reinforcement.
- **Neutral (Slate Grays):** A range of cool grays provides the structural skeleton without the starkness of pure black.

**Task Status Tokens:**
- **To-do:** A muted slate that represents a "pending" or "quiet" state.
- **In Progress:** A brighter, active blue to draw attention to current activities.
- **Completed:** A soft, desaturated green that provides a satisfying but non-distracting sense of accomplishment.

## Typography
This design system utilizes **Plus Jakarta Sans** for all roles. This typeface was chosen for its modern geometric foundation paired with soft, humanist terminals that feel welcoming.

- **Headlines:** Use Bold weights with slight negative letter-spacing to create a "locked-in," organized appearance for page titles.
- **Body Text:** Use Regular weights with generous line-height (1.5x) to ensure high readability when scanning chore descriptions.
- **Labels:** Use SemiBold uppercase for status badges and small metadata to maintain hierarchy without increasing font size.

## Layout & Spacing
The layout philosophy follows a **Fixed Grid** on desktop (max-width 1200px) and a **Fluid Grid** on mobile devices. The rhythm is built on an 8px base unit.

- **Whitespace:** Use generous margins between sections to prevent the interface from feeling "cluttered"—a direct metaphor for the tidy living space the app promotes.
- **Responsive Behavior:** On mobile, side margins shrink to 20px, and multi-column card layouts stack vertically into a single-column "feed" style for easy thumb scrolling.
- **Alignment:** All elements should align to the left to establish a clear vertical reading line, aiding quick information retrieval.

## Elevation & Depth
To maintain a modern and professional feel, depth is communicated through **Tonal Layers** supplemented by **Ambient Shadows**.

- **Surface Levels:** The background uses the neutral base. Cards and containers use a pure white (#FFFFFF) surface to "pop" against the gray.
- **Shadows:** Use extremely soft, diffused shadows (Blur: 20px, Opacity: 4-6%) with a slight blue tint (#5C7CFA) to ground the elements. This prevents the "dirty" look of pure black shadows.
- **Interaction:** Upon hover, cards should slightly increase their elevation (longer shadow) and lift by 2px to signal interactivity.

## Shapes
The shape language is defined by **large, friendly radii**. 

- **Cards:** Use `rounded-xl` (1.5rem / 24px) to create a distinct, friendly container that feels safe and approachable.
- **Buttons & Inputs:** Use `rounded-lg` (1rem / 16px) to maintain consistency with the cards while appearing slightly more structured.
- **Chips/Badges:** Use fully pill-shaped (999px) borders for status indicators to differentiate them from functional buttons.

## Components
Consistent styling across components ensures the system feels unified:

- **Task Cards:** These are the primary unit of the UI. They feature a white background, 24px corner radius, and a 1px soft gray border. Content is padded by 24px on all sides.
- **Status Chips:** High-contrast text on a low-opacity version of the status color (e.g., Soft Blue text on 10% Blue background) for maximum readability.
- **Primary Buttons:** Solid Soft Blue backgrounds with white text. No gradients. Ensure a minimum height of 48px for touch accessibility.
- **Checkboxes:** Large (24x24px) with rounded corners (4px) to make the physical act of "checking off" a chore feel deliberate and satisfying.
- **Input Fields:** Soft gray background with no border in its default state; shifts to a 2px Primary Blue border when focused.
- **Progress Bar:** A thin (8px) horizontal track used at the top of shared dashboards to show the percentage of flat chores completed for the week.