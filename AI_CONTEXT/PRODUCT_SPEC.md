# Product specification — high-signal reference

## North star

Every development decision should make it more satisfying to discover, craft, optimize, and sell an original potion through direct touch interaction on a phone.

## Product

Alchemy Trail is an original mobile-web/PWA alchemy shop simulator. The defining mechanic is the **Essence Atlas**: ingredients contribute characteristic vector paths; grinding controls how much path becomes active; stirring advances the potion marker along queued path distance; reaching resonance nodes allows the player to infuse effects; precision determines potency.

Core loop: start day → inspect stock/garden/traders/commissions → customer request → choose/grind/add ingredients → stir/heat/dilute/stabilize → infuse effects → bottle → sell/negotiate/refuse → earn coins/reputation/research → upgrades/progression → end day.

## Non-negotiable technology

- Mobile web first, portrait first; support tablet/desktop responsively.
- Vanilla semantic HTML, CSS, TypeScript, ES Modules.
- No React/Vue/Svelte/Angular/Solid/Next/Nuxt/Astro app framework.
- No Phaser/Pixi/Three/Babylon/PlayCanvas/Unity/Godot/Construct/ECS framework.
- No Tailwind/Bootstrap/Material UI/Bulma/Ionic.
- Browser-native APIs first: Canvas 2D, SVG, Web Audio, Pointer Events, IndexedDB, Service Worker/Cache API, requestAnimationFrame, ResizeObserver.
- Small narrow libraries only when justified; they must not become architecture.
- Static hosting compatible.
- Strict TypeScript; calculation-heavy systems tested.
- Content data-driven, not embedded in screen classes.
- Core gameplay must eventually work offline after cached first load.

## UX principles

- Tactile first: direct manipulation where practical.
- Discovery before instructions.
- Calm but deep; avoid twitch pressure and forced timers.
- One dominant activity per mobile screen.
- Primary tap targets roughly 44 CSS px minimum.
- Handle safe areas.
- No essential hover behavior.
- Never hide why an action is unavailable.
- Gesture ownership must be explicit; once captured, another subsystem must not steal it.

## Brewing rules

- Atlas world coordinates are gameplay units, not pixels; v1 bounds roughly -2400..2400 both axes.
- DOM/CSS: screens, panels, lists, dialogue, HUD. Canvas 2D: Atlas/path/marker/map particles. SVG: scalable/procedural icons and ingredient silhouettes.
- Ingredient paths are local-space polylines translated to the queued endpoint.
- Grinding controls active path fraction; pointer travel distance matters more than circle recognition.
- Paths queue before traversal.
- Stirring measures angular travel around the cauldron and advances path distance continuously.
- Player can stop at arbitrary path distance; interpolation is by polyline arc length.
- Water continuously pulls marker toward origin; never teleport.
- Effect acquisition should use auto-preview + explicit `Infuse` action.
- Resonance potency: distance-to-node-center determines I/II/III deterministically.
- Base cauldron has 3 effect slots; stronger duplicate potency replaces weaker duplicate without another slot.
- Ordinary experimentation should be forgiving.

## Input priority while brewing

1. mortar gesture
2. spoon gesture
3. water/heat control
4. ingredient drag
5. map pan
6. map pinch zoom
7. generic tap

Use Pointer Events only. `touch-action: none` belongs only on gesture-owning surfaces, not globally.

## Persistence / determinism

- IndexedDB for game save; localStorage only for tiny preferences.
- Explicit save schema version and migrations.
- Autosave after meaningful economic/progression actions and on visibility hidden.
- Daily content uses seeded randomness; subsystem seeds derive from profile/day/subsystem.
- Do not serialize functions/classes directly.

## Originality/IP boundary

Genre-level alchemy/shop/crafting mechanics are allowed, but names, lore, atlas topology, effect taxonomy, ingredient names/shapes/art, bottles, UI composition, characters, writing, balancing, music/sound, progression, quests, economy, and icons must be original. Never recreate copyrighted screens/assets/text/recipes/maps from an existing commercial game.

## Initial content targets

MVP can start with 12–16 effects; v1 targets 30–36. v1 targets 35–50 ingredients, 16 customer archetypes, 100+ request templates, garden, traders, recipes/mastery, upgrades, reputation, commissions, world events, PWA, export/import save, accessibility settings, and original assets.

## Testing gates

Unit coverage must eventually include vector math, polyline interpolation, grind slicing, resonance potency, request evaluation, pricing, deterministic RNG, save migrations, unlocks. Integration paths include ingredient→grind→add→stir→infuse→bottle and customer→offer→evaluate→sale→coins/save. E2E target viewports include 390×844, 360×640, 412×915, and desktop 1440×900.

## AI implementation rule

Build vertical playable slices in the order `data → logic → UI → persistence → tests`. Prefer gameplay correctness over flourish, mobile usability over desktop complexity, deterministic systems over uncontrolled randomness, native APIs over dependencies, small modules over speculative abstractions, and working implementation over scaffolding for its own sake.
