# Claude Code Implementation Plan

Each mission is completed only after lint, typecheck, tests, and build are green.

## M0 — Repository bootstrap

Install dependencies, verify Next.js starts, generate the lockfile, and run `npm run check`.

## M1 — Static one-page interface

Build Arabic RTL numbered sections for question, rubric, total score (default 20), student answer, primary action, loading, validation, and accessibility. No live AI call.

## M2 — Domain schemas and score integrity

Add Zod schemas, deterministic total calculation, score clamping, quarter-point rounding, rubric-total mismatch detection, and unit tests.

## M3 — Text and file extraction

Support pasted text, TXT, PDF, and DOCX with server-side type/size validation and no persistent storage.

## M4 — AI grading pipeline

Add provider-neutral adapter, prompt builder, prompt-injection resistance, structured output validation, deterministic normalization, timeout/error mapping, and mocked tests.

## M5 — Editable grading result

Show criterion-level scores, evidence, rationale, strengths, improvements, warnings, editable feedback, copy, print, and reset.

## M6 — End-to-end hardening

Test happy path, missing inputs, unsupported and oversized files, rubric mismatch, malformed AI output, provider timeout, accessibility, and privacy.

## M7 — Deployment readiness

Prepare Vercel configuration, environment documentation, smoke tests, security review, and final status report.
