# Agent Development Guide

## Product principle

The correct product is not the most feature-rich product. It is the smallest trustworthy tool that reduces the teacher's correction time without hiding how the grade was produced.

## Architecture boundaries

- UI: `src/app` and `src/components`
- Domain logic: `src/domain`
- File extraction: `src/server/extractors`
- AI grading: `src/server/grading`
- API route: `src/app/api/grade`
- Shared validation: `src/lib`
- Tests: colocated unit tests or `tests`

## Design requirements

- Arabic RTL by default.
- Single-column form on small screens.
- Clear numbered sections.
- One primary action: `تصحيح الإجابة`.
- Result must show proposed total score, criterion-level scores, evidence, strengths, improvements, final feedback, and warnings.
- Teacher can edit scores and feedback before copying or printing.

## Code quality

- Functions should do one thing.
- Avoid `any`.
- Validate request payloads and AI responses.
- Separate extraction, prompt construction, provider call, validation, normalization, and presentation.
- Keep provider-specific details behind one adapter.
- Use deterministic code for totals and limits.
- Tests must cover failure paths, not only successful paths.
