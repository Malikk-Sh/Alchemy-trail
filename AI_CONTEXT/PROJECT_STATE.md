# Current project state

Last updated: 2026-09-15

## Current milestone

**Phase 1 — first real brewing vertical slice is playable and has received its first interaction/feedback polish pass.**

The user explicitly deferred continuous viewport/BrowserStack checking for now. BrowserStack remains available as a manual workflow only.

## Implemented

Foundation:

- strict TypeScript / browser ES Modules / no framework
- lightweight `Game` + `ScreenManager`
- responsive safe-area-aware CSS tokens and static Node server
- geometry/polyline utilities and Node unit tests
- content validation + GitHub Actions CI
- persistent `AI_CONTEXT/` handoff system

First brewing slice:

- original `Sunleaf` ingredient data with a local vector essence path
- original `Warmth` effect/resonance node data
- Canvas 2D Essence Atlas with DPR handling
- live ingredient-path preview driven by grind amount
- tactile grinding by pointer travel distance plus press-and-hold fallback and keyboard progression
- commit gating so the chosen path must actually be capable of reaching Warmth resonance
- circular stirring gesture using Pointer Events and unwrapped angular travel
- marker movement by polyline arc length
- separate travelled and remaining path visualization
- deterministic distance-based resonance + potency preview
- live resonance meter/link and stronger visual state near the node
- explicit `Infuse Warmth` gate available only inside resonance
- captured Infuse-time potency used for the bottled result
- deterministic quality tiers: Faint / Steady / Potent / Masterwork
- original inline bottle result graphic and parchment quality card
- four-stage `Grind → Stir → Infuse → Bottle` guidance with contextual instructions
- Reset / Brew another flows
- title screen real navigation into brewing
- UI material language based on supplied references: dark wood, parchment cards, teal primary actions, amber magical accents

## Verification status

Verified on 2026-09-15:

- strict TypeScript compilation passes
- all 10 unit tests pass
- tests cover geometry, grind slicing/translation, arc-length marker travel, path completion, deterministic resonance, exact Sunleaf→Warmth reachability, quality tiers, and angle unwrap
- GitHub Actions CI run #29 completed successfully with the full repository `npm run check`

Continuous BrowserStack real-device checks remain intentionally deferred/manual.

## Not implemented yet

- multi-ingredient queue / multiple effects
- pan/zoom Atlas camera
- water dilution and heat gameplay
- customers, pricing, shop economy
- IndexedDB persistence/migrations
- journal/recipes, traders, garden, progression
- PWA/offline, sound, production content scale
- final generated art/content scale

## Known risks / watch items

- current first brew is intentionally narrow: one ingredient → one effect
- human visual/gameplay feedback on the current deployed build is still needed before declaring the core brew feel accepted
- `moduleResolution: Bundler` without a bundler remains intentional
- no package lock is committed yet; CI still uses `npm install`
- the full original GDD is not yet copied into the repository; `PRODUCT_SPEC.md` is a working distillation
