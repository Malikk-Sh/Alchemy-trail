# Visual direction

Last updated: 2026-09-15

This file captures the durable visual language from the user's supplied reference screens. The screenshots themselves are reference material, not a mandate to reproduce another game's exact layouts or assets.

## Core look

- warm, approachable fantasy-apothecary mood
- softly lit low-poly / faceted environmental art with readable silhouettes
- dark walnut/brown structural chrome framing lighter content
- parchment/ivory cards for important information and inventory content
- saturated teal/cyan for the primary active action and current navigation state
- amber/gold for currency, warmth, reward, and magical highlights
- moss/leaf greens for botanical identity
- large serif display typography paired with compact sans-serif utility labels
- rounded but substantial controls that feel carved, inset, or physically mounted

## Quality bar from the references

The target is not achieved by recoloring ordinary web panels. Each major screen should read as one illustrated game scene with UI mounted into it. Quality comes from scene composition + cohesive props + material UI + restrained motion together.

Prioritize:

- a recognizable environment or diorama occupying the screen, not a generic background
- large original prop art with faceted shading and readable silhouettes
- overlapping foreground/background layers that create depth
- warm key light, soft ambient shadows, localized magical glow, and small highlight accents
- fewer but larger, more physical interface surfaces
- animation tied to believable objects: fire flicker, steam drift, mortar motion, spoon motion, active glow, button compression

## Mobile UI language

- persistent, compact top chrome when useful
- large single-purpose touch targets, usually 44 CSS px or larger
- strong foreground/background separation instead of thin minimalist UI
- ingredient items should read like collectible physical cards with a bold botanical icon and count/name below
- active actions should glow or lift slightly; disabled actions should remain legible but visibly unavailable
- use concise labels and visual hierarchy rather than dense explanatory copy

## Brewing-specific translation

The reference brewing screen is useful for the physical workbench language (mortar, cauldron, ingredients, large Infuse action), but Alchemy Trail's defining mechanic remains the Essence Atlas from the GDD.

Therefore:

- keep the Essence Atlas as the primary spatial gameplay visualization
- embed the Atlas into an illustrated apothecary/workbench scene rather than presenting it as a technical rectangle
- Atlas rendering should resemble magical cartography/topography with contours, star/rune marks, glows, and material framing
- grinding should feel like manipulating a mortar, not editing a numeric form
- stirring should feel like a physical cauldron/spoon gesture that advances the Atlas marker
- Warmth and other effects should glow like magical destinations rather than ordinary UI badges
- bottling should resolve into a parchment/result card with clear effect + potency

## Production asset pipeline

- procedural SVG / Canvas / CSS are the default runtime art tools because they are original, scalable, fast on mobile, and compatible with the GDD
- use low-poly faceted forms and hand-authored shading rather than flat icon geometry
- GLB may be created as an authoring/source asset when a prop or character benefits from 3D modeling; bake it down for runtime unless real-time depth/interaction is essential
- do not add a general-purpose 3D engine solely for decoration
- keep source and generated assets organized by scene under `assets/generated/`
- motion lives in a shared layer and must honor `prefers-reduced-motion`

## Current Brew Scene v2 assets

- `assets/generated/brew/workshop.svg` — original apothecary window/workbench environment with low-poly valley
- `assets/generated/brew/cauldron.svg` — faceted iron cauldron/hearth prop
- `assets/generated/brew/mortar.svg` — stone mortar/pestle with botanical contents
- `assets/generated/brew/sunleaf.svg` — original Sunleaf botanical prop/card art
- `assets/generated/brew/bottle.svg` — original potion bottle/result prop
- `styles/brew-production.css` — illustrated composition/material layer
- `styles/motion.css` — tactile scene/UI motion layer

## Originality rule

Do not pixel-copy the supplied references, their characters, exact maps, illustrations, or icon designs. Recreate the broad material language, hierarchy, warmth, polish, and readability with original procedural/CSS/SVG/Canvas assets consistent with the Alchemy Trail GDD.
