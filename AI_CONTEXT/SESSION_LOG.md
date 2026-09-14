# Session log

Append concise factual session summaries. Newest entry may go at the top.

## 2026-09-15 — Vercel deployment repaired and verified

- Reproduced the Vercel MCP failure: the surfaced `deploy_to_vercel` schema exposed no arguments while its backend required `target`, `name`, and `files`.
- Confirmed from Vercel documentation that the tool is supposed to accept those fields; passing the documented hidden arguments directly works.
- Added `scripts/build-site.mjs`, `npm run build:site`, `dist-site/` ignore, and `vercel.json` so the project has an explicit reproducible static build/output contract.
- GitHub Actions CI run #34 passed with the new site-build configuration.
- Verified a preview deployment by fetching the deployed HTML and new `styles/brewing-polish.css` successfully.
- Deployed production successfully; `https://alchemy-trail.vercel.app` now points at the new build and serves the polished brewing version.
- Current Vercel project is not Git-linked, so the verified temporary deployment workaround uses a tiny bootstrap deployment whose Vercel build clones public `main`, runs `npm install`, runs `npm run build:site`, and publishes `dist-site`.
- No Vercel credentials were added to repository files.

## 2026-09-15 — First brew feel/feedback polish

- Continued the first playable brewing slice without adding customers/economy.
- Added a four-stage brew guide (`Grind → Stir → Infuse → Bottle`) with live contextual guidance.
- Grinding now supports both pointer-travel and press-and-hold progression; keyboard progression remains supported.
- Prevented committing a Sunleaf path until its endpoint can actually reach Warmth resonance, avoiding an early dead-end tutorial state.
- Tuned stirring from 28 to 36 world units per radian so the tutorial path takes roughly one deliberate circular stirring motion rather than feeling sluggish.
- Tuned the tutorial Warmth node to the full Sunleaf endpoint so a careful full grind/stir can produce 100% potency.
- Atlas now distinguishes remaining path from travelled path, intensifies the Warmth node in resonance, and draws a live resonance link from marker to node.
- Added a resonance meter plus deterministic bottled quality tiers: Faint, Steady, Potent, Masterwork.
- Added an original inline bottle graphic and quality treatment for the result card.
- Local strict TypeScript compilation passed; all 10 unit tests passed before commit.
- GitHub Actions CI run #29 passed the full repository check.
- BrowserStack remains manual/deferred as requested.

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
- Phase 0 code/CI is verified; viewport/device matrix checking is intentionally deferred/manual by user request.

## 2026-09-14 — Repository bootstrap

- User explicitly chose to start from zero and requested a dedicated persistent folder for AI context/history/technical details/future work.
- Repository inspection found only `delete.this`; no existing implementation needed preservation.
- Distilled the supplied GDD v1.0 into durable working constraints and milestone order.
- Authored Phase 0 foundation: strict TypeScript/ES Modules, app shell, screen manager, title screen, responsive safe-area CSS, vector/polyline math, unit tests, content validator, static server, CI.
- Added root `AGENTS.md` and `AI_CONTEXT/` read/update protocol for cross-session continuity.
- Next: verify the foundation, then implement the complete one-potion brewing vertical slice before customers.
