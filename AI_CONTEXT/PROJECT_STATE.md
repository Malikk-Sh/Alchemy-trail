# Current project state

Last updated: 2026-09-14

## Current milestone

**Phase 1 — first real brewing vertical slice is implemented in code and entering visual/gameplay verification.**

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
- tactile grinding based on pointer travel distance, not circle recognition
- keyboard-accessible grind progression
- commit ingredient to a real queued path
- circular stirring gesture using Pointer Events and unwrapped angular travel
- marker movement by polyline arc length
- deterministic distance-based resonance + potency preview
- explicit `Infuse Warmth` gate available only inside resonance
- bottle result card with captured effect and potency
- Reset / Brew another flows
- title screen now has a real navigation action into brewing
- UI material language updated toward the supplied references: dark wood, parchment cards, teal primary actions, amber magical accents

## Verification status

Verified locally before commit:

- strict TypeScript compilation passes
- 4 new brewing-math tests pass: grind-path slicing/translation, arc-length marker travel, deterministic resonance, angle unwrap

GitHub CI is expected to remain the source of truth for the full `npm run check` suite. Continuous BrowserStack real-device checks are intentionally deferred/manual.

## Not implemented yet

- multi-ingredient queue / multiple effects
- pan/zoom Atlas camera
- water dilution and heat gameplay
- customers, pricing, shop economy
- IndexedDB persistence/migrations
- journal/recipes, traders, garden, progression
- PWA/offline, sound, production content scale
- final generated art assets matching the visual direction

## Known risks / watch items

- current first brew is intentionally narrow: one ingredient → one effect
- visual/gameplay inspection of the deployed build is still needed before declaring the slice polished
- `moduleResolution: Bundler` without a bundler remains intentional
- no package lock is committed yet; CI still uses `npm install`
- the full original GDD is not yet copied into the repository; `PRODUCT_SPEC.md` is a working distillation
