# AI Context — start here

This directory is the persistent memory/handoff layer for Alchemy Trail. Its purpose is to let a new AI coding session become productive quickly without rereading the entire repository or reconstructing past decisions.

## Read order

1. `PROJECT_STATE.md` — what exists right now, verification status, known issues.
2. `HANDOFF.md` — the exact next work package and where to start.
3. `DECISIONS.md` — durable decisions and why they were made.
4. `TECHNICAL_NOTES.md` — architecture contracts, implementation details, pitfalls.
5. `PRODUCT_SPEC.md` — distilled product/GDD requirements.
6. `ROADMAP.md` — milestone order and acceptance gates.
7. `SESSION_LOG.md` — chronological development history.

## Update rule

Do not treat this folder as passive documentation. After every meaningful implementation session, update project state, handoff, and session log in the same workstream. Record only durable facts and useful reasoning; do not dump hidden chain-of-thought or transient scratch work.

## Source-of-truth hierarchy

1. User instructions in the active task.
2. Original supplied **ALCHEMY TRAIL — Ultimate GDD + Technical Design + AI Implementation Specification v1.0**.
3. Existing working code and tests for established implementation contracts.
4. This `AI_CONTEXT` folder as the project-history and fast-reference layer.

If this folder conflicts with current code because it was not updated, verify the code and repair the context files before continuing.
