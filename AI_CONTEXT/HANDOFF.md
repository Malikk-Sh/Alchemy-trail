# Handoff — next session starts here

## Immediate objective

Finish the Phase 0 mobile visual smoke check, then implement **Milestone 1: the first real brewing vertical slice**. Do not start customers before the brew loop works.

## Current verification fact

GitHub Actions run #2 is green and `npm run check` passes. Do not repeat repository archaeology or redesign the foundation without a concrete reason.

## First actions

1. Read `PROJECT_STATE.md`, `DECISIONS.md`, and current source/tests.
2. Run the app locally and smoke-test the title screen at 360×640 and 390×844 when a browser is available.
3. Begin the brewing slice in a cohesive series of commits.
4. Keep `npm run check` green after each meaningful milestone.

## Milestone 1 implementation order

1. data definitions for one original effect node and one original ingredient path
2. Canvas Atlas renderer with device-pixel-ratio handling
3. brewing domain state / queued path
4. ingredient path preview
5. grind percentage interaction
6. commit ingredient to queue
7. spoon stirring gesture via Pointer Events
8. arc-length marker interpolation
9. resonance preview and deterministic potency
10. explicit Infuse action
11. bottle result card
12. tests for every deterministic calculation added

## Acceptance gate

A player on a phone-sized viewport can make one real potion from scratch: manipulate one ingredient, choose partial/full grind, add it, stir along the actual queued path, stop deliberately near a resonance node, infuse an effect, and bottle a result. No fake buttons or bypass state.

## Do not do yet

- do not generate dozens of ingredients/effects
- do not add customers/economy before the brew slice is real
- do not add a framework or state-management library
- do not spend a session polishing docs instead of gameplay
