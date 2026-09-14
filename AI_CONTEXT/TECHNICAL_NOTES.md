# Technical notes and contracts

## Build/runtime

- TypeScript source: `src/`
- compiled modules: `dist/js/`
- HTML/CSS remain static and reference `dist/js/main.js`
- source imports use explicit `.js` suffixes so emitted ES Modules are browser-valid
- no continuous game loop while static; requestAnimationFrame should run only for active animation/gesture work

## Vercel deployment contract

- `npm run build:site` compiles TypeScript and assembles the deployable static tree under `dist-site/`.
- `dist-site/` contains `index.html`, `styles/`, `assets/`, and compiled `dist/js/`; it is generated output and must not be committed.
- `vercel.json` uses `npm run build:site` and `dist-site` as the output directory.
- Verified production domain: `https://alchemy-trail.vercel.app`.
- As of 2026-09-15 the surfaced Vercel MCP schema incorrectly exposes `deploy_to_vercel` with no arguments even though the backend/documented tool requires `target`, `name`, and `files`. Passing those documented arguments explicitly works despite the surfaced schema mismatch.
- The existing Vercel project is not currently Git-linked. Until that changes, the verified deployment workaround sends a tiny bootstrap file and uses Vercel's build command to clone public `main`, run `npm install`, run `npm run build:site`, and publish `dist-site`.
- Do not add Vercel credentials or access tokens to repository files for this workaround.

## Art/runtime pipeline

- The visual target is illustration-first mobile game UI, not generic web-app chrome.
- Runtime default remains DOM/CSS + procedural SVG + Canvas 2D. This keeps the mobile build light while allowing high-detail layered scenes.
- Original low-poly source assets live under `assets/generated/`; the first production set is under `assets/generated/brew/` (`workshop.svg`, `cauldron.svg`, `mortar.svg`, `sunleaf.svg`, `bottle.svg`).
- `styles/brew-production.css` is the Brew Scene v2 material/composition layer. `styles/motion.css` contains shared tactile motion and reduced-motion handling.
- GLB is allowed as a source-authoring format when it materially improves an asset. Prefer baking/rasterizing or converting it into lightweight runtime art unless real-time 3D interaction is essential.
- Do not introduce Three.js/Babylon/Pixi/Phaser or another renderer merely to display decorative GLB assets; that would violate the GDD framework/engine constraints and increase mobile cost.
- Ambient scene motion should use CSS/SVG whenever possible; reserve requestAnimationFrame for gameplay-coupled animation.
- Reference screens define material language, composition quality, and polish target, not assets/layouts to copy literally.

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
- Atlas visual language is magical cartography/topography, not a development grid

## Input contract

Use Pointer Events only. Capture a pointer when a subsystem owns its gesture. Apply `touch-action: none` only to the active game surface. Brewing gesture priority must follow the product spec.

## Content contract

Gameplay content belongs under `src/data/` and must be data-driven. `scripts/validate-content.mjs` parses TypeScript AST and currently enforces generic duplicate-id, negative-base-value, and too-short-path checks where applicable. Extend validators together with new content schemas.

## Save contract

Not implemented yet. When added, IndexedDB is primary storage, explicit `schemaVersion` and migrations are mandatory, and daily generated content must be seeded/deterministic.

## BrowserStack credentials

- Do not use a project MCP configuration for BrowserStack.
- BrowserStack automation credentials are expected from GitHub Actions secrets named `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY`.
- Never commit, print, echo, or persist the secret values in repository files, logs, screenshots, or AI context.
- Wire these secrets into BrowserStack/Playwright CI only when the real-device or cross-browser test stage is implemented.

## Performance baseline

Mobile interaction takes priority. Avoid layout thrashing during gestures, avoid unnecessary 60 FPS loops, and keep DOM updates out of the hot Atlas drawing path.
