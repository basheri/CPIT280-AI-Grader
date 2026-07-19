# Project Status

**Current mission:** All missions complete (M0–M7)  
**Overall status:** Ready for deployment  
**Last updated:** 2026-07-19

## Completed

### M0 — Repository bootstrap
- Dependency installation, lockfile generation, CI verification.

### M1 — Static interface polish & accessibility
- Client-side validation, `aria-required`/`aria-describedby`/`aria-invalid`, error alerts, loading state.

### M2 — Domain schemas & score integrity
- Zod schemas (`GradingInputSchema`, `AIGradingResponseSchema`, `NormalizedGradingResultSchema`).
- Score normalizer with clamping, rounding, total recalculation, rubric mismatch detection.

### M3 — Text & file extraction
- TXT/PDF/DOCX extractors with MIME type and size validation.
- Typed `ExtractionError` with error codes.

### M4 — AI grading pipeline
- Prompt builder with injection resistance.
- Provider-neutral OpenAI-compatible adapter with 30s timeout.
- Grade orchestrator and POST `/api/grade` route.

### M5 — Editable grading result
- Criterion-level editable scores, evidence, rationale.
- Deterministic total recalculation on edit.
- Copy, print, and reset actions.

### M6 — End-to-end hardening
- Integration tests covering happy path, error paths, and edge cases.
- Test plan documented.

### M7 — Deployment readiness
- Architecture, grading spec, acceptance criteria documentation.
- `serverExternalPackages` configured for pdf-parse.

## Test Summary

- 10 test files, 65 tests, all passing.
- `npm run check` (lint + typecheck + test + build) passes.

## Known Limitations

- PDF text extraction does not work on image-only PDFs.
- AI grading quality depends on the configured model and provider.
- No offline mode — requires internet for AI grading.
- Single-language UI (Arabic only).

## Important Constraints

- Do not expand the product beyond the documented first release.
- Do not upload real student work as repository fixtures.
- Do not commit API keys or `.env` files.
