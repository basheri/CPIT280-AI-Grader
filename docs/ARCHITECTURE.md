# Architecture

## Request Flow

```
Browser Form
  → FormData (POST /api/grade)
    → extractText() per file field
    → GradingInputSchema validation
    → buildGradingPrompt()
    → callAI() (OpenAI-compatible endpoint)
    → AIGradingResponseSchema validation
    → normalizeGradingResult() (clamp, round, recalculate)
    → JSON response
  → GradingResult component (editable)
```

## Module Boundaries

| Layer | Path | Responsibility |
|-------|------|----------------|
| UI | `src/app/`, `src/components/` | Pages, form, result display |
| Domain | `src/domain/` | Scoring utilities, result normalizer |
| Shared | `src/lib/` | Zod schemas, constants, upload validation |
| Extractors | `src/server/extractors/` | TXT/PDF/DOCX text extraction |
| Grading | `src/server/grading/` | Prompt builder, AI adapter, orchestrator |
| API | `src/app/api/grade/` | Route handler |

## Security Model

- **No authentication**: Single-user personal tool.
- **No persistent storage**: Files processed in memory, never written to disk.
- **Server-side API keys**: `AI_API_KEY` is only accessed in server-side route handlers.
- **File validation**: MIME type allowlist, per-file and total size limits enforced server-side.
- **Prompt injection resistance**: Student answers wrapped in delimiters with explicit ignore-instructions directive.
- **No student content logging**: Extracted text and AI prompts are never logged.
- **Input sanitization**: Null bytes stripped from extracted text.

## Score Integrity

The AI proposes scores, but application code always:
1. Clamps each criterion score to `[0, maxScore]`
2. Rounds to nearest quarter point (0.25)
3. Recalculates total from individual scores
4. Detects rubric-total mismatches

This ensures the displayed total is always deterministically correct.
