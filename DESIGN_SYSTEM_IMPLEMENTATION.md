# Design System Implementation

## Overview
Phase 2 establishes the core visual tokens and component architecture for TimeCapsule, aligning with the brand guidelines to deliver a premium, nostalgic, and intelligent feel.

## Colors
The HSL color tokens have been refined to support an immersive dark mode (museum-like) and a clean light mode.
- **Dark Mode Background:** Deep slate/black (`224 71% 4%`)
- **Primary Elements:** High contrast clean whites on dark, and dark slate on light.
- **Muted Elements:** Deep charcoal for subtle borders and backgrounds.

## Typography
- Implemented `tracking-tight` for headings (H1-H6) to give a solid, premium typographic scale.
- Added `tracking-wide` to body text with `font-feature-settings: "rlig" 1, "calt" 1` for elegant legibility.

## Motion & Animation
- **fade-in**: Subtle opacity fade for container elements.
- **fade-in-up**: Soft upward reveal for heroic typography and cards.
- **pulse-slow**: 4-second cubic-bezier infinite pulse for ambient glowing effects (to be used later).
- **spring animations**: Used Framer Motion `type: "spring"` for the timeline nodes to create a physical, tactile feel on hover.

## Primitives
- Integrated `shadcn/ui` for foundational primitives (`Button`, `Card`).
- Created a `TimelinePreview` visual component using `framer-motion`.
- Fully responsive `Header` and `Footer` layout shells.
- Integrated `next-themes` for seamless light/dark toggling.

## Accessibility
- Used semantic HTML (`<header>`, `<main>`, `<footer>`, `<section>`).
- Implemented `aria-label` and `sr-only` text for icon-only buttons (like the theme toggle).
- Verified contrast ratios with the updated HSL tokens.
