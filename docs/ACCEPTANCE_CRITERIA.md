# Acceptance Criteria

## M0 — Repository Bootstrap
- [x] `npm install` generates `package-lock.json`
- [x] `npm run check` (lint + typecheck + test + build) passes

## M1 — Static Interface
- [x] Arabic RTL form with 4 numbered sections
- [x] Default total score of 20, editable
- [x] Client-side validation: requires text or file per section
- [x] `aria-required`, `aria-describedby`, `aria-invalid` on inputs
- [x] Validation errors displayed with `role="alert"`
- [x] Submit button disabled during submission
- [x] Component tests for validation paths

## M2 — Domain Schemas & Score Integrity
- [x] `GradingInputSchema` validates form input
- [x] `AIGradingResponseSchema` validates AI output
- [x] `NormalizedGradingResultSchema` defines the result shape
- [x] `normalizeGradingResult` clamps, rounds, and recalculates
- [x] Rubric-total mismatch detected and flagged
- [x] Missing evidence flagged per criterion
- [x] Unit tests for schemas and normalizer

## M3 — Text & File Extraction
- [x] TXT extraction with UTF-8 decode
- [x] PDF extraction via pdf-parse
- [x] DOCX extraction via mammoth
- [x] MIME type validation (allowlist)
- [x] Per-file size limit enforcement
- [x] Total upload size validation
- [x] Null byte stripping
- [x] Typed `ExtractionError` with error codes
- [x] Unit tests with mocked libraries

## M4 — AI Grading Pipeline
- [x] Prompt builder with injection resistance
- [x] Provider-neutral OpenAI-compatible adapter
- [x] 30-second timeout with abort controller
- [x] Typed errors: timeout, provider, connection, validation
- [x] Grade orchestrator: prompt → AI → validate → normalize
- [x] API route handler with multipart form processing
- [x] Error mapping: 400 (input), 502 (AI), 504 (timeout)
- [x] Unit tests for each layer (mocked AI)

## M5 — Editable Grading Result
- [x] Score header with earned/total display
- [x] Criterion cards with editable score, evidence, rationale
- [x] Score changes trigger clamping and total recalculation
- [x] Rubric mismatch warning banner
- [x] Editable strengths, improvements, final feedback
- [x] Copy feedback to clipboard
- [x] Print support
- [x] Reset to form
- [x] Form wired to API with loading and error states
- [x] Component tests for editing and actions

## M6 — End-to-End Hardening
- [x] Integration tests: happy path, missing inputs, timeout, malformed AI response, score clamping, rubric mismatch
- [x] Test plan documented
- [x] No student content in error responses
- [x] API key server-side only

## M7 — Deployment Readiness
- [x] Architecture documentation
- [x] Grading specification
- [x] Acceptance criteria
- [x] Test plan
- [x] Decision log
