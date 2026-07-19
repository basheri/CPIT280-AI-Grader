# Test Plan

## Unit Tests

### Domain Logic (`src/domain/`)
- **scoring.ts**: `roundToQuarter`, `clampScore`, `calculateTotal`, `rubricMatchesTotal`
- **normalizer.ts**: Score clamping, quarter rounding, total recalculation, rubric mismatch detection, missing evidence warnings

### Schemas (`src/lib/`)
- **schemas.ts**: Zod validation for `GradingInputSchema`, `CriterionResultSchema`, `AIGradingResponseSchema` — valid/invalid input paths

### Extractors (`src/server/extractors/`)
- **extract-text.ts**: TXT/PDF/DOCX extraction (mocked pdf-parse and mammoth), unsupported MIME type, oversized file, empty content, null byte stripping

### Grading Pipeline (`src/server/grading/`)
- **prompt-builder.ts**: System and user prompt content, delimiter wrapping, injection resistance instructions
- **ai-adapter.ts**: Successful API call, HTTP errors (401), network failure, timeout (AbortError), missing env vars
- **grade.ts**: Valid AI response normalization, malformed JSON, missing fields, score clamping, timeout propagation

## Component Tests

### Form (`src/components/`)
- **grader-form.tsx**: Section rendering, empty-submit validation, filled-field validation, total score validation, aria attributes, role=alert on errors, default total score
- **grading-result.tsx**: Criterion display, total rendering, score editing with recalculation, score clamping, rubric mismatch warning, clipboard copy, reset callback

## Integration Tests

### API Route (`tests/integration/`)
- **grading-flow.test.ts**: Happy path end-to-end (mocked AI), missing inputs (question/rubric/answer), invalid total score, malformed AI response (502), AI timeout (504), score clamping in AI response, rubric-total mismatch detection

## Not Tested

- **Live AI provider calls**: Requires a real API key. All AI calls are mocked in tests.
- **Real PDF/DOCX parsing**: Library calls are mocked. Real file parsing is verified manually.
- **Browser-level accessibility**: Tab order, screen reader behavior — verified manually.
- **Print layout**: Verified manually via browser print preview.
