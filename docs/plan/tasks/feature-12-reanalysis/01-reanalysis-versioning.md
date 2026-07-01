# Task: AI Reanalysis & Version History

## Feature group

Feature 12 — AI Reanalysis → [PROGRESS.md](../../PROGRESS.md#feature-12-ai-reanalysis)

## Objective

Admins trigger reanalysis; system stores version snapshots before updating.

## Requirements

- ProductAnalysisVersion, IngredientAnalysisVersion models
- Reanalysis endpoints queue BullMQ jobs
- Version list endpoint for audit

## Subtasks

- [ ] Add version tables to Prisma + migration
- [ ] Before reanalysis: snapshot current state to version table
- [ ] `POST /admin/products/:uuid/reanalyze` — enqueue job
- [ ] `POST /admin/ingredients/:uuid/reanalyze` — enqueue job
- [ ] Processors: re-run AI prompts, update entity, increment ai_version
- [ ] `GET /admin/products/:uuid/versions` — list snapshots with timestamps
- [ ] Admin UI: "Reanalyze" button on product detail (admin only)
- [ ] Admin UI: version history modal (read-only JSON or formatted diff)

## Technical Notes

- Reanalysis does not change uuid or break user scans/favorites
- Rate limit reanalysis per product (e.g. 1/hour) to control AI cost

## Acceptance Criteria

- [ ] Admin triggers reanalysis → product scores/descriptions update
- [ ] Previous analysis preserved in version history
- [ ] Ingredient reanalysis updates ingredient detail page
- [ ] Version list shows at least 2 entries after one reanalysis
