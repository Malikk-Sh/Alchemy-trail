# Current project state

Last updated: 2026-09-15

## Current milestone

**Phase 1 — first real brewing vertical slice is playable, Russian-localized, and has completed three major screenshot-driven production-art cycles.**

BrowserStack/device-matrix checks remain intentionally manual/deferred by user request.

## Implemented

Foundation:

- strict TypeScript / browser ES Modules / no framework
- lightweight `Game` + `ScreenManager`
- responsive safe-area-aware CSS tokens and static Node server
- geometry/polyline utilities and Node unit tests
- content validation + GitHub Actions CI
- persistent `AI_CONTEXT/` handoff system
- reproducible Vercel static build via `npm run build:site`
- Vercel Git integration now auto-deploys `main` to production and visual branches to preview deployments

First brewing slice:

- original `Sunleaf` / player-facing `Солнцелист` ingredient data with a local vector essence path
- original `Warmth` / player-facing `Тепло` effect/resonance node data
- Canvas 2D Essence Atlas with DPR handling
- live ingredient-path preview driven by grind amount
- tactile grinding by pointer travel distance plus press-and-hold fallback and keyboard progression
- commit gating so the chosen path can reach resonance
- circular stirring gesture using Pointer Events and unwrapped angular travel
- marker movement by polyline arc length
- deterministic distance-based resonance + potency preview
- explicit Infuse gate available only inside resonance
- captured Infuse-time potency used for the bottled result
- deterministic quality tiers with Russian player-facing labels
- four-stage guidance, reset, rebrew, and real title→brew navigation

Current production-art state:

- Russian is the default player-facing language; `Alchemy Trail` remains the brand
- upgraded original low-poly SVG workshop with deeper mountains, river, village, clouds, trees, shelves, bottles, books, hanging herbs, banner, lantern and counter props
- dedicated portrait title key-art shows an alchemy desk, journal, potion, Sunleaf and mountain valley rather than reusing Brew background
- cauldron/hearth, mortar/pestle, Sunleaf, potion bottle and water flask have received a higher-fidelity faceted low-poly redraw
- scene-first Brew composition now pushes the cauldron forward as the main focal object while the preparation station is secondary
- Atlas is a compact magical dashboard above the physical workshop rather than a competing full-screen panel
- physical water flask is visible beside the cauldron as a decorative scene prop without fake interaction
- mobile reward overlay is viewport-centred, safe-area aware and scrollable on short screens; the prior offset bug caused by workbench `perspective` is fixed at the containing-block level
- Brew stage choreography uses existing gameplay state: preparation is emphasized before commit, cauldron after commit, resonance becomes the dramatic peak, and Bottle becomes the primary visual action after Infuse
- tactile motion layer includes grinding flecks/rocking, stirring bubbles, fire/steam response, Atlas sweep, resonance/Infuse feedback, stage pulses and reduced-motion support
- atmosphere pass adds cool window light, warm hearth/lantern light, vignette, deeper wood treatment, parchment material depth and stronger prop grounding
- Brew HUD remains compact with shorter topbar/Atlas, compact ingredient slot and sticky real action bar for Reset/Infuse/Bottle
- Essence Atlas v2 uses a material dark-green chart with topography, runes, etched frame, alchemical node sigils, layered paths/anchors and curved resonance link

## Verification status

Verified on 2026-09-15:

- strict TypeScript compilation passes
- all 10 unit tests pass
- tests cover geometry, grind slicing/translation, arc-length marker travel, path completion, deterministic resonance, exact Sunleaf→Warmth reachability, quality tiers, and angle unwrap
- visual PRs #1–#13 were merged only after green GitHub Actions CI
- latest atmosphere/material PR #13 passed CI run #91 before merge
- PR #10 CI #85, PR #11 CI #87, PR #12 CI #89 and PR #13 CI #91 all passed

## Not implemented yet

- multi-ingredient queue / multiple effects
- pan/zoom Atlas camera
- water dilution and heat gameplay
- customers, pricing, shop economy
- IndexedDB persistence/migrations
- journal/recipes, traders, garden, progression
- PWA/offline, sound, production content scale

## Known risks / watch items

- current first brew is intentionally narrow: one ingredient → one effect
- the current art baseline still requires human visual judgment; do not claim reference-level parity without screenshots/feedback
- active art iteration currently uses additive CSS layers through `brew-v13.css`; consolidate only after the visual direction is accepted
- `:has()` is used for modern mobile-browser presentation states; keep supported-browser targets in mind
- `moduleResolution: Bundler` without a bundler remains intentional
- no package lock is committed yet; CI still uses `npm install`
- the full original GDD is not yet copied into the repository; `PRODUCT_SPEC.md` is a working distillation
