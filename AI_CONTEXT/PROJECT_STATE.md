# Current project state

Last updated: 2026-09-15

## Current milestone

**Phase 1 — first real brewing vertical slice is playable, Russian-localized, and has completed a four-PR screenshot-driven production-art overhaul.**

The user explicitly deferred continuous viewport/BrowserStack checking for now. BrowserStack remains available as a manual workflow only.

## Implemented

Foundation:

- strict TypeScript / browser ES Modules / no framework
- lightweight `Game` + `ScreenManager`
- responsive safe-area-aware CSS tokens and static Node server
- geometry/polyline utilities and Node unit tests
- content validation + GitHub Actions CI
- persistent `AI_CONTEXT/` handoff system
- reproducible Vercel static build via `npm run build:site`

First brewing slice:

- original `Sunleaf` / player-facing `Солнцелист` ingredient data with a local vector essence path
- original `Warmth` / player-facing `Тепло` effect/resonance node data
- Canvas 2D Essence Atlas with DPR handling
- live ingredient-path preview driven by grind amount
- tactile grinding by pointer travel distance plus press-and-hold fallback and keyboard progression
- commit gating so the chosen path must actually be capable of reaching resonance
- circular stirring gesture using Pointer Events and unwrapped angular travel
- marker movement by polyline arc length
- separate travelled and remaining path visualization
- deterministic distance-based resonance + potency preview
- explicit Infuse gate available only inside resonance
- captured Infuse-time potency used for the bottled result
- deterministic quality tiers with Russian player-facing labels
- four-stage guidance, reset, rebrew, and real title→brew navigation

Current production-art state:

- Russian is the default player-facing language; `Alchemy Trail` remains the brand
- original low-poly SVG workshop with window, valley, river, mountains, shelves, lantern, banner, counter and props
- upgraded original cauldron/hearth, mortar/pestle, Sunleaf, water flask, potion bottle, and custom leaf brand mark
- scene-first Brew composition: compact Atlas above one physical workshop scene; mortar and cauldron are the interaction objects rather than generic cards
- disabled states no longer ghost/fade the physical props
- wood/parchment/teal/amber material system, tactile active states, fire/steam/item motion and reduced-motion support
- resonance and infused states visibly affect the cauldron/readout
- bottling resolves into a cinematic parchment reward overlay; Masterwork has premium treatment
- Essence Atlas v2 uses a material dark-green chart with topography, runes, etched frame, alchemical node sigils, layered paths/anchors, curved resonance link, and reduced neon/debug-graph feel

## Verification status

Verified on 2026-09-15:

- strict TypeScript compilation passes
- all 10 unit tests pass
- tests cover geometry, grind slicing/translation, arc-length marker travel, path completion, deterministic resonance, exact Sunleaf→Warmth reachability, quality tiers, and angle unwrap
- autonomous visual PRs #1–#4 each passed GitHub Actions before squash merge
- latest visual/Atlas PR CI run #63 completed successfully

Continuous BrowserStack real-device checks remain intentionally deferred/manual.

## Not implemented yet

- multi-ingredient queue / multiple effects
- pan/zoom Atlas camera
- water dilution and heat gameplay
- customers, pricing, shop economy
- IndexedDB persistence/migrations
- journal/recipes, traders, garden, progression
- PWA/offline, sound, production content scale
- final broad asset/content scale

## Known risks / watch items

- current first brew is intentionally narrow: one ingredient → one effect
- the four-PR art overhaul must now be judged from the deployed build by the user; do not assume reference-level parity without human feedback
- CSS art layers are intentionally additive (`brew-production`, `brew-recompose`, `brew-details`, `brew-v4`, `brew-v5`, `brew-v6`); consolidate only after the visual direction is accepted, not during active art iteration
- `moduleResolution: Bundler` without a bundler remains intentional
- no package lock is committed yet; CI still uses `npm install`
- the full original GDD is not yet copied into the repository; `PRODUCT_SPEC.md` is a working distillation
