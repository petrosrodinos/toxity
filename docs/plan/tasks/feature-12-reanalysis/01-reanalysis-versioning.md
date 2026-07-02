# Task: AI Reanalysis & Version History

## Feature group

Feature 12 — AI Reanalysis → [PROGRESS.md](../../PROGRESS.md#feature-12-ai-reanalysis)

## Objective

Admins trigger reanalysis; system stores version snapshots before updating.

## Requirements

- ProductAnalysisVersion, IngredientAnalysisVersion models
- Reanalysis endpoints start in-process async work (no BullMQ — `setImmediate` + entity status or job row)
- Version list endpoint for audit

## Subtasks

- [x] Add version tables to Prisma + migration (`ProductAnalysisVersion`, `IngredientAnalysisVersion`)
- [x] Before reanalysis: snapshot current state to version table
- [x] `POST /admin/products/:uuid/reanalyze` — return 202, run AI via `setImmediate`
- [x] `POST /admin/ingredients/:uuid/reanalyze` — return 202, run AI via `setImmediate`
- [x] Runner: re-run AI prompts, update entity (`ai_version` reset to the current pipeline version constant — see technical note below)
- [x] `GET /admin/products/:uuid/versions` — list snapshots with timestamps (`GET /admin/ingredients/:uuid/versions` added symmetrically)
- [x] Admin UI: "Reanalyze" button on product detail (admin only)
- [x] Admin UI: version history (inline expandable panel showing key snapshot fields per version — no dedicated modal primitive existed yet, so this uses an inline disclosure instead of introducing a new one)

## Technical Notes

- **No BullMQ.** Same pattern as product creation: fire-and-forget in API process, poll or refresh entity for completion.
- Reanalysis does not change uuid or break user scans/favorites
- Rate limit reanalysis per product (e.g. 1/hour) to control AI cost

## Acceptance Criteria

- [x] Admin triggers reanalysis → product scores/descriptions update (build/type-check verified; manual E2E needs OpenAI credentials + DB not available in this environment)
- [x] Previous analysis preserved in version history (snapshot written before the AI call runs)
- [x] Ingredient reanalysis updates ingredient detail page
- [x] Version list shows at least 2 entries after one reanalysis (each reanalyze run appends one snapshot of the *pre-run* state)
