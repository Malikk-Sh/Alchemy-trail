# Handoff — next session starts here

## Immediate objective

Verify and refine the **first playable brew** now present on `main`, using the deployed build for human visual/gameplay feedback. Do not jump to customers until this core interaction feels correct.

## Current playable flow

Title → Open the Essence Atlas → grind Sunleaf by pointer travel → commit ingredient → stir in circles → steer marker along the real path → reach Warmth resonance → Infuse → Bottle → see potency result.

## Next work package

1. Inspect the deployed brew visually and fix obvious mobile usability/layout issues reported by the user.
2. Tune grind travel, stirring sensitivity, Atlas framing, resonance radius, and feedback based on feel rather than adding more systems prematurely.
3. Add small original procedural/SVG visual assets where they materially improve readability (ingredient/mortar/bottle/effect), without copying the reference art.
4. Once the one-potion flow feels good, add the next data-driven ingredient/effect only if it proves the architecture rather than bloating content.
5. Keep `npm run check` green.

## Deferred intentionally

- BrowserStack viewport/device matrix is manual-only for now; user asked to postpone constant viewport checking.
- customers/economy remain after the brew slice.
- persistence remains after the core brew interaction is stable enough to save meaningful state.

## Acceptance gate before customers

A player should understand, without a fake bypass, that grinding exposes more of an ingredient path, stirring advances the marker along that path, resonance depends on actual spatial proximity, Infuse captures the effect, and Bottle resolves a real potion result.
