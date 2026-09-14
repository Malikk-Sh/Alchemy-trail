# Instructions for AI coding agents

Before editing this repository, read these files in order:

1. `AI_CONTEXT/README.md`
2. `AI_CONTEXT/PROJECT_STATE.md`
3. `AI_CONTEXT/HANDOFF.md`
4. `AI_CONTEXT/DECISIONS.md`
5. relevant source/tests for the task

For product rules and scope, use `AI_CONTEXT/PRODUCT_SPEC.md` as the fast working reference. The original supplied GDD v1.0 remains the source specification; this context layer is intentionally a high-signal distillation so future sessions do not have to reconstruct project history.

## Mandatory working rules

- No application/game/component frameworks.
- Vanilla HTML/CSS + strict TypeScript + ES Modules.
- Prefer browser-native APIs and small focused modules.
- Mobile portrait first; primary interaction must work without hover.
- Gameplay content must be data-driven.
- Deterministic calculation-heavy systems require tests.
- Never leave dead controls or fake interactions and call a feature complete.
- Preserve runnable state after meaningful milestones.
- Use cohesive commits.
- Before reporting completion, run typecheck, tests, content validation, and build.

## Mandatory continuity update

After meaningful work, update at minimum:

- `AI_CONTEXT/PROJECT_STATE.md`
- `AI_CONTEXT/SESSION_LOG.md`
- `AI_CONTEXT/HANDOFF.md`

If a durable architecture/product decision changed, also update `AI_CONTEXT/DECISIONS.md` and `AI_CONTEXT/TECHNICAL_NOTES.md`.
