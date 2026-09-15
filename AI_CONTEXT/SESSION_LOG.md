# Session log

Append concise factual session summaries. Newest entry may go at the top.

## 2026-09-15 — Third autonomous visual production cycle

- User explicitly said to continue autonomous design work after the reward-offset screenshot and second visual cycle.
- PR #10 raised core prop fidelity: cauldron/hearth, mortar/pestle, potion bottle and Sunleaf were redrawn with richer faceted low-poly geometry, reflections, material faces and detail. CI run #85 passed before squash merge.
- PR #11 recomposed Brew around the cauldron as the dominant visual focal point, compacted Atlas further, reduced preparation-station weight, added a decorative physical water flask beside the cauldron, and converted the readout into a smaller potion plaque. CI run #87 passed before squash merge.
- PR #12 added stage choreography driven entirely by existing gameplay state: preparation emphasis before commit, cauldron emphasis after commit, Atlas sweep during stirring, stronger resonance peak, Bottle emphasis after Infuse, and a more layered result entrance. CI run #89 passed before squash merge.
- PR #13 deepened atmosphere/materials and upgraded the water flask: cool window light, warm hearth/lantern light, vignette, carved wood treatment, richer parchment, stronger prop grounding and scene-wide resonance warmth. CI run #91 passed before squash merge.
- PRs #10–#13 were squash-merged into `main`; gameplay math and the real Grind → Stir → Resonance → Infuse → Bottle flow were not changed.
- Vercel Git integration is active: visual branches receive Preview deployments and `main` receives Production deployments automatically.
- Active art iteration now extends through `brew-v13.css`; do not consolidate these layers until the user accepts the visual baseline.

## 2026-09-15 — Reward overlay fix + second autonomous visual cycle

- User supplied a real-device screenshot showing the bottled-result reward shifted downward and asked to continue design work.
- Root cause was identified precisely: `.workbench { perspective: 900px; }` established a containing block for the descendant `position: fixed` reward card, so it centred against the long workbench instead of the viewport.
- PR #5 removed the containing-block cause in the final visual layer and made the reward viewport-centred, safe-area-aware, scrollable on short phones, and less over-darkened behind the modal. CI run #72 passed before merge.
- PR #6 rebuilt `workshop.svg` with denser low-poly art: clouds, deeper mountain layers, river, village, more trees, shelves, bottles, books, hanging herbs, banner, lantern and counter props; also improved lighting/material grading. CI run #74 passed before merge.
- PR #7 added tactile motion without a continuous render loop: mortar rocking/herb flecks, simmer bubbles, cauldron/fire response, resonance/Infuse coupling, stage pulses, reward backdrop and reduced-motion handling. CI run #76 passed before merge.
- PR #8 compressed Brew into a more game-like mobile HUD: shorter topbar and Atlas, compact ingredient slot, reduced vertical document spacing, and a sticky real action bar for Reset/Infuse/Bottle. CI run #78 passed before merge.
- PR #9 added dedicated portrait title key-art (alchemy desk, journal, potion, Sunleaf and mountain valley) plus a new entry-screen composition instead of reusing the Brew background. CI run #80 passed before merge.
- PRs #5–#9 were automatically squash-merged after green CI. Gameplay math and the real Grind → Stir → Resonance → Infuse → Bottle flow were not changed.

## 2026-09-15 — Autonomous four-PR production-art overhaul

- User explicitly authorized autonomous PR creation/merging and continuing visual work until there was a significant improvement over the approximately 4.5/10 deployed baseline.
- Completed and automatically squash-merged four visual PRs, each only after green GitHub Actions CI.
- PR #1 (`Brew Scene v4`) rebuilt the original low-poly workshop illustration, cauldron/hearth, mortar/pestle and water flask; added a custom leaf brand mark; recomposed Brew around physical props; and prevented disabled controls from ghosting the props.
- PR #2 (`Brew Scene v5`) upgraded Sunleaf and potion bottle assets, rebuilt the title presentation, added physical resonance/Infuse glow, tactile action motion and premium result styling.
- PR #3 (`Brew Scene v6`) turned bottling into a cinematic parchment reward overlay and added steam, active cauldron motion and stronger Masterwork feedback.
- PR #4 (`Atlas v2`) remade the Essence Atlas as a material magical chart with deterministic texture, topography, runes, etched frame, alchemical effect sigil, layered paths/anchors, curved resonance link and less neon/debug-graph styling.
- Latest visual PR CI run #63 passed before merge. Existing strict TypeScript and 10 deterministic unit tests remained green.
- No customer/economy scope was added; the work stayed focused on raising the production quality of the one-potion vertical slice.

## 2026-09-15 — Russian localization pass

- User rated Brew Scene v3 around 4.5/10 and requested moving the game UI to Russian.
- Kept `Alchemy Trail` as the product/brand name while translating all current player-facing title and brewing copy into Russian.
- Localized `Sunleaf` → `Солнцелист`, `Warmth` → `Тепло`, brew stage labels, guidance text, action buttons, result card copy, potion quality labels/descriptions, accessibility labels, document metadata, and `<html lang="ru">`.
- Localized baked/decorative text as well: workshop water flask now reads `Родниковая вода`, and the CSS potion plaque now reads `ТЕКУЩЕЕ ЗЕЛЬЕ`.
- Stable IDs remain English (`sunleaf`, `warmth`, quality IDs) so localization does not change game logic, tests, persistence contracts, or deterministic behavior.
- Russian is now the player-facing default language for new content unless the user asks otherwise.

## 2026-09-15 — Screenshot-driven Brew Scene v3 recomposition

- User rated Brew Scene v2 roughly 3.5/10 and supplied screenshots from the actual deployed game.
- Visual diagnosis: the screen still read as stacked web panels; the Essence Atlas dominated the composition, while the workshop, mortar, cauldron, and physical alchemy fantasy felt secondary.
- Changed direction from incremental CSS polish to composition-first restructuring while preserving the real brewing logic.
- Added `styles/brew-recompose.css`: Atlas is now a compact magical strip; the main screen area is an illustrated workshop; mortar and cauldron are side-by-side physical interaction stations; the cauldron is visually dominant; potion readout is parchment-like; inventory/actions sit below the scene.
- Added an original `assets/generated/brew/water-flask.svg` decorative prop and `styles/brew-details.css` for scene-level detail and subtle prop motion.
- Existing Grind → Stir → Resonance → Infuse → Bottle behavior was not changed.
- GitHub Actions CI run #42 passed after the core recomposition; final CI run #45 passed after the detail layer.
- Production deployment `dpl_HkkYYWTAYkokf7mz4EgqA3JXnucz` reached READY and `https://alchemy-trail.vercel.app` serves the new v3 CSS layers.
- Remaining quality gap is primarily asset richness, scene composition, typography, and object-specific animation polish; do not return to generic card-stack layouts.

## 2026-09-15 — Brew Scene v2 production-art pass

- User rejected the current prototype-level design/animation quality and asked to push much closer to the supplied low-poly mobile-game references, allowing GLB source assets if useful.
- Chose an illustration-first 2.5D runtime approach: DOM/CSS + procedural SVG + Canvas 2D remain the runtime foundation; GLB is reserved as an optional source-authoring format rather than adding a real-time 3D engine for decoration.
- Added an original low-poly Brew asset set under `assets/generated/brew/`: workshop environment, cauldron/hearth, mortar/pestle, Sunleaf botanical art, and potion bottle.
- Added `styles/brew-production.css` to turn the Brew screen and title into a layered game scene with wood/parchment materials, environmental depth, physical props, dimensional buttons, fire/steam/herb motion, and result art.
- Reworked `AtlasRenderer` away from a development grid toward magical cartography: topographic contours, deterministic star marks, compass motif, material path rendering, stronger Warmth node treatment, and vignette.
- Added `styles/motion.css` for shared scene entrances, tactile button sheen/icons, interaction focus treatment, captured-effect motion, and reduced-motion support.
- Gameplay logic and the real Grind → Stir → Infuse → Bottle flow were preserved.
- GitHub Actions CI run #38 passed after the Atlas renderer change; CI run #39 passed after the shared motion layer.
- This is the first production-art pass, not a claim of final reference-level parity. Next priority is human visual feedback on the deployed Brew Scene v2 and another art refinement pass before expanding gameplay scope.

## 2026-09-15 — Vercel deployment repaired and verified

- Reproduced the Vercel MCP failure: the surfaced `deploy_to_vercel` schema exposed no arguments while its backend required `target`, `name`, and `files`.
- Confirmed from Vercel documentation that the tool is supposed to accept those fields; passing the documented hidden arguments directly works.
- Added `scripts/build-site.mjs`, `npm run build:site`, `dist-site/` ignore, and `vercel.json` so the project has an explicit reproducible static build/output contract.
- GitHub Actions CI run #34 passed with the new site-build configuration.
- Verified a preview deployment by fetching the deployed HTML and new `styles/brewing-polish.css` successfully.
- Deployed production successfully; `https://alchemy-trail.vercel.app` now points at the new build and serves the polished brewing version.
- Vercel was later linked to GitHub; current pushes to `main` now auto-deploy to production and visual branches receive preview deployments.
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
