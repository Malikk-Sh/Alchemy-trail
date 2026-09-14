# Technical notes and contracts

## Build/runtime

- TypeScript source: `src/`
- compiled modules: `dist/js/`
- HTML/CSS remain static and reference `dist/js/main.js`
- source imports use explicit `.js` suffixes so emitted ES Modules are browser-valid
- no continuous game loop while static; requestAnimationFrame should run only for active animation/gesture work

## Screen architecture

`Game` owns a lightweight `ScreenManager`. Screen modules return DOM roots. Do not turn screen classes into content databases or domain-logic containers. Future domain services should live under `src/systems/`.

## Geometry contract

`src/core/math.ts` is foundational gameplay math. World geometry is floating point. Polyline motion is measured by arc length, never by point index. Keep deterministic behavior and test edge cases whenever this module changes.

## Canvas contract for next phase

- world coordinates are independent from CSS/device pixels
- resize backing store using effective DPR, clamped to 2 if performance requires
- transform world→screen through camera zoom/offset
- cache static Atlas layers
- avoid allocating excessively inside hot pointer/render loops

## Input contract

Use Pointer Events only. Capture a pointer when a subsystem owns its gesture. Apply `touch-action: none` only to the active game surface. Brewing gesture priority must follow the product spec.

## Content contract

Gameplay content belongs under `src/data/` and must be data-driven. `scripts/validate-content.mjs` parses TypeScript AST and currently enforces generic duplicate-id, negative-base-value, and too-short-path checks where applicable. Extend validators together with new content schemas.

## Save contract

Not implemented yet. When added, IndexedDB is primary storage, explicit `schemaVersion` and migrations are mandatory, and daily generated content must be seeded/deterministic.

## BrowserStack / real-device testing

- Project-level BrowserStack Remote MCP configuration lives at `.vscode/mcp.json`.
- It uses the hosted endpoint `https://mcp.browserstack.com/mcp` and OAuth; do not commit BrowserStack username/access keys.
- Primary intended use: real-device/browser smoke testing for iOS Safari, Android Chrome, and representative desktop browsers.
- Prefer Remote MCP for normal project testing because it avoids credential files in the repo. Use local `@browserstack/mcp-server` only when local/private-network testing requires local process access.
- BrowserStack is complementary to deterministic unit/integration/E2E tests, not a replacement for them.
- Before closing major mobile UI milestones, run at least one real-device smoke pass when BrowserStack access is available.

## Performance baseline

Mobile interaction takes priority. Avoid layout thrashing during gestures, avoid unnecessary 60 FPS loops, and keep DOM updates out of the hot Atlas drawing path.
