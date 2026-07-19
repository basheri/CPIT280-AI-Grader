# CPIT280 AI Grader — Claude Code Instructions

@AGENTS.md
@docs/PRD.md
@docs/ARCHITECTURE.md
@docs/GRADING_SPEC.md
@docs/ACCEPTANCE_CRITERIA.md
@docs/IMPLEMENTATION_PLAN.md
@docs/TEST_PLAN.md

## Mission

Build a small, reliable, privacy-conscious personal grading assistant for CPIT280. Keep the product intentionally simple.

## Non-negotiable scope

- One-page application.
- No login or authentication.
- No database.
- No student management.
- No Blackboard integration.
- Default total score is 20 but remains editable.
- The AI must grade only against the uploaded question and rubric.
- The teacher remains the final decision-maker.
- Do not persist uploaded files, extracted text, or grading results.

## Required workflow

1. Inspect the repository and relevant documentation.
2. Use Plan Mode before material changes.
3. State the exact mission and acceptance criteria being implemented.
4. Implement one mission at a time.
5. Add or update tests with each behavior change.
6. Run `npm run lint`, `npm run typecheck`, `npm run test`, and `npm run build`.
7. Do not mark a mission complete unless all gates pass.
8. Update `PROJECT_STATUS.md` and `docs/DECISIONS.md`.
9. Summarize changed files, verification evidence, limitations, and next mission.
10. Never push or merge unless explicitly instructed by the user.

## Engineering rules

- Use TypeScript strict mode.
- Prefer small, explicit modules.
- Use Zod at all untrusted boundaries.
- Never trust model-generated JSON without schema validation.
- Never calculate the total score only inside the model; recalculate it in application code.
- Never allow a criterion score to exceed its maximum.
- Reject or flag a rubric whose criteria total does not match the requested total.
- Surface uncertainty and missing evidence instead of inventing content.
- Avoid unnecessary abstractions and dependencies.
- Do not add authentication, a database, queues, analytics, or background jobs.
- Keep all user-facing Arabic RTL and professional.
- Use accessible labels, keyboard navigation, visible focus states, and readable contrast.

## Security and privacy

- Never commit `.env`, `.env.local`, API keys, uploaded student work, or generated grading records.
- Do not log file contents or student answers.
- Enforce file type and size limits server-side.
- Treat file names and extracted content as untrusted input.
- Do not execute uploaded files.
- Keep AI API calls server-side.

## Git rules

- Work on a feature branch.
- Make small, intentional commits.
- Use conventional commit prefixes.
- Do not rewrite history or push directly to `main` during feature development.
