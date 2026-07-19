# Architecture Decision Log

## D001 — No authentication or database

**Date:** 2026-07-19  
**Decision:** The application has no login, no database, and no persistent storage.  
**Rationale:** This is a personal grading tool for a single teacher. Simplicity and privacy outweigh multi-user features. Student data is processed in memory and never persisted.

## D002 — OpenAI-compatible API adapter

**Date:** 2026-07-19  
**Decision:** Use a single provider-neutral adapter targeting the OpenAI `/chat/completions` API shape.  
**Rationale:** Works with OpenAI, OpenRouter, and any compatible endpoint. Avoids vendor lock-in without adding a multi-provider abstraction.

## D003 — Deterministic score recalculation in application code

**Date:** 2026-07-19  
**Decision:** The AI proposes criterion scores, but the application code always clamps, rounds, and recalculates the total.  
**Rationale:** AI-generated totals may be inconsistent. Deterministic code guarantees scores never exceed criteria maxima and the total always equals the sum of criterion scores.

## D004 — Quarter-point rounding

**Date:** 2026-07-19  
**Decision:** All scores are rounded to the nearest 0.25.  
**Rationale:** Matches the grading granularity used in CPIT280 assignments.

## D005 — Default total score of 20

**Date:** 2026-07-19  
**Decision:** The total score defaults to 20 but is editable by the teacher.  
**Rationale:** 20 is the standard assignment total for CPIT280, but the tool should not hard-code it.
