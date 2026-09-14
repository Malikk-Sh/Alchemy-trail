# Alchemy Trail

Alchemy Trail is an original, mobile-first browser alchemy shop simulator built around tactile potion crafting and a spatial Essence Atlas.

## Status

Phase 0 — Foundation. The repository currently boots a mobile-safe title screen, has strict TypeScript configuration, a lightweight screen manager, vector/polyline math with unit tests, content-validation infrastructure, and CI.

The next development target is the first brewing vertical slice: one ingredient → grind → add → stir → resonance → infuse → bottle.

## Stack

- semantic HTML
- CSS
- TypeScript / ES Modules
- browser-native APIs
- Canvas 2D for the Essence Atlas (next phase)
- Node built-in test runner
- GitHub Actions

Application/game frameworks are intentionally prohibited.

## Local setup

```bash
npm install
npm run typecheck
npm test
npm run validate:content
npm run build
npm run serve
```

Then open `http://127.0.0.1:4173`.

## Architecture

Game logic stays independent of DOM rendering where practical. Screens are coordinated by `ScreenManager`; calculation-heavy systems live in small modules under `src/core` and `src/systems`; gameplay content is data-driven under `src/data`; Canvas-specific rendering will live under `src/rendering`.

## AI continuity

**Any coding agent must read [`AI_CONTEXT/README.md`](./AI_CONTEXT/README.md) before making changes.** That folder is the persistent handoff layer for project state, decisions, technical notes, known risks, roadmap, and session history.

Root [`AGENTS.md`](./AGENTS.md) contains the mandatory session protocol.

## Testing

`npm test` builds the TypeScript source and runs deterministic unit tests. Calculation-heavy systems must receive tests when introduced.

## Assets

Prefer procedural SVG/Canvas/CSS first, then original generated raster assets. Never copy protected game assets, text, maps, characters, or UI compositions from commercial games.

## Deployment

The project is static-host compatible. A production build emits browser modules to `dist/js`; HTML/CSS/assets remain static files and can be hosted on GitHub Pages or any basic HTTP server.
