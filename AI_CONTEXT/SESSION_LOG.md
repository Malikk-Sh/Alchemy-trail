# Session log

Append concise factual session summaries. Newest entry may go at the top.

## 2026-09-14 — Visual references + first playable brew

- User supplied six visual reference screens covering map/quest, brew, customer, garden, trader, and journal UI.
- Recorded their durable visual language in `VISUAL_DIRECTION.md` without treating the references as pixel-copy targets.
- Changed BrowserStack Mobile Smoke from push-triggered to manual `workflow_dispatch`; constant viewport checks are deferred by user request.
- Implemented the first playable Essence Atlas brewing slice: Sunleaf data/path, Warmth node, Canvas renderer, live path preview, ingredient commit, stirring, resonance, explicit Infuse, bottling result, and reset/rebrew flow.
- Grinding was upgraded from a numeric control to pointer-travel interaction on a mortar-like surface; it measures travel distance rather than recognizing circles.
- Added deterministic brewing tests for path slicing/translation, arc-length travel, resonance potency, and angular unwrap.
- Reworked the title/brew visual layer toward warm wood + parchment + teal/amber reference cues while retaining original assets and the GDD-defined Atlas mechanic.

## 2026-09-14 — BrowserStack MCP reverted

- Removed the project-level BrowserStack MCP configuration and the related MCP-specific documentation.
- BrowserStack will be integrated through GitHub Actions secrets instead of MCP.
- Expected secret names: `BROWSERSTACK_USERNAME` and `BROWSERSTACK_ACCESS_KEY`.
- Secret values must never be written into repository files or AI context.

## 2026-09-14 — Foundation verification / CI repair

- Reconstructed the authored TypeScript foundation locally because the execution container could not resolve external GitHub/npm hosts.
- Global TypeScript compile succeeded; 3/3 Node unit tests passed; content validation passed.
- First GitHub Actions run failed before install because `setup-node cache: npm` requires a lockfile.
- Fixed CI by removing npm cache until a lockfile is intentionally committed.
- GitHub Actions run #2 passed end-to-end, including dependency install and `npm run check`.
- Phase 0 code/CI is verified; real-device viewport checking is now deferred/manual.

## 2026-09-14 — Repository bootstrap

- User explicitly chose to start from zero and requested a dedicated persistent folder for AI context/history/technical details/future work.
- Repository inspection found only `delete.this`; no existing implementation needed preservation.
- Distilled the supplied GDD v1.0 into durable working constraints and milestone order.
- Authored Phase 0 foundation: strict TypeScript/ES Modules, app shell, screen manager, title screen, responsive safe-area CSS, vector/polyline math, unit tests, content validator, static server, CI.
- Added root `AGENTS.md` and `AI_CONTEXT/` read/update protocol for cross-session continuity.
- Next: verify the foundation, then implement the complete one-potion brewing vertical slice before customers.
