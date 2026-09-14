# Decision log

Record durable decisions here. Do not record transient scratch reasoning.

## D-001 — Repository starts clean

**Date:** 2026-09-14  
**Status:** accepted

The repository contained only `delete.this`, so development starts from a clean foundation rather than preserving an existing implementation.

## D-002 — Persistent AI context lives in `AI_CONTEXT/`

**Date:** 2026-09-14  
**Status:** accepted

`AI_CONTEXT/` is the durable cross-session handoff layer. Root `AGENTS.md` forces a read/update protocol so future agents can resume from project state and handoff instead of rediscovering everything.

## D-003 — No app/game framework and no bundler initially

**Date:** 2026-09-14  
**Status:** accepted

Use strict TypeScript compiled by `tsc` to browser ES Modules. Add a bundler only after a concrete problem justifies it.

## D-004 — Use Node's built-in test runner for foundation

**Date:** 2026-09-14  
**Status:** accepted

Avoid a test dependency until test ergonomics require one. Tests consume compiled JS from `dist/js`, keeping runtime math identical to browser output.

## D-005 — DOM screens, Canvas Atlas

**Date:** 2026-09-14  
**Status:** accepted

Use DOM/CSS for screen structure and controls; reserve Canvas 2D for the Essence Atlas, paths, marker, and tightly coupled map effects.
